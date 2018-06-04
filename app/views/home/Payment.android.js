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
  StatusBar,
  BackHandler,
} from 'react-native'



import { pubS,DetailNavigatorStyle,MainThemeNavColor,ScanNavStyle } from '../../styles/'
import { setScaleText, scaleSize, ifIphoneX } from '../../utils/adapter'
import { TextInputComponent,Btn,Loading, } from '../../components/'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Picker from 'react-native-picker'
import { insert2TradingDBAction } from '../../actions/tradingManageAction'
import { refreshTokenAction } from '../../actions/tokenManageAction'
import { passReceiveAddressAction } from '../../actions/accountManageAction'
import { contractAbi } from '../../utils/contractAbi'
import I18n from 'react-native-i18n'
import { getTokenGas, getGeneralGas } from '../../utils/getGas'
import { fromV3 } from '../../utils/fromV3'
import { scientificToNumber } from '../../utils/splitNumber'
const EthUtil = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet')
const EthereumTx = require('ethereumjs-tx')

let self = null

import Toast from 'react-native-toast'
import { platform } from 'os';


class Payment extends Component{
  constructor(props){
    super(props)
    this.state={
      receiverAddress: '0xFC2708Fc317e6f6298A5Dc79b7e2342a2b763909',
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
      loadingVisible: false,
      loadingText: '',
      gasValue: '',
      currentAccountName: '',
      currentTokenAddress: '',
    }
    self = this
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }
  
