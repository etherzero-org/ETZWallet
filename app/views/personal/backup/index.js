import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  BackHandler,
  Clipboard,
  Share,
  Button,
  StatusBar,
  Platform
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize, ifIphoneX } from '../../../utils/adapter'
import { sliceAddress } from '../../../utils/splitNumber'
import { Btn,Loading, } from '../../../components/'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'


import { deleteAccountAction,resetDeleteStatusAction,updateBackupStatusAction,passPropsAction } from '../../../actions/accountManageAction'
const Wallet = require('ethereumjs-wallet')

import { toLogin } from '../../../root'
import I18n from 'react-native-i18n'
import Toast from 'react-native-root-toast'

import accountDB from '../../../db/account_db'

import { fromV3 } from '../../../utils/fromV3'
class BackUpAccount extends Component{
  constructor(props){
    super(props)
    this.state = {
      iptPsdVisible: false,
      pKeyVisible: false,
      psdVal: '',
      privKey: '',
      privBackuped: false,
      backupMnemonic: false,
      mncBackuped: false,
      isDelAccount: false,
      dVisible: false,
      keyStore: {},
      loadingText: '',
      visible: false,
      localMnemonic: '',
      currentList: {},
      pasModalVisible: -1,//0  私钥 1 删除  2 keystore 3助记词
      keystoreBackuped: false,
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }
  componentWillMount(){
    const { currentAccount, globalAccountsList } = this.props.accountManageReducer

    this.props.dispatch(resetDeleteStatusAction())
    
    globalAccountsList.map((list,index) => {
      if(list.address === this.props.address){
        this.setState({
          localMnemonic: list.mnemonic,
          currentList: list
        })
        if(list.backup_status === 1){
          this.setState({
            privBackuped: true
          })
        }
        if(list.backup_keystore === 1){
          this.setState({
            keystoreBackuped: true
          })
        }
        if(!list.mnemonic){
          this.setState({
            mncBackuped: true,
          })
        }
        let keys = this.getKeys(list)

        this.setState({ keyStore:keys })
      }
    })
  }


  componentWillReceiveProps(nextProps){
    if(this.props.accountManageReducer.deleteSuc !== nextProps.accountManageReducer.deleteSuc && nextProps.accountManageReducer.deleteSuc){
      this.setState({
        visible: false,
        loadingText: ''
      })
      let t = Toast.show(I18n.t('delete_successfully'))
      setTimeout(() => {
        Toast.hide(t)
      },1000)

      if(this.props.accountsNumber === 1){
        setTimeout(() => {
          toLogin()
        },1000)
        accountDB.dropTable({
          sql: 'drop table account'
        })

      }else{
        setTimeout(() => {
          this.props.navigator.pop()
        },1000)
      }
    }

    if(this.props.accountManageReducer.delMnemonicSuc !== nextProps.accountManageReducer.delMnemonicSuc && nextProps.accountManageReducer.delMnemonicSuc){
      this.setState({
        mncBackuped: true
      })
    }

    //修改密码成功后  keystore需要使用reducer中的
    const { globalAccountsList,copyKeystoreSuc } = nextProps.accountManageReducer

    console.log('修改密码成功后  keystore需要使用reducer中的',globalAccountsList)
    globalAccountsList.map((list,index) => {
      if(list.address === this.props.address){
        this.setState({
          currentList: list
        })
        
        let keys = this.getKeys(list)
        this.setState({ keyStore:keys })
      }
    })

    if(this.props.accountManageReducer.copyKeystoreSuc !== copyKeystoreSuc && copyKeystoreSuc){
      this.setState({
        keystoreBackuped: true
      })
    }

  }

  getKeys(list){
    let keys = {
      "version":list.version,
      "id":list.kid,
      "address":list.address,
      "crypto":{
        "ciphertext":list.ciphertext,
        "cipherparams":{
            "iv":list.iv
        },
        "cipher":list.cipher,
        "kdf":list.kdf,
        "kdfparams":{
          "dklen":list.dklen,
          "salt":list.salt,
          "n":list.n,
          "r":list.r,
          "p":list.p
        },
        "mac":list.mac
      }
    }
    return keys
  }

  onNavigatorEvent(event){

    if (event.type == 'NavBarButtonPress') {
      if(event.id === 'save_change'){
        this.saveUserName()
      }
    }
     switch (event.id) {
      case 'willAppear':
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        break;
      case 'willDisappear':
        this.backPressed = 0;
        this.backHandler.remove();
        break;
      default:
        break
     }
  }
  handleBackPress = () => {
    if (this.backPressed && this.backPressed > 0) {
      this.props.navigator.popToRoot({ animated: false })
      return false
    }
    this.backPressed = 1
  }
  saveUserName = () => {

  }
  deleteAccount = () => {
    this.setState({
      iptPsdVisible: true,
      isDelAccount: true,
      pasModalVisible: 1
    })
  }

  onPressCancel = () => {
    this.setState({
      dVisible: false
    })
  }
  onPressConfirmDel = () => {
    console.log('onPressConfirmDel1111')
    this.setState({
      dVisible: false,
      visible: true,
      loadingText: I18n.t('deleting_account')
    })
    this.props.dispatch(deleteAccountAction(this.props.b_id,this.props.accountsNumber,this.props.currentAccountId))   
  }

  backUpPrivBtn = () => {
    this.setState({
      iptPsdVisible: true,
      pasModalVisible: 0,
    })
  }
  onHide = () => {
    this.setState({
      iptPsdVisible: false,
      psdVal: '',
      // backupMnemonic: false,
      pasModalVisible: -1,
      isDelAccount: false,
      visible: false
    })
  }
  onChangePsdText = (val) => {
    this.setState({
      psdVal: val
    })
  }
  onPKeyHide = () => {
    this.setState({
      pKeyVisible: false,
      privKey: '',
      privBackuped: true,
    })

    this.props.dispatch(updateBackupStatusAction(this.props.address))
  }

  onConfirm = () => {
    const { psdVal,backupMnemonic,keyStore,isDelAccount } = this.state
    this.setState({
      loadingText: I18n.t("unlocking"),
      iptPsdVisible: false,
    })
    setTimeout(() => {
      this.setState({
        visible: true,
      })
    },500)
    setTimeout(async () => {
      console.log('keyStore==',keyStore)
      console.log('psdVal==',psdVal)
      try {
          const wal = await fromV3(keyStore,psdVal)
          console.log('wal',wal)
          let priv = wal.privKey.toString('hex')
          console.log('备份解析的私钥',priv)
          this.showDiffModal(priv)

          this.onHide()

      } catch (err) {
        console.log('fromV3 err',err)

        Alert.alert(
          I18n.t('title_error'),
          `${err}`,
          [
            {text:I18n.t('ok'),onPress:() => 
            this.setState({ 
              psdVal: '',
              loadingText: '',
              visible: false,
            })
          }
          ]
        ) 
      }
    },1000)
  }
  showDiffModal(priv){
    switch(this.state.pasModalVisible){//0  私钥 1 删除  2 keystore 3助记词
      case 0:
        this.showPrivModal(priv)
        break
      case 1:
        this.showDelModal()
        break
      case 2:
        this.toExportKey()
        break
      case 3:
        this.showMneModal()
        break
      default:
        break
    }
  }
  showPrivModal = () => {
    setTimeout(() => {
      this.setState({
        privKey: priv,
        pKeyVisible: true,
      })
    },1000)
  }
  showDelModal = () => {
    setTimeout(() => {
      this.setState({
        dVisible: true,
      })
    },1000) 
  }
  toExportKey = () => {
    const { currentList, keyStore} = this.state
    this.props.dispatch(passPropsAction({
      currentList,
      keyStore
    }))

    this.props.navigator.push({
      screen: 'export_keystore',
      title:I18n.t('export_keystore'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
      passProps:{
        curAddr:this.props.address
      }
    })
  }
  showMneModal = () => {
    this.props.navigator.push({
      screen: 'write_mnemonic',
      title: '',
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
      passProps: {
        currentAddress: this.props.address,
        localMnemonic: this.state.localMnemonic
      }
    })
  }


  onCopyBtn = () => {
    Clipboard.setString(this.state.privKey)
    Toast.showLongBottom(I18n.t('copy_successfully'))
  }
  backupMnemonicBtn = () => {
    this.setState({
      iptPsdVisible: true,
      // backupMnemonic: true
      pasModalVisible: 3,
    })

  }
  backUpKeyStoreBtn = () => {

    this.setState({
      iptPsdVisible: true,
      pasModalVisible: 2,
    })

    // let k = JSON.stringify(keyStore)


    // Share.share({
    //   message: k,
    //   title: I18n.t('backup_keystore_title'),
    // }, {
    //   dialogTitle: I18n.t('share_your_keystore'),
    // })
    // .then(this._showResult)
    // .catch((error) => Toast.showLongBottom(I18n.t('share_error')))
  }
  // _showResult = (result) => {
  //   if (result.action === Share.sharedAction) {
  //     if (result.activityType) {

  //     } else {

  //     }
  //   } else if (result.action === Share.dismissedAction) {
  //     Toast.showLongBottom(I18n.t('share_error'))
  //   }
  // }


  modifyPsd = () => {
    const { currentList, keyStore} = this.state
    this.props.dispatch(passPropsAction({
      currentList,
      keyStore
    }))
    this.props.navigator.push({
      screen: 'modify_password',
      title:I18n.t('change_psd'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }
  render(){
    const { iptPsdVisible,psdVal,pKeyVisible,privKey,privBackuped,mncBackuped,keyStore,dVisible, visible, keystoreBackuped } = this.state
    const { isLoading,delMnemonicSuc } = this.props.accountManageReducer
    return(
      <View style={[pubS.container,{backgroundColor:'#fff',alignItems:'center'}]}>
        <Loading loadingVisible={visible} loadingText={this.state.loadingText}/>
        {
          Platform.OS === 'ios' ?
          <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
          : null
        }
        
        <Image source={require('../../../images/xhdpi/Penguin.png')} style={styles.avateStyle}/>
        <Text style={pubS.font26_5}>{sliceAddress(this.props.address,10)}</Text>
        <View style={[styles.userNameViewStyle,pubS.rowCenterJus,pubS.bottomStyle,{marginTop: scaleSize(80),}]}>
          <Text style={pubS.font26_4}>{I18n.t('account_name')}</Text>
          <Text style={pubS.font26_4}>{this.props.userName}</Text>
        </View>
        {
          this.props.psdPrompt.length > 0 ? 
          <View style={[styles.userNameViewStyle,pubS.rowCenterJus,pubS.bottomStyle]}>
            <Text style={pubS.font26_4}>{I18n.t('pas_prompt')}</Text>
            <Text style={pubS.font26_4}>{this.props.psdPrompt}</Text>
          </View>
          : null
        }
        <TouchableOpacity style={[styles.userNameViewStyle,pubS.rowCenterJus,pubS.bottomStyle]} onPress={this.modifyPsd} activeOpacity={.7} >
          <Text style={pubS.font26_4}>{I18n.t('change_psd')}</Text>
          <Image source={require('../../../images/xhdpi/btn_ico_payment_select_def.png')} style={{width:scaleSize(16),height: scaleSize(30)}}/>
        </TouchableOpacity>
        <View style={{position:'absolute',bottom: scaleSize(40)}}>
          
          {
            mncBackuped ? 
            <View/>
            :
            <Btn
              btnPress={ () => this.backupMnemonicBtn() }
              bgColor={'#2B8AFF'}
              opacity={.7}
              btnText={I18n.t('backup_mnemonic_1')}
              btnMarginTop={scaleSize(150)}
            />
          }

          {
            keystoreBackuped ? 
            <View/>
            : 
            <Btn
              btnPress={() => this.backUpKeyStoreBtn() }
              bgColor={'#2B8AFF'}
              opacity={.7}
              btnText={I18n.t('backup_keystore_1')}
              btnMarginTop={scaleSize(20)}
            />
          }
          
          
          {
            privBackuped ? 
            <View/>
            :
            <Btn
              btnPress={ () => this.backUpPrivBtn() }
              bgColor={'#2B8AFF'}
              opacity={.7}
              btnText={I18n.t('backup_private_key')}
              btnMarginTop={scaleSize(20)}
            />
          }
          <Btn
            btnPress={this.deleteAccount}
            btnText={I18n.t('delete')}
            btnMarginTop={scaleSize(20)}
            bgColor={'#BDC0C6'}
          />
        </View>

        <Modal
          isVisible={iptPsdVisible}
          onBackButtonPress={this.onHide}
          onBackdropPress={this.onHide}
          backdropOpacity={.8}
        >
          <View style={styles.modalView}>
            <Text style={[pubS.font34_2,{marginTop: scaleSize(50)}]}>{I18n.t('enter_password')}</Text>
            <TextInput
              placeholder={I18n.t('password')}
              value={psdVal}
              onChangeText={ this.onChangePsdText}
              underlineColorAndroid={'transparent'}
              textAlignVertical={'center'}
              secureTextEntry={true}
              style={styles.textIptStyle}
              autoFocus={true}
            />
            <View style={[pubS.rowCenter,pubS.topBorderStyle,{height: scaleSize(88),marginTop: scaleSize(25),width: '100%'}]}>
              <TouchableOpacity activeOpacity={.7} onPress={this.onHide} style={[pubS.center,styles.modalBtnStyle]}>
                <Text style={[pubS.font34_3,{}]}>{I18n.t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.7} onPress={this.onConfirm} style={[pubS.center,{width:'50%',borderBottomRightRadius:scaleSize(26)}]}>
                <Text style={[pubS.font34_3,{fontWeight: 'bold'}]}>{I18n.t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={pKeyVisible}
          backdropOpacity={.8}
        >
          <View style={styles.pkViewStyle}>
            <View style={[styles.privViewStyle,pubS.center]}>
              <Text style={[pubS.font36_4,{fontWeight: 'bold'}]}>{I18n.t('backup_private_key')}</Text>
              <TouchableOpacity activeOpacity={.7} onPress={this.onPKeyHide} style={styles.iconStyle}>
                <Image source={require('../../../images/xhdpi/btn_ico_collectionnobackup_close_def.png')} style={{height: scaleSize(30),width: scaleSize(30)}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.privModalView}>
              <Text style={pubS.font22_1}>{I18n.t('private_key_modal')}</Text>
            </View>
            <View style={[styles.pkStyle,pubS.center]}>
              <Text style={pubS.font24_3}>{privKey}</Text>
            </View>
            <TouchableOpacity onPress={this.onCopyBtn} activeOpacity={.7} style={[styles.copyBtnStyle,pubS.center]}>
              <Text style={pubS.font28_4}>{I18n.t('copy')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

       <Modal isVisible={dVisible}>
          <View style={[styles.confirmModal]}>
            <Text style={[pubS.font34_3,styles.titleStyle]}>{I18n.t('delete_account')}</Text>
            <View style={[pubS.center,pubS.rowCenter,styles.btnViewStyle]}>
              <TouchableOpacity activeOpacity={.6} onPress={this.onPressCancel} style={[pubS.center,styles.btnStyle]}>
                <Text style={pubS.font34_3}>{I18n.t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.6} onPress={this.onPressConfirmDel} style={[pubS.center,styles.btnStyle,{borderRightWidth:StyleSheet.hairlineWidth,borderColor:'#dce4e6'}]}>
                <Text style={pubS.font34_3}>{I18n.t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        

      </View>
    )
  }
}
const styles = StyleSheet.create({
  privModalView: {
    backgroundColor:'#FFE186',
    paddingLeft: scaleSize(28),
    paddingRight: scaleSize(28),
    paddingTop: scaleSize(13),
    paddingBottom: scaleSize(13)
  },
  privViewStyle:{
    height: scaleSize(90),
    backgroundColor:'#2B8AFF',
    width: '100%',
    borderTopLeftRadius: scaleSize(10),
    borderTopRightRadius: scaleSize(10)
  },

  btnViewStyle: {
    position: 'absolute',
    bottom:0,
    borderColor: '#dce4e6',
      borderTopWidth: StyleSheet.hairlineWidth,  
  },
  titleStyle: {
    marginTop: 40,
    alignSelf: 'center'
  },
  confirmModal:{
    backgroundColor:'#fff',
    height: 150,
    width:280,
    alignSelf:'center',
    borderRadius: 5,

  },
  btnStyle: {
    height:40,
    width: 140,
  },
  copyBtnStyle:{
    width: scaleSize(500),
    height: scaleSize(70),
    backgroundColor: '#2B8AFF',
    borderRadius: scaleSize(35),
    marginTop: scaleSize(24),

  },
  pkStyle:{
    height: scaleSize(100),
    width: scaleSize(500),
    backgroundColor: '#E3E8F1',
    paddingLeft: scaleSize(19),
    paddingRight: scaleSize(19),
    marginTop: scaleSize(33),
    borderRadius: scaleSize(6),
  },
  iconStyle:{
    position: 'absolute',
    top: scaleSize(30),
    right: scaleSize(30),
  },
  pkViewStyle: {
    width: scaleSize(560),
    height: scaleSize(480),
    alignSelf: 'center',
    alignItems:'center',
    borderRadius: scaleSize(10),
    backgroundColor:'#fff',
    alignItems:'center'
  },
  modalBtnStyle:{
    borderBottomLeftRadius : scaleSize(26),
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#dce4e6',
    width: '50%',
  },
  textIptStyle: {
    borderColor:'#808080',
    borderWidth:1,
    padding: 0,
    paddingLeft: 4,
    // flex: 1,
    fontSize: setScaleText(26),
    color:'#657CAB',
    width: scaleSize(476),
    height: scaleSize(50),
    marginTop: scaleSize(40),
  },
  modalView:{
    width: scaleSize(540),
    height: scaleSize(297),
    // position: 'absolute',
    // top: scaleSize(59),
    alignSelf: 'center',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius: scaleSize(26),
  },
  userNameViewStyle:{
    ...ifIphoneX(
      {
        height:scaleSize(100),
        width: 345,
        
      },
      {
        height:scaleSize(100),
        width: scaleSize(680),
      },
      {
        height:scaleSize(100),
        width: scaleSize(680),
      }
    )

  },
  avateStyle:{
    width: scaleSize(112),
    height: scaleSize(112),
    marginTop: scaleSize(84),
    alignSelf:'center',

  }
})
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(BackUpAccount)