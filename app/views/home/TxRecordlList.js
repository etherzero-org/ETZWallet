import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  ScrollView,
  BackHandler
} from 'react-native'

import { pubS,DetailNavigatorStyle,MainThemeNavColor } from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../utils/adapter'
import RecordListItem from './tradingRecord/RecordListItem'
import { splitNumber,sliceAddress,timeStamp2Date } from '../../utils/splitNumber'
import { Navigation } from 'react-native-navigation'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import accountDB from '../../db/account_db'
import {Loading } from '../../components/'
class TxRecordlList extends Component{
  constructor(props){
    super(props)
    this.state = {
      recordList: [],
      loadingVisible: true
    }
     // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentWillMount(){
    this.getRecordList()  
     
  }


  componentWillReceiveProps(nextProps){
    const { txEtzStatus,txEtzHash } = nextProps.txReducer

    if(this.props.txReducer.txEtzStatus !== txEtzStatus){
        this.setState({
          loadingVisible: true,
        })
        if(!!txEtzStatus){
          //执行一条update语句  更新
          this.updatePending(1,txEtzHash)
        }else{
          this.updatePending(0,txEtzHash)
        }
        
    }
  }

  // onNavigatorEvent(event) {
  //   switch (event.id) {
  //     case 'willAppear':
  //       this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  //       break;
  //     case 'willDisappear':
  //       this.backHandler.remove()
  //       break;
  //     default:
  //       break;
  //   }

  // }
  // handleBackPress = () => {
  //   console.log('返回1111111')
  //   this.props.navigator.popToRoot({ animated: false })
  // }

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
      this.getRecordList()
    }else{
      if(updateRes === 'fail'){
         console.log('updatePending失败')
        this.getRecordList()
      }
    }

    
  }

  async getRecordList(){
    const { currentAccount, globalAccountsList } = this.props.accountManageReducer
    //根据当前账户(0x${currentAccount.address} = tx_sender)地址查找 交易记录
    //token name
    let selRes = await accountDB.selectTable({
      sql: 'select * from trading where tx_sender = ? and tx_token = ? ORDER BY id DESC',//按id降序排列
      parame: [`0x${currentAccount.address}`,this.props.curToken]
    })

    this.setState({
      recordList: selRes,
      loadingVisible: false
    })

  }

  toTradingRecordDetail = (res) => {
    this.props.navigator.push({
      screen: 'trading_record_detail',
      title:I18n.t('tx_records_1'),
      navigatorStyle: MainThemeNavColor,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      passProps: {
        detailInfo: res,
        fromList: 'list'
      }
    })
  }
  renderItem = (item) => {
    let res = item.item
    let icon = require('../../images/xhdpi/etz_logo.png')
    switch(res.tx_result){
      case 0:
        icon = require('../../images/xhdpi/lab_ico_selectasset_error_def.png')
        break
      case 1:
        icon = require('../../images/xhdpi/lab_ico_selectasset_payment_def.png')
        break
      case -1:
        icon = require('../../images/xhdpi/tx_list_pending.png')
        break
      default:
        break
    }
    return(
      <RecordListItem
        style={{marginBottom: scaleSize(10)}}
        listIcon={icon}
        listIconStyle={{width: scaleSize(20),height:scaleSize(20)}}
        onPressListItem={res.tx_result !==-1 ? () => this.toTradingRecordDetail(res) : () => {return}}
        receiverAddress={sliceAddress(res.tx_receiver)}
        receiverTime={res.tx_result !==-1 ? timeStamp2Date(res.tx_time) : timeStamp2Date(`${Date.parse(new Date())/1000}.`)}
        receiverVal={res.tx_value}
        unit={this.props.curToken}
        payStatus={res.tx_result}
      />
    )
  }

  ListHeaderComponent = () => {
    const { etzBalance, etz2rmb } = this.props
      return(
        <View style={[styles.listViewStyle,pubS.center]}>
          <Text style={pubS.font72_1}>{splitNumber(etzBalance)}</Text>
          {
            //<Text style={pubS.font26_3}>{this.props.currencySymbol}</Text>
          }
          
        </View>
      ) 
  }



  payBtn = () => {    
    this.props.navigator.push({
      screen: 'on_payment',
      title:I18n.t('send'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: Object.assign({},DetailNavigatorStyle,{
        navBarHidden: true
      }),
      passProps:{
        curToken: this.props.curToken,
        curDecimals:this.props.curDecimals
      }
    })
  }
  collectBtn = () => {
    this.props.navigator.push({
      screen: 'on_receive',
      title:I18n.t('receive'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }
  ListEmptyComponent = () => {
    return(
      <View style={{marginTop: 10,alignItems:'center'}}>
        <Text style={pubS.font24_4}>{I18n.t('no_tx_info')}</Text>
      </View>
    )
  }
  render(){
    console.log('交易列表',this.state.recordList)
    return(
      <View style={[styles.container,{backgroundColor:'#F5F7FB'}]}>
        <Loading loadingVisible={false} loadingText={I18n.t('loading')}/>   
        <View style={{marginBottom: scaleSize(96)}}> 
          <ScrollView>
            <FlatList
              data={this.state.recordList}
              renderItem={this.renderItem}
              keyExtractor = {(item, index) => index}
              ListHeaderComponent={this.ListHeaderComponent}
              ListEmptyComponent={this.ListEmptyComponent}
            />
          </ScrollView>
        </View>
        <View style={[styles.bottomBtnStyle,pubS.rowCenter]}>
          <TouchableOpacity activeOpacity={.7} onPress={this.payBtn} style={[styles.btnStyle,{backgroundColor:'#ffa93b'},pubS.center]}>
            <Text style={pubS.font30_3}>{I18n.t('send')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.7} onPress={this.collectBtn} style={[styles.btnStyle,{backgroundColor:'#ff6f51'},pubS.center]}>
            <Text style={pubS.font30_3}>{I18n.t('receive')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...ifIphoneX(
      {
        flex: 1,
        width:375
      },
      {
        flex: 1,
        // width: scaleSize(750),
      },
      {
        flex: 1,
        // width: scaleSize(750),
      }
    )

  },
  btnStyle:{
    width: '50%',
    height: scaleSize(96),
  },
  bottomBtnStyle:{
    ...ifIphoneX(
      {
        width: 375,
        height: scaleSize(96),
        position:'absolute',
        bottom: 0,
      },
      {
        width: scaleSize(750),
        height: scaleSize(96),
        position:'absolute',
        bottom: 0,
      },
      {
        width: scaleSize(750),
        height: scaleSize(96),
        position:'absolute',
        bottom: 0,
      }
    )
  },
  listViewStyle:{
    height: Platform.OS === 'ios' ? scaleSize(270) : scaleSize(300),
    // height: scaleSize(280),
    backgroundColor: '#144396',
  },
})
export default connect(
  state => ({
    tradingManageReducer: state.tradingManageReducer,
    accountManageReducer: state.accountManageReducer,
    txReducer: state.txReducer,
  })
)(TxRecordlList)