  onNavigatorEvent(event){
     // if(event.id === 'backPress'){


        // if(this.props.receive_address){
        //   this.props.navigator.popToRoot({
        //     animated: true, 
        //     animationType: 'fade'
        //   })
        // }
     // }

     switch (event.id) {
      case 'willAppear':
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        break;
      case 'willDisappear':
        this.backHandler.remove();
        break;
      default:
        break;
    }

  } 
   handleBackPress = () => {
    this.props.navigator.popToRoot({ animated: false });
     
    return true;
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
    if(this.props.receive_address){
      this.setState({
        receiverAddress: this.props.receive_address
      })
    } 

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

  }
  componentDidMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)

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
    console.log('this.props.accountManageReducer.scanAddress==',this.props.accountManageReducer.scanAddress)
    if(this.props.accountManageReducer.scanAddress !== scanAddress && scanAddress.length > 0){
      this.setState({
        receiverAddress: scanAddress,
        currentTokenName: scanCurToken
      })
    }
  }

  componentWillUnmount(){
    // this.onPressClose()
    Picker.hide()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }
  


   _keyboardDidShow = () => {
      this.refs._scroll.scrollToEnd({animated: true})
  }

  _keyboardDidHide =() => {

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

    // let numVal = parseFloat(txValue)
    // let ruleNum = Math.pow(0.1,currentTokenDecimals).toFixed(currentTokenDecimals)//最小的值
    // if(numVal < ruleNum){
    //   // Alert.alert('不能小于规定的小数位')
    //   return
    // }else{
      if(receiverAddress.length === 42 && txValue.length > 0){
        if(this.state.currentTokenName === 'ETZ'){

          let genGasValue = await getGeneralGas(txValue,senderAddress,receiverAddress)

          // console.log('genGasValue==',genGasValue)
          this.setState({
            gasValue: genGasValue,
          })

        }else{
          let tokenGasValue = await getTokenGas(senderAddress,receiverAddress,currentTokenName,currentTokenDecimals,txValue,currentTokenAddress)
          // console.log('tokenGasValue==',tokenGasValue)
          this.setState({
            gasValue: tokenGasValue,
          })
        }
      }
    // }

  }
  onNextStep = () => {
    const { receiverAddress, txValue, noteVal, } = this.state
    let addressReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{42}$/
    if(!addressReg.test(receiverAddress)){
      this.setState({
        txAddrWarning: I18n.t('input_receive_address'),
      })
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
      loadingVisible: false,
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
    
    const { txPsdVal, txPsdWarning, loadingText,loadingVisible } = this.state
    if(txPsdVal.length === 0){
      Keyboard.dismiss();
      this.setState({
        txPsdWarning: I18n.t('input_password'),
        loadingText: '',
        loadingVisible: false,
      })
      return
    }else{
      this.setState({
        loadingText: I18n.t('sending'),
        loadingVisible: true,
        visible: false,
        modalSetp1: true,
      })
      setTimeout(() => {
        this.validatPsd()
      },1000)
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
        loadingVisible: false,
      })
    }
  }
  makeTransact(){
      if(!this.state.isToken){
        this.makeTransactByETZ()
      }else{
        this.makeTransactByToken()
      }
  }
  async makeTransactByETZ(){
    const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,gasValue } = this.state
    const { fetchTokenList } = this.props.tokenManageReducer 
    try{  
      let newWallet = await fromV3(this.state.keyStore,txPsdVal)
      let privKey = newWallet.privKey.toString('hex')
      console.log('privKey==',privKey)
      let bufPrivKey = new Buffer(privKey, 'hex')
      // console.log('bufPrivKey==',bufPrivKey)
      let nonceNumber = await web3.eth.getTransactionCount(`0x${senderAddress}`)

      console.log('txValue==',txValue)
      let totalValue = web3.utils.toWei(txValue,'ether')
      let hex16 = parseInt(totalValue).toString(16)

      
      
      const txParams = {
          nonce: `0x${nonceNumber.toString(16)}`,
          gasPrice: '0x09184e72a000', 
          gasLimit: `0x${parseFloat(gasValue).toString(16)}`,
          to: receiverAddress,
          value: `0x${hex16}`,
          data: '',
          chainId: 88
      }
      console.log('txParams====',txParams)
      const tx = new EthereumTx(txParams)
      tx.sign(bufPrivKey)
      const serializedTx = tx.serialize()
      console.log('serializedTx==',serializedTx)

      
      let hashVal = ''
      web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
      .on('transactionHash', function(hash){
        console.log('hash==',hash)
        hashVal = hash
        let passDetailInfo = {
          tx_value: txValue,                         
          tx_token: 'ETZ',                               
          tx_sender: `0x${senderAddress}`,               
          tx_receiver: receiverAddress,                  
          tx_note: noteVal,                              
          tx_hash: hash,                              
          tx_block_number: 0,                            
          tx_time: '',  
          tx_result: 1
        }
        self.onPressClose()
       self.props.navigator.push({                          
         screen: 'trading_record_detail',                   
         title:I18n.t('tx_records_1'),                      
         navigatorStyle: MainThemeNavColor, 
         passProps: {  
          detailInfo:passDetailInfo,
         }                                                  
       })                                                   


      })
      .on('receipt', function(receipt){
          console.log('receipt==',receipt)
          let sendResult = 1
          if(receipt.status==="0x1" || receipt.status == true){
              //更新etz数量
               self.props.dispatch(refreshTokenAction(senderAddress,fetchTokenList))
               setTimeout(() => {
                 Alert.alert(I18n.t('send_successful'))
               },1000)
           }else{
             sendResult = 0
             Alert.alert(I18n.t('send_failure'))
           }
          

          self.props.dispatch(insert2TradingDBAction({
            tx_hash: hashVal,
            tx_value: txValue,
            tx_sender: `0x${senderAddress}`,
            tx_receiver: receiverAddress,
            tx_note: noteVal,
            tx_token: "ETZ",
            tx_result: sendResult,
            currentAccountName: `0x${senderAddress}`
          }))
      })
      // .on('confirmation', function(confirmationNumber, receipt){ 
        
      // })
      .on('error', (error) => {
        console.log('error==',error)
        Alert.alert(`${error}`)
        self.onPressClose()
        self.props.navigator.pop()
      })
    }catch(error){
      this.onPressClose()
      Alert.alert(error)
    }
  }
  async makeTransactByToken(){
    
    const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,currentTokenName,currentTokenDecimals,currentTokenAddress,gasValue } = this.state
    const { fetchTokenList } = this.props.tokenManageReducer 

    try{
      let newWallet = await fromV3(this.state.keyStore,txPsdVal)
      let privKey = newWallet.privKey.toString('hex')
      
      let txNumber = parseFloat(txValue) *  Math.pow(10,currentTokenDecimals)
      
      let txNum = ''
      if(/e/.test(`${txNumber}`)){
        let t = scientificToNumber(`${txNumber}`.replace('+',''))
        txNum = `${t}`
      }else{
        txNum = `${txNumber}`
      }
      console.log('txNum==',txNum)
      
      let hex16 = parseInt(txNum).toString(16)      
      console.log('hex16',hex16)
      let myContract = new web3.eth.Contract(contractAbi, currentTokenAddress)

      let data = myContract.methods.transfer(receiverAddress, `0x${hex16}`).encodeABI()

      web3.eth.getTransactionCount(`0x${senderAddress}`, function(error, nonce) {
        let gas = parseFloat(gasValue) + 500
        const txParams = {
            nonce: web3.utils.toHex(nonce),
            gasPrice:"0x098bca5a00",
            gasLimit: `0x${gas.toString(16)}`,
            to: currentTokenAddress,
            value :"0x0",
            data: data,
            chainId: "0x58"
        }
        console.log("txParams:", txParams)

        const tx = new EthereumTx(txParams)
        // 通过明文私钥初始化钱包对象key
        const privateKey = Buffer.from(privKey, 'hex')

        let key = Wallet.fromPrivateKey(privateKey)

        
        tx.sign(key.getPrivateKey())

        var serializedTx = '0x' + tx.serialize().toString('hex')

        console.log("serializedTx: ", serializedTx)
        
        let hashVal = ''
        web3.eth.sendSignedTransaction(serializedTx).on('transactionHash', function(hash){
            console.log('transactionHash:', hash)
            hashVal = hash

            let passDetailInfo = {
              tx_value: txValue,                         
              tx_token: currentTokenName,                               
              tx_sender: `0x${senderAddress}`,               
              tx_receiver: receiverAddress,                  
              tx_note: noteVal,                              
              tx_hash: hash,                              
              tx_block_number: 0,                            
              tx_time: '',  
              tx_result: 1
            }

            self.onPressClose()

            self.props.navigator.push({                          
               screen: 'trading_record_detail',                   
               title:I18n.t('tx_records_1'),                      
               navigatorStyle: MainThemeNavColor, 
               passProps: {  
                detailInfo:passDetailInfo,
               }                                                  
            })

        })
        // .on('confirmation', function(confirmationNumber, receipt){
            // console.log('confirmation:', confirmationNumber)
            
        // })
        .on('receipt', function(receipt){
            console.log('receipt:', receipt)
            let sendResult = 0
            if(receipt.status==="0x1" || receipt.status == true){
              sendResult = 1
              self.props.dispatch(refreshTokenAction(senderAddress,fetchTokenList))
              setTimeout(() => {
                Alert.alert(I18n.t('send_successful'))
              },1000)
            }else{
              Alert.alert(I18n.t('send_failure'))
            }
            

            self.props.dispatch(insert2TradingDBAction({
              tx_hash: hashVal,
              tx_value: txValue,
              tx_sender: `0x${senderAddress}`,
              tx_receiver: receiverAddress,
              tx_note: noteVal,
              tx_token: currentTokenName,
              tx_result: sendResult,
              currentAccountName: `0x${senderAddress}`
            }))
            self.props.dispatch(insert2TradingDBAction({
              tx_hash: hashVal,
              tx_value: '0.00',
              tx_sender: `0x${senderAddress}`,
              tx_receiver: receiverAddress,
              tx_note: noteVal,
              tx_token: "ETZ",
              tx_result: sendResult,
              currentAccountName: `0x${senderAddress}`
            }))

        }).on('error', (error) => {
          console.log(error)
          self.onPressClose()
          self.props.navigator.pop()
          Alert.alert(`${error}`,)

          // alert(error)
        });
      })

    }catch (error) {
      this.onPressClose()
      Alert.alert(error)
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
        <Loading loadingVisible={this.state.loadingVisible} loadingText={this.state.loadingText}/>   
          <View style={[styles.navbarStyle,pubS.rowCenterJus,{paddingLeft: scaleSize(24),paddingRight: scaleSize(24)}]}>
          <TouchableOpacity activeOpacity={.6} onPress={this.onPressBack} style={pubS.rowCenter}>
            <Image source={require('../../images/xhdpi/send_page_back_ios.png')}style={styles.navImgStyle}/>
          </TouchableOpacity>
          <View style={{marginLeft: 50}}>
            <Text style={[pubS.font30_2,{}]}>{I18n.t('send')}</Text>
          </View>
          
          <TouchableOpacity activeOpacity={.6} onPress={this.toScan} style={styles.drawerStyle}>
            <Image source={require('../../images/xhdpi/btn_ico_payment_scan_def.png')} style={styles.navImgStyle}/>
          </TouchableOpacity>
        </View>  
          <ScrollView ref={'_scroll'}>     
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
            />
            <TextInputComponent
              placeholder={I18n.t('amount')}
              value={txValue}
              onChangeText={this.onChangeTxValue}
              warningText={txValueWarning}
              keyboardType={'numeric'}
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
            <Modal
              isVisible={visible}
              onBackButtonPress={this.onPressClose}
              onBackdropPress={this.onPressClose}
              style={styles.modalView}
              backdropOpacity={.8}
            >
              <View style={styles.modalView}>
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
          </ScrollView>         
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
  navImgStyle: {
      width:scaleSize(40),
      height: scaleSize(40)
    },
    drawerStyle:{
      height: scaleSize(83),
      width: scaleSize(145),
      justifyContent:'center',
      marginRight: scaleSize(10),
      alignItems:'flex-end',
    },
    navbarStyle:{
      marginTop: scaleSize(30),   
      height: scaleSize(67),
      backgroundColor: '#fff',
    },
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
      marginBottom:0,
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
    tokenManageReducer: state.tokenManageReducer
  })
)(Payment)
