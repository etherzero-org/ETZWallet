import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
  RefreshControl,
  Button,
  BackHandler,
  StatusBar,
  Alert,
  AppState,
} from 'react-native'

import { pubS,DetailNavigatorStyle,MainThemeNavColor,ScanNavStyle } from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX, } from '../../utils/adapter'
import Drawer from 'react-native-drawer'
import { connect } from 'react-redux'
import SwitchWallet from './SwitchWallet'
import { switchDrawer } from '../../utils/switchDrawer'

import { splitDecimal, scientificToNumber} from '../../utils/splitNumber'
import {Scan} from '../../components/'

import { insertToTokenAction,initSelectedListAction,refreshTokenAction,fetchTokenAction } from '../../actions/tokenManageAction'
import { insert2TradingDBAction } from '../../actions/tradingManageAction'
import { resetTxStatusAction } from '../../actions/txAction'
import I18n from 'react-native-i18n'
import Toast from 'react-native-toast'


import { Navigation } from 'react-native-navigation'

import accountDB from '../../db/account_db'

import { globalAllAccountsInfoAction,globalCurrentAccountInfoAction } from '../../actions/accountManageAction'
let etzTitle = "ETZ"

class Assets extends Component{
  constructor(props){
    super(props)
    this.state = {
      navTitle: '',
      selectedAssetsList: [],
      isRefreshing: false,
      curAddr: '',
      currencySymbol: '',
      currentAppState: AppState.currentState,
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentWillMount(){
    // Navigation.dismissAllModals({
    //   animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    // })

    this.props.navigator.setTabButton({
      tabIndex: 0,
      label: I18n.t('assets')
    })
    this.props.navigator.setTabButton({
      tabIndex:1,
      label: I18n.t('mine')
    })
    this.setState({
      isRefreshing: false
    })
    
    localStorage.load({
      key: 'lang',
      autoSync: true,
    }).then( ret => {
      this.setCurrencySymbol(ret.selectedLan)
    }).catch (err => {

    })

    this.getAllAccounts()
  }
  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  onNavigatorEvent(event) {
    if (event.id === 'bottomTabSelected') {
        this.onCloseDrawer()
    }
    if (event.id === 'bottomTabReselected') {
      this.onCloseDrawer()
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
        break;
    }

  }
   handleBackPress = () => {
    if (this.backPressed && this.backPressed > 0) {
      this.props.navigator.popToRoot({ animated: false });
      return false;
    }

    this.backPressed = 1;
    Toast.showLongBottom(I18n.t('click_again')) 
    // this.props.navigator.showSnackbar({
    //   text: 'Press one more time to exit',
    //   duration: 'long',
    // });
    return true;
  }

  setCurrencySymbol(symbol){
    switch(symbol){
      case 'zh-CN':
        this.setState({
          currencySymbol: '¥',
        })
        break
      case 'en-US':
        this.setState({
          currencySymbol: '$',
        })
        break
      case 'ru-RU':
        this.setState({
          currencySymbol: '₽',
        })
        break
      default:
        break
    }
  }
  async getAllAccounts(){
    const { fetchTokenList } = this.props.tokenManageReducer
    //所有的账户数据
    let findAccountsList = await accountDB.selectTable({
      sql: 'select * from account',
      parame: []
    })
    this.props.dispatch(globalAllAccountsInfoAction(findAccountsList))

    findAccountsList.map((value,index) => {
      if(value.is_selected === 1){
        this.props.dispatch(refreshTokenAction(value.address,fetchTokenList))
       
        this.setState({
          navTitle: value.account_name,
          curAddr: value.address,
          isRefreshing: true
        })

        
        //当前账户信息
        this.props.dispatch(globalCurrentAccountInfoAction(value))
        //初始化 已经选择的token list (选中之后 再退出) 也就是初始化 fetchTokenList
        this.props.dispatch(initSelectedListAction())
        return;
      }
      return;
    })
  }



  componentWillReceiveProps(nextProps){
 
    const { fetchTokenList } = this.props.tokenManageReducer

    //刷新
    const { refreshEnd} = nextProps.tokenManageReducer

    switch(refreshEnd){
      case 'start':
        this.setState({
          isRefreshing: true
        })
        break
      case 'suc':
        this.setState({
          isRefreshing: false
        })
        break
      case 'fail':
        this.setState({
          isRefreshing: false
        })
        default:
          break
    }
    
    //删除了当前账号  需要更新reducers里的当前账号
    const { globalAccountsList, currentAccount } = nextProps.accountManageReducer
    if(this.props.accountManageReducer.deleteCurrentAccount !== nextProps.accountManageReducer.deleteCurrentAccount && nextProps.accountManageReducer.deleteCurrentAccount){
      this.props.dispatch(globalCurrentAccountInfoAction(globalAccountsList[0]))
      this.props.dispatch(refreshTokenAction(globalAccountsList[0].address,fetchTokenList))
      this.setState({
        navTitle: globalAccountsList[0].account_name
      })
    }
    //切换账号
    if(this.props.accountManageReducer.currentAccount.account_name !== currentAccount.account_name){
      this.setState({
        navTitle: currentAccount.account_name,
        curAddr: currentAccount.address
      })
      return;
    }

    //交易状态

    const { txEtzStatus,txEtzHash, txErrorMsg,txErrorOrder } = nextProps.txReducer
    if(this.props.txReducer.txEtzStatus !== txEtzStatus){
      let sendResult = 1
      if(txEtzStatus === 1){
         this.props.dispatch(refreshTokenAction(this.state.curAddr,fetchTokenList))
          //更新轉賬狀態
         this.updatePending(1,txEtzHash)
         Alert.alert(I18n.t('send_successful'))
       }else{
         sendResult = 0
          if(!!txErrorOrder){
            this.updatePending(0,txEtzHash)
          }else{
            this.deletePending()
          }
         Alert.alert(txErrorMsg)
         return
       }
      this.props.dispatch(resetTxStatusAction())
    }
  }

  async deletePending(){
    let delRes = await accountDB.deleteAccount({
      sql: 'delete from trading where tx_result = -1',
      d_id: [],
    })
  }

  async updatePending(status,hash){

    let tx = await web3.eth.getTransaction(hash)
    let txBlock  = await web3.eth.getBlock(tx.blockNumber)
     console.log('更新hash值',txBlock)
    let block = txBlock.number
    let time = txBlock.timestamp


    let updateRes = await accountDB.updateTable({
      sql: 'update trading set tx_result = ?,tx_time = ?,tx_hash = ?,tx_block_number = ? where tx_result = -1 ',
      parame: [status,time,hash,block]
    })
    if(updateRes === 'success'){
      console.log('updatePending成功')

    }else{
      if(updateRes === 'fail'){
         console.log('updatePending失败')

      }
    }
    
  }

  componentWillUnmount(){
    this.onCloseDrawer()
    AppState.removeEventListener('change', this._handleAppStateChange);

  }
  _handleAppStateChange = (nextAppState) => {
    if(nextAppState === 'active'){
      console.log('开始刷新',nextAppState)
      this.getAllAccounts()
    }
  }
  toAssetsDetail = (title,balance,token,deci) => {
    this.props.navigator.push({
      screen: 'tx_record_list',
      title,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: MainThemeNavColor,
      passProps:{
        etzBalance: balance,
        etz2rmb: 0,
        curToken: token,
        currencySymbol: this.state.currencySymbol,
        curDecimals: deci
      }
    })
  }

  onScan = () => {
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
      passProps: {
        fromHome:true
      }
    })
  }

