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

  /**
   * ionic生命周期事件
   * 
   * 处理切换tab时的逻辑（实际上编译记录时没有切换tab页面的操作）
   */
  ionViewWillEnter() {
    //新增记录切换tab页时，重新生成新记录
    if (!this.ifEditRecord) {
      //获取资金类别
      this.recordTypeColumns = this.customsettingService.getRecordTypeColumns(this.direction);
      //重新初始化资金记录
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

    //完成后要弹出提示信息(自动消失那种)，失败时要记录日志
    if (this.ifEditRecord) {
      //编辑
      this.recordService.editRecord(this.moneyRecord).then(
        (data) => {
          this.presentToast("成功");
        }
      ).catch(error => {
        this.presentToast("失败");
      });
    } else {
      //新增
      this.recordService.addRecord(this.moneyRecord).then(
        (data) => {
          this.presentToast("成功");
        }
      ).catch(error => {
        this.presentToast("失败");
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
}
