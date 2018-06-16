import React, { Component } from 'react'
import {
  StatusBar,
  Platform,
  BackHandler,
  NetInfo,

} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { registerScreens, registerScreenVisibilityListener, } from './config/'
import { getPixelRatio } from './utils/adapter'
import { TabBarAppStyle,AssetsNavStyle,MainThemeNavColor,TabBarIOSStyle } from './styles/'
import I18n from 'react-native-i18n'
registerScreens()
registerScreenVisibilityListener()
getPixelRatio()

if (!__DEV__) {
  global.console = {
    info: () => {
    },
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  }
}


const bottomTabStyle = {
  top: 6,
  left: 6,
  bottom: 6,
  right: 6,
}

const tabs = [
  {
    label: I18n.t('assets'),
    screen: 'home_assets',
    icon: require('./images/xhdpi/tab_ico_personalcenter_assets_def.png'),
    selectedIcon: require('./images/xhdpi/tab_ico_home_asset_def.png'),
    navigatorStyle: Object.assign({},AssetsNavStyle,{ navBarHidden: true, }), //AssetsNavStyle, //tabBarHidden: true,  navBarHidden: true,
    iconInsets: bottomTabStyle,
    id:0,
  },
  {
    label: I18n.t('mine'),
    screen: 'home_personal',
    icon: require('./images/xhdpi/tab_ico_home_personalcenter_def.png'),
    selectedIcon: require('./images/xhdpi/tab_ico_personalcenter_personal_def.png'),
    navigatorStyle: Object.assign({},AssetsNavStyle,{ navBarHidden: true, }),
    iconInsets: bottomTabStyle,
    id:1,
  },

]

function toHome () {
   if(Platform.OS == 'ios'){
    return Navigation.startTabBasedApp({
      tabs,
      // appStyle: TabBarAppStyle,
      tabsStyle: TabBarIOSStyle,
    })
   }else{
    return Navigation.startTabBasedApp({
      tabs,
      appStyle: TabBarAppStyle,
    })
   }


}

function toLogin () {
  return Navigation.startSingleScreenApp({
          screen: {
            screen: 'login',
            navigatorStyle: {navBarHidden: true,statusBarColor:'#144396'},
          },
          animationType: 'fade'
        })
}

function toSplash () {
  return Navigation.startSingleScreenApp({
    screen: {
      screen: 'splash',
      navigatorStyle: {navBarHidden: true,statusBarColor:'#144396'},
    },
    animationType: 'fade'
  })
}

toSplash()

export {
  toHome,
  toLogin,
  toSplash
}
