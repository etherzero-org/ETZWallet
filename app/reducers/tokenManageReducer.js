import * as types from '../constants/tokenManageConstant'

import { contractAbi } from '../utils/contractAbi'


const initState = {
	isLoading: true,
	selectedList: [],
	refreshEnd: '',
	fetchTokenList: [],
	etzBalance: '0',
}


export default function tokenManageReducer(state=initState,action){
	switch(action.type){
		case types.DELETE_TOKEN_LIST_START:
			return onDelSelectedStart(state,action)
			break
		case types.DELETE_TOKEN_LIST:
			return onDelSelected(state,action)
			break
		case types.ADD_TOKEN_LIST_START:
			return onAddSelectedStart(state,action)
			break
		case types.ADD_TOKEN_LIST:
			return onAddSelected(state,action)
			break
		case types.INIT_SELECTED_LIST:
			return onInitSelectedList(state,action)
			break
		case types.REFRESH_TOKEN_INFO:
			return onRefresh(state,action)
			break
		case types.REFRESH_TOKEN_SUCCESS:
			return onRefreshSuc(state,action)
			break
		case types.REFRESH_TOKEN_FAIL:
			return onRefreshFail(state,state)
			break
		case types.FETCH_TOKEN_LIST:
			return onFetchStart(state,action)
			break
		case types.FETCH_TOKEN_LIST_SUC:
			return onFetchSuc(state,action)
			break
		case types.FETCH_TOKEN_LIST_ERR:
			return onFetchFail(state,action)
			break	
		case types.GLOBAL_TOKEN_LIST:
			return globalToken(state,action)
			break
		case types.SWITCH_TOKEN_LIST_START:
			return onSwitchTokenStart(state,action)
			break
		case types.SWITCH_TOKEN_LIST:
			return onSwitchToken(state,action)
			break
		case types.REFRESH_ETZ:
			return onRefreshEtz(state,action)
			break
		default:
			return state
			break
	}
}

const onSwitchTokenStart = (state,action) => {
	return {
		...state,
		fetchTokenList: []
	}
}
const onSwitchToken = (state,action) => {
	const { data } = action.payload
	return {
		...state,
		fetchTokenList: data
	}
}

const onInitSelectedList = (state,action) => {
	const { data } = action.payload
	return {
		...state,
		fetchTokenList: data
	}
}

const onDelSelectedStart = (state,action) => {
	const { delAddr,curaddr } = action.payload

	let newState = Object.assign({},state)

	newState.fetchTokenList.map((val,idx) => {
		if(val.tk_address === delAddr && val.account_addr === curaddr){
			newState.fetchTokenList[idx].tk_selected = 0
		}
	})
	
	return newState
}
const onDelSelected = (state,action) => {
	return state
}
const onAddSelectedStart = (state,action) => {
	const { addAddr,curaddr } = action.payload

	let newState = Object.assign({},state)


	newState.fetchTokenList.map((val,idx) => {
		if(val.tk_address === addAddr && val.account_addr === curaddr){
			newState.fetchTokenList[idx].tk_selected = 1
		}
	})
	return newState
}

const onAddSelected = (state,action) => {
	return state
}

const globalToken = (state,action) => {
	const { list } = action.payload
	return {
		...state,
		fetchTokenList: list
	}
}
const onFetchStart = (state,action) => {
	let newState = Object.assign({},state)
	newState.fetchTokenList = []
	return newState
}
const onFetchSuc = (state,action) => {
	const { list } = action.payload
	return {
		...state,
		fetchTokenList: list
	}
}
const onFetchFail = (state,action) => {

	return {
		...state,
		fetchTokenList: []
	}
}


const onRefresh = (state,action) => {

	return {
		...state,
		refreshEnd: 'start'
	}
}

const onRefreshSuc = (state,action) => {
	const { data } = action.payload
	
	return {
		...state,
		fetchTokenList: data,
		refreshEnd: 'suc',
		
	}
}
const onRefreshEtz = (state,action) => {
	const { data } = action.payload
	console.log('onRefreshEtz reducer',data)
	return {
		...state,
		etzBalance: data
	}
}

const onRefreshFail = (state,action) => {
	return {
		...state,
		refreshEnd: 'fail'
	}
}