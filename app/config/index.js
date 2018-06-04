import { BackHandler } from 'react-native'
import { Navigation, ScreenVisibilityListener } from 'react-native-navigation'
import { onExitApp } from '../utils/exitApp'
import store from '../store/'
import { Provider } from 'react-redux'

import Splash from '../views/Splash'
import Login from '../views/login/'
import CreateAccount from '../views/login/CreateAccount'
import ImportAccount from '../views/login/import/'
import TermsOfService from '../views/login/TermsOfService'
import CreateAccountSuccess from '../views/login/CreateAccountSuccess'



import Personal from '../views/personal/'
import Support from '../views/personal/Support'
import ModifyPassword from '../views/personal/ModifyPassword'
import HelpCenter from '../views/personal/HelpCenter'
import AccountManage from '../views/personal/AccountManage'
import Setting from '../views/personal/setting/'
import SwitchLanguage from '../views/personal/setting/SwitchLanguage'
import BackUpAccount from '../views/personal/backup/'
import WriteMnemonic from '../views/personal/backup/WriteMnemonic'
import VerifyMnemonic from '../views/personal/backup/VerifyMnemonic'
import ExportKeyStore from '../views/personal/backup/ExportKeyStore'


import Assets from '../views/home/Assets'
import MsgCenterList from '../views/home/MsgCenterList'
import Receive from '../views/home/Receive'
import Payment from '../views/home/Payment'
import TradingRecord from '../views/home/tradingRecord/'
import ScanQrCode from '../views/home/ScanQrCode'
import TxRecordlList from '../views/home/TxRecordlList'
import TradingRecordDetail from '../views/home/TradingRecordDetail'
import TxWebView from '../views/home/TxWebView'
import SwitchWallet from '../views/home/SwitchWallet'
import AddAssets from '../views/home/AddAssets'
import BindPhone from '../views/home/BindPhone'
import RecomPrize from '../views/home/RecomPrize'
import SelectCoutry from '../views/home/SelectCoutry'
import DownLoadApp from '../views/home/DownLoadApp'
import ReceiveCandy from '../views/home/ReceiveCandy'

function registerScreens() {
  Navigation.registerComponent('splash', () => Splash,store,Provider)
  Navigation.registerComponent('login', () => Login,store,Provider)
  Navigation.registerComponent('create_account', () => CreateAccount,store,Provider)
  Navigation.registerComponent('import_account', () => ImportAccount,store,Provider)
  Navigation.registerComponent('terms_of_service', () => TermsOfService,store,Provider)
  Navigation.registerComponent('create_account_success', () => CreateAccountSuccess,store,Provider)
  Navigation.registerComponent('back_up_account', () => BackUpAccount,store,Provider)
  Navigation.registerComponent('write_mnemonic', () => WriteMnemonic,store,Provider)
  Navigation.registerComponent('verify_mnemonic', () => VerifyMnemonic,store,Provider)
  Navigation.registerComponent('home_assets', () => Assets,store,Provider)
  Navigation.registerComponent('home_personal', () => Personal,store,Provider)
  Navigation.registerComponent('msg_center_list', () => MsgCenterList,store,Provider)
  Navigation.registerComponent('on_payment', () => Payment,store,Provider)
  Navigation.registerComponent('on_receive', () => Receive,store,Provider)
  Navigation.registerComponent('trading_record', () => TradingRecord,store,Provider)
  Navigation.registerComponent('scan_qr_code', () => ScanQrCode,store,Provider)
  Navigation.registerComponent('tx_record_list', () => TxRecordlList,store,Provider)
  Navigation.registerComponent('trading_record_detail', () => TradingRecordDetail,store,Provider)
  Navigation.registerComponent('support', () => Support,store,Provider)
  Navigation.registerComponent('help_center', () => HelpCenter,store,Provider)
  Navigation.registerComponent('account_manage', () => AccountManage,store,Provider)
  Navigation.registerComponent('setting', () => Setting,store,Provider)
  Navigation.registerComponent('switch_language', () => SwitchLanguage,store,Provider)
  Navigation.registerComponent('tx_web_view', () => TxWebView,store,Provider)
  Navigation.registerComponent('switch_wallet', () => SwitchWallet,store,Provider)
  Navigation.registerComponent('add_assets', () => AddAssets,store,Provider)
  Navigation.registerComponent('bind_phone', () => BindPhone,store,Provider)
  Navigation.registerComponent('recom_prize', () => RecomPrize,store,Provider)
  Navigation.registerComponent('select_coutry', () => SelectCoutry,store,Provider)
  Navigation.registerComponent('download_app', () => DownLoadApp,store,Provider)
  Navigation.registerComponent('receive_candy', () => ReceiveCandy,store,Provider)
  Navigation.registerComponent('modify_password', () => ModifyPassword,store,Provider)
  Navigation.registerComponent('export_keystore', () => ExportKeyStore,store,Provider)

}

// 注册页面切换监听器
function registerScreenVisibilityListener() {
  new ScreenVisibilityListener({
    // willAppear: ({screen}) => addFunc(screen),
    // didAppear: ({screen, startTime, endTime, commandType}) => console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`),
    // willDisappear: ({screen}) => removeFunc(screen),
    // didDisappear: ({screen}) => console.log(`Screen disappeared ${screen}`)
  }).register()
}

// function addFunc(screen){
//   if(screen === 'home_assets'){
//     BackHandler.addEventListener('hardwareBackPress',() => {
//       onExitApp()
//     })
//   }
// }
// function removeFunc(screen){
//   if(screen === 'home_assets'){
//     BackHandler.removeEventListener('hardwareBackPress',() => {
//       onExitApp()
//     })
//   }
// }


export {
  registerScreens,
  registerScreenVisibilityListener
}