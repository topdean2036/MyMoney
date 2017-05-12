
import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'edit-money-popover',
  templateUrl: 'edit-money.popover.html'
})
export class EditMoneyPopover {
  //显示的数字，是正在录入的数字或者计算结果
  shownumber: string = '';
  //计算公式
  foluma: string = '';
  //刚进入界面或者点击命令(=)后，标记为是
  firstFlag: boolean = true;
  //记录上次输入的+-命令
  tmpCommand: string = '';
  //记录临时结果，用于连续+-时
  tmpResult: number = 0;

  private selectContent;

  constructor(public params: NavParams, public viewCtrl: ViewController) {
    this.shownumber = params.get('inNmuber');
  }

  ngOnInit() {
    this.selectContent = document.querySelector('.popover-content')
  }
  onPageDidEnter() {
    alert(this.selectContent);
    this.selectContent.style.bottom = 0
    this.selectContent.style.left = 0
    this.selectContent.style.top = 'auto'
  }

  //点击数字或'.'
  clickNumber(input: string) {
    if (this.firstFlag) {
      this.shownumber = input;
    } else {
      //显示的数字里面已经有'.'时，不在添加'.'
      if (input == '.' && (this.shownumber == '' || this.shownumber.indexOf('.') > 0)) {
        //
      } else {
        //拼接数字
        this.shownumber = '' + this.shownumber + input;
      }
    }

    //录入过数字了，就不会再清除之前的数字
    this.firstFlag = false;
    //alert(input + '-' + this.firstFlag + '-' + this.shownumber + '-' + this.foluma + '-' + this.tmpCommand + '-' + this.tmpResult);

  }

  //点击命令
  clickCommand(command: string) {
    switch (command) {
      //计算结果，重置第一次标记为是，清空计算公式，清空上次计算命令、清空临时结果
      case '=':
        this.executeEqualCommand();
        break;

      //计算临时结果，修改上次命令，拼接计算公式，清空显示的数字,第一次标记置为否
      case '+':
        //显示数字要是没有值，表示刚才刚输入了一个+-命令，此时用新命令替换公式里最后的命令
        //修改计算公式最后命令，修改上次命令，显示的数字不变（仍然为空），第一次标记不变（仍然为否），临时结果不变
        if (this.shownumber.length == 0) {
          this.foluma = this.foluma.substr(0, this.foluma.length - 1) + '+';
          this.tmpCommand = '+';
          //this.shownumber='';
          //this.firstFlag = false;
          //this.tmpResult = this.tmpResult;
        }
        //要显示数字有值，正常执行命令，处理连续+-动作（计算临时结果）
        //计算公式拼接显示数字和+，修改上次命令，计算临时结果，第一次标记置否，显示的数字置空
        else {
          if (this.tmpCommand == '+') {
            this.tmpResult = Number(this.tmpResult) + Number(this.shownumber);
          } else if (this.tmpCommand == '-') {
            this.tmpResult = Number(this.tmpResult) - Number(this.shownumber);
          } else {
            this.tmpResult = Number(this.shownumber);
          }
          this.foluma = '' + this.foluma + this.shownumber + '+';
          this.tmpCommand = '+';
          this.firstFlag = false;
          this.shownumber = '';
        }
        break;

      //逻辑同+命令
      case '-':
        if (this.shownumber.length == 0) {
          this.foluma = this.foluma.substr(0, this.foluma.length - 1) + '-';
          this.tmpCommand = '-';
        }
        else {
          if (this.tmpCommand == '+') {
            this.tmpResult = Number(this.tmpResult) + Number(this.shownumber);
          } else if (this.tmpCommand == '-') {
            this.tmpResult = Number(this.tmpResult) - Number(this.shownumber);
          } else {
            this.tmpResult = Number(this.shownumber);
          }
          this.foluma = '' + this.foluma + this.shownumber + '-';
          this.tmpCommand = '-';
          this.firstFlag = false;
          this.shownumber = '';
        }
        break;

      //显示的数字重置为0，重置第一次标记为是，清空计算公式，清空上次计算命令、清空临时结果
      case 'C':
        this.shownumber = '0';
        //录入'='后，第一次标记为是，像刚进入界面一样
        this.firstFlag = true;
        //清空计算公式
        this.foluma = '';
        //清空计算命令
        this.tmpCommand = '';
        //清空临时结果
        this.tmpResult = 0;
        break;
    }
    //alert(command + '-' + this.firstFlag + '-' + this.shownumber + '-' + this.foluma + '-' + this.tmpCommand + '-' + this.tmpResult);

  }

  //执行=命令
  //计算结果，重置第一次标记为是，清空计算公式，清空上次计算命令、清空临时结果
  executeEqualCommand() {
    if (this.tmpCommand == '+') {
      this.shownumber = String(Number(this.tmpResult) + Number(this.shownumber));
    } else if (this.tmpCommand == '-') {
      this.shownumber = String(Number(this.tmpResult) - Number(this.shownumber));
    }

    //录入'='后，第一次标记为是，像刚进入界面一样
    this.firstFlag = true;
    //清空计算公式
    this.foluma = '';
    //清空计算命令
    this.tmpCommand = '';
    //清空临时结果
    this.tmpResult = 0;
  }

  dismiss() {
    this.executeEqualCommand();
    this.viewCtrl.dismiss({ money: this.shownumber });
  }
}
