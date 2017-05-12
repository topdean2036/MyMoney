import { MoneyRecord } from './../../../vo/money-record';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

@Component({
    templateUrl: 'moneytransfer.tab.html'
})
export class MoneyTransferTab {
    moneyRecord: MoneyRecord;
    moneyDirection: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

        //TODO 判断是否新增记录，如果是修改还要获取修改记录的信息

        this.moneyRecord = new MoneyRecord();
        this.moneyRecord.money = 10;
        this.moneyDirection = 'in';
    }

    editMoney(money: number) {
        // let editMoneyModal = this.modalCtrl.create(EditMoneyModal, { inNmuber: this.moneyRecord.money });
        // editMoneyModal.present();
        // editMoneyModal.onDidDismiss(data => {
        //     if (data != null) {
        //         this.moneyRecord.money = data.money;
        //     }
        // });
    }

}
