import React, { Component } from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { pubS } from '../styles/'
import { setScaleText, scaleSize, ifIphoneX } from '../utils/adapter'
export default class TextInputComponent extends Component{
  constructor(props){
    super(props)
    this.state = {
      multiline: false,
      iptMarginTop: 0,
    }
  }
  static defaultProps = {
    isScan: false,
    toMore: false,
    coinUnit: '',
    touchable: false,
    amount: ''
  }
  componentWillMount(){
    this.setState({
      multiline: this.props.isMultiline
    })
  }

  render(){
    const { warningText,iptMarginTop,isScan,onPressIptRight,toMore,coinUnit,touchable,onPressTouch,amount } = this.props
    const { multiline} = this.state
    
    return(
      <TouchableOpacity
        activeOpacity={touchable ? .7 : 1} 
        onPress={touchable ? onPressTouch : () => {return}} 
        >
          <View 
            pointerEvents={touchable ? 'none' : 'auto'}
            style={[styles.textInputView,{ borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0, marginTop: iptMarginTop,height: multiline ? scaleSize(190) :scaleSize(99)}]}
          >
            
          
          <TextInput
            clearButtonMode={'while-editing'}
            multiline={multiline}
            style={[styles.textIptStyle,{borderColor: multiline ? '#DBDFE6' : 'transparent',borderWidth: multiline ? StyleSheet.hairlineWidth : 0}]}
            placeholderTextColor={'#C7CACF'}
            underlineColorAndroid={ multiline ? 'transparent' : '#DBDFE6'}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...this.props}
          />
          {
            amount.length > 0 ? 
              <Text>{amount}</Text>
            : null
          }
          {
            toMore ?
            <View style={pubS.arrowViewStyle}>
              <Image source={require('../images/xhdpi/btn_ico_payment_select_def.png')} style={{width: scaleSize(16),height: scaleSize(30)}}/>
            </View>
            : null
          }
          {
            // <TouchableOpacity activeOpacity={.7} onPress={onPressIptRight} style={{position:'absolute',right:4,top:scaleSize(32),}}>
            //   {
            //     isScan ?
            //     <Image source={require('../images/xhdpi/btn_ico_payment_scan_def.png')} style={{width: scaleSize(45),height: scaleSize(43)}}/>
            //     : null
            //   }
            //   {
            //     coinUnit.length > 0 ?
            //     <Text style={pubS.font26_4}>{coinUnit}</Text>
            //     : null
            //   }
            // </TouchableOpacity>
          }
          <Text style={[pubS.font24_1,{marginTop: multiline ? 0 : -8,marginLeft: 4}]}>{warningText}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({

  textInputView: {
    ...ifIphoneX(
      {
        borderColor:'#DBDFE6',
        alignSelf:'center',
        width: 360,
        backgroundColor: '#fff',
        // borderWidth:1,
        // borderColor:'red',
      },
      {
        borderColor:'#DBDFE6',
        padding: 0,
        alignSelf:'center',
        width: scaleSize(680),
        backgroundColor: '#fff',
        // borderWidth:1,
        // borderColor:'red',
      },
      {
        borderColor:'#DBDFE6',
        alignSelf:'center',
        padding: 0,
        width: scaleSize(680),
        backgroundColor: '#fff',
        paddingTop: scaleSize(20),
        // borderWidth:1,
        // borderColor:'red',
      }
    )

  },

  textIptStyle: {
    // borderColor:'red',
    // borderWidth:1,
    padding: 0,
    paddingLeft: 4,
    flex: 1,
    fontSize: setScaleText(26),
    // width: scaleSize(680),
    color:'#657CAB'
  },
})
