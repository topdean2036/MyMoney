import { RecordService } from './../service/record.service';
import { AccordionPage } from './../components/accordion-demo/demo-page/accordion';
import { RecordListPage } from './../pages/record-list/record-list.page';
import { DatabaseService } from './../service/database.service';
import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

//import { StatusBar} from '@ionic-native/status-bar';
//import { Splashscreen } from '@ionic-native/splash-screen';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

import { EditRecordPage } from '../pages/edit-record/edit-record.page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public menu: MenuController, public dbService: DatabaseService,
    public recordService: RecordService) {
    this.initializeApp();
    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'My First List', component: ListPage },
      { title: '可折叠', component: AccordionPage },
      { title: '记一笔', component: EditRecordPage },
      { title: '资金流水', component: RecordListPage }
    ];
  }

  /**
   * 初始化app
   */
  async initializeApp() {
    try {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      await this.platform.ready();

      //StatusBar.styleDefault();
      //Splashscreen.hide();

      //初始化数据库
      await this.dbService.init();
      //初始化资金记录表
      await this.recordService.initMoneyRecord();
      //初始化账户表
      
    } catch (error) {
      console.log(error);
      return;
    }
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
