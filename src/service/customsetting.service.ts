import { GlobalService } from './global.service';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomsettingService {

  constructor(public dbService: DatabaseService, public global: GlobalService) {

  }

  //TODO 获取资金类别。需要做成动态查询
  getRecordTypeColumns(direction: string): any[] {
    let recordTypeColumns: any[];
    if (direction == "支出") {
      recordTypeColumns = [
        {
          name: 'type',
          options: [
            { text: '食品酒水', value: '食品酒水' },
            { text: '服饰美容', value: '服饰美容' }
          ]
        },
        {
          name: 'subtype',
          options: [
            { text: '早午晚餐', value: '早午晚餐', parentVal: '食品酒水' },
            { text: '水果零食', value: '水果零食', parentVal: '食品酒水' },
            { text: '烟酒茶', value: '烟酒茶', parentVal: '食品酒水' },
            { text: '衣服裤子', value: '衣服裤子', parentVal: '服饰美容' },
            { text: '鞋帽包包', value: '鞋帽包包', parentVal: '服饰美容' },
            { text: '化妆饰品', value: '化妆饰品', parentVal: '服饰美容' },
            { text: '美容美发', value: '美容美发', parentVal: '服饰美容' },
            { text: 'aaaaaa', value: 'aaaaaa', parentVal: '服饰美容' }
          ]
        }

      ];
    } else if (direction == "收入") {
      recordTypeColumns = [
        {
          name: 'type',
          options: [
            { text: '职业收入', value: '职业收入' }
          ]
        },
        {
          name: 'subtype',
          options: [
            { text: '工资收入', value: '工资收入', parentVal: '职业收入' },
            { text: '奖金', value: '奖金', parentVal: '职业收入' }
          ]
        }

      ];
    } else {
      //转账的时候不应该获取资金类别
      return null;
    }
    return recordTypeColumns;
  }

  //TODO 获取账户。需要做成动态查询
  getRecordAccountColumns(): any[] {
    let recordAccountColumns = [{
      name: 'account',
      options: [
        { text: '老公现金', value: '老公现金' },
        { text: '老婆现金', value: '老婆现金' },
        { text: '建设银行', value: '建设银行' },
        { text: '工商银行', value: '工商银行' },
        { text: '招商银行', value: '招商银行' },
        { text: '中国银行', value: '中国银行' },
        { text: '微信钱包', value: '微信钱包' },
        { text: '支付宝', value: '支付宝' },
        { text: 'FT余额', value: 'FT余额' },
        { text: '应收', value: '应收' }]
    }];
    return recordAccountColumns;
  }
}
