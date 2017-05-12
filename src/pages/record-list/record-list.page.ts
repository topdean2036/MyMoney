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
  selectedRecord: any;
  dayRecords: any[];
  msg: string;

  //月数组
  monthArray: Array<{ monthTitle: string, details: any[], showDetails: boolean }> = [];

  constructor(public navCtrl: NavController, public recordService: RecordService) {

  }


  ngOnInit(): void {
    //获取资金记录的月份合计
    this.recordService.getRecordListMonthSum((new Date()).getFullYear().toString()).then(
      (data) => {
        alert(data);
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.monthArray.push({
              monthTitle: data.rows.item(i).month + "月    收入：" + data.rows.item(i).moneyIn + "   支出：" + data.rows.item(i).moneyOut,
              details: [],
              showDetails: false
            });
          }
        }
      }
    ).catch(error => this.msg = JSON.stringify(error));

    // this.recordService.getRecordList().then(
    //   (date) => {
    //     this.dayRecords = date;
    //     this.monthArray.push({
    //       monthTitle: '1月    收入：100   支出：150',
    //       details: this.dayRecords,
    //       showDetails: false
    //     });
    //     this.monthArray.push({
    //       monthTitle: '2月   收入：110   支出：160',
    //       details: this.dayRecords,
    //       showDetails: false
    //     });
    //     this.monthArray.push({
    //       monthTitle: '3月   收入：120   支出：170',
    //       details: this.dayRecords,
    //       showDetails: false
    //     });
    //   }
    // ).catch(error => this.msg = JSON.stringify(error));
  }

  //展开、收回记录列表
  toggleRecordDetails(arr) {
    if (arr.showDetails) {
      arr.showDetails = false;
    } else {
      arr.showDetails = true;
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
