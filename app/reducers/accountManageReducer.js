import * as types from  '../constants/accountManageConstant'
const wallet = require('ethereumjs-wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const util = require('ethereumjs-util')
const bip39 = require('bip39')


const initState = {
	accountInfo: [],
	currentAddr: '',
	importStatus: '',
	importFailMsg: '',
	// deleteFinished: false,
	updateBackupSucc: false,
	isLoading: false,
	deleteSuc: false,
	passAccInfoSuc: '',
	createSucc: false,
	delMnemonicSuc: false,

	globalAccountsList: [],
	currentAccount: {},
	deleteCurrentAccount: false,
	backupModalTimes: 0,
	importLoading: false,

	scanAddress: '',
	scanCurToken: '',
	allAmoountAddress: [],

	modifyStatus: 0,
	modifyText: '',

	pass_currentList: {},
	pass_keyStore: {},

	mnemonicValue: '',
	create_usernane: '',
	create_psd: '',
	create_prompt: '',
	create_from: '',

	copyKeystoreSuc: false,
}
export default function accountManageReducer (state = initState,action) {
	switch(action.type){

		case types.ON_SWITCH_ACCOUNT_START:
			return onSwitchStart(state,action)
			break
		case types.ON_SWITCH_ACCOUNT_END:
			return onSwitchEnd(state,action)
			break
		case types.ON_DELETE_ACCOUNT_START:
			return onDelStart(state,action)
			break
		case types.ON_DELETE_ACCOUNT_SUC:
			return onDelSuc(state,action)
			break
		case types.ON_DELETE_ACCOUNT_FAIL:
			return onDelFail(state,action)
			break
		case types.RESET_DELETE_STATUS:
			return onReset(state,action)
			break
		case types.UPDATE_BACKUP_STATUS:
			return onUpateBackupStart(state,action)
			break
		case types.UPDATE_BACKUP_STATUS_SUCC:
			return onUpateBackupSuc(state,action)
			break
		case types.CREATE_ACCOUNT_START:
			return accountCreateStart(state,action)
			break
		case types.CREATE_ACCOUNT_SUC:
			return accountCreateSuc(state,action)
			break
		case types.IMPORT_ACCOUNT_START:
			return importStart(state,action)
			break
		case types.IMPORT_ACCOUNT_SUC:
			return importSuc(state,action)
			break
		case types.IMPORT_ACCOUNT_FAIL:
			return importFail(state,action)
			break
		case types.DELETE_MNEMONIC:
			return onDelMneMonic(state,action)
			break
		case types.DELETE_MNEMONIC_START:
			return onDelMneMonicStart(state,action)
			break
		case types.GLOBAL_ALL_ACCOUNTS_INFO:
			return globalAccounts(state,action)
			break
		case types.GLOBAL_CURRENT_ACCOUNT_INFO:
			return globalCurrentAccounts(state,action)
			break
		case types.CHANGE_BACKUP_MODAL_TIMES:
			return changeBackupTimes(state,action)
			break
		case types.SHOW_IMPORT_LOADING:
			return onShowLoading(state,action)
			break
		case types.PASS_SCAN_RECEIVE_ADDRESS:
			return onPassScanAddr(state,action)
			break
		case types.REFERSH_MANEGE_BALANCE:
			return onBalance(state,action)
			break
		case types.MODIFY_PASSWORD_SUC:
			return onModifySuc(state,action)
			break
		case types.MODIFY_PASSWORD_FAIL:
			return onModifyFail(state,action)
			break	
		case types.MODIFY_PASSWORD_START:
			return onModifyStart(state,action)
			break	
		case types.PASS_PROPS:
			return onPassProps(state,action)
			break
		case types.GEN_MNEMONIC_START:
			return genMneStart(state,action)
			break
		case types.GEN_MNEMONIC_SUC:
			return genMneSuc(state,action)
			break
		case types.COPY_KEYSTORE_BACKUP:
			return copyKeyBackup(state,action)
			break
		default:
			return state
			break

	}
}
const copyKeyBackup = (state,action) => {
	return{
		...state,
		copyKeystoreSuc: true
	}
}
const genMneStart = (state,action) => {
	return {
		...state,
		mnemonicValue: '',
		create_usernane: '',
		create_psd: '',
		create_prompt: '',
		create_from: ''
	}
}
const genMneSuc = (state,action) => {
	const { mne,userNameVal, psdVal, promptVal,fromLogin }  = action.payload

	return {
		...state,
		mnemonicValue: mne,
		create_usernane: userNameVal,
		create_psd: psdVal,
		create_prompt: promptVal,
		create_from: fromLogin
	}
}
const onPassProps = (state,action) => {
	const { currentList, keyStore} = action.payload	
	return {
		...state,
		pass_currentList: currentList,
		pass_keyStore: keyStore
	}
}

const onModifyStart = (state,action) => {

	console.log('777777777777globalAccountsList',state.globalAccountsList)
	return {
		...state,
		modifyStatus: 0,
		modifyText: '',
	}
}

const onModifySuc = (state,action) => {
	const { modifyText,modifyResult } = action.payload
	console.log('modifyResult===',modifyResult[0])
	const { kid, ciphertext, mac, salt, iv, address} = modifyResult[0]

	let newState = Object.assign({},state)

	console.log('newState.globalAccountsList===',newState.globalAccountsList)
	newState.globalAccountsList.map((value,index) => {
		if(value.address === address){

			 newState.globalAccountsList[index].ciphertext = ciphertext

			 newState.globalAccountsList[index].mac = mac

			 newState.globalAccountsList[index].salt = salt

			 newState.globalAccountsList[index].iv = iv


			 newState.globalAccountsList[index].kid = kid
		}
	})

	return {
		...newState,
		modifyStatus: 1,
		modifyText: modifyText,
	}
}

const onModifyFail = (state,action) => {
	const { msg } = action.payload
	return {
		...state,
		modifyStatus: 2,
		modifyText:msg
	}
}
const onPassScanAddr = (state,action) => {
	const { addr, token} = action.payload
	return {
		...state,
		scanAddress: addr,
		scanCurToken: token,
	}
}

const changeBackupTimes = (state,action) => {
	const { time } = action.payload
	return {
		...state,
		backupModalTimes: time,
	}
}

const onShowLoading = (state,action) => {
	const { status } = action.payload
	return{
		...state,
		importLoading: status
	}
}
const globalCurrentAccounts = (state,action) => {
	return {
		...state,
		currentAccount: action.payload.currinfos,
	}
}

const globalAccounts = (state,action) => {
	return {
		...state,
		globalAccountsList: action.payload.infos
	}
}
const onDelMneMonicStart = (state,action) => {
	return {
		...state,
		delMnemonicSuc: false,
	}
}
const onDelMneMonic = (state,action) => {
	const { data,addr } = action.payload

	let newState = Object.assign({},state)
	newState.globalAccountsList.map((list,index) => {
		if(list.address === addr){
			newState.globalAccountsList[index].mnemonic = ''
		}
	})
	return {
		...state,
		delMnemonicSuc: data
	}
}
const accountCreateStart = (state,action) => {
	console.log('创建开始',)
	return {
		...state,
		isLoading: true,
		createSucc: false
	}
}
const accountCreateSuc = (state,action) => {
	const { data } = action.payload
	console.log('创建完成')
	return {
		...state,
		isLoading: false,
		createSucc: data
	}
}

const onUpateBackupStart = (state,action) => {

	return state
}

const onUpateBackupSuc = (state,action) => {
	const { data,updateAddr } = action.payload

	let newState = Object.assign({},state)

	newState.globalAccountsList.map((list,index) => {
		if(list.address === updateAddr){
			// list.backup_status = 1
			newState.globalAccountsList[index].backup_status = 1
		}
	})
	return {
		...newState,
		updateBackupSucc: data
	}
}

const onReset = (state,action) => {
	return {
		...state,
		importStatus: '',
		updateBackupSucc: false,
		deleteSuc: false,
		createSucc: false,
		delMnemonicSuc: false,
		deleteCurrentAccount: false
	}
}

const onDelStart = (state,action) => {
	return {
		...state,
		isLoading: true
	}
}
const onDelSuc = (state,action) => {
	const { deleteId,curId } = action.payload

	let newState = Object.assign({},state)

	newState.globalAccountsList.map((list,index) => {
		
		if(list.id === deleteId){
			newState.globalAccountsList.splice(index,1)
		}	

	})
	//删除的是当前账号  is_selected = 1
	console.log('deleteId==',deleteId)
	console.log('curId==',curId)
	console.log('newState.globalAccountsList===',newState.globalAccountsList)
	let delCur = false 
	if(deleteId === curId){
		if(newState.globalAccountsList.length > 0){
			newState.globalAccountsList[0].is_selected = 1
			delCur = true
		}
	}


	console.log('删除成功',newState.globalAccountsList)

	return {
		...newState,
		isLoading: false,
		deleteSuc: true,
		deleteCurrentAccount: delCur
	}
}
const onDelFail = (state,action) => {
	console.log('删除失败')
	return {
		...state,
		isLoading: false,
		deleteSuc: false
	}
}
	

const onSwitchStart = (state,action) => {
	


	return state
}

const onSwitchEnd = (state,action) => {
	const { switchAddr } = action.payload

	let newState = Object.assign({},state)

	newState.globalAccountsList.map((list,index) => {
		console.log('list.address==',list.address)
		console.log('switchAddr==',switchAddr)
		if(list.address === switchAddr){
			newState.globalAccountsList[index].is_selected = 1
			newState.currentAccount = newState.globalAccountsList[index]
		}else{
			newState.globalAccountsList[index].is_selected = 0
		}
	})


	console.log('newState.globalAccountsList===',newState.globalAccountsList)
	return {
		...newState,
	}
}

const importStart = (state,action) => {
	return {
		...state,
		importStatus: '',
	}
}
const importSuc = (state,action) => {
	const { data } = action.payload //导入的这条数据
	
	let newState = Object.assign({},state)

	newState.globalAccountsList.push(data)

	return {
		...newState,
		importStatus: 'success',
		importLoading: false
	}
}
const importFail = (state,action) => {
	const { msg } = action.payload
	return {
		...state,
		importStatus: 'fail',
		importFailMsg: msg,
		importLoading: false
	}
}
const onBalance = (state,action) => {
	const { data } = action.payload


	let newState = Object.assign({},state)
	for(let i = 0;i < data.balData.length; i ++){
		newState.globalAccountsList[i].assets_total = data.balData[i]
	}			
	return newState
}

