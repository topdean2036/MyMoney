import { GlobalService } from './global.service';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { RecordDirection } from './../constant/record';
import { MoneyRecord } from '../vo/money-record';

@Injectable()
export class RecordService {

  constructor(public dbService: DatabaseService, public global: GlobalService) {
    // this.initMoneyRecord();
  }

  //初始化资金记录表
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
  getRecordListMonthSum(year: string): Promise<any> {
    let moneyInSql = "SUM(CASE direction WHEN '收入' THEN money ELSE 0 END) AS moneyIn, ";
    let moneyOutSql = "SUM(CASE direction WHEN '支出' THEN money ELSE 0 END) AS moneyOut ";

    let sql = "SELECT MAX(SUBSTR(date,6,2)) AS month, " + moneyInSql + moneyOutSql +
      " FROM money_record WHERE date LIKE '" + year + "%' GROUP BY SUBSTR(date,1,7) ORDER BY SUBSTR(date,1,7) DESC";

    let params = [];
    return this.dbService.execSql(sql, params);
  }

  /**
   * 根据年月查询资金流水
   * @param yearmonth 
   */
  async getRecordListByMonth(yearmonth: string): Promise<MoneyRecord[]> {
    let rsArray: MoneyRecord[] = [];

    let sql = "SELECT id,direction,money,type,subtype,account,date,comment,SUBSTR(date,9,2) as day FROM money_record WHERE date LIKE '" + yearmonth + "%' order by date desc";
    let params = [];

    try {
      //数据库查询结果
      let rs = await this.dbService.execSql(sql, params);

      //把结果放到MoneyRecord数组里面
      if (rs.rows.length > 0) {
        for (var i = 0; i < rs.rows.length; i++) {
          rsArray.push(this.itemToBean(rs.rows.item(i)));
        }
      }
    } catch (error) {
      const msg = JSON.stringify(error);
      alert("error:" + msg);
      console.error(msg);
    }

    return rsArray;
  }

  /**
   * 把sql查询结果放入资金记录对象
   * @param item 
   */
  private itemToBean(item: any): MoneyRecord {
    let mr = new MoneyRecord();
    mr.id = item.id;
    mr.direction = item.direction;
    mr.money = item.money;
    mr.type = item.type;
    mr.subtype = item.subtype;
    mr.account = item.account;
    mr.date = item.date;
    mr.comment = item.comment;
    mr._alltype = mr.type + " " + mr.subtype;

    return mr;
  }

  getRecordListAll(): Promise<MoneyRecord[]> {
    let sql = "SELECT * FROM money_record ORDER BY id DESC";
    let rs: MoneyRecord[] = [];

    return this.dbService.execSql(sql).then((data) => {
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let mr = this.itemToBean(data.rows.item(i));
          rs.push(mr);
        }
      }
      return rs;
    });
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

  //TODO 根据资金方向获取默认类型
  getDefultAlltype(direction: string): Promise<string> {
    let alltype: string;
    switch (direction) {
      case RecordDirection.In:
        alltype = "职业收入 工资收入";
        break;
      case RecordDirection.Out:
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

  // getRecordVO(money: number, date: string): MoneyRecord {
  //   let moneyRecord = new MoneyRecord();
  //   moneyRecord.id = 1;
  //   moneyRecord.money = money;
  //   moneyRecord._alltype = "食品酒水 水果零食";
  //   moneyRecord.type = "食品酒水";
  //   moneyRecord.subtype = "水果零食";
  //   moneyRecord.direction = '支出';
  //   moneyRecord.account = '建设银行';
  //   // if (date == null) {
  //   //   alert('date'+date);
  //   //   moneyRecord.date = this.global.toChinaISOString(new Date());
  //   // } else {
  //   moneyRecord.date = date;
  //   // }

  //   moneyRecord.comment = "我的备注";
  //   return moneyRecord;
  // }
}
