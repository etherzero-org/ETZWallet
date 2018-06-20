

import * as types from '../constants/activityConstant'


const initState = {
	isLoading: false,
	bindStatus: 0,
	bindMsg: '',
	sendMsg: '',
	inviteCode: {}
}

export default function activityReducer (state = initState,action) {
	switch(action.type){
		case types.SEND_VERIF_CODE_START:
			return sendStart(state,action)
			break
	    case types.SEND_VERIF_CODE_SUC:
		    return sendSuc(state,action)
		    break
	    case types.SEND_VERIF_CODE_FAIL:
	        return sendFail(state,action)
	        break
	    case types.BIND_ADDRESS_START:
	    	return bindStart(state,action) 
	    	break
	    case types.BIND_ADDRESS_SUC:
	    	return bindSuc(state,action) 
	    	break
	    case types.BIND_ADDRESS_FAIL:
	    	return bindFail(state,action) 
	    	break
	    case types.RESET_ACTIVITY_STATUS:
	    	return resetStatus(state,action)
	    	break
		default:
			return state
			break

	}
}
const resetStatus = (state,action) => {
	return {
		...state,
		isLoading: false,
		bindStatus: 0,
		bindMsg: ''
	}
}
const bindStart = (state,action) => {
	return {
		...state
	}
}
const bindSuc = (state,action) => {
	const { data } = action.payload
	console.log('data==',data)
	return {
		...state,
		bindStatus: 1,
		inviteCode: data
	}
}
const bindFail = (state,action) => {
	const { msg } = action.payload
	return {
		...state,
		bindMsg: msg,
		bindStatus: 2
	}
}
const sendStart = (state,action) => {
	return {
		...state
	}
} 
const sendSuc = (state,action) => {
	return {
		...state
	}
}
const sendFail = (state,action) => {
	const { msg } = action.payload
	return {
		...state,
		sendMsg: msg
	}
}
