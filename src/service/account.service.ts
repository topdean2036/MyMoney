import { Injectable } from '@angular/core';

import { DatabaseService } from './database.service';
import { Account } from '../vo/account';

@Injectable()
export class AccountService {

    constructor(public dbService: DatabaseService) {

    }

    //初始化资金记录表
    async initAccount() {
        let sql = "CREATE TABLE IF NOT EXISTS account ("
            + "name TEXT PRIMARY KEY,"
            + "balance REAL,"
            + "isdefault INTEGER,"
            + "type TEXT,"
            + "subtype TEXT,"
            + "currencytype TEXT)";

        await this.dbService.execSql(sql);

        //查询用户表里是否有初始数据
        let rs = await this.getAccountList();
        if (rs.length == 0) {
            //TODO 没有初始数据时，插入两条初始数据
            let defaultAccount = new Account();
            defaultAccount.name = '现金';
            defaultAccount.balance = 0;
            defaultAccount.isdefault = 1;
            //TODO 账户类型
            defaultAccount.type = '现金账户';
            defaultAccount.subtype = '现金口袋';
            //TODO 币种
            defaultAccount.currencytype = '人民币';
            await this.addAccount(defaultAccount);
        }
    }

    async addAccount(account: Account): Promise<any> {
        let sql = "INSERT INTO account (name, balance, isdefault, type, subtype, currencytype) VALUES (?,?,?,?,?,?)";
        let params = [account.name, account.balance, account.isdefault, account.type, account.subtype, account.currencytype];

        return this.dbService.execSql(sql, params);
    }

    async getAccountList(): Promise<Account[]> {
        let rsArray: Account[] = [];
        let sql = "SELECT name,balance,isdefault,type,subtype,currencytype FROM account";
        let params = [];
        let rs = await this.dbService.execSql(sql, params);
        try {
            if (rs.rows.length > 0) {
                for (var i = 0; i < rs.rows.length; i++) {
                    rsArray.push(this.itemToBean(rs.rows.item(i)));
                }
            }
        } catch (error) {
            const msg = JSON.stringify(error);
            alert("error:" + msg);
            console.error(msg);
        }

        return rsArray;
    }

    private itemToBean(item: any): Account {
        let mr = new Account();
        mr.name = item.name;
        mr.balance = item.balance;
        mr.isdefault = item.isdefault;
        mr.type = item.type;
        mr.subtype = item.subtype;
        mr.currencytype = item.currencytype;

        return mr;
    }
}
