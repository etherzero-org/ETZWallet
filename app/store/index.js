import { createStore, applyMiddleware, combineReducers } from 'redux'
import reduxThunk from 'redux-thunk'


import tradingManageReducer from '../reducers/tradingManageReducer'
import accountManageReducer from '../reducers/accountManageReducer'
import tokenManageReducer from '../reducers/tokenManageReducer'
import switchLanguageReducer from '../reducers/switchLanguageReducer'
import activityReducer from '../reducers/activityReducer'

const rootReducer = combineReducers({
  	tradingManageReducer,
  	accountManageReducer,
  	tokenManageReducer,
  	switchLanguageReducer,
  	activityReducer,
})
const store = createStore(
  rootReducer,
  applyMiddleware(reduxThunk)
)

export default store