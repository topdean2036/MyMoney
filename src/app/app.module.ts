import { CustomsettingService } from './../service/customsetting.service';
import { FormateFromISOPipe } from '../pipes/formateFromISO.pipe';
import { GlobalService } from './../service/global.service';
import { AccordionPage } from './../components/accordion-demo/demo-page/accordion';
import { RecordListPage } from './../pages/record-list/record-list.page';
import { DatabaseService } from './../service/database.service';
import { RecordService } from './../service/record.service';
import { AccountService } from './../service/account.service';

import { NgModule, ErrorHandler, Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { EditRecordPage } from '../pages/edit-record/edit-record.page';
import { EditMoneyPopover } from './../pages/edit-record/popover/edit-money.popover';
import { MoneyInOutTab } from './../pages/edit-record/tabs//moneyinout.tab';
import { MoneyTransferTab } from './../pages/edit-record/tabs//moneytransfer.tab';

import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    AccordionPage,
    EditRecordPage, EditMoneyPopover, RecordListPage,
    MoneyInOutTab, MoneyTransferTab,
    FormateFromISOPipe
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MultiPickerModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    AccordionPage,
    EditRecordPage, EditMoneyPopover, RecordListPage,
    MoneyInOutTab, MoneyTransferTab
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    DatabaseService,
    RecordService,
    AccountService,
    GlobalService,
    CustomsettingService
  ]
})
export class AppModule { }
