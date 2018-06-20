import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native'
import { Navigation } from 'react-native-navigation'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import QRCodeScanner from 'react-native-qrcode-scanner'
import I18n from 'react-native-i18n'
import { passReceiveAddressAction } from '../../actions/accountManageAction'
import { connect } from 'react-redux'
class ScanQrCode extends Component{
  constructor(props){
    super(props)

  }
  
  onSuccess = (e) => {
    
    if(this.props.fromHome){
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
          scanSucAddr: e.data,
        }
      })
    }else{
      this.props.dispatch(passReceiveAddressAction(e.data,this.props.curToken))
      this.props.navigator.pop()
    }
  }

  onCancel = () => {
    this.props.navigator.pop()
  }
  render(){
    return(
        <View style={pubS.container}>
          <QRCodeScanner
            onRead={this.onSuccess}
            bottomContent={(
              <TouchableOpacity activeOpacity={.7} onPress={this.onCancel}>
                <Text style={pubS.font54_1}>{I18n.t('cancel')}</Text>
              </TouchableOpacity>
            )}
            customMarker={(
              <View style={{height:scaleSize(390),width:scaleSize(390),alignSelf:'center'}}>
              
              </View>
            )}
            cameraStyle={{backgroundColor:'transparent'}}
            containerStyle={{backgroundColor:'#000'}}
            topViewStyle={{backgroundColor:'#000'}}
            bottomViewStyle={{backgroundColor:'#000'}}
          />
        </View>
    )
  }
}

const styles = StyleSheet.create({

});

export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(ScanQrCode)
