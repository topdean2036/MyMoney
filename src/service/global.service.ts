import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class GlobalService {
  toChinaISOString(date: Date): string {
    return (new Date(date.getTime() + +8 * 3600 * 1000)).toISOString();
  }

  toDateString(date: Date): string {
    return '' + date.getFullYear() + '-' + this.addPre0(date.getMonth() + 1) + '-'
      + this.addPre0(date.getDate()) + 'T' + this.addPre0(date.getHours())
      + ':' + this.addPre0(date.getMinutes()) + ':' + this.addPre0(date.getSeconds())
      + '.' + date.getMilliseconds() + 'Z';
  }

  addPre0(num: number): string {
    let result = '';
    if (num < 10) {
      result = '0' + num;
    } else {
      result = '' + num;
    }
    return result;
  }

  /**
   * 弹出提示框，2秒后消失
   * @param toastMsg 
   * @param toastCtrl 
   */
  presentToast(toastMsg: string, toastCtrl: ToastController) {
    let toast = toastCtrl.create({
      message: toastMsg,
      duration: 2000
    });
    toast.present();
  }
}
