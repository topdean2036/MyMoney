import { RecordService } from './../../service/record.service';
import { MoneyRecord } from './../../vo/money-record';
import { RecordDirection } from './../../constant/record';

import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';

import { MoneyTransferTab } from './tabs/moneytransfer.tab';
import { MoneyInOutTab } from './tabs/moneyinout.tab';

@Component({
  templateUrl: 'edit-record.page.html'
})
export class EditRecordPage {

  tabInRoot: any;
  tabOutRoot: any;
  tabTransferRoot: any;

  moneyRecord: MoneyRecord;

  tabParamIn: any = { direction: RecordDirection.In };
  tabParamOut: any = { direction: RecordDirection.Out };
  tabParamTransfer: any = { direction: RecordDirection.Transfer };

  @ViewChild('editRecordTabs') editRecordTabs: Tabs;

  constructor(public navCtrl: NavController, public recordService: RecordService) {
    this.tabInRoot = MoneyInOutTab;
    this.tabOutRoot = MoneyInOutTab;
    this.tabTransferRoot = MoneyTransferTab;
  }

  ngOnInit(): void {
  }

  selectInTab(): void {
    // this.recordService.getRecordByDirection("收入").then(record => (this.moneyRecord = record));
  }

  selectOutTab(): void {
    // this.recordService.getRecordByDirection("支出").then(record => (this.moneyRecord = record));
  }

  selectTransferTab(): void {
    // this.recordService.getRecordByDirection("转账").then(record => (this.moneyRecord = record));
  }

}