  onPay = () => {
    this.props.navigator.push({
      screen: 'on_payment',
      title:I18n.t('send'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: Object.assign({},DetailNavigatorStyle,{
        navBarHidden: true
      }),
      passProps:{
        curToken: 'ETZ',
        currencySymbol: this.state.currencySymbol,
      }
    })
  }
  onCollection = () => {
    this.props.navigator.push({
      screen: 'on_receive',
      title:I18n.t('receive'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }
  onTradingRecord = () => {
    this.props.navigator.push({
      screen: 'trading_record',
      title:I18n.t('tx_records'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: Object.assign({},MainThemeNavColor,{navBarNoBorder:true}),
      // navigatorButtons: {
      //   rightButtons: [
      //     {
      //       icon: require('../../images/xhdpi/nav_ico_transactionrecords_picker_def.png'),
      //       id: 'calendar_picker'
      //     }
      //   ]
      // }
    })
  }
  
  addAssetsBtn = () => {
    this.props.navigator.push({
      screen: 'add_assets',
      title:I18n.t('add_assets'),
      navigatorStyle: DetailNavigatorStyle,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      // navigatorButtons: {
      //   rightButtons: [
      //     {
      //       id: 'search_token',
      //       icon: require('../../images/xhdpi/nav_search_addasset_def.png')
      //     }
      //   ]
      // }
    })
  }

  onDrawerCloseStart = () => {
    switchDrawer(false)
  }
  onDrawerOpenStart = () => {
    switchDrawer(true)
  }
  
  onCloseDrawer = () => {
    this._drawer.close()
  }
  onLeftDrawer = () => {
    this.props.navigator.push({
      screen:'msg_center_list',
      title:I18n.t('msg_center'),
      navigatorStyle: DetailNavigatorStyle,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorButtons: {
        rightButtons: [
          {
              title:'Readed All',
              id: 'readed_all'
          }
        ],
      },
    })
  }

  onRightDrawer = () => {
    this._drawer.open()
  }

  onRefresh = () => {
    const { fetchTokenList } = this.props.tokenManageReducer
    this.setState({
        isRefreshing: true
    })
    //这里的下拉刷新  更新etz和代币的余额
    this.props.dispatch(refreshTokenAction(this.state.curAddr,fetchTokenList))
  }

  onBindPhone = () => {
    this.props.navigator.push({
      screen: 'bind_phone',
      title:I18n.t('bind_phone'),
      navigatorStyle: DetailNavigatorStyle,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
    })
    // this.props.navigator.push({
    //         screen: 'recom_prize',
    //         title:I18n.t('recom_prize'),
    //         navigatorStyle: DetailNavigatorStyle,
    //         backButtonTitle:I18n.t('back'),
    //         backButtonHidden:false,
    //         passProps: {
    //           inviteCode: '12345678'
    //         }
    //     })
  }

  onReceiveCandy = () => {
    this.props.navigator.push({
      screen: 'receive_candy',
      title:'领取',
      navigatorStyle: DetailNavigatorStyle,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
    })
  }
  render(){
    const { selectedAssetsList, isRefreshing, currencySymbol} = this.state
    
    const { currentAccount, globalAccountsList } = this.props.accountManageReducer
    const { fetchTokenList,etzBalance } = this.props.tokenManageReducer
    // console.log('etzBalance  render===',etzBalance)
    // console.log('deviceWidth  render===',deviceWidth)
    // console.log('deviceHeight  render===',deviceHeight)

    return(
      <View style={styles.containerView}>
        {
          Platform.OS === 'ios' ? 
          <View style={styles.stateBar}/>
          : null
        }     
        <Drawer
          ref={(ref) => this._drawer = ref}
          type="overlay"
          openDrawerOffset={0.4}
          side={'right'}
          tapToClose={true}
          content={<SwitchWallet thisPorps={this} onCloseSwitchDrawer={this.onCloseDrawer}/>}
          onCloseStart={this.onDrawerCloseStart}
          onOpenStart={this.onDrawerOpenStart}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
                tintColor={"#144396"}
                title={I18n.t('loading')}
                // titleColor="#00ff00"
                colors={['#fff']}
                progressBackgroundColor={"#1d53a6"}
              />
            }
          >
            <View style={[styles.navbarStyle,pubS.rowCenterJus,{paddingLeft: scaleSize(24),paddingRight: scaleSize(24)}]}>
              {
                // <TouchableOpacity activeOpacity={.6} onPress={this.onLeftDrawer}>
                //   <Image source={require('../../images/xhdpi/nav_ico_home_message_def.png')}style={styles.navImgStyle}/>
                // </TouchableOpacity>
                
              // <TouchableOpacity activeOpacity={.6} onPress={this.onReceiveCandy} style={{width: scaleSize(160),height: scaleSize(87),justifyContent:'center'}}> 
              //   <Text style={pubS.font26_1}>领取</Text>
              // </TouchableOpacity>
              }
              <View style={{width: scaleSize(160),height: scaleSize(87),justifyContent:'center'}}>
              </View>
              <Text style={[pubS.font30_1,{}]}>{this.state.navTitle}</Text>
              <TouchableOpacity activeOpacity={.6} onPress={() => this.onRightDrawer()} style={[styles.drawerStyle,{}]}>
                <Image source={require('../../images/xhdpi/nav_ico_home_more_def.png')} style={styles.navImgStyle}/>
              </TouchableOpacity>
            </View>
            <View>
              <View style={[styles.assetsTotalView,pubS.center,{height: Platform.OS === 'ios' ? scaleSize(260) : scaleSize(300)}]}>
                  <Text style={pubS.font72_1}>{splitDecimal(etzBalance)}</Text>
                  <Text style={pubS.font26_3}>{I18n.t('total_assets')}</Text>
              </View>

              <View style={[styles.optionView,pubS.center]}>
                  <View style={[pubS.rowCenterJus,styles.listItemBox]}>
                    <TouchableOpacity activeOpacity={.7} onPress={this.onScan} style={[styles.optionItem]}>
                      <Image source={require('../../images/xhdpi/btn_ico_home_scan_def.png')} style={styles.itemImageStyle}/>
                      <Text style={[pubS.font24_2,]}>{I18n.t('scan')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} onPress={this.onPay} style={[styles.optionItem]}>
                      <Image source={require('../../images/xhdpi/btn_ico_home_payment_def.png')} style={styles.itemImageStyle}/>
                      <Text style={[pubS.font24_2,]}>{I18n.t('send')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} onPress={this.onCollection} style={[styles.optionItem]}>
                      <Image source={require('../../images/xhdpi/btn_ico_home_collection_def.png')} style={styles.itemImageStyle}/>
                      <Text style={[pubS.font24_2,]}>{I18n.t('receive')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} onPress={this.onTradingRecord} style={[styles.optionItem]}>
                      <Image source={require('../../images/xhdpi/btn_ico_home_transactionrecords_def.png')} style={styles.itemImageStyle}/>
                      <Text style={[pubS.font24_2,]}>{I18n.t('tx_records')}</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
            <AssetsItem
              shortName={etzTitle}
              fullName={'EtherZero'}
              coinNumber={splitDecimal(etzBalance)}
              //price2rmb={0}
              symbol={this.state.currencySymbol}
              onPressItem={() => this.toAssetsDetail(etzTitle,splitDecimal(etzBalance),'ETZ',0)}
            />
            {
              fetchTokenList.map((res,index) => {
                // console.log('res.account_addr===',res.account_addr)
                // console.log('currentAccount.address=',currentAccount.address)
                if(res.tk_selected === 1 && (res.account_addr === currentAccount.address)){
                  return(
                    <AssetsItem
                      key={index}
                      shortName={res.tk_symbol}
                      fullName={res.tk_name}
                      coinNumber={scientificToNumber(splitDecimal(res.tk_number)) }
                      //price2rmb={0}
                      symbol={this.state.currencySymbol}
                      onPressItem={() => this.toAssetsDetail(res.tk_symbol,splitDecimal(res.tk_number),res.tk_symbol,res.tk_decimals)}
                    />
                  )
                }
              })
            }
            <TouchableOpacity style={[styles.whStyle,styles.addBtnStyle,pubS.center]} activeOpacity={.7} onPress={this.addAssetsBtn}>
              <Text style={pubS.font24_3}>{`+ ${I18n.t('add_assets')}`}</Text>
            </TouchableOpacity>
          </ScrollView>
        </Drawer>
          
        
      </View>
    )
  }
}

class AssetsItem extends Component {
  render(){
    const { shortName, fullName, coinNumber, price2rmb, onPressItem} = this.props
    return(
      <TouchableOpacity style={[styles.listItemView,styles.whStyle]} activeOpacity={.7} onPress={onPressItem}>
        <Image source={require('../../images/xhdpi/etz_logo.png')} style={pubS.logoStyle}/>
        <View style={[styles.listItemTextView,pubS.rowCenterJus]}>
          <View>
            <Text style={pubS.font36_2}>{shortName}</Text>
            <Text style={[pubS.font24_2]}>{fullName}</Text>
          </View>
          <View>
            <Text style={pubS.font36_2}>{coinNumber}</Text> 
          </View>
            {
          //<View style={pubS.rowCenterJus}>
              //<Text style={pubS.font24_2}>{`≈ ${this.props.symbol}${price2rmb}`}</Text>
          //</View>
            }
        </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  containerView:{
    backgroundColor:'#F5F7FB',
    flex:1,
  },
  stateBar:{ 
    ...ifIphoneX(
      {
        height: 44,
        backgroundColor:'#144396'
      },
      {
        height: scaleSize(46),
        backgroundColor:'#144396'
      }
    )
  },
  drawerStyle:{
    // borderColor:'#fff',
    // borderWidth:1,
    height: scaleSize(87),
    width: scaleSize(160),
    // position:"absolute",
    // top: 0,
    // right:scaleSize(24),
    alignItems:'flex-end',
    justifyContent:'center'
  },
  navImgStyle: {
    width:scaleSize(40),
    height: scaleSize(40)
  },
  navbarStyle:{
    height: scaleSize(87),
    backgroundColor: '#144396',
  },
  addBtnStyle:{
    borderStyle:'dashed',
    borderColor:'#B1CBFF',
    borderWidth: 1,
    borderRadius:4,
    marginTop: scaleSize(20),
    alignSelf:'center',
  },
  logoStyle:{
    ...ifIphoneX({
      width: 27,
      height:27,
      marginTop: 16
    },
    {
      width: scaleSize(44),
      height:scaleSize(44),
      marginTop: scaleSize(22)
    },
    {
      width: scaleSize(44),
      height:scaleSize(44),
      marginTop: scaleSize(22)
    }
    )
  },
  whStyle: {
    ...ifIphoneX(
      {
        width:scaleSize(580),
        height: scaleSize(120)
      },
      {
        width:scaleSize(702),
        height: scaleSize(120)
      },
      {
        width:scaleSize(702),
        height: scaleSize(120)
      }
    )

  },
  listItemTextView:{
    ...ifIphoneX(
      {
        width: 293,
        marginLeft:scaleSize(18),
        // paddingTop: scaleSize(15),
        // paddingBottom: scaleSize(22),
      },
      {
        width: scaleSize(618),
        marginLeft:scaleSize(18),
        // paddingTop: scaleSize(15),
        // paddingBottom: scaleSize(22),
      },
      {
        width: scaleSize(618),
        marginLeft:scaleSize(18),
        // paddingTop: scaleSize(15),
        // paddingBottom: scaleSize(22),
        // borderColor:'red',
        // borderWidth:1,
      }
    )
    
    
  },
  listItemBox:{
    ...ifIphoneX(
      {
        width:345,
        alignSelf:'center',
        flex:1,
      },
      {
        width:scaleSize(650),
        alignSelf:'center',
        flex:1,
      },
      {
        width:scaleSize(650),
        alignSelf:'center',
        flex:1,
      }
  )
  },
  listItemView:{
    backgroundColor:'#fff',
    ...ifIphoneX({marginLeft:30,marginRight:30},{paddingLeft: scaleSize(22),paddingRight: scaleSize(22)},{paddingLeft: scaleSize(22),paddingRight: scaleSize(22)}),
    justifyContent:'center',
    flexDirection:'row',
    borderRadius: 4,
    alignSelf:'center',
    marginTop: scaleSize(20),
  },
  itemImageStyle:{
    height: scaleSize(90),
    width: scaleSize(90)
  },
  optionItem: {

    alignItems:'center',
    // borderColor:'blue',
    // borderWidth:1,
  },
  optionView: {
    height: scaleSize(180),
    paddingLeft: scaleSize(50),
    paddingRight: scaleSize(50),
    backgroundColor:'#fff',
    // borderColor:'red',
    // borderWidth:1,
    ...ifIphoneX({
      width: 375,
      alignSelf:'center'
    })
  },
  assetsTotalView: {
    
    backgroundColor:'#144396',
    // backgroundColor:'red',

  }
})
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer,
    tokenManageReducer: state.tokenManageReducer,
    txReducer: state.txReducer
  })
)(Assets)
