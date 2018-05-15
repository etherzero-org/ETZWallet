const wallet = require('ethereumjs-wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const util = require('ethereumjs-util')
const bip39 = require('bip39')
const randomBytes = require('randombytes')
import I18n from 'react-native-i18n'

import accountDB from '../db/account_db'
import {  ethWallet,EthereumHDKey } from './ethWallet'
import { fromV3,toLowerCaseKeys } from './fromV3'

async function onImportAccount(options){
	const { importSuccess, importFailure, parames } = options

	const { privateKey, privatePassword, privateUserName,type,mnemonicVal, mnemonicPsd, mnemonicUserName,keystoreVal, keystoreUserName, fromLogin, keystorePsd,accountsList, hintValue } = parames
	let selected = 0
	let keyStore = {}
	let createFinished = false
	let userName = ''
	try {
		if(type === 'private'){
			let buf = new Buffer(privateKey, 'hex')
			let wal = ethWallet.fromPrivateKey(buf)
		    let p_keystore = wal.toV3(privatePassword,{c:8192,n:8192})

		    console.log('私钥导入p_keystore====',p_keystore)

		    keyStore = p_keystore
		    userName = privateUserName
		    createFinished = true
		}else{
			if(type === 'mnemonic'){
				console.log('需要导入的助记词',mnemonicVal)
				let seed = bip39.mnemonicToSeed(mnemonicVal)
			    let hdWallet = EthereumHDKey.fromMasterSeed(seed)
			    let w = hdWallet.getWallet()
			    let m_keystore = w.toV3(mnemonicPsd,{c:8192,n:8192})
			    console.log('助记词导入',m_keystore)
			    keyStore = m_keystore
			    userName = mnemonicUserName
			    createFinished = true
			}else{
				//keystore导入时  使用keystore+psd生成paivekey 再用paivekey+psd生成自己的keystore

				let keyStore1 = JSON.parse(keystoreVal)
				let keyStore2 = toLowerCaseKeys(keyStore1)
				let newWallet 
				try{
					newWallet = fromV3(keyStore2,keystorePsd)//验证密码
				} catch (err){
					importFailure(err) 
					return
				}

				if(keyStore2.crypto.kdfparams.n > 8193){
	          		let ksPrivKey = newWallet.privKey.toString('hex')
	          		let buf = new Buffer(ksPrivKey, 'hex')
					let wal = ethWallet.fromPrivateKey(buf)
				    let ksKeystore3 = wal.toV3(keystorePsd,{c:8192,n:8192})
			   		keyStore = ksKeystore3
					
				}else{
					keyStore = keyStore2
				}
				console.log('keyStore导入完成',keyStore)
				userName = keystoreUserName
				createFinished  = true
			}
		}
	} catch (err){
		console.log('导入出错555',err)
		importFailure(err) 
		return
	}

	if(createFinished){
	    

	   	if(fromLogin === 'login'){
	   		selected = 1
	       	accountDB.createAmountTable()
	       	accountDB.createTokenTable()
	       	accountDB.createTradingTable()
	   	}else{
	   		//不能导入相同的账号

	   		for(let i = 0; i < accountsList.length; i ++){
	   			if(accountsList[i].address === keyStore.address){
	   				importFailure(I18n.t('account_existed'))
	   				return
	   			}
	   		}

	   		selected = 0
	   	}

	    let userData = [],  
    		user = {};

	  	try {
	  		user.password_promp= hintValue
		    user.account_name = userName  
		    user.backup_status = 0  
		    user.is_selected = selected
		    user.assets_total = '0'
		    user.address = keyStore.address
		    user.kid = keyStore.id 
		    user.version = keyStore.version

	    	user.cipher = keyStore.crypto.cipher
	    	user.ciphertext = keyStore.crypto.ciphertext
	    	user.kdf = keyStore.crypto.kdf
			user.mac = keyStore.crypto.mac
			user.dklen = keyStore.crypto.kdfparams.dklen
			user.salt = keyStore.crypto.kdfparams.salt
			user.n = keyStore.crypto.kdfparams.n
			user.r = keyStore.crypto.kdfparams.r
			user.p = keyStore.crypto.kdfparams.p
			user.iv = keyStore.crypto.cipherparams.iv

		    userData.push(user) 

		    let importInsertRes = await accountDB.insertToAccontTable(userData)

		    if(importInsertRes){
		    	//导入成功   回调
		    	importSuccess(userData)
		    }else{
		    	console.log('导入出错444')
		    	importFailure('import failed')
		    }
	  		
	  	} catch(err){
	  		console.log('导入出错333',err)
	  		importFailure(err) 
	  	}
 	}
}


async function onDelAccount(options){
	const { parames, delSuccess, delFailure } = options
	const { deleteId, curId } = parames
	let delRes = await accountDB.deleteAccount({
		sql: 'delete from account where id = ?',
		d_id: [deleteId],
	})

	if(delRes === 'success'){
		delSuccess()
	}else{
		if(delRes === 'fail'){
			delFailure()
		}
	}

	if(curId === deleteId){
		let selectRes = await accountDB.selectTable({
			sql: 'select account_name from account',
			parame: []
		})
		let updateRes = ''
		if(selectRes.length !== 0){
			updateRes = await accountDB.updateTable({
				sql: 'update account set is_selected = 1 where account_name = ?',
				parame: [selectRes[0].account_name]
			})
		}
		if(updateRes === 'success'){
			console.log('successful===删除的是当前账号  更新 将另一个账号 is_selected=1')
		}else{
			if(updateRes === 'fail'){
				console.log('failure===删除的是当前账号  更新 将另一个账号 is_selected=1')
			}
		}
	}
}


async function onCreateAccount(options){
	const { parames, createSuccess, } = options
	const { userNameVal, psdVal, promptVal, fromLogin} = parames
	
    let selected = 0 
	let mnemonic = await bip39.generateMnemonic();
    console.log('创建时生成的mnemonic==',mnemonic)
    
    let seed = await bip39.mnemonicToSeed(mnemonic)

    let hdWallet = EthereumHDKey.fromMasterSeed(seed)


    let w = hdWallet.getWallet()

    let keyStore = w.toV3(psdVal,{c:8192,n:8192})

    console.log('keyStore==',keyStore)

    if(fromLogin === 'login'){
    	accountDB.createAmountTable()
    	accountDB.createTokenTable()
    	accountDB.createTradingTable()
    	selected = 1
    }else{
    	selected = 0
    }

    let userData = [],  
    	user = {};
    user.password_promp = promptVal
    user.mnemonic = mnemonic
    user.account_name = userNameVal  
    user.backup_status = 0  
    user.assets_total = '0'
    user.is_selected = selected
    user.address = keyStore.address  
    user.kid = keyStore.id  
    user.version = keyStore.version  
    user.cipher = keyStore.crypto.cipher  
    user.ciphertext = keyStore.crypto.ciphertext  
    user.kdf = keyStore.crypto.kdf  
    user.mac = keyStore.crypto.mac  
    user.dklen = keyStore.crypto.kdfparams.dklen 
    user.salt = keyStore.crypto.kdfparams.salt  
    user.n = keyStore.crypto.kdfparams.n  
    user.r = keyStore.crypto.kdfparams.r  
    user.p = keyStore.crypto.kdfparams.p  
    user.iv = keyStore.crypto.cipherparams.iv  
    userData.push(user) 

    let insertRes = await accountDB.insertToAccontTable(userData)

    if(insertRes){
    	//创建成功   回调
    	createSuccess(true)
    }else{
    	createSuccess(false)
    }

}

async  function onUpdatePrivStatus(options) {
	const { parames, updatePrivSuccess } = options

	let updateRes = await accountDB.updateTable({
		sql: 'update account set backup_status = 1 where address= ?',
		parame: [parames.addr]
	})
	if(updateRes === 'success'){
		updatePrivSuccess(true)
	}else{
		if(updateRes === 'fail'){
			updatePrivSuccess(false)
		}
	}
}

async function onDeleteMnemonic(options){
	const { parames, delSuc } = options

	let delMRes = await accountDB.updateTable({
		sql: 'update account set mnemonic = "" where address= ? ',
		parame: [parames.addr]
	})

	console.log('更新朱几次状态',delMRes)

	if(delMRes === 'success'){
		delSuc(true)
	}else{
		if(delMRes === 'fail'){
			delSuc(false)
		}
	}
    

}

async function onSwitchAccount(options){
	const { parames, switchAccountEnd } = options

	const { switchAddr } = parames

	let switchRes1 = await accountDB.updateTable({
		sql: 'update account set is_selected = 1 where address= ?',
		parame: [switchAddr]
	})

	if(switchRes1 === 'success'){
		let switchRes2 = await accountDB.updateTable({
			sql: 'update account set is_selected = 0 where address != ?',
			parame: [switchAddr]
		})
		if(switchRes2 === 'success'){
			switchAccountEnd()
		}
	}else{
		console.log('切换账号出错')
	}
}

async function onGetManageBalance(options){
	const { parames,getBalanceNum } = options
	let ba = []
	for(let i = 0; i < parames.list.length; i ++){
		let balance = await web3.eth.getBalance(`0x${parames.list[i].address}`)
		let idxBalance = web3.utils.fromWei(balance,'ether')
		ba.push(idxBalance)		
	}
	getBalanceNum({
		balData: ba,
	})

}

const accountDBOpation = {
	importAccount:(options) => {
		onImportAccount(options)
	},
	deleteAccount:(options) => {
		onDelAccount(options)
	},

	createAccount:(options) => {
		onCreateAccount(options)
	},
	updatePrivStatus:(options) => {
		onUpdatePrivStatus(options)
	},
	deleteMnemonic:(options) => {
		onDeleteMnemonic(options)
	},
	switchAccount:(options) =>{
		onSwitchAccount(options)
	},
	getManageBalance: (options) => {
		onGetManageBalance(options)
	}
}

export default accountDBOpation