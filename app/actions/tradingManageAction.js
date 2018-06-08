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
				insertMark: data.tx_random
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
	return(dispatch,getState) => {
		dispatch(start()),

		tradingDBOpation.makeTxByETZ({
			parames: {
				info
			},
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
	const reset = () => {
		return {
			type: types.RESET_TX_STATUS
		}
	}
	return (dispatch,getState) => {
		dispatch(reset())
	}
}
export {
	insert2TradingDBAction,
	makeTxByETZAction,
	makeTxByTokenAction,
	resetTxStatusAction
}