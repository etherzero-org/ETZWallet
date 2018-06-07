import * as types from '../constants/tradingManageConstant'


const initState = {
	saveRecordSuc: false,

  txEtzStatus: -1,
  txEtzHash: '',
  txErrorMsg: '',
  txErrorOrder: 1,//只有0/1  0表示将会删除这条记录  1表示将会保留这条记录(即使是失败的交易)

  pendingTxList: [],
  txStateMark: -1,//状态发生改变的这条交易记录的标记
}
export default function tradingManageReducer (state = initState,action) {
	switch(action.type){
		case types.SAVE_TO_RECORD_START:
			return saveStart(state,action)
			break
    case types.SAVE_TO_RECORD_SUC:
      return saveSuc(state,action)
      break
    case types.SAVE_TO_RECORD_FAIL:
      return saveFail(state,action)
      break
    case types.MAKE_TX_BY_ETZ_START:
      return txETZStart(state,action)
      break
    case types.MAKE_TX_BY_ETZ_SUC:
      return txETZSuc(state,action)
      break
    case types.MAKE_TX_BY_ETZ_FAIL:
      return txETZFail(state,action)
      break
    case types.RESET_TX_STATUS:
      return txReset(state,action)
      break
    case types.MAKE_TX_BY_TOEKN_START:
      return txTokenStart(state,action)
      break
    case types.MAKE_TX_BY_TOKEN_SUC:
      return txTokenSuc(state,action)
      break
    case types.MAKE_TX_BY_TOKEN_FAIL:
      return txTokenFail(state,action)
      break
		default:
			return state
			break

	}
}
const txReset = (state,action) => {
  return {
    ...state,
    txEtzStatus: -1,
    txEtzHash: '',
    txErrorMsg: '',
    txErrorOrder: 1,

  }
}

const txTokenStart = (state,action) => {
  return state
}
const txTokenSuc = (state,action) => {
  return state
}
const txTokenFail = (state,action) => {
  return state
}
const txETZStart = (state,action) => {
  return {
    ...state,
    txEtzStatus: -1,
    txEtzHash: ''
  }
}

const txETZSuc = (state,action) => {
  const { sucdata,mark } = action.payload
  console.log('pendingMark55555 txETZSuc',mark)
  return {
    ...state,
    txEtzStatus: 1,
    txEtzHash: sucdata,
    txStateMark: mark
  }
}
const txETZFail = (state,action) => {
  const { faildata,msg,order,mark } = action.payload
  console.log('pendingMark55555 txETZFail',mark)
  return {
    ...state,
    txEtzStatus: 0,
    txEtzHash: faildata,
    txErrorMsg: msg,
    txErrorOrder: order,
    txStateMark: mark
  }
}



const saveSuc = (state,action) => {
  const { sucdata, insertMark } = action.payload
  console.log('交易----插入数据库成功 的insertMark',insertMark)
  console.log('pendingTxList=====',state.pendingTxList)
  let newState = Object.assign({},state)
  newState.pendingTxList.push(insertMark)
  console.log('newState.pendingTxList====',newState.pendingTxList)
  return {
    ...newState,
    saveRecordSuc: true,
  }
}
const saveFail = (state,action) => {
  console.log('插入数据库失败 saveRecordSuc11')
  return {
    ...state,
    saveRecordSuc: false
  }
}
const saveStart = (state,action) => {
	return {
    ...state,
    saveRecordSuc: false
  }
}