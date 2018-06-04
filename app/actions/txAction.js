import * as types  from '../constants/txConstant'
import txOpation from '../utils/txOpation'
const makeTxByETZAction = (info) => {
	console.log('action111')
	const start = () => {
		return {
			type: types.MAKE_TX_BY_ETZ_START,
		}
	}
	const suc = (sucdata) => {
		return {
			type: types.MAKE_TX_BY_ETZ_SUC,
			payload: {
				sucdata
			}
		}
	}
	const fail = (faildata,msg,order) => {
		return {
			type: types.MAKE_TX_BY_ETZ_FAIL,
			payload: {
				faildata,
				msg,
				order
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(start()),

		txOpation.makeTxByETZ({
			parames: {
				info
			},
			txETZSuccess: (sucdata) => {dispatch(suc(sucdata))},
			txETZFail: (faildata,msg,order) => {dispatch(fail(faildata,msg,order))}
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
	makeTxByETZAction,
	resetTxStatusAction
}