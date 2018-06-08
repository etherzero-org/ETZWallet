import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Clipboard,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import { TextInputComponent,Btn } from '../../components/'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode'
import { connect } from 'react-redux'
import I18n, { getLanguages } from 'react-native-i18n'
import { changeBackupModalTimesAction } from '../../actions/accountManageAction'
const wallet = require('ethereumjs-wallet')
import Toast from 'react-native-toast'
class Receive extends Component{
  constructor(props){
    super(props)
    this.state={
        visible: false,
        payTotalVal: '',
        addressText: '',

        backupBtnStyle_height: scaleSize(70),
        backupBtnStyle_width: scaleSize(500),

        whileView_height: scaleSize(420),

        blueView_height: scaleSize(355),
        blueView_padding: scaleSize(30),

        modalView_width: scaleSize(620),
        modalView_height: scaleSize(865),
        modalView_top: scaleSize(49),
    }

  }

  componentWillMount(){

    const { currentAccount,backupModalTimes } = this.props.accountManageReducer

    this.setState({
      addressText: `0x${currentAccount.address}`
    })
    if(currentAccount.backup_status === 0 && backupModalTimes === 0){
      this.setState({
        visible: true
      })
    }
    // console.log('I18n.currentLoca=====',I18n.currentLocale())
    let a  =I18n.currentLocale()

    I18n.currentLocale().search(/zh/) === 0 ? a = 'zh' : null
    
    if(Platform.OS === 'ios'){
      switch(a){
        case 'zh':
          this.onZh()
          break
        case 'en':
          this.onEn()
          break
        case 'ru-RU':
          this.onRu()
          break
        default:
          break
      }
    }else{
      switch(I18n.currentLocale()){
        case 'zh-CN':
          this.onZh()
          break
        case 'en-US':
          this.onEn()
          break
        case 'ru-RU':
          this.onRu()
          break
        default:
          break
      }
    }
    this.props.dispatch(changeBackupModalTimesAction(1))
  }

  componentWillUnmount(){
    this.setState({
      visible: false
    }) 
  }


  // onChangePayTotal = (val) => {
  //   this.setState({
  //     payTotalVal: val,
  //   })
  // }
  onZh = () => {
    this.setState({
      backupBtnStyle_height: scaleSize(70),
      backupBtnStyle_width: scaleSize(500),
      whileView_height: scaleSize(356) ,
      blueView_height: scaleSize(260),
      modalView_width: scaleSize(560),
      modalView_height: scaleSize(700),
      modalView_top: scaleSize(149),
      blueView_padding: scaleSize(60),
    })
  }
  onEn = () => {
    this.setState({
      backupBtnStyle_height: scaleSize(70),
      backupBtnStyle_width: scaleSize(500),
      whileView_height:scaleSize(356) ,
      blueView_height: scaleSize(360),
      modalView_width: scaleSize(560),
      modalView_height: scaleSize(800),
      modalView_top: scaleSize(120),
      blueView_padding: scaleSize(30),
    })
  }
  onRu = () => {
    this.setState({
      backupBtnStyle_height: scaleSize(70),
      backupBtnStyle_width: scaleSize(500),
      whileView_height:scaleSize(456) ,
      blueView_height: scaleSize(420),
      modalView_width: scaleSize(660),
      modalView_height: scaleSize(960),
      modalView_top: scaleSize(80),
      blueView_padding: scaleSize(0),
    })
  }
  onPressCopyBtn = () => {
      Clipboard.setString(this.state.addressText)
      Toast.showLongBottom(I18n.t('copy_successfully'))
  }

  onHide = () => {
    this.setState({
      visible: false
    })
  }
  backupBtn = () => {
    const { currentAccount,globalAccountsList } = this.props.accountManageReducer

    this.setState({
      visible: false
    })
    
    this.props.navigator.push({
      screen: 'back_up_account',
      title: currentAccount.account_name,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
      passProps: {
        userName: currentAccount.account_name,
        address: currentAccount.address,
        b_id: currentAccount.id,
        accountsNumber: globalAccountsList.length,
        currentAccountId: currentAccount.id,
        psdPrompt: currentAccount.password_promp || ''
      },
      navigatorButtons: {
        rightButtons: [
          {
            title: 'Save',
            id: 'save_change'
          }
        ]
      }
    })
  }

  render(){
    const { payTotalVal,visible,addressText, backupBtnStyle_height,backupBtnStyle_width, whileView_height, blueView_height, modalView_width, modalView_height,modalView_top,blueView_padding } = this.state
    return(
      <View style={[pubS.container,{paddingTop: scaleSize(35)}]}>
      {
          Platform.OS === 'ios' ?
          <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
          : null
      }
      
        {
        // <TextInputComponent
        //   placeholder={'Enter receive amount (Optional)'}
        //   value={payTotalVal}
        //   onChangeText={this.onChangePayTotal}
        // >
        // </TextInputComponent>
        }

        <View style={{marginTop: scaleSize(125),alignSelf:'center'}}>
          <QRCode
            value={addressText}
            size={scaleSize(400)}
            bgColor='#000'
            fgColor='#fff'
          />
        </View>
        <Text style={[pubS.font24_2,{marginTop: scaleSize(19),alignSelf:'center'}]}>{addressText}</Text>
        <Btn
          btnPress={this.onPressCopyBtn}
          btnText={I18n.t('copy_receive_address')}
          btnMarginTop={scaleSize(100)}
        />


      <Modal
        isVisible={visible}
        onBackButtonPress={this.onHide}
        onBackdropPress={this.onHide}
        style={[styles.modalView,{height: modalView_height,width: modalView_width,top: modalView_top}]}
        backdropOpacity={.8}
      >
        <Image source={require('../../images/xhdpi/img_collectionnobackup.png')} style={[styles.modalImageStyle,{ left: (modalView_width-scaleSize(107))/2,}]}/>
        <View style={[{alignItems:'center'}]}>
          <View style={[styles.blueView,{height: blueView_height,paddingLeft: blueView_padding,paddingRight: blueView_padding}]}>
              <Text style={[pubS.font36_3,{marginTop: scaleSize(32),textAlign:'center'}]}>{I18n.t('backup_first')}</Text>
              <Text style={[pubS.font22_2,{marginTop: scaleSize(13),width: '100%',textAlign:'center'}]}>{I18n.t('backup_modal_1')}</Text>
          </View>
          <View style={[styles.whileView,{height: whileView_height}]}>
              <Text style={[pubS.font30_2,{marginTop: scaleSize(20),textAlign:'center'}]}>{`--  ${I18n.t('backup_mnemonic')} --`}</Text>
              <Text style={[pubS.font24_2,{textAlign:'center'}]}>{I18n.t('backup_modal_2')}</Text>
              <Text style={[pubS.font30_2,{marginTop: scaleSize(20),textAlign:'center'}]}>{`--  ${I18n.t('backup_keystore')}  --`}</Text>
              <Text style={[pubS.font24_2,{textAlign:'center'}]}>{I18n.t('backup_modal_3')}</Text>
              <TouchableOpacity 
                activeOpacity={.7} 
                onPress={this.backupBtn} 
                style={[styles.backupBtnStyle,pubS.center,{height: backupBtnStyle_height,width:backupBtnStyle_width}]}
              >
                <Text style={pubS.font28_2}>{I18n.t('backup_now')}</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalImageStyle:{
    height: scaleSize(121),
    width: scaleSize(107),
    zIndex:999,
    position:'absolute',
    top:0,
   
  },
  backupBtnStyle:{
      
    borderWidth: 1,
    borderColor: '#2B8AFF',
    borderRadius: scaleSize(35),
    marginTop: scaleSize(30),
  },
  whileView:{
    backgroundColor:'#fff',
    width:'100%',
    alignItems:'center',
    borderBottomLeftRadius :scaleSize(10),
    borderBottomRightRadius :scaleSize(10),
  },
  blueView: {
    backgroundColor:'#2B8AFF',
    width:'100%',
    alignItems:'center',
    borderTopLeftRadius: scaleSize(10),
    borderTopRightRadius: scaleSize(10),
    marginTop: scaleSize(84),
  },
  modalView:{
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor:'transparent',
    // borderColor:'red',
    // borderWidth:1,
  }
})
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(Receive)
