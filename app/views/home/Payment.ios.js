import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Keyboard,
  StatusBar
} from 'react-native'



import { pubS,DetailNavigatorStyle,MainThemeNavColor,ScanNavStyle } from '../../styles/'
import { setScaleText, scaleSize, ifIphoneX } from '../../utils/adapter'
import { TextInputComponent,Btn,Loading,NavHeader,LoadingModal } from '../../components/'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Picker from 'react-native-picker'
import { makeTxByETZAction, makeTxByTokenAction,insert2TradingDBAction,showLoadingAction,resetTxStatusAction } from '../../actions/tradingManageAction'
import { refreshTokenAction } from '../../actions/tokenManageAction'
import { passReceiveAddressAction } from '../../actions/accountManageAction'
import { contractAbi } from '../../utils/contractAbi'
import I18n from 'react-native-i18n'
import { getTokenGas, getGeneralGas } from '../../utils/getGas'
import { fromV3 } from '../../utils/fromV3'
import {splitDecimal } from '../../utils/splitNumber'
import InputScrollView from 'react-native-input-scroll-view';
import accountDB from '../../db/account_db'
const EthUtil = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet')
const EthereumTx = require('ethereumjs-tx')

let self = null

import { platform } from 'os';


class Payment extends Component{
  constructor(props){
    super(props)
    this.state={
      receiverAddress: '',
      txValue: '',
      noteVal: '',
      txAddrWarning: '',
      txValueWarning: '',
      txPsdWarning: '',
      txPsdVal: '',
      visible: false,
      modalTitleText:I18n.t('send_detail'),
      modalTitleIcon: require('../../images/xhdpi/nav_ico_paymentdetails_close_def.png'),
      modalSetp1: true,
      senderAddress: '',
      keyStore: {},
      currentTokenName: 'ETZ',
      isToken: false,
      currentTokenDecimals: 0,
      // loadingVisible: false,
      loadingText: '',
      gasValue: '',
      currentAccountName: '',
      currentTokenAddress: '',

      currentAssetValue: '',//当前资产的数量 
      keyboardHeight: 0
    }
    self = this
  }
  


