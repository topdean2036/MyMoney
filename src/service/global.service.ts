import { Injectable } from '@angular/core';

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

}
