import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateFromISO',
})
export class FormateFromISOPipe implements PipeTransform {
  transform(value: string, formateString: string): string {
    let result: string = '';
    //YYYY-MM-DD HH:mm
    if (formateString == null) {
      result = value.replace(/T/, ' ').substring(0, 16);
    }
    //获取日期
    else if (formateString == 'day') {
      let date: Date = new Date(value.substring(0, 10));
      result = date.getDate()<10? '0' + date.getDate() : '' + date.getDate();
    }
    //周几
    else if (formateString == 'Week') {
      let date: Date = new Date(value.substring(0, 10));
      result = '' + this.toChineseWeek(date.getDay());
    }
    return result;
  }

  toChineseWeek(day: number): string {
    let weekString = '';
    switch (day) {
      case 0:
        weekString = '周日';
        break;
      case 1:
        weekString = '周一';
        break;
      case 2:
        weekString = '周二';
        break;
      case 3:
        weekString = '周三';
        break;
      case 4:
        weekString = '周四';
        break;
      case 5:
        weekString = '周五';
        break;
      case 6:
        weekString = '周六';
        break;
    }
    return weekString;
  }
}
