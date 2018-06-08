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
import { checkKeystore } from '../../../utils/checkKeystore'
class KeyStore extends Component{
  constructor(props){
    super(props)
    this.state={
      keystoreVal: '',
      keystoreWarning: '',
      userNameVal: '',
      userNameWarning: '',
      passwordVal: '',
      passwordWarning: '',
    }
  }
  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow(false));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    // let online = `{"version":3,"id":"b895ea70-fdff-4b6b-9420-56bf088d3c9e","address":"d56bada9eae5e107192dcd4d94389ae5160ee3b4","Crypto":{"ciphertext":"e207cc4eea9a157c7c82cca8f7f4a53cef1cf76dd0a34020b1831b066ff6fe1d","cipherparams":{"iv":"30466067050573459f21d6c6fb5a5877"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"9c938d44823ef01a414599b8d4cb6d79278e92e681a93c33c1ddde6fd0db2033","n":8192,"r":8,"p":1},"mac":"0c20a0cee801ef3101079ad65283c983b54d8e61340e17634fefacfc614acf93"}}`
    // let im = '{"version":3,"crypto":{"mac":"4889f12528d852754c2f9877372a612de64c0710ee352bf21f192c572c08adca","cipherparams":{"iv":"4781627ee1f671726babaca08551e9f0"},"kdfparams":{"dklen":32,"r":8,"salt":"f6a0530bdd39b668167cbefbc0acee57d63d0534ee62faa7ed5a852ab9492b9d","p":1,"n":262144},"cipher":"aes-128-ctr","ciphertext":"85ac5a616f5593f4fd574e49ea777df2b9b44d3fd4fd2935c0ffd62ac38af750","kdf":"scrypt"},"id":"a922295f-ee97-46ef-b1f3-155cd9ca80b8","address":"f2ea22b3c5fd625f42c4a77a3d17b246900f0117"}'
    // let local = '{"version":3,"id":"962c6028-12c2-4f94-8662-3b3bea6d567e","address":"ec80a9fe89b05e337efa9c801c07c8444d9cb32e","crypto":{"ciphertext":"747c915f231a508735d9ebad6ab70bf379c30d52e78a964c6b396867ab5f5b8e","cipherparams":{"iv":"38fef4acfe68ad225f05d2afc5c22837"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"c74436c3871b5959b1e5483a53fd7d1b37778840474f7b8c8298012a251e8888","n":8192,"r":8,"p":1},"mac":"6c1ca62cf63bc8a0098c46e007df429c93fad5155916fcf08d137af05a9c4e71"}}'
    // let bit = '{"version": 3,  "id": "8bb95fef-dcf3-4027-a9f3-dafd50d9f1cc",  "address": "a9f68706e0608e585b9df501a1e6ad2edfa5f0e5",  "crypto": {    "ciphertext": "c930eba836a40cc6f5e822240db1505e01678cf71988755e00d6c6f685be7ab1",    "cipherparams": {      "iv": "7b80875d6633123806879eec2c123561"    },    "cipher": "aes-128-ctr",    "kdf": "scrypt",    "kdfparams": {      "dklen": 32,      "salt": "dec114d80abc89d1b64101a43631e691cf355d2afb5ad2be2d48310637783ecb",      "n": 8192,      "r": 8,      "p": 1    },    "mac": "fe48046c93ffe22caedc5459176df4f334cbdf39c661ccecddf2374ebc40f9d4"  }}'
    // this.setState({
    //   keystoreVal: bit
    // })
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (status) => {
    if(status){
      this.refs._scroll.scrollToEnd({animated: true})
    }
  }

  _keyboardDidHide =() => {

  }
  onChangelKeystore = (val) => {
    this.setState({
      keystoreVal: val,
      keystoreWarning: ''
    })
  }
  onChangeUseNameText = (val) => {
    this.setState({
      userNameVal: val,
      userNameWarning: '',
    })
  }

  onPressImport = () => {

    const { keystoreVal, keystoreWarning,userNameVal,userNameWarning,passwordVal } = this.state
    if(userNameVal.length === 0){
      this.setState({
        userNameWarning: I18n.t('enter_account_name'),
      })
    }else{
      if(!keystoreVal || checkKeystore(keystoreVal)){
        this.setState({
          keystoreWarning: I18n.t('keystore_warning'),
        })
      }else{
        if(passwordVal.length === 0){
          this.setState({
            passwordWarning: I18n.t('enter_password')
          })
        }else{
          this.onBtn()
        }
      }
    }
  }

  onBtn = () => {
    const { keystoreVal, userNameVal,passwordVal } = this.state 
    const { globalAccountsList } = this.props.accountManageReducer

  
    this.props.dispatch(showImportLoadingAction(true))
    setTimeout(() => {
      this.props.dispatch(importAccountAction({
        keystoreVal,
        keystoreUserName: userNameVal,
        keystorePsd: passwordVal,
        type: 'keystore',
        fromLogin: this.props.fromLogin === 'login' ? 'login' : 'accounts',
        accountsList: globalAccountsList
      }))
    },1000)
  

  }
  onFocus = () => {   
    this._keyboardDidShow(true)
  }

  onChangPassword = (value) => {
    this.setState({
      passwordVal: value
    })
  }
  render(){
    isIphoneX() ?    //判断IPONEX
    this.state.DEFULT_IPONEX = 345
    : this.state.DEFULT_IPONEX = scaleSize(680);
    const { keystoreVal, keystoreWarning,userNameVal,userNameWarning,DEFULT_IPONEX,passwordVal,passwordWarning } = this.state
    return(
      <View style={styles.container}>
        <ScrollView
          ref={'_scroll'}
        >
          <TextInputComponent
            placeholder={I18n.t('account_name')}
            value={userNameVal}
            onChangeText={this.onChangeUseNameText}
            warningText={userNameWarning}//
          />
          <TextInputComponent
            isMultiline={true}
            placeholder={I18n.t('keystore_content')}
            value={keystoreVal}
            onChangeText={this.onChangelKeystore}
            warningText={keystoreWarning}
            iptMarginTop={scaleSize(60)}
            onFocus={this.onFocus}
          />

          <TextInputComponent
            placeholder={I18n.t('password')}
            value={passwordVal}
            onChangeText={this.onChangPassword}
            secureTextEntry={true}
            warningText={passwordWarning}
          />
          
          <Btn
            btnMarginTop={scaleSize(60)}
            btnPress={this.onPressImport}
            btnText={I18n.t('import')}
            btnWidth={DEFULT_IPONEX}
          />
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
)(KeyStore)