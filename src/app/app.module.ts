import { CustomsettingService } from './../service/customsetting.service';
import { RecordServiceTest } from './../service/record.service.test';
import { FormateFromISOPipe } from '../pipes/formateFromISO.pipe';
import { GlobalService } from './../service/global.service';
import { AccordionPage } from './../components/accordion-demo/demo-page/accordion';
import { RecordListPage } from './../pages/record-list/record-list.page';
import { DatabaseService } from './../service/database.service';
import { RecordService } from './../service/record.service';
import { NgModule, ErrorHandler, Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { EditRecordPage } from '../pages/edit-record/edit-record.page';
import { EditMoneyPopover } from './../pages/edit-record/popover/edit-money.popover';
import { MoneyInOutTab } from './../pages/edit-record/tabs//moneyinout.tab';
import { MoneyTransferTab } from './../pages/edit-record/tabs//moneytransfer.tab';

import { MultiPicker } from '../components/multi-picker/multi-picker';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    AccordionPage,
    EditRecordPage, EditMoneyPopover, RecordListPage,
    MoneyInOutTab, MoneyTransferTab,
    MultiPicker,
    FormateFromISOPipe
  ],
  imports: [
    FormsModule,
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
    MoneyInOutTab, MoneyTransferTab,
    MultiPicker
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RecordService,
    RecordServiceTest,
    DatabaseService,
    GlobalService,
    CustomsettingService
  ]
})
export class AppModule { }
