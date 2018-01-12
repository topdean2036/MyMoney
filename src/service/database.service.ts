import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {

  public db: SQLiteObject;
  public dbname: string = 'mymoney.db';

  constructor(public sqlite: SQLite) { }

  async init() {
    await this.sqlite.create({ name: this.dbname, location: 'default' });
  }

  async execSql(querySQL: string, params?: any): Promise<any> {
    params = params || [];
    return await this.db.executeSql(querySQL, params);
  }
}
