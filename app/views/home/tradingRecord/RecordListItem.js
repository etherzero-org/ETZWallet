import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../../utils/adapter'
import I18n from 'react-native-i18n'
class RecordListItem extends Component{
  static defaultProps = {
    moneyTextColor: '#657CAB',
    listIcon: require('../../../images/xhdpi/etz_logo.png'),
    style: {},
    listIconStyle: {width: scaleSize(44),height:scaleSize(44)},
    onPressListItem: undefined,
    payStatus: 1,//支付状态 1 0 -1
  }
  render(){
    const { moneyTextColor,listIcon,style,listIconStyle, onPressListItem, receiverAddress, receiverTime, receiverVal,unit, payStatus} = this.props

    let payText = ''
    switch(payStatus){
      case -1:
        payText = I18n.t('sending')
        break
      case 0:
        payText = I18n.t('send_failure')
        break
      case 1:
        payText = '转账成功'
        break
      default:
        break
    }

    return(
      <TouchableOpacity style={[styles.container,pubS.rowCenterJus,pubS.padding50,style]} activeOpacity={ onPressListItem ? .7 : 1 } onPress={onPressListItem}>
        <Image source={listIcon} style={listIconStyle}/>
        <View style={[styles.listItemTextView,pubS.rowCenterJus]}>
          <View style={[{height:'100%',justifyContent:'space-between'},pubS.paddingCloumn20]}>
            <Text style={pubS.font28_3}>{receiverAddress}</Text>
            <Text style={pubS.font24_4}>{receiverTime}</Text>
          </View>

          <View style={[styles.sendPrice,pubS.paddingCloumn20,payStatus === 1 ? pubS.center:null]}>
            <Text style={{fontSize: setScaleText(28),color:moneyTextColor}}>{`${receiverVal} ${unit}`}</Text>              
              {
                payStatus === 1 ? null : <Text style={pubS.font24_1}>{payText}</Text>
              }
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  listItemTextView:{
    ...ifIphoneX(
      {
        width: 375,
        height: scaleSize(130),
        marginLeft: scaleSize(18)
        // borderWidth:1,
      },
      {
        width: scaleSize(600),
        height: scaleSize(130),
        marginLeft: scaleSize(18)
        // borderWidth:1,
      },
      {
        width: scaleSize(600),
        height: scaleSize(130),
        marginLeft: scaleSize(18)
        // borderWidth:1,
      }
    )

  },
  container: {
    ...ifIphoneX(
      {
        height: scaleSize(130),
        width: 375,
        backgroundColor:'#fff',
      },
      {
        height: scaleSize(130),
        width: scaleSize(750),
        backgroundColor:'#fff',
      },
      {
        height: scaleSize(130),
        width: scaleSize(750),
        backgroundColor:'#fff',
      }
    )
  },
  sendPrice:{
    ...ifIphoneX(
      {height:'100%',justifyContent:'space-between',alignItems:'flex-end',marginRight:80},
      {height:'100%',justifyContent:'space-between',alignItems:'flex-end'},
      {height:'100%',justifyContent:'space-between',alignItems:'flex-end'},
    )
  }
})
export default RecordListItem
