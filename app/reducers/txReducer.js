import * as types from '../constants/txConstant'


const initState = {
  txEtzStatus: -1,
  txEtzHash: '',
  txErrorMsg: '',
  txErrorOrder: 1,
}
export default function txReducer (state = initState,action) {
	switch(action.type){
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
const txETZStart = (state,action) => {
  return {
    ...state,
    txEtzStatus: -1,
    txEtzHash: ''
  }
}
// const txHash = (state,action) => {

//   const {data} = action.payload
//   console.log('action.payload.data2222222222222=====',data)
//   return {
//     ...state,
//     txEtzHash: data
//   }
// }
const txETZSuc = (state,action) => {
  const { sucdata } = action.payload
  return {
    ...state,
    txEtzStatus: 1,
    txEtzHash: sucdata
  }
}
const txETZFail = (state,action) => {
  const { faildata,msg,order } = action.payload
  return {
    ...state,
    txEtzStatus: 0,
    txEtzHash: faildata,
    txErrorMsg: msg,
    txErrorOrder: order
  }
}