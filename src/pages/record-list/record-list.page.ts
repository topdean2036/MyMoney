import { GlobalService } from './../../service/global.service';
import { MoneyTransferTab } from './../edit-record/tabs/moneytransfer.tab';
import { MoneyInOutTab } from './../edit-record/tabs/moneyinout.tab';
import { RecordService } from './../../service/record.service';
import { MoneyRecord } from './../../vo/money-record';
import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'record-list',
  templateUrl: 'record-list.page.html'
})
export class RecordListPage implements OnInit {
  // selectedRecord: any;
  // dayRecords: any[];
  msg: string;
  //选择查询年份
  selectedYear: string;
  //选择查询月份对应的资金流水
  selectedMonthRecord: Array<{ date: string, dayRecord: MoneyRecord[] }>;

  //月份数据数组
  monthArray: Array<{ month: string, monthTitle: string, showDetails: boolean }> = [];
  //日数据数组
  dayArray: Array<{ day: string, moneyRecords: MoneyRecord[] }> = [];

  constructor(public navCtrl: NavController, public recordService: RecordService, public global: GlobalService) {

  }


  ngOnInit(): void {
    //获取当前查询年份：
    this.selectedYear = (new Date()).getFullYear().toString();

    //获取资金记录的月份合计
    this.recordService.getRecordListMonthSum(this.selectedYear).then(
      (data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.monthArray.push({
              month: data.rows.item(i).month,
              monthTitle: data.rows.item(i).month + "月    收入：" + data.rows.item(i).moneyIn + "   支出：" + data.rows.item(i).moneyOut,
              showDetails: false
            });
          }
        }
      }
    ).catch(error => {
      this.msg = JSON.stringify(error);
      alert("error:" + this.msg);
    });
  }

  //展开、收回记录列表
  toggleRecordDetails(selectedMonthRecord) {
    if (selectedMonthRecord.showDetails) {
      this.selectedMonthRecord = [];
      selectedMonthRecord.showDetails = false;
    } else {
      this.selectedMonthRecord = [];
      //循环月份列表，收回所有流水列表，保证只有一个月份的流水列表处于展开状态
      for (let i = 0; i < this.monthArray.length; i++) {
        let monthRecord = this.monthArray[i];
        monthRecord.showDetails = false;
      }

      //查询展开月份的资金流水
      this.recordService.getRecordListByMonth(this.selectedYear + '-' + selectedMonthRecord.month).then(
        (data) => {
          let dayMoneyRecords: MoneyRecord[] = [];
          //重新组织数据
          if (data.rows.length > 0) {
            let day: any;
            for (var i = 0; i < data.rows.length; i++) {
              let mr = this.global.itemToMoneyRecord(data.rows.item(i));
              if (data.rows.item(i).day == day) {
                dayMoneyRecords.push(mr);
              } else {
                day = data.rows.item(i).day;
                dayMoneyRecords = [];
                dayMoneyRecords.push(mr);
                this.selectedMonthRecord.push({
                  date: data.rows.item(i).date,
                  dayRecord: dayMoneyRecords
                });
              }
            }
          }
        });
      //展开列表
      selectedMonthRecord.showDetails = true;
    }
  }

  //编辑资金记录
  recordTapped(event, moneyRecord: MoneyRecord) {
    // this.navCtrl.push(EditRecordPage, {
    //   moneyRecord: moneyRecord
    // });
    let direction = moneyRecord.direction;
    switch (direction) {
      case "支出":
        this.navCtrl.push(MoneyInOutTab, {
          moneyRecord: moneyRecord,
          direction: direction
        });
        break;
      case "收入":
        this.navCtrl.push(MoneyInOutTab, {
          moneyRecord: moneyRecord,
          direction: direction
        });
        break;
      case "转账":
        this.navCtrl.push(MoneyTransferTab, {
          moneyRecord: moneyRecord
        });
        break;
    }
  }

  //TODO 数据库操作执行完成后，给出提示信息
  deleteRecord(index, dayRecords: MoneyRecord[]) {
    alert(index);
    //数据库删除
    this.recordService.delRecord(dayRecords[index].id).then(
      (data) => {
        // this.logtext = JSON.stringify(data);
        //删除前台界面记录
        dayRecords.splice(index, 1);
      }
    ).catch(error => {
      // this.logtext = JSON.stringify(error)
    }
      );
  }
}
