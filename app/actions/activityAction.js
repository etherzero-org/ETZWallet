import * as types from '../constants/activityConstant'
import Http from '../utils/http'
//重置状态
const resetActivityStatusAction = () => {
	const reset = () => {
		return {
			type: types.RESET_ACTIVITY_STATUS
		}
	}
	return(dispatch,getState) => {
		dispatch(reset())
	}
}
//发送验证码
const sendVerifCodeAction = (cca2,phone) => {
	const start = () => {
		return {
			type: types.SEND_VERIF_CODE_START,
		}
	}
	const suc = (sucdata) => {
		return {
			type: types.SEND_VERIF_CODE_SUC,
			payload: {
				sucdata
			}
		}
	}
	const fail = (msg) => {
		return {
			type: types.SEND_VERIF_CODE_FAIL,
			payload: {
				msg
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(start()),
		Http.sendsms({
			data: {
				"phonenum": phone,
				"country_code": cca2
			},
			success: (sucdata) => {dispatch(suc(sucdata))},
			fail: (msg) => {dispatch(fail(msg))}
		})
	}
}
//立即绑定  生成奖励
const bindAddressAction = (info) => {
	const bindStart = () => {
		return {
			type: types.BIND_ADDRESS_START,
			payload: {

			}
		}
	}
	const suc = (data) => {
		return {
			type: types.BIND_ADDRESS_SUC,
			payload: {
				data
			}
		}
	}
	const fail = (msg) => {
		return {
			type: types.BIND_ADDRESS_FAIL,
			payload: {
				msg
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(bindStart()),
		Http.bindAddress({
			data: {
				phonenum: info.phoneNumber,
				country_code: info.callingCode,
				invite_code: info.invCode,
				random: info.verifCode,
				receiveaddress: info.address,
				uniqueId: info.uniqueId,
				systemName: info.systemName,
				systemVersion: info.systemVersion,
			},
			success: (sucdata) => {dispatch(suc(sucdata))},
			fail: (msg) => {dispatch(fail(msg))}
		})
	}
}

export {
	sendVerifCodeAction,
	bindAddressAction,
	resetActivityStatusAction
}