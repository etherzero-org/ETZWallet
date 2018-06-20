
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  BackHandler,
  ScrollView
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import {ArrowToDetail} from '../../components/'
import I18n from 'react-native-i18n'
import Toast from 'react-native-root-toast'
import DeviceInfo from 'react-native-device-info'
class Personal extends Component{
  constructor(props){
    super(props)
    this.state={
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  
  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        break;
      case 'willDisappear':
        this.backPressed = 0;
        this.backHandler.remove();
        break;
      default:
        break;
    }

  }
  handleBackPress = () => {
    if (this.backPressed && this.backPressed > 0) {
      this.props.navigator.popToRoot({ animated: false });
      return false;
    }

    this.backPressed = 1;
    let t = Toast.show(I18n.t('click_again'))
    setTimeout(() => {
      Toast.hide(t)
    },1000) 
    // this.props.navigator.showSnackbar({
    //   text: 'Press one more time to exit',
    //   duration: 'long',
    // });
    return true;
  }
  toAccountManage = () => {
    this.props.navigator.push({
      screen: 'account_manage',
      title:I18n.t('manage_wallets'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }

  toHelpCenter = () => {
    this.props.navigator.push({
      screen: 'help_center',
      title:I18n.t('help_center'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }
  
  toContactService = () => {
    this.props.navigator.push({
      screen: 'support',
      title:I18n.t('support'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
      navigatorButtons: {
        rightButtons: [
          {
            title: I18n.t('send_email'),
            id: 'send_email'
          }
        ]
      }
    })
  }
  toLanguage = () => {
    this.props.navigator.push({
      screen: 'switch_language',
      title: I18n.t('language'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
      navigatorButtons: {
        rightButtons: [
          {
            title: I18n.t('save'),
            id: 'save_switch_language'
          }
        ]
      }
    })
  }
  render(){
    
    return(
      <View style={[pubS.container,{backgroundColor:'#F5F7FB',}]}>
        {
          Platform.OS === 'ios' ?
            <StatusBar backgroundColor="#FFFFFF"  barStyle="light-content"  animated={true}/>
          : null
        }
          <Image source={require('../../images/xhdpi/bg_personalcenter.png')} style={{height: scaleSize(387),width: scaleSize(750)}}/>
          <ArrowToDetail
            arrowText={I18n.t('manage_wallets')}
            arrowIcon={require('../../images/xhdpi/ico_personalcenter_accountmanagement_def.png')}
            arrowOnPress={this.toAccountManage}
          />
          <ArrowToDetail
            arrowText={I18n.t('language')}
            arrowIcon={require('../../images/xhdpi/ico_personalcenter_language_def.png')}
            arrowOnPress={this.toLanguage}
          />
          <View style={{marginTop:scaleSize(40)}}>
            <ArrowToDetail
              arrowText={`${I18n.t('help_center')}  ${DeviceInfo.getVersion()}`}
              arrowIcon={require('../../images/xhdpi/ico_personalcenter_helpcenter_def.png')}
              arrowOnPress={this.toHelpCenter}
            />
            {
            // <ArrowToDetail
            //   arrowText={`${I18n.t('support')}`}//}
            //   arrowIcon={require('../../images/xhdpi/ico_personalcenter_contact_def.png')}
            //   arrowOnPress={this.toContactService}
            // />
            }
          </View>
      </View>
    )
  }
}


export default Personal
