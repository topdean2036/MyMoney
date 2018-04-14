import { GlobalService } from './../../service/global.service';
import { MoneyTransferTab } from './../edit-record/tabs/moneytransfer.tab';
import { MoneyInOutTab } from './../edit-record/tabs/moneyinout.tab';
import { RecordService } from './../../service/record.service';
import { MoneyRecord } from './../../vo/money-record';
import { RecordDirection } from './../../constant/record';

import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

@Component({
  selector: 'record-list',
  templateUrl: 'record-list.page.html'
})
export class RecordListPage {
  // selectedRecord: any;
  // dayRecords: any[];

  //资金记录颜色样式：根据资金方向是收入、支出来判断
  moneyColorClass = " {'inMoneyColor':moneyRecord.direction=='收入','outMoneyColor':moneyRecord.direction=='支出'}";

  //选择查询年份
  selectedYear: string;
  //选择查询月份对应的资金流水
  selectedMonthRecord: Array<{ date: string, dayRecord: MoneyRecord[] }> = [];

  //月份数据数组
  monthArray: Array<{ month: string, monthTitle: string, showDetails: boolean }> = [];

  constructor(public navCtrl: NavController, public recordService: RecordService, public toastCtrl: ToastController, public global: GlobalService) {

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
      let msg = JSON.stringify(error);
      alert("error:" + msg);
      console.error(msg);
    });
  }

  /**
   * ionic生命周期事件
   * 
   * 重新生成展开月份里面的数据，处理编辑记录后数据不刷新问题
   */
  ionViewWillEnter() {
    //有被选中的月份数据时（有月份列表展开）
    if (this.selectedMonthRecord.length > 0) {
      let selectedMonth = this.selectedMonthRecord[0].dayRecord[0].date.substr(5, 2);
      //根据年份和月份，重新生成月资金列表
      this.selectedMonthRecord = [];
      this.createMonthRecordList(this.selectedYear, selectedMonth);
    }
  }

  //展开、收回记录列表
  toggleRecordDetails(monthItem) {
    if (monthItem.showDetails) {
      this.selectedMonthRecord = [];
      monthItem.showDetails = false;
    } else {
      this.selectedMonthRecord = [];
      //循环月份列表，收回所有流水列表，保证只有一个月份的流水列表处于展开状态
      for (let i = 0; i < this.monthArray.length; i++) {
        let monthRecord = this.monthArray[i];
        monthRecord.showDetails = false;
      }

      //根据年份和月份，重新生成月资金列表
      this.createMonthRecordList(this.selectedYear, monthItem.month);
      //展开列表
      monthItem.showDetails = true;
    }
  }

  /**
   * 根据年份和月份，重新生成月资金列表
   * @param year 
   * @param month 
   */
  private createMonthRecordList(year: string, month: string) {
    //查询展开月份的资金流水
    this.recordService.getRecordListByMonth(year + '-' + month).then(
      //重新组织数据，按照日期分组
      (data) => {
        let dayMoneyRecords: MoneyRecord[] = [];
        if (data.length > 0) {
          //用来分组的日期
          let day: any;
          for (var i = 0; i < data.length; i++) {
            let mr: MoneyRecord = data[i];
            //获取记录是几号的
            if (mr.date.substr(8, 2) == day) {
              dayMoneyRecords.push(mr);
            } else {
              day = mr.date.substr(8, 2);
              dayMoneyRecords = [];
              dayMoneyRecords.push(mr);
              this.selectedMonthRecord.push({
                date: mr.date,
                dayRecord: dayMoneyRecords
              });
            }
          }
        } else {
          this.selectedMonthRecord = [];
        }
      }).catch(error => {
        this.selectedMonthRecord = [];

        const msg = JSON.stringify(error);
        alert("error:" + msg);
        console.error(msg);
      });
  }

  /**
   * 编辑资金记录.根据资金方向调整到相应页面
   * @param event 
   * @param moneyRecord 
   */
  recordTapped(event, moneyRecord: MoneyRecord) {
    let direction = moneyRecord.direction;
    switch (direction) {
      case RecordDirection.Out:
        this.navCtrl.push(MoneyInOutTab, {
          moneyRecord: moneyRecord,
          direction: direction
        });
        break;
      case RecordDirection.In:
        this.navCtrl.push(MoneyInOutTab, {
          moneyRecord: moneyRecord,
          direction: direction
        });
        break;
      case RecordDirection.Transfer:
        this.navCtrl.push(MoneyTransferTab, {
          moneyRecord: moneyRecord
        });
        break;
    }
  }

  /**
   * 删除记录.数据库操作执行完成后，给出提示信息
   * @param index 
   * @param dayRecords 
   */
  deleteRecord(index, dayRecords: MoneyRecord[]) {
    //数据库删除
    this.recordService.delRecord(dayRecords[index].id).then(
      (data) => {
        //删除前台界面记录
        dayRecords.splice(index, 1);
        this.global.presentToast("成功", this.toastCtrl);
      }
    ).catch(error => {
      this.global.presentToast("失败", this.toastCtrl);

      const msg = JSON.stringify(error);
      alert("error:" + msg);
      console.error(msg);
    }
    );
  }
}
