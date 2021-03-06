import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'

import { pubS,DetailNavigatorStyle,MainThemeNavColor } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import RecordListItem from './tradingRecord/RecordListItem'
import { splitNumber,sliceAddress,timeStamp2Date } from '../../utils/splitNumber'
import TradingSQLite from '../../utils/tradingDB'
import UserSQLite from '../../utils/accountDB'
const tradingSqLite = new TradingSQLite()  
let t_db
const sqLite = new UserSQLite();  
let db  
import I18n from 'react-native-i18n'
class AssetDetailList extends Component{
  constructor(props){
    super(props)
    this.state = {
      listData: []
    }
  }

  componentDidMount(){
   
    


    if(!t_db){
      t_db = tradingSqLite.open()
    }
    if(!db){
      db = sqLite.open()
    }

    db.transaction((tx) => {
      tx.executeSql("select * from account where is_selected = 1",[],(tx,results)=>{
        let aName = results.rows.item(0).account_name
        t_db.transaction((tx)=>{  
            tx.executeSql("select * from trading where tx_account_name = ?", [aName],(tx,t_results)=>{  
              let len = t_results.rows.length 
              let list = []
              for(let i=0; i<len; i++){  
                let u = t_results.rows.item(i)
                if(u.tx_token === this.props.curToken){
                  list.push(u)
                }
              }
              this.setState({
                listData: list
              })
            })
        },(error)=>{

        })
      })
    },(error) => {

    })

    
  }





  toTradingRecordDetail = (res) => {
    this.props.navigator.push({
      screen: 'trading_record_detail',
      title:I18n.t('tx_records_1'),
      navigatorStyle: MainThemeNavColor,
      passProps: {
        detailInfo: res
      }
    })
  }
  renderItem = (item) => {
    let res = item.item
    
    return(
      <RecordListItem
        style={{marginBottom: scaleSize(10)}}
        listIcon={res.tx_result === 1 ? require('../../images/xhdpi/lab_ico_selectasset_payment_def.png') : require('../../images/xhdpi/lab_ico_selectasset_error_def.png')}
        listIconStyle={{width: scaleSize(20),height:scaleSize(20)}}
        onPressListItem={() => this.toTradingRecordDetail(res)}
        receiverAddress={sliceAddress(res.tx_receiver)}
        receiverTime={timeStamp2Date(res.tx_time)}
        receiverVal={res.tx_value}
        unit={this.props.curToken}
        payFail={res.tx_result === 1 ? false : true}
      />
    )
  }
  ListHeaderComponent = () => {
    const { etzBalance, etz2rmb } = this.props
      return(
        <View style={[styles.listViewStyle,pubS.center]}>
          <Text style={pubS.font72_1}>{splitNumber(etzBalance)}</Text>
          <Text style={pubS.font26_3}>{`≈ ¥ 0`}</Text>
        </View>
      ) 
  }
  payBtn = () => {
    this.props.navigator.push({
      screen: 'on_payment',
      title:I18n.t('send'),
      navigatorStyle: DetailNavigatorStyle,
      passProps:{
        curToken: this.props.curToken
      }
    })
  }
  collectBtn = () => {
    this.props.navigator.push({
      screen: 'on_receive',
      title:I18n.t('receive'),
      navigatorStyle: DetailNavigatorStyle,
    })
  }
  ListEmptyComponent = () => {
    return(
      <View style={{marginTop: 10,alignItems:'center'}}>
        <Text>{I18n.t('no_tx_info')}</Text>
      </View>
    )
  }
  render(){
    console.log('交易列表',this.state.listData)
    return(
      <View style={[pubS.container,{backgroundColor:'#F5F7FB'}]}>
        <View style={{marginBottom: scaleSize(96)}}> 
          <FlatList
            data={this.state.listData}
            renderItem={this.renderItem}
            keyExtractor = {(item, index) => index}
            ListHeaderComponent={this.ListHeaderComponent}
            ListEmptyComponent={this.ListEmptyComponent}
          />
        </View>
        <View style={[styles.bottomBtnStyle,pubS.rowCenter]}>
          <TouchableOpacity activeOpacity={.7} onPress={this.payBtn} style={[styles.btnStyle,{backgroundColor:'#FFAA3B'},pubS.center]}>
            <Text style={pubS.font30_3}>{I18n.t('send')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.7} onPress={this.collectBtn} style={[styles.btnStyle,{backgroundColor:'#FF9844'},pubS.center]}>
            <Text style={pubS.font30_3}>{I18n.t('receive')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btnStyle:{
    width: '50%',
    height: scaleSize(96),
  },
  bottomBtnStyle:{
    width: scaleSize(750),
    height: scaleSize(96),
    position:'absolute',
    bottom: 0,
  },
  listViewStyle:{
    height: scaleSize(280),
    backgroundColor: '#144396',
  },
})
export default AssetDetailList
