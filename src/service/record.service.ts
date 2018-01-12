import { GlobalService } from './global.service';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';

import { MoneyRecord } from '../vo/money-record';

@Injectable()
export class RecordService {

  constructor(public dbService: DatabaseService, public global: GlobalService) {
    // this.initMoneyRecord();
  }

  //TODO 初始化资金记录表
  initMoneyRecord() {
    let sql = "CREATE TABLE IF NOT EXISTS money_record ("
      + "id INTEGER PRIMARY KEY AUTOINCREMENT,"
      + "direction TEXT,"
      + "money REAL,"
      + "type TEXT,"
      + "subtype TEXT,"
      + "account TEXT,"
      + "date TEXT,"
      + "comment TEXT)";

    this.dbService.execSql(sql);
  }

  addRecord(moneyRecord: MoneyRecord): Promise<any> {
    let sql = "INSERT INTO money_record (direction, money,type,subtype,account,date,comment) VALUES (?,?,?,?,?,?,?)";
    let params = [moneyRecord.direction, moneyRecord.money, moneyRecord.type,
    moneyRecord.subtype, moneyRecord.account, moneyRecord.date, moneyRecord.comment];

    return this.dbService.execSql(sql, params);
  }

  editRecord(moneyRecord: MoneyRecord): Promise<any> {
    let sql = "UPDATE money_record SET direction = ?,money = ?,type = ?,subtype = ?,account = ?,date = ?,comment = ? WHERE id = ?";
    let params = [moneyRecord.direction, moneyRecord.money, moneyRecord.type,
      moneyRecord.subtype, moneyRecord.account, moneyRecord.date, moneyRecord.comment,
      moneyRecord.id];

    return this.dbService.execSql(sql, params);
  }

  delRecord(id: number): Promise<any> {
    let sql = "DELETE FROM money_record WHERE id = ?";
    let params = [id];
    return this.dbService.execSql(sql, params);
  }

  //需要合计月份的流入、流出
  getRecordListMonthSum(year: string): Promise<any>{
    let moneyInSql = "SUM(CASE direction WHEN '收入' THEN money ELSE 0 END) AS moneyIn, ";
    let moneyOutSql = "SUM(CASE direction WHEN '支出' THEN money ELSE 0 END) AS moneyOut ";

    let sql = "SELECT MAX(SUBSTR(date,6,2)) AS month, " + moneyInSql + moneyOutSql +
      " FROM money_record WHERE date LIKE '" + year + "%' GROUP BY SUBSTR(date,1,7) ORDER BY SUBSTR(date,1,7) DESC";

    let params = [];
    return this.dbService.execSql(sql, params);
  }

  //根据年月查询资金流水
  getRecordListByMonth(yearmonth: string): Promise<any>{
    let sql = "SELECT id,direction,money,type,subtype,account,date,comment,SUBSTR(date,9,2) as day FROM money_record WHERE date LIKE '" + yearmonth + "%'";
    let params = [];
    return this.dbService.execSql(sql, params);
  }

  getRecordListAll(): Promise<MoneyRecord[]> {
      let sql = "SELECT * FROM money_record ORDER BY id DESC";
      let rs: MoneyRecord[] = [];

      return this.dbService.execSql(sql).then((data) => {
          if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                  let mr = this.global.itemToMoneyRecord(data.rows.item(i));
                  rs.push(mr);
              }
          }
          return rs;
      });
  }

  getRecordList(): Promise<any[]> {

    let resultList: any[] = [];

    let dayRecordList3: MoneyRecord[] = [];
    let dayRecordList2: MoneyRecord[] = [];
    let dayRecordList1: MoneyRecord[] = [];

    let date = new Date();
    date.setDate(3);
    date.setHours(17);
    let moneyRecord31 = this.getRecordVO(3, this.global.toDateString(date));
    dayRecordList3.push(moneyRecord31);

    date = new Date();
    date.setDate(3);
    date.setHours(16);
    let moneyRecord32 = this.getRecordVO(3.2, this.global.toChinaISOString(date));
    dayRecordList3.push(moneyRecord32);

    date = new Date();
    date.setDate(3);
    date.setHours(15);
    let moneyRecord33 = this.getRecordVO(3.3, this.global.toChinaISOString(date));
    dayRecordList3.push(moneyRecord33);

    date = new Date();
    date.setDate(2);
    date.setHours(14);
    let moneyRecord21 = this.getRecordVO(2, this.global.toChinaISOString(date));
    dayRecordList2.push(moneyRecord21);

    date = new Date();
    date.setDate(2);
    date.setHours(13);
    let moneyRecord22 = this.getRecordVO(2.2, this.global.toChinaISOString(date));
    dayRecordList2.push(moneyRecord22);

    date = new Date();
    date.setDate(2);
    date.setHours(12);
    let moneyRecord23 = this.getRecordVO(2.3, this.global.toChinaISOString(date));
    dayRecordList2.push(moneyRecord23);

    date = new Date();
    date.setDate(1);
    date.setHours(11);
    let moneyRecord11 = this.getRecordVO(1, this.global.toChinaISOString(date));
    dayRecordList1.push(moneyRecord11);

    date = new Date();
    date.setDate(1);
    date.setHours(10);
    let moneyRecord12 = this.getRecordVO(1.2, this.global.toChinaISOString(date));
    dayRecordList1.push(moneyRecord12);

    resultList.push(dayRecordList3);
    resultList.push(dayRecordList2);
    resultList.push(dayRecordList1);

    return Promise.resolve(resultList);
  }

  getRecord(): Promise<MoneyRecord> {
    let moneyRecord = new MoneyRecord();
    moneyRecord.money = 101;
    moneyRecord._alltype = "食品酒水 水果零食";
    moneyRecord.direction = '支出';
    moneyRecord.account = '建设银行';
    moneyRecord.date = this.global.toChinaISOString(new Date());
    moneyRecord.comment = "我的备注";
    return Promise.resolve(moneyRecord);
  }

  getRecordByDirection(direction: string): Promise<MoneyRecord> {
    let moneyRecord = new MoneyRecord();
    moneyRecord.money = 0;
    moneyRecord.date = this.global.toChinaISOString(new Date());
    moneyRecord.direction = direction;
    moneyRecord.comment = "";
    //根据资金方向判断默认类型
    this.getDefultAlltype(direction).then(alltype => (moneyRecord._alltype = alltype));
    //获取默认账户
    this.getDefultAccount().then(account => (moneyRecord.account = account));
    return Promise.resolve(moneyRecord);
  }

  //TODO 根据资金方向活期默认类型
  getDefultAlltype(direction: string): Promise<string> {
    let alltype: string;
    switch (direction) {
      case "收入":
        alltype = "职业收入 工资收入";
        break;
      case "支出":
        alltype = "食品酒水 水果零食";
        break;
      default:
        alltype = "";
    }
    return Promise.resolve(alltype);
  }

  //TODO 获取默认账户
  getDefultAccount(): Promise<string> {
    let account: string;
    account = "老公现金";
    return Promise.resolve(account);
  }

  getRecordVO(money: number, date: string): MoneyRecord {
    let moneyRecord = new MoneyRecord();
    moneyRecord.id = 1;
    moneyRecord.money = money;
    moneyRecord._alltype = "食品酒水 水果零食";
    moneyRecord.type = "食品酒水";
    moneyRecord.subtype = "水果零食";
    moneyRecord.direction = '支出';
    moneyRecord.account = '建设银行';
    // if (date == null) {
    //   alert('date'+date);
    //   moneyRecord.date = this.global.toChinaISOString(new Date());
    // } else {
    moneyRecord.date = date;
    // }

    moneyRecord.comment = "我的备注";
    return moneyRecord;
  }
}
