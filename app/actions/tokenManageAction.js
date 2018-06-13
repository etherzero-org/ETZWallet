import * as types from '../constants/tokenManageConstant'
import tokenDBOpation from '../utils/tokenDBOpation'

const gloablTokenList = (list) => {
	const getList = () => {
		return {
			type: types.GLOBAL_TOKEN_LIST,
			payload: {
				list
			}
		}
	}
	return (dispatch,getState) => {
		dispatch(getList())
	}
}
const fetchTokenAction = (addr,refresh) => {
	const onFetchStart = () => {
		return {
			type: types.FETCH_TOKEN_LIST,
			payload: {
				addr
			}
		}
	}
	const suc = (list) => {
		return {
			type: types.FETCH_TOKEN_LIST_SUC,
			payload: {
				list
			}	
		}
	}
	const err = () => {
		return {
			type: types.FETCH_TOKEN_LIST_ERR,
			payload: {

			}	
		}
	}
	return (dispatch,getState) => {
		dispatch(onFetchStart())
		tokenDBOpation.fetchToken({
			parames: {
				addr,
				refresh
			},
			fetchTokenSuccess: (list) => {dispatch(suc(list))},
			fetchTokenFail: (msg) => {dispatch(err(msg))}
		})
	}
}


const deleteSelectedToListAction = (delAddr,curaddr) => {
	const onDeleteStart = () => {
		return {
			type: types.DELETE_TOKEN_LIST_START,
			payload:{
				delAddr,
				curaddr,
			}
		}
	}

	const onDelete = () => {
		return {
			type: types.DELETE_TOKEN_LIST,
			
		}
	}
	
	return(dispatch,getState) => {
		dispatch(onDeleteStart())
		tokenDBOpation.deleteSelectedToken({
			parames: {
				delAddr,
				curaddr
			},
			deleteSelected: (data) => {dispatch(onDelete(data))}
		})
	}
}

const addSelectedToListAction = (addAddr,curaddr) => {
	const onAddStart = () => {
		return {
			type: types.ADD_TOKEN_LIST_START,
			payload:{
				addAddr,
				curaddr
			}
		}
	}
	const onAdd = () => {
		return {
			type: types.ADD_TOKEN_LIST,
			
		}
	}
	return(dispatch,getState) => {
		dispatch(onAddStart())
		tokenDBOpation.addSelectedToken({
			parames: {
				addAddr,
				curaddr
			},
			addSelected: (data) => {dispatch(onAdd(data))}
		})
	}
}
const initSelectedListAction = () => {
	const onInitSel = (data) => {
		return {
			type: types.INIT_SELECTED_LIST,
			payload: {
				data
			}
		}
	}
	return(dispatch,getState) => {
		tokenDBOpation.initSelectedToken({
			parames: {

			},
			initSelectedTokenList: (data) => {dispatch(onInitSel(data))}
		})
	}
}

const refreshTokenAction = (addr,tokenlist) => {
	console.log('下拉刷新action')
	const onRef = () => {
		return {
			type: types.REFRESH_TOKEN_INFO,
			payload:{
				addr
			}
		}
	}
	const suc = (data) => {
		return {
			type: types.REFRESH_TOKEN_SUCCESS,
			payload: {
				data,
				
			}
		}
	}
	const fail = (msg) => {
		return {
			type: types.REFRESH_TOKEN_FAIL,
			payload: {
				msg
			}
		}
	}
	const etz = (data) => {
		return {
			type: types.REFRESH_ETZ,
			payload: {
				data
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(onRef())
		tokenDBOpation.tokenRefresh({
			parames:{
				addr,
				tokenlist
			},
			refreshEtz: (data) => { dispatch(etz(data))},
			refreshSuccess: (data) => { dispatch(suc(data))},
			refreshFail: (msg) => { dispatch(fail(msg))}
		})
	}
}

const switchTokenAction = (addr) => {
	const onSwitchStart = () => {
		return {
			type:types.SWITCH_TOKEN_LIST_START,
		}
	}
	const onSwitch = (data) => {
		return {
			type: types.SWITCH_TOKEN_LIST,
			payload: {
				data
			}
		}
	}
	return(dispatch,getState) => {
		dispatch(onSwitchStart())
		tokenDBOpation.switchTokenList({
			parames: {
				addr
			},
			switchTokenSuc: (data) => { dispatch(onSwitch(data))}
		})
	}
}


export {
	deleteSelectedToListAction,
	addSelectedToListAction,
	initSelectedListAction,
	refreshTokenAction,
	fetchTokenAction,
	gloablTokenList,
	switchTokenAction,
}