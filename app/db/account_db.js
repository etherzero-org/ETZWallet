import React from 'react'
import SQLite from 'react-native-sqlite-storage'
SQLite.enablePromise(true)

var database_name = "test.db"
var database_version = "1.0"
var database_displayname = "Test"
var database_size = -1

let updateNum = 0

class AmountDatabase  {

    constructor(){
        SQLite.openDatabase(database_name, database_version, database_displayname, database_size).then( res =>{
            this.conn = res
        }).catch(err => {
            console.log('22222222',err)
        })
    }

    createAmountTable(){ 
        console.log('this.conn===',this.conn)
        this.conn.transaction( tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ACCOUNT(' +  
              'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +  
              'account_name VARCHAR,'+  
              'password_promp VARCHAR,'+  
              'mnemonic VARCHAR,'+
              'is_selected INTEGER,' + 
              'assets_total VARCHAR,' + 
              'backup_status INTEGER,' +   
              'backup_keystore INTEGER,' + 
              'address VARCHAR,' + 
              'kid VARCHAR,' + 
              'version INTEGER,' + 
              'cipher VARCHAR,' + 
              'ciphertext VARCHAR,' + 
              'kdf VARCHAR,' + 
              'mac VARCHAR,' + 
              'dklen INTEGER,' + 
              'salt VARCHAR,' + 
              'n INTEGER,' + 
              'r INTEGER,' + 
              'p INTEGER,' + 
              'iv VARCHAR)'  
              , [], ()=> {  
                console.log('create amount successful')
              }, (err)=> {  
                console.log('create amount err',err)
            })
        }) 
    } 

    createTokenTable(){ 
        this.conn.transaction( tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS TOKEN(' +  
              'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +  
              'account_addr VARCHAR,'+ 
              'tk_address VARCHAR,'+
              'tk_decimals INTEGER,'+  
              'tk_name VARCHAR,' + 
              'tk_price VARCHAR,' + 
              'tk_symbol VARCHAR,' +    
              'tk_selected INTEGER,' + 
              'tk_number INTEGER)'  
              , [], ()=> {  
                console.log('create token table successful')
              }, (err)=> {  
                console.log('create token table err',err)
            })
        }) 
    }

    createTradingTable(){
        this.conn.transaction( tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS TRADING(' +  
                  'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +  
                  'tx_token VARCHAR,'+
                  'tx_time VARCHAR,'+  
                  'tx_result INTEGER,' + //1成功 0失败 -1 正在转账pending
                  'tx_hash VARCHAR,' +  
                  'tx_value VARCHAR,' +    
                  'tx_sender VARCHAR,' + 
                  'tx_receiver VARCHAR,' + 
                  'tx_note VARCHAR,' + 
                  'tx_account_name VARCHAR,' + 
                  'tx_block_number INTEGER)'
              , [], ()=> {  
                console.log('create trading table successful')
              }, (err)=> {  
                console.log('create trading table err',err)
            })
        }) 
    }

    deleteAccountAllData(query){  
        this.conn.transaction( tx => {
            tx.executeSql(query.sql,query.parame,() => {
                console.log('delete account data successful')
            })
        })   
    } 

    dropTable(query){  

        this.conn.transaction( tx => {
            tx.executeSql(query.sql,[],() => {
                console.log('delete table successful')
            })
        })
    } 

    async deleteAccount(query){
        let delFinish = ''
        try{
            await this.conn.transaction( tx => {
                delFinish = this.delete(query,tx)
            })
        } catch(err){
            delFinish = 'fail'
            console.log('删除失败1')
        }
        return delFinish
    }
    async delete(query,tx){
        let deleteFinished = ''
        try{
            await tx.executeSql(query.sql,query.d_id)
            deleteFinished = 'success'
        }catch(err){
            deleteFinished = 'fail'
            console.log('删除失败2')
        }
        return deleteFinished
    }

    //   ---
    async updateTable(query){
        let upTabFinished = ''
        try {
            await this.conn.transaction( tx => {
                upTabFinished = this.updateTab(query,tx)
            })
        }catch (err){
            upTabFinished = 'fail'
        }
        return upTabFinished
    }
    async updateTab(query,tx){
        let upFinished = ''
        try{
            await tx.executeSql(query.sql,query.parame)
            upFinished = 'success'
        }catch(err){
            upFinished = 'fail'
        }
        return upFinished
    }

    async selectTable(query){

        let res = []
        try {
            await this.conn.transaction( tx1 => {
                res = this.select(tx1,query)
            })
        } catch (err){
            res = []
            // console.log('22222',err)
        }
        return res
    }

    async select(tx1,query){
        let allAccounts = []
        try {
            let res = await tx1.executeSql(query.sql,query.parame)
            let len = res[1].rows.length 
            for(let i=0; i<len; i++){  
              let u = res[1].rows.item(i)
              allAccounts.push(u)
            } 

        } catch(err){
            console.log('select account table err',err)
        }
        return allAccounts
    }

    
    // async insertToTable(query){
    //     let succ = false
    //     console.log('插入',query)
    //     try {
    //         await this.conn.transaction( tx => {
    //             succ = this.insertTo(tx,query)
    //         })
    //     } catch (err){
    //         succ = false
    //         console.log('插入失败1',err)
    //     }
        
    //     return succ
    // }

    // async insertTo(tx,query){
    //     console.log('query.parame===',query.parame)
    //     console.log('query.parame22==', typeof query.parame + '-------------' + query.parame.length)

    //     let insertSuccess = false
    //     try {

    //         await tx.executeSql(query.sql,query.parame)

    //         insertSuccess = true

    //     } catch(err){
    //         insertSuccess = false
    //         console.log('插入失败2',err)
    //     }
    //     return insertSuccess
    // }

    async insertToAccontTable(accountData){  
        let len = accountData.length;  
 
        console.log('account table insert data',accountData) 

        let insertSuccess = false
        await this.conn.transaction( tx =>{  

            return Promise.all(accountData.map(async (query,idx) => {
                try {
                    const { account_name, mnemonic, is_selected, assets_total, backup_status, backup_keystore, address, kid, version, cipher, ciphertext, kdf, mac, dklen, salt, n,r,p,iv, password_promp } = query


                    let sql = "INSERT INTO account(account_name,mnemonic,is_selected,assets_total,backup_status,backup_keystore,address,kid,version,cipher,ciphertext,kdf,mac,dklen,salt,n,r,p,iv,password_promp)"+  
                              "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                    await tx.executeSql(sql,[account_name,mnemonic,is_selected,assets_total,backup_status,backup_keystore,address,kid,version,cipher,ciphertext,kdf,mac,dklen,salt,n,r,p,iv,password_promp])

                    insertSuccess = true

                } catch(err){
                    
                    insertSuccess = false

                    console.log('insert account err',err)
                }
            })) 
        })
        return insertSuccess
    }  


    async insertToTokenTable(tokenData){
        console.log('token表插入的数据',tokenData)
        let insertSuccess = false
        await this.conn.transaction( tx =>{  

            return Promise.all(tokenData.map(async (query,idx) => {
                try {
                    const { tk_address,account_addr, tk_decimals, tk_name, tk_price, tk_symbol, tk_selected, tk_number } = query

                    let sql = "INSERT INTO token(tk_address, account_addr,tk_decimals, tk_name, tk_price, tk_symbol, tk_selected, tk_number) values(?,?,?,?,?,?,?,?)";  
                    
                    await tx.executeSql(sql,[tk_address, account_addr, tk_decimals, tk_name, tk_price, tk_symbol, tk_selected, tk_number])

                    insertSuccess = true

                } catch(err){
                    
                    insertSuccess = false

                    console.log('insert token err',err)
                }
            })) 
        })
        return insertSuccess
    }

    async insertToTradingTable(tradingData){
        let insertTradingSuccess = false
        console.log('交易插入的数据',tradingData)
        await this.conn.transaction( tx =>{  

            return Promise.all(tradingData.map(async (query,idx) => {
                try {
                    const { tx_time,tx_token,tx_account_name,tx_result,tx_hash,tx_value,tx_sender,tx_receiver,tx_note,tx_block_number } = query

                    let sql = "INSERT INTO trading(tx_time,tx_token,tx_account_name,tx_result,tx_hash,tx_value,tx_sender,tx_receiver,tx_note,tx_block_number) values(?,?,?,?,?,?,?,?,?,?)";  
                    
                    await tx.executeSql(sql,[tx_time,tx_token,tx_account_name,tx_result,tx_hash,tx_value,tx_sender,tx_receiver,tx_note,tx_block_number])

                    insertTradingSuccess = true

                } catch(err){
                    
                    insertTradingSuccess = false

                    console.log('insert trading err',err)
                }
            })) 
        })
        return insertTradingSuccess
    }

    // closeDatabase(){
    //     this.conn.close().then(this.dbCloseSuccess).catch(this.dbCloseError)
    // }

    // dbCloseSuccess(res){

    // }

    // dbCloseError(err){

    // }
}

const accountDB = new AmountDatabase()


export default accountDB