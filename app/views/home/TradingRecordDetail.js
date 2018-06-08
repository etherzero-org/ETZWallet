//交易记录详情
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  WebView, 
  Clipboard,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../utils/adapter'
import QRCode from 'react-native-qrcode'
import { sliceAddress,timeStamp2FullDate } from '../../utils/splitNumber'
import I18n from 'react-native-i18n'
import Toast from 'react-native-root-toast'
class TextInstructions extends Component{
  static defaultProps = {
    inColor: '#657CAB',
    onPressText: undefined,
  }
  render(){
    const { title, instructions,inColor,onPressText } = this.props
    return(
      <TouchableOpacity onPress={onPressText} activeOpacity={onPressText ? .7 : 1} style={{height: scaleSize(70),justifyContent:'space-between',marginLeft: scaleSize(35),marginTop: scaleSize(20)}}>
        <Text style={pubS.font24_4}>{title}</Text>
        <Text style={{color:inColor,fontSize: setScaleText(24)}} numberOfLines={2}>{instructions}</Text>
      </TouchableOpacity>
    )
  }
}


class TradingRecordDetail extends Component{
  constructor(props){
    super(props)
    this.state = {
      txDetail:{}
    }
  }

  componentDidMount(){
  
    this.setState({
        txDetail: this.props.detailInfo
    })
  }

  toWebView = (hash) => {
    this.props.navigator.push({
      screen: 'tx_web_view',
      title:I18n.t('tx_records'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle:DetailNavigatorStyle,
      passProps: {
        hash,
      }
    })
  }
  onCopyBtn = () => {
    Clipboard.setString(this.props.detailInfo.tx_receiver)
    let t = Toast.show(I18n.t('copy_successfully'))
    setTimeout(() => {
      Toast.hide(t)
    },1000)
  }

  
  render(){
    const { txDetail } = this.state
    console.log('txDetail==222222222222=',txDetail)
    return(
      <View style={pubS.container}>
        {
          Platform.OS == 'ios' ?
          <StatusBar backgroundColor="#FFFFFF"  barStyle="light-content" hidden={false} />
          : null
        }
        <Image source={ txDetail.tx_result === 1 ? require('../../images/xhdpi/ico_selectasset_transactionrecords_succeed.png') : require('../../images/xhdpi/ico_selectasset_transactionrecords_error.png')} style={styles.iocnStyle}/>
        <View style={styles.topView}></View>
        <View style={styles.mainStyle}>
          <View style={[styles.accountStyle,pubS.rowCenter2]}>
            <Text style={pubS.font60_1}>{txDetail.tx_value}</Text>
            <Text style={[pubS.font22_3,{marginLeft: scaleSize(18),marginTop: scaleSize(28)}]}>{txDetail.tx_token}</Text>
          </View>
          <TextInstructions
            title={I18n.t('payer')}
            instructions={txDetail.tx_sender}
          />
          <TextInstructions
            title={I18n.t('payee')}
            instructions={txDetail.tx_receiver}
          />
          <TextInstructions
            title={I18n.t('note')}
            instructions={txDetail.tx_note}
          />

          <View style={[{width: scaleSize(680),alignSelf:'center',marginTop: scaleSize(30),marginBottom: scaleSize(10)},pubS.bottomStyle]}></View>
          <View style={[pubS.rowCenterJus,{paddingRight: scaleSize(35)}]}>
            <View>
              <TextInstructions
                title={I18n.t('tx_number')}
                instructions={ Object.keys(txDetail).length > 0 ? sliceAddress(txDetail.tx_hash,12) : ''}
                inColor={'#2B8AFF'}
                onPressText={() => this.toWebView(txDetail.tx_hash)}
              />
              <TextInstructions
                title={I18n.t('block')}
                instructions={txDetail.tx_block_number}
              />
              <TextInstructions
                title={I18n.t('tx_time')}
                instructions={ Object.keys(txDetail).length > 0 ? timeStamp2FullDate(txDetail.tx_time) : null }
              />
            </View>
            <View style={{marginTop: scaleSize(40)}}>
              <QRCode
                value={txDetail.tx_receiver}
                size={scaleSize(170)}
                bgColor='#000'
                fgColor='#fff'
              />
              <TouchableOpacity onPress={this.onCopyBtn} activeOpacity={.7} style={[styles.btnStyle,pubS.center]}>
                <Text style={pubS.font22_3}>{I18n.t('copy_url')}</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    btnStyle:{
        height: scaleSize(50),
        width: scaleSize(170),
        backgroundColor: '#E3E8F1',
        borderRadius:scaleSize(6),
        marginTop: scaleSize(10)
    },
    iocnStyle:{
      ...ifIphoneX(
        {
          width: scaleSize(100),
          height: scaleSize(100),
          position:'absolute',
          left: 160,
          top: scaleSize(50),
          zIndex: 999,
        },
        {
          width: scaleSize(100),
          height: scaleSize(100),
          position:'absolute',
          left: scaleSize(325),
          top: scaleSize(50),
          zIndex: 999,
        },
        {
          width: scaleSize(100),
          height: scaleSize(100),
          position:'absolute',
          left: scaleSize(325),
          top: scaleSize(50),
          zIndex: 999,
        }
      )

    },
    accountStyle:{
      ...ifIphoneX(
        {
          height: scaleSize(178),
          borderColor:'#DBDFE6',
          borderBottomWidth: StyleSheet.hairlineWidth,
          width: 375,
          alignSelf:'center',
          marginBottom: scaleSize(10),
          // borderWidth:1,
        },
        {
          height: scaleSize(178),
          borderColor:'#DBDFE6',
          borderBottomWidth: StyleSheet.hairlineWidth,
          width: scaleSize(680),
          alignSelf:'center',
          marginBottom: scaleSize(10),
          // borderWidth:1,
        },{
          height: scaleSize(178),
          borderColor:'#DBDFE6',
          borderBottomWidth: StyleSheet.hairlineWidth,
          width: scaleSize(680),
          alignSelf:'center',
          marginBottom: scaleSize(10),
          // borderWidth:1,
        }
      )

    },
    mainStyle:{
       ...ifIphoneX(
         {
          backgroundColor:'#fff',
          width: 375
         },
         {
          backgroundColor:'#fff',
          width: scaleSize(750)
         },
         {
          backgroundColor:'#fff',
          width: scaleSize(750)
         }
       )
    },
    topView:{
      height: scaleSize(100),
      backgroundColor: '#144396',
    },
})

export default TradingRecordDetail
