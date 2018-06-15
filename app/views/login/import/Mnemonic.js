import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize,ifIphoneX,isIphoneX } from '../../../utils/adapter'
import { TextInputComponent,Btn,Loading } from '../../../components/'
import { importAccountAction,resetDeleteStatusAction,showImportLoadingAction } from '../../../actions/accountManageAction'
import { connect } from 'react-redux'
import { toHome } from '../../../root'
import I18n from 'react-native-i18n'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const bip39 = require('bip39')

class Mnemonic extends Component{
  constructor(props){
    super(props)
    this.state={
      mnemonicVal: '',
      mnemonicValWarning: '',
      passwordVal: '',
      passwordWarning: '',
      repeadPsdVal: '',
      rePsdWarning: '',
      userNameVal: '',
      userNameWarning: '',
      hintValue: '',
    }
  }


  onChangeMemonic = (val) => {
    this.setState({
      mnemonicVal: val,
      mnemonicValWarning: ''
    })
  }
  onChangPassword = (val) => {
    this.setState({
      passwordVal: val,
      passwordWarning: ''
    })
  }
  onChangeRePassword = (val) => {
    this.setState({
      repeadPsdVal: val,
      rePsdWarning: ''
    })
  }
  onChangeUseNameText = (val) => {
    this.setState({
      userNameVal: val,
      userNameWarning: ''
    })
  }
  onPressImport = () => {
   const { mnemonicVal, mnemonicValWarning, passwordVal, passwordWarning, repeadPsdVal, rePsdWarning,userNameVal } = this.state
   let psdReg = /^(?![a-zA-z]+$)(?!\d+$)(?![!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/   
   if(userNameVal.length === 0){
      this.setState({
        userNameWarning: I18n.t('enter_account_name'),
      })
    }else{
      if(!bip39.validateMnemonic(mnemonicVal)){
        this.setState({
          mnemonicValWarning: I18n.t('mnemonic_phrase_warning'),
        })
      }else{
        
        if(!psdReg.test(passwordVal)){
          this.setState({
            passwordWarning: I18n.t('password_verification'),
          })
        }else{
          if(passwordVal !== repeadPsdVal){
            this.setState({
              rePsdWarning: I18n.t('passwords_different'),
            })
          }else{
            this.onImport()
          }
        }
      }
    }
  }

  onImport = () => {
    const { mnemonicVal, passwordVal, userNameVal, hintValue} = this.state  
    const { globalAccountsList } = this.props.accountManageReducer
    this.props.dispatch(showImportLoadingAction(true))
    setTimeout(() => {
      if(bip39.validateMnemonic(mnemonicVal)){
        this.props.dispatch(importAccountAction({
          mnemonicVal,
          mnemonicPsd: passwordVal,
          mnemonicUserName: userNameVal,
          type: 'mnemonic',
          fromLogin: this.props.fromLogin === 'login' ? 'login' : 'accounts',
          accountsList: globalAccountsList,
          hintValue
        }))
      }else{
        this.props.dispatch(showImportLoadingAction(false))
        this.setState({
          mnemonicValWarning: I18n.t('mnemonic_phrase_warning'),
        })
      }
    },1000)   
  }

  onChangeHint = (val) => {
    this.setState({
      hintValue: val
    })
  }


  render(){
    isIphoneX() ?    //判断IPONEX
    this.state.DEFULT_IPONEX = 345
    : this.state.DEFULT_IPONEX = scaleSize(680);
    const { mnemonicVal, mnemonicValWarning, passwordVal, passwordWarning, repeadPsdVal, rePsdWarning,userNameVal, userNameWarning,DEFULT_IPONEX,hintValue } = this.state
    return(
      <View style={styles.container}>
        <ScrollView

        >
          <KeyboardAwareScrollView
            style={{ backgroundColor: '#fff' }}
            enableOnAndroid={true}
            scrollToEnd={true}
            enableResetScrollToCoords={true}
          >
            <TextInputComponent
              placeholder={I18n.t('account_name')}
              value={userNameVal}
              onChangeText={this.onChangeUseNameText}
              warningText={userNameWarning}//
            />
            <TextInputComponent
              isMultiline={true}
              placeholder={I18n.t('mnemonic_phrase_1')}
              value={mnemonicVal}
              onChangeText={this.onChangeMemonic}
              warningText={mnemonicValWarning}
              iptMarginTop={scaleSize(60)}
              
            />
            <TextInputComponent
              placeholder={I18n.t('password')}
              value={passwordVal}
              onChangeText={this.onChangPassword}
              secureTextEntry={true}
              warningText={passwordWarning}
            />
           
            <TextInputComponent
              placeholder={I18n.t('repeat_password')}
              value={repeadPsdVal}
              onChangeText={this.onChangeRePassword}
              secureTextEntry={true}
              warningText={rePsdWarning}
            />
            <TextInputComponent
              placeholder={I18n.t('password_hint')}
              value={hintValue}
              onChangeText={this.onChangeHint}
            />
            <Btn
              btnMarginTop={scaleSize(60)}
              btnPress={this.onPressImport}
              btnText={I18n.t('import')}
              btnWidth={DEFULT_IPONEX}
            />
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor:'#fff',
        width: 375
        // width: scaleSize(750),
      },
      {
        flex: 1,
        backgroundColor:'#fff',
        // width: scaleSize(750),
      },
      {
        flex: 1,
        backgroundColor:'#fff',
        // width: scaleSize(750),
      }
    )
  }

})
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(Mnemonic)