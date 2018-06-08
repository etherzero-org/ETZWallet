import * as types from '../constants/tradingManageConstant'
import tradingDBOpation from '../utils/tradingDBOpation'
const insert2TradingDBAction = (data) => {
	const start = () => {
		return {
			type: types.SAVE_TO_RECORD_START,
		}
	}
	const suc = (sucdata) => {
		return {
			type: types.SAVE_TO_RECORD_SUC,
			payload: {
				sucdata,
				insertMark: data.tx_random,
				isToken: data.isToken
			}
		}
	}
	const fail = (msg) => {
		return {
			type: types.SAVE_TO_RECORD_FAIL,
			payload: {
				msg
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(start()),
		tradingDBOpation.tradingSaveToRecord({
			parames: {
				data
			},
			saveSuccess: (sucdata) => {dispatch(suc(sucdata))},
			saveFail: (msg) => {dispatch(fail(msg))}
		})
	}
}

const makeTxByETZAction = (info) => {
	const start = () => {
		return {
			type: types.MAKE_TX_BY_ETZ_START,
		}
	}
	const suc = (sucdata,mark) => {
		console.log('转账成功返回的额数据sucdata',sucdata)
		return {
			type: types.MAKE_TX_BY_ETZ_SUC,
			payload: {
				sucdata,
				mark
			}
		}
	}
	const fail = (faildata,msg,order,mark) => {
		return {
			type: types.MAKE_TX_BY_ETZ_FAIL,
			payload: {
				faildata,
				msg,
				order,
				mark
			}
		}
	}
	// const psdErr = (msg) => {
	// 	return {
	// 		type: types.TX_ETZ_PSD_ERROR,
	// 		payload:{
	// 			msg
	// 		}
	// 	}
	// }
	return(dispatch,getState) => {
		dispatch(start()),

		tradingDBOpation.makeTxByETZ({
			parames: {
				info
			},
			// txETZPsdErr: (msg) => {dispatch(psdErr(msg))},
			txETZSuccess: (sucdata1,sucdata2) => {dispatch(suc(sucdata1,sucdata2))},
			txETZFail: (faildata,msg,order,mark) => {dispatch(fail(faildata,msg,order,mark))}
		})
	}
}

const makeTxByTokenAction = (info) => {
	const start = () => {
		return {
			type: types.MAKE_TX_BY_ETZ_START,
		}
	}
	const suc = (sucdata,mark) => {
		return {
			type: types.MAKE_TX_BY_ETZ_SUC,
			payload: {
				sucdata,
				mark
			}
		}
	}
	const fail = (faildata,msg,order,mark) => {
		return {
			type: types.MAKE_TX_BY_ETZ_FAIL,
			payload: {
				faildata,
				msg,
				order,
				mark
			}
		}
	}
	return(dispatch,getState) => {
		
		dispatch(start()),

		tradingDBOpation.makeTxByToken({
			parames: {
				info
			},
			txTokenSuccess: (sucdata1,sucdata2) => {dispatch(suc(sucdata1,sucdata2))},
			txTokenFail: (faildata,msg,order,mark) => {dispatch(fail(faildata,msg,order,mark))}
		})
	}
}

const resetTxStatusAction = () => {
	console.log('初始化action')
	const reset = () => {
		return {
			type: types.RESET_TX_STATUS
		}
	}
	return (dispatch,getState) => {
		dispatch(reset())
	}
}
const showLoadingAction = (visible,text) => {
	console.log('action visible111',visible)
	const show = () => {
		return {
			type: types.SHOW_LOADING,
			payload:{
				visible,
				text
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(show())
	}
}
const updateTxListAction = (status) => {
	const update = () => {
		return {
			type: types.UPDATE_TX_LIST,
			payload:{
				status
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(update())
	}
}

export {
	insert2TradingDBAction,
	makeTxByETZAction,
	makeTxByTokenAction,
	resetTxStatusAction,
	showLoadingAction,
	updateTxListAction,
}