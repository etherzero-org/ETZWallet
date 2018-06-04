import * as types from  '../constants/accountManageConstant'
import accountDBOpation from '../utils/accountDBOpation'


const switchAccountAction = (addr) => {
	const switchStart = () => {
		return {
			type: types.ON_SWITCH_ACCOUNT_START,
			payload: {
				addr,
			}
		}
	}

	const switchEnd = () => {
		return {
			type: types.ON_SWITCH_ACCOUNT_END,
			payload:{
				switchAddr: addr,
			}
		}
	}

	return(dispatch,getState) => {
		dispatch(switchStart())
		accountDBOpation.switchAccount({
			parames: {
				switchAddr: addr,
			},
			switchAccountEnd:() => {dispatch(switchEnd())}
		})
	}
}
const importAccountAction = (data) => {
	const importStart = () => {
		return {
			type: types.IMPORT_ACCOUNT_START,
			payload: {

			}
		}
	}
	const importSuc = (data) => {
		return {
			type: types.IMPORT_ACCOUNT_SUC,
			payload: {
				data
			}
		}
	}
	const importFail = (msg) => {
		return {
			type: types.IMPORT_ACCOUNT_FAIL,
			payload: {
				msg
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(importStart())
		accountDBOpation.importAccount({
			parames: {
				privateKey: data.privateKey,
				privatePassword: data.privatePassword,
				privateUserName: data.privateUserName,
				type: data.type,
				mnemonicVal: data.mnemonicVal,
				mnemonicPsd: data.mnemonicPsd,
				mnemonicUserName: data.mnemonicUserName,
				keystoreVal: data.keystoreVal,
				keystoreUserName: data.keystoreUserName,
				keystorePsd: data.keystorePsd,
				fromLogin: data.fromLogin,
				accountsList: data.accountsList,
				hintValue: data.hintValue
			},
			importSuccess: (data) => {dispatch(importSuc(data))},
			importFailure: (msg) => {dispatch(importFail(msg))}
		})
	}
}

const deleteAccountAction = (deleteId,accountsNum,curId) => {

	const onDelStart = () => {
		return {
			type: types.ON_DELETE_ACCOUNT_START,
		}
	}
	const delSuc = () => {
		return {
			type: types.ON_DELETE_ACCOUNT_SUC,
			payload: {
				deleteId,
				curId
			}
		}
	}
	const delFail = () => {
		return {
			type: types.ON_DELETE_ACCOUNT_FAIL,
			payload: {
				deleteId,
			}
			
		}
	}
	return(dispatch,getState) => {
		dispatch(onDelStart())
		accountDBOpation.deleteAccount({
			parames: {
				deleteId,
				curId,
			},
			delSuccess: () => {dispatch(delSuc())},
			delFailure: () => {dispatch(delFail())}
		})
	}
}

const resetDeleteStatusAction = () => {
	const onReset = () => {
		return {
			type: types.RESET_DELETE_STATUS,
		}
	}
	return(dispatch,getState) => {
		dispatch(onReset())
	}
}
const updateBackupStatusAction = (addr) => {
	const onUpdate = () => {
		return {
			type: types.UPDATE_BACKUP_STATUS,
			payload: {
				addr,
			}
		}
	}
	const updateSuc = (data) => {
		return {
			type: types.UPDATE_BACKUP_STATUS_SUCC,
			payload: {
				data,
				updateAddr: addr
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(onUpdate())
		accountDBOpation.updatePrivStatus({
			parames: {
				addr
			},
			updatePrivSuccess:(data) =>{dispatch(updateSuc(data))}
		})
	}
}


const createAccountAction = (par) => {
	const onStart = () => {
		return {
			type: types.CREATE_ACCOUNT_START,
			payload: {
				
			}
		}
	}
	const createSucc = (data) => {
		return {
			type: types.CREATE_ACCOUNT_SUC,
			payload: {
				data
			}
		}
	}

	return(dispatch,getState) => {
		dispatch(onStart())
		accountDBOpation.createAccount({
			parames: {
				userNameVal:par.userNameVal,
				psdVal: par.psdVal,
				promptVal: par.promptVal,
				fromLogin: par.from,
				mnemonicValue: par.mnemonicValue
			},
			createSuccess: (data) => {dispatch(createSucc(data))},
		})
	}
}
const genMnemonicAction = (par) => {
	const genStart = () => {
		return {
			type: types.GEN_MNEMONIC_START,
			payload: {
				
			}
		}
	}
	const genSucc = (mne) => {
		return {
			type: types.GEN_MNEMONIC_SUC,
			payload: {
				mne,
				userNameVal: par.userNameVal,
				psdVal: par.psdVal,
				promptVal: par.promptVal,
				fromLogin: par.from,
			}
		}
	}

	return(dispatch,getState) => {
		dispatch(genStart())
		accountDBOpation.genMnemonic({
			parames: {
				fromLogin: par.from,
			},
			genSuccess: (mne) => {dispatch(genSucc(mne))},
		})
	}
}

const deleteMnemonicAction = (addr) => {
	const deleteSuc = (data) => {
		return {
			type: types.DELETE_MNEMONIC,
			payload: {
				data,
				addr
			}
		}
	}
	const deleteMnemonicStart = () => {
		return {
			type: types.DELETE_MNEMONIC_START,

		}
	}
	return(dispatch,getState) => {
		dispatch(deleteMnemonicStart())
		accountDBOpation.deleteMnemonic({
			parames: {
				addr
			},
			delSuc:(data) => {dispatch(deleteSuc(data))}
		})
	}
}


const globalAllAccountsInfoAction = (infos) => {
	const sharedInfos = () => {
		return {
			type: types.GLOBAL_ALL_ACCOUNTS_INFO,
			payload:{
				infos
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(sharedInfos())
	}
}
const globalCurrentAccountInfoAction = (currinfos) => {
	const curInfos = () => {
		return {
			type: types.GLOBAL_CURRENT_ACCOUNT_INFO,
			payload:{
				currinfos
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(curInfos())
	}
}

const changeBackupModalTimesAction = (time) => {
	const changeTimes = () => {
		return{
			type: types.CHANGE_BACKUP_MODAL_TIMES,
			payload:{
				time
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(changeTimes())
	}
}

const showImportLoadingAction = (status) => {
	const onShow = () => {
		return {
			type: types.SHOW_IMPORT_LOADING,
			payload: {
				status
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(onShow())
	}
}

const passReceiveAddressAction = (addr,token) => {
	const onPass = () => {
		return {
			type: types.PASS_SCAN_RECEIVE_ADDRESS,
			payload: {
				addr,
				token,
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(onPass())
	}
}

const refreshManageBalanceAction = (list) => {
	const getBal = (data) => {
		return{
			type: types.REFERSH_MANEGE_BALANCE,
			payload: {
				data,
			}
		}
	}
	return (dispatch,getState) => {
		accountDBOpation.getManageBalance({
			parames: {
				list
			},
			getBalanceNum: (data) => {dispatch(getBal(data))}
		})
	}
}



const passPropsAction = (data) => {
	const pass = () => {
		return {
			type: types.PASS_PROPS,
			payload:{
				currentList: data.currentList,
				keyStore: data.keyStore
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(pass())
	}
}

const modifyPasswordAction = (info) => {
	const modifyStart = () => {
		return {
			type: types.MODIFY_PASSWORD_START	
		}
	}

	const suc = (data) => {
		return {
			type: types.MODIFY_PASSWORD_SUC,
			payload: {
				modifyText: data.modifyText,
				modifyResult: data.modifyResult,
			}
		}
	}
	
	const err = (msg) => {
		return {
			type: types.MODIFY_PASSWORD_FAIL,
			payload:{
				msg
			}
		}
	}
	
	return (dispatch,getState) => {
		dispatch(modifyStart())
		accountDBOpation.modifyPassword({
			parames: {
				currentList: info.currentList,
				keys: info.keys,
				oldPsd: info.oldPsd,
				newPsd: info.newPsd,
			},
			modifySuccess: (data) => {dispatch(suc(data))},
			modifyFail: (msg) => {dispatch(err(msg))}
		})
	}
}

const copyKeystoreAction = (addr) => {
	const onCopy = () => {
		return{
			type: types.COPY_KEYSTORE_BACKUP,
		}
	}
	return(dispatch,getState) => {
		dispatch(onCopy())
		accountDBOpation.updateBackupKeystore({
			parames: {
				addr,
			}
		})
	}
}

export {
	switchAccountAction,
	importAccountAction,
	deleteAccountAction,
	resetDeleteStatusAction,
	updateBackupStatusAction,
	createAccountAction,
	deleteMnemonicAction,
	globalAllAccountsInfoAction,
	globalCurrentAccountInfoAction,
	changeBackupModalTimesAction,
	showImportLoadingAction,
	passReceiveAddressAction,
	refreshManageBalanceAction,
	modifyPasswordAction,
	passPropsAction,
	genMnemonicAction,
	copyKeystoreAction
}