import { RecordService } from './../service/record.service';
import { AccordionPage } from './../components/accordion-demo/demo-page/accordion';
import { RecordListPage } from './../pages/record-list/record-list.page';
import { DatabaseService } from './../service/database.service';
import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

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

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      //初始化数据库、资金记录表
      this.dbService.init().then(() => { return this.recordService.initMoneyRecord() });
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
