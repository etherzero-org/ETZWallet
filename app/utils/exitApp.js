import {
    BackHandler,
    Platform
} from 'react-native'
import Toast from 'react-native-root-toast'
import I18n from 'react-native-i18n'
export function onExitApp() {
    if (this.lastBackPressed && this.lastBackPressed + 2500 >= Date.now()) {
      BackHandler.exitApp()
      return true
    }
    this.lastBackPressed = Date.now()
    let t = Toast.show(I18n.t('click_again'))
   	setTimeout(() => {
   		Toast.hide(t)
   	},1000)
    return true
}