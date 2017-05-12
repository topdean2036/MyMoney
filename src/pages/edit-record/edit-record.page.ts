import { RecordService } from './../../service/record.service';
import { MoneyRecord } from './../../vo/money-record';

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';

import { MoneyTransferTab } from './tabs/moneytransfer.tab';
import { MoneyInOutTab } from './tabs/moneyinout.tab';

@Component({
  templateUrl: 'edit-record.page.html'
})
export class EditRecordPage implements OnInit {

  tabInRoot: any;
  tabOutRoot: any;
  tabTransferRoot: any;

  moneyRecord: MoneyRecord;

  tabParam: any;

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
