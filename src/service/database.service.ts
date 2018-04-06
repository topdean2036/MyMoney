import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {

  public db: SQLiteObject;
  public dbname: string = 'mymoney.db';

  constructor(public sqlite: SQLite) { }

  async init() {
    try{
      this.db = await this.sqlite.create({ name: this.dbname, location: 'default' });
    }catch(error){
      alert("error"+error);
      console.error(error);
    }
  }

  async execSql(querySQL: string, params?: any): Promise<any> {
    params = params || [];
    try{
      return await this.db.executeSql(querySQL, params);
    }catch(error){
      alert("error"+error);
      console.error(error);
    }    
  }
}