  componentWillMount(){

    const { fetchTokenList } = this.props.tokenManageReducer 

    const { currentAccount } = this.props.accountManageReducer

    
    if(this.props.scanSucAddr){
       this.setState({
        receiverAddress: this.props.scanSucAddr,
       })
    }
    if(this.props.curToken !== 'ETZ'){
      this.setState({
        isToken: true,
        currentTokenName: this.props.curToken,
        currentTokenDecimals: this.props.curDecimals
      })
    }
    // if(this.props.receive_address){
    //   this.setState({
    //     receiverAddress: this.props.receive_address
    //   })
    // } 

    fetchTokenList.map((val,idx) => {
      if(val.tk_symbol === this.props.curToken){
        this.setState({
          currentTokenDecimals: val.tk_decimals,
          currentTokenAddress: val.tk_address
        })
      }
    })

    let ks =  {
      "version": currentAccount.version,
      "id": currentAccount.kid,
      "address": currentAccount.address,
      "crypto": {
        ciphertext: currentAccount.ciphertext,
        cipherparams: {
          "iv": currentAccount.iv
        },
        "cipher": currentAccount.cipher,
        "kdf": currentAccount.kdf,
        "kdfparams": {
          "dklen": currentAccount.dklen,
          "salt": currentAccount.salt,
          "n":currentAccount.n,
          "r":currentAccount.r,
          "p":currentAccount.p
        },
        "mac": currentAccount.mac
      }
    }
    this.setState({
      senderAddress: currentAccount.address,//也就是当前账户地址
      keyStore: ks,
      currentAccountName: currentAccount.account_name
    })
    this.assetsValue()


    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this._keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this._keyboardDidHide.bind(this))

  }
  componentDidMount(){
    const tokenPickerData = ["ETZ"]
    const { fetchTokenList } = this.props.tokenManageReducer 
    fetchTokenList.map((val,idx) => {
      if(val.tk_selected === 1 && val.account_addr === this.state.senderAddress){
        tokenPickerData.push(val.tk_symbol)
      }
    })
    Picker.init({
      pickerConfirmBtnText: I18n.t('confirm'),
      pickerCancelBtnText: I18n.t('cancel'),
      pickerTitleText: '',
      pickerConfirmBtnColor: [21, 126, 251, 1],
      pickerCancelBtnColor: [21, 126, 251, 1],
      pickerToolBarBg: [247, 247, 247, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarFontSize: 14,
      pickerFontSize: 22,
      pickerFontColor: [51, 51, 51, 1],
      pickerData: tokenPickerData,
      onPickerConfirm: pickedValue => {
        this.setState({
          currentTokenName: pickedValue[0],
          gasValue: ''
        })
        if(pickedValue[0] !== 'ETZ'){
          this.setState({
            isToken: true
          })
          this.selectTokenResult(pickedValue[0])
        }else{
          this.setState({
            currentAssetValue: this.props.tokenManageReducer.etzBalance 
          })
        }
        fetchTokenList.map((val,idx) => {
          if(val.tk_symbol === this.state.currentTokenName){
            this.setState({
              currentTokenDecimals: val.tk_decimals,
              currentTokenAddress: val.tk_address
            })
          }
        })
        this.getGasValue()
      },
    })
  }

  componentWillReceiveProps(nextProps){
    const { scanAddress, scanCurToken} = nextProps.accountManageReducer
    if(this.props.accountManageReducer.scanAddress !== scanAddress && scanAddress.length > 0){
      this.setState({
        receiverAddress: scanAddress,
        currentTokenName: scanCurToken
      })
    }


    const { saveRecordSuc,pendingTxList } = nextProps.tradingManageReducer

    

    //插入数据库成功 开始发送交易action
    this.sendTxAction(saveRecordSuc, pendingTxList)
    

    // if(this.props.tradingManageReducer.txetzpassworderror !== nextProps.tradingManageReducer.txetzpassworderror && nextProps.tradingManageReducer.txetzpassworderror.length > 0){
    //   Alert.alert('密码错啦')
    //   this.props.dispatch(resetTxStatusAction())
    //   return
    // }else{
      
    //   this.props.dispatch(resetTxStatusAction())
    // }

  }
  _keyboardDidShow(e){
    this.setState({
      keyboardHeight: e.startCoordinates.height
    })
  }
  _keyboardDidHide(){

  }
  sendTxAction(saveRecordSuc, pendingTxList){
    const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,gasValue, } = this.state
    const { fetchTokenList,etzBalance } = this.props.tokenManageReducer 
    if(this.props.tradingManageReducer.saveRecordSuc !== saveRecordSuc && saveRecordSuc){
      //插入数据库成功
      console.log('插入数据库成功')
      // this.setState({
      //   loadingVisible: false
      // })

      
      

      if(this.state.currentTokenName === 'ETZ'){
        this.props.dispatch(makeTxByETZAction({
          txPsdVal,
          senderAddress,
          txValue,
          receiverAddress,
          noteVal,
          gasValue,
          fetchTokenList,
          keyStore: this.state.keyStore,
          pendingMark: pendingTxList[pendingTxList.length-1]
        }))
      }else{
        this.props.dispatch(makeTxByTokenAction({
          txPsdVal,
          senderAddress,
          txValue,
          receiverAddress,
          noteVal,
          gasValue,
          fetchTokenList,
          currentTokenDecimals: this.state.currentTokenDecimals,
          currentTokenAddress: this.state.currentTokenAddress,
          currentTokenName: this.state.currentTokenName,
          keyStore: this.state.keyStore,
          pendingMark: pendingTxList[pendingTxList.length-1]
        }))
      }

      setTimeout(() => {
        this.props.dispatch(showLoadingAction(false,''))
        this.props.navigator.push({
          screen: 'tx_record_list',
          title: this.state.currentTokenName,
          backButtonTitle:I18n.t('back'),
          backButtonHidden:false,
          navigatorStyle: Object.assign({},DetailNavigatorStyle,{
            navBarHidden: true,
            navBarTextColor:'#fff',
            navBarBackgroundColor:'#144396',
            statusBarColor:'#144396',
            statusBarTextColorScheme:'light'
          }),
          passProps:{
            etzBalance: splitDecimal(this.state.currentAssetValue),//etz或者代币资产金额
            etz2rmb: 0,
            curToken: this.state.currentTokenName,//token缩写  etz即ETZ
            // currencySymbol: this.props.currencySymbol,//  货币符号
            curDecimals: this.props.curDecimals,//小数点位数
          }
        })
      },1000)
    }
  }
  componentWillUnmount(){
    this.onPressClose()
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    Picker.hide()

  }
  assetsValue(){
    if(this.props.curToken === 'ETZ'){
      this.setState({
        currentAssetValue: this.props.tokenManageReducer.etzBalance
      })
    }else{
       this.selectTokenResult(this.props.curToken)
    }
  }
  async selectTokenResult(tok){
    let selTokenRes = await accountDB.selectTable({
      sql: 'select tk_number from token where tk_symbol = ?',
      parame: [tok]
    })
    this.setState({
      currentAssetValue: `${selTokenRes[0].tk_number}`
    })
  }
  onChangeToAddr = (val) => {
    this.setState({
      receiverAddress: val.trim(),
      txAddrWarning: ''
    })  
    this.getGasValue()
  }  
  onChangeTxValue = (val) => {
    const { currentTokenDecimals,txValue } = this.state
    if(!isNaN(val)){
      //不能小于规定的小数位
      this.setState({
        txValue: val,
        txValueWarning: ''
      })
        
      setTimeout(() => {
          this.getGasValue()
      },500)

      }else{
      Alert.alert(I18n.t('input_number'))
    }
  }


  onChangeNoteText = (val) => {
    this.setState({
      noteVal: val.trim(),
    })
  }
  async getGasValue(){
    const { receiverAddress,txValue,senderAddress, currentTokenName, currentTokenDecimals, currentTokenAddress } = this.state
    if(receiverAddress.length === 42 && txValue.length > 0){
      if(this.state.currentTokenName === 'ETZ'){

        let genGasValue = await getGeneralGas(txValue,senderAddress,receiverAddress)

        // console.log('genGasValue==',genGasValue)
        this.setState({
          gasValue: genGasValue,
        })

      }else{
        let tokenGasValue = await getTokenGas(senderAddress,receiverAddress,currentTokenName,currentTokenDecimals,txValue,currentTokenAddress)
        console.log('tokenGasValue==',tokenGasValue)
        this.setState({
          gasValue: tokenGasValue,
        })
      }
    }
  }
  onNextStep = () => {
    const { receiverAddress, txValue, noteVal,currentAssetValue } = this.state
    let addressReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{42}$/    
    if(!addressReg.test(receiverAddress)){
      this.setState({
        txAddrWarning: I18n.t('input_receive_address'),
      })
      return
    }else if(parseFloat(txValue) + 0.01 > parseFloat(currentAssetValue)){
      Alert.alert(I18n.t('low_than_balence'))
      return
    }else{
      if(txValue.length === 0){
        this.setState({
          txValueWarning: I18n.t('input_send_account')
        })
        return
      }else{
        this.setState({
          visible: true
        })
      }
    }
        
  }

  toScan = () => {
    let a = '',
        b = '';
    this.props.dispatch(passReceiveAddressAction(a,b))
    this.props.navigator.push({
      screen: 'scan_qr_code',
      title:I18n.t('scan'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: Object.assign({},DetailNavigatorStyle,{
        navBarTextColor:'#fff',
        navBarBackgroundColor:'#000',
        statusBarColor:'#000',
        statusBarTextColorScheme:'light',
      }),
      passProps:{
        curToken: this.state.currentTokenName
      }
    })
  }
  showTokenPicker = () => {
    Picker.show()
  }
  onPressClose = () => {
    Keyboard.dismiss()
    this.setState({
      visible: false,
      modalSetp1: true,
      txPsdVal: '',
      loadingText: '',
      // loadingVisible: false,
    })
  }

  onPressCloseIcon = () => {
    if(this.state.modalSetp1){
      this.onPressClose()
    }else{
      this.setState({
        modalSetp1: true,
        modalTitleText:I18n.t('send_detail'),
        modalTitleIcon: require('../../images/xhdpi/nav_ico_paymentdetails_close_def.png'),
      })
    }
  }

  onPressOrderModalBtn = () => {
    this.setState({
      modalTitleText: I18n.t('send_psd'),
      modalTitleIcon: require('../../images/xhdpi/nav_ico_createaccount_back_def.png'),
      modalSetp1: false
    })
  }
  onPressPayBtn = () => {
    
    const { txPsdVal, txPsdWarning, loadingText } = this.state
    Keyboard.dismiss();
    if(txPsdVal.length === 0){
      this.setState({
        txPsdWarning: I18n.t('input_password'),
        loadingText: '',
      })
      return
    }else{
      this.props.dispatch(showLoadingAction(true,I18n.t('sending')))
      this.setState({
        // loadingText: I18n.t('sending'),
        visible: false,
        modalSetp1: true,
      })

      

      this.validatPsd()
    }
  }
  validatPsd = () => {
   
    try{

      this.makeTransact()

    } catch(err){
      console.log('psd error',err)
      this.setState({
        visible: false,
        modalSetp1: true,
        txPsdVal: '',
        txPsdWarning: I18n.t('password_is_wrong'),
        loadingText: '',
        // loadingVisible: false,
      })
    }
  }
  makeTransact(){
    const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,gasValue,currentTokenName } = this.state
    const { fetchTokenList,etzBalance } = this.props.tokenManageReducer 

      if(!this.state.isToken){
        // this.makeTransactByETZ()
        this.props.dispatch(insert2TradingDBAction({
          tx_hash: '',
          tx_value: txValue,
          tx_sender: `0x${senderAddress}`,
          tx_receiver: receiverAddress,
          tx_note: noteVal,
          tx_token: "ETZ",
          tx_result: -1,
          currentAccountName: `0x${senderAddress}`,
          tx_random:  Math.round(Math.random() * 10000)
        }))
      }else{
        // this.makeTransactByToken()
        let tokenRandom = Math.round(Math.random() * 10000)

        this.props.dispatch(insert2TradingDBAction({
          tx_hash: '',
          tx_value: txValue,
          tx_sender: `0x${senderAddress}`,
          tx_receiver: receiverAddress,
          tx_note: noteVal,
          tx_token: currentTokenName,
          tx_result: -1,
          currentAccountName: `0x${senderAddress}`,
          tx_random:  tokenRandom
        }))
        this.props.dispatch(insert2TradingDBAction({
          tx_hash: '',
          tx_value: '0.00',
          tx_sender: `0x${senderAddress}`,
          tx_receiver: receiverAddress,
          tx_note: noteVal,
          tx_token: "ETZ",
          tx_result: -1,
          currentAccountName: `0x${senderAddress}`,
          tx_random:  tokenRandom,
          isToken: true//这条是代币插入
        }))
      }
  }

  onChangePayPsdText = (val) => {
    this.setState({
      txPsdVal: val,
      txPsdWarning: ''
    })
  }
  onPressBack = () => {
    this.props.navigator.popToRoot({
      animated: true, 
      animationType: 'fade', 
    })
  }
  render(){
    const { receiverAddress, txValue, noteVal,visible,modalTitleText,modalTitleIcon,txPsdVal,
            modalSetp1,txAddrWarning,txValueWarning,senderAddress,txPsdWarning,currentTokenName, gasValue } = this.state
    

    
    return(
      <View style={pubS.container}>
        <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
        <LoadingModal/>  
        <NavHeader
          navTitle={I18n.t('send')}
          pressBack={this.onPressBack}
          toScan={this.toScan}
        />
          
        
          <TextInputComponent
            value ={currentTokenName}
            editable={false}
            toMore={true}
            touchable={true}
            onPressTouch={this.showTokenPicker}
          />
          <TextInputComponent
            placeholder={I18n.t('receiver_address')}
            value={receiverAddress}
            onChangeText={this.onChangeToAddr}
            warningText={txAddrWarning}
            //isScan={true}
            //onPressIptRight={this.toScan}
          />
          <TextInputComponent
            placeholder={I18n.t('amount')}
            value={txValue}
            onChangeText={this.onChangeTxValue}
            warningText={txValueWarning}
            keyboardType={'numeric'}
            //amount={splitDecimal(this.state.currentAssetValue)} 
          />
          <TextInputComponent 
            placeholder={I18n.t('note_1')}
            value={noteVal}
            onChangeText={this.onChangeNoteText}
          />
          <View style={[styles.gasViewStyle,pubS.rowCenterJus]}>
            <Text style={{color:'#C7CACF',fontSize: setScaleText(26)}}>Gas:</Text>
            <Text>{gasValue}</Text>
          </View>

        <Btn
          btnMarginTop={scaleSize(60)}
          btnPress={this.onNextStep}
          btnText={I18n.t('next')}
        />
        {
          <Modal
            isVisible={visible}
            onBackButtonPress={this.onPressClose}
            onBackdropPress={this.onPressClose}
            style={styles.modalView}
            backdropOpacity={.8}
          >
            <View style={[styles.modalView,{marginBottom: modalSetp1 ? 0 : 10}]}>
              <View style={[styles.modalTitle,pubS.center]}>
                <TouchableOpacity onPress={this.onPressCloseIcon} activeOpacity={.7} style={styles.modalClose}>
                  <Image source={modalTitleIcon} style={{height: scaleSize(30),width: scaleSize(30)}}/>
                </TouchableOpacity>
                <Text style={pubS.font26_4}>{modalTitleText}</Text>
              </View>
              {
                modalSetp1 ?
                <View>
                  <RowText
                    rowTitle={I18n.t('order_note')}
                    rowContent={noteVal}
                  />
                  <RowText
                    rowTitle={I18n.t('to_address')}
                    rowContent={receiverAddress}
                  />
                  <RowText
                    rowTitle={I18n.t('from_address')}
                    rowContent={`0x${senderAddress}`}
                  />
                  <RowText
                    rowTitle={I18n.t('amount_1')}
                    rowContent={txValue}
                    rowUnit={currentTokenName}
                  />

                  <Btn
                    btnPress={this.onPressOrderModalBtn}
                    btnText={I18n.t('confirm')}
                    btnMarginTop={scaleSize(50)}
                  />
                </View>
                :
                <View>
                  <TextInputComponent
                    placeholder={I18n.t('password')}
                    value={txPsdVal}
                    onChangeText={this.onChangePayPsdText}
                    warningText={txPsdWarning}
                    secureTextEntry={true}
                    autoFocus={true}
                  />
                  <Btn
                    btnPress={this.onPressPayBtn}
                    btnText={I18n.t('make_send')}
                    btnMarginTop={scaleSize(50)}
                  />
                </View>
              }
            </View>
          </Modal>
        }
          
        
         
         
      </View>
    )
  }
}
class RowText extends Component{
  static defaultProps = {
    rowUnit: '',
  }
  render(){
    const { rowTitle,rowContent, rowUnit} = this.props
    return(
      <View style={[styles.rowTextView,pubS.rowCenterJus]}>
        <Text style={[pubS.font26_5,{width:'20%'}]}>{rowTitle}</Text>
        <View style={[pubS.rowCenterJus,{width: '80%',}]}>
          <Text style={[pubS.font26_4,{marginLeft: scaleSize(40)}]}>{rowContent}</Text>
          {
            rowUnit.length > 0 ?
            <Text style={pubS.font26_4}>{rowUnit}</Text>
            : null
          }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    
    gasViewStyle:{
      ...ifIphoneX(
        {
          paddingLeft: 4,
          alignSelf:'center',
          width: 355,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor:'#DBDFE6',
          height: scaleSize(99)
        },
        {
          paddingLeft: 4,
          alignSelf:'center',
          width: scaleSize(680),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor:'#DBDFE6',
          height: scaleSize(99)
        },
        {
          paddingLeft: 4,
          alignSelf:'center',
          width: scaleSize(680),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor:'#DBDFE6',
          height: scaleSize(99)
        }
      )

    },
    rowTextView:{
      ...ifIphoneX(
        {
          width: 345,
          height: scaleSize(88),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: '#DBDFE6',
          alignSelf:'center'
        },
        {
          width: scaleSize(680),
          height: scaleSize(88),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: '#DBDFE6',
          alignSelf:'center'
        },
        {
          width: scaleSize(680),
          height: scaleSize(88),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: '#DBDFE6',
          alignSelf:'center'
        }
      )

    },
    modalTitle:{
      height: scaleSize(88),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor:'#F2F2F2',
      borderWidth:1,
    },
    modalView:{
      width: scaleSize(750),
      height: scaleSize(710),
	    position: 'absolute',
	    bottom: 0,
	    alignSelf: 'center',
	    backgroundColor:'#fff',
    },
    modalClose:{
      ...ifIphoneX(
        {position:'absolute',left: 50,top: scaleSize(29)},
        {position:'absolute',left: scaleSize(24),top: scaleSize(29)},
        {position:'absolute',left: scaleSize(24),top: scaleSize(29)}
      )
    }
})

export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer,
    tokenManageReducer: state.tokenManageReducer,
    tradingManageReducer: state.tradingManageReducer,
  })
)(Payment)
