import * as types from  '../constants/accountManageConstant'
const wallet = require('ethereumjs-wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const util = require('ethereumjs-util')
const bip39 = require('bip39')


const initState = {
	accountInfo: [],
	currentAddr: '',
	importStatus: '',
	// deleteFinished: false,
	updateBackupSucc: false,
	isLoading: false,
	deleteSuc: false,
	passAccInfoSuc: '',
	createSucc: false,
	delMnemonicSuc: false,

	globalAccountsList: [],
	currentAccount: {},
	deleteCurrentAccount: false
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
		default:
			return state
			break

	}
}
const globalCurrentAccounts = (state,action) => {
	return {
		...state,
		currentAccount: action.payload.currinfos
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

	const newState = Object.assign({},state)

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
	}
}
const importFail = (state,action) => {
	return {
		...state,
		importStatus: 'fail',
	}
}