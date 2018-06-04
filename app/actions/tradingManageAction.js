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
				sucdata
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


export {
	insert2TradingDBAction,
	
}