import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {

  public db: SQLite;
  public dbname: string = 'mymoney.db';

  constructor(private platform: Platform) { }

  init(): Promise<any> {
    this.db = new SQLite();
    return this.db.openDatabase({ name: this.dbname, location: 'default' })
      .catch(error => { Error('Error opening database' + error) });
  }

  execSql(querySQL: string, params?: any): Promise<any> {
    params = params || [];
    return this.db.executeSql(querySQL, params)
      .catch(error => { Error('Unable to execute sql' + error) });
  }
}
