import { CustomsettingService } from '../../../service/customsetting.service';
import { EditMoneyPopover } from './../popover/edit-money.popover';
import { RecordService } from './../../../service/record.service';
import { MoneyRecord } from './../../../vo/money-record';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController, ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'moneyinout.tab.html'
})
export class MoneyInOutTab implements OnInit {
  moneyRecord: MoneyRecord;
  //是否编辑
  ifEditRecord: boolean;
  //收入、支出
  direction: string;
  //资金类型下拉列表
  recordTypeColumns: any[] = [];
  //账户下拉列表
  recordAccountColumns: any[] = [];

  rs: MoneyRecord[] = [];
  //TODO 测试代码，需要删除
  logtext: string = "显示更新记录";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public popoverCtrl: PopoverController,
    public recordService: RecordService, public customsettingService: CustomsettingService,
    public toastCtrl: ToastController) {
    //如果是编译记录，会获取到资金记录，新增记录时不会有
    this.moneyRecord = navParams.get('moneyRecord');
    // alert(JSON.stringify(navParams.get('moneyRecord')));

    //从新增页面导航过来时，获取tabs里面的参数，判断收入支出。只能用data的方式过去，直接get不到数据
    this.direction = navParams.data.direction;
  }

  ngOnInit(): void {
    //判断是否新增记录，新增时根据资金方向初始化记录
    if (this.moneyRecord == null) {
      this.ifEditRecord = false;

      this.moneyRecord = new MoneyRecord();
      this.recordService.getRecordByDirection(this.direction).then(record => (this.moneyRecord = record));
    } else {
      // alert(JSON.stringify(this.moneyRecord));
      //修改记录时，根据传入的资金记录初始化响应参数
      this.ifEditRecord = true;
      this.direction = this.moneyRecord.direction;
    }

    //获取资金类别
    this.recordTypeColumns = this.customsettingService.getRecordTypeColumns(this.direction);
    //获取账户
    this.recordAccountColumns = this.customsettingService.getRecordAccountColumns();
  }

  //处理切换tab时的逻辑（实际上编译记录时没有切换tab页面的操作）
  ionViewDidEnter() {
    //新增记录切换tab页时，重新生成新记录
    if (!this.ifEditRecord) {
      alert(this.direction);
      //获取资金类别
      this.recordTypeColumns = this.customsettingService.getRecordTypeColumns(this.direction);

      this.recordService.getRecordByDirection(this.direction).then(record => (this.moneyRecord = record));
    }
  }

  //编辑金额时，弹出金额编辑页面
  editMoney(myEvent, money: number) {
    let editMoneyPopover = this.popoverCtrl.create(EditMoneyPopover, { inNmuber: this.moneyRecord.money });
    editMoneyPopover.present();
    editMoneyPopover.onDidDismiss(data => {
      if (data != null) {
        this.moneyRecord.money = data.money;
      }
    });
  }

  //保存
  save() {
    //处理_alltype，拆分主类别、副类别
    this.moneyRecord.type = this.moneyRecord._alltype.split(" ")[0];
    this.moneyRecord.subtype = this.moneyRecord._alltype.split(" ")[1];

    //TODO 完成后要弹出提示信息(自动消失那种)，失败时要记录日志
    if (this.ifEditRecord) {
      //TODO 编辑
      this.recordService.editRecord(this.moneyRecord).then(
        //TODO
        (data) => {
          this.presentToast("成功");
          this.logtext = JSON.stringify(data);
        }
      ).catch(error => {
        this.presentToast("失败");
        this.logtext = JSON.stringify(error)
      });
    } else {
      //新增
      this.recordService.addRecord(this.moneyRecord).then(
        //TODO
        (data) => {
          this.presentToast("成功");
          this.logtext = JSON.stringify(data);
        }
      ).catch(error => {
        this.presentToast("失败");
        this.logtext = JSON.stringify(error);
      });
    }

    //新增记录完成时，刷新金额、备注字段，为新增下一条记录准备
    if (!this.ifEditRecord) {
      this.moneyRecord.money = 0;
      this.moneyRecord.comment = "";
    } else {
      //编辑记录完成时，要返回到资金列表页面
      this.navCtrl.pop();
    }
  }

  //弹出提示框
  presentToast(toastMsg: string) {
    let toast = this.toastCtrl.create({
      message: toastMsg,
      duration: 2000
    });
    toast.present();
  }

  getRecordList() {
    // this.rs = this.recordService.getRecordList();

    this.recordService.getRecordListAll().then(
      (data) => {
        this.rs = data;
        // this.logtext = JSON.stringify(this.rs);
        this.logtext = JSON.stringify(data[0]);
      }
    ).catch(error => this.logtext = JSON.stringify(error));

    // if (this.rs.length > 0) {
    //     for (let mr of this.rs) {
    //         console.log("金额:" + mr.money + ";类别:" + mr.subtype + " " + mr.type + ";账户" + mr.account
    //             + ";时间" + mr.date + ";备注:" + mr.comment);
    //     }
    // }
  }

  alertValue() {
    alert("金额:" + this.moneyRecord.money + "/n类别:" + this.moneyRecord._alltype + "/n账户" + this.moneyRecord.account
      + "/n时间" + this.moneyRecord.date + "/n备注:" + this.moneyRecord.comment);
  }

}
