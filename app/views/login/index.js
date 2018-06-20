import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle} from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../utils/adapter'
import I18n from 'react-native-i18n'
import { onExitApp } from '../../utils/exitApp'
class Login extends Component{
  constructor(props){
    super(props)
    this.state= {

    }
  }
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress',this.onBack)
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress',this.onBack)
  }
  onBack = () => {
    onExitApp()
  }
  createAccoumt = () => {

    this.props.navigator.push({
      screen: 'create_account',
      title:I18n.t('create'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: Object.assign({},DetailNavigatorStyle,{navBarNoBorder:true}),
      passProps: { fromLogin: 'login'}
    })
  }

  importAccoumt = () => {

    this.props.navigator.push({
      screen: 'import_account',
      title:I18n.t('import'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
      passProps: { fromLogin: 'login'}
    })
  }
  // termsOfService = () => {
    // this.props.navigator.push({
    //   screen: 'terms_of_service',
    //   title:'服务条款',
    //   navigatorStyle: DetailNavigatorStyle,
    // })
  // }
  render(){

    return(
      <View style={pubS.container}>
        {
          Platform.OS === 'ios' ?
            <StatusBar backgroundColor="#FFFFFF"  barStyle="light-content"  animated={true}/>
          : null
        }
        <Image source={require('../../images/xhdpi/bg_signin.png')} style={[pubS.fullWH,styles.bgStyle]}/>
        <Image source={require('../../images/xhdpi/logo.png')} style={styles.logoStyle}/>
        <View style={styles.btnContainer}>
          <TouchableOpacity activeOpacity={.7} onPress={this.createAccoumt} style={[pubS.center,styles.btnStyle]}>
            <Text style={pubS.font30_1}>{I18n.t('create')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.7} onPress={this.importAccoumt} style={[pubS.center,styles.btnStyle,{marginTop: scaleSize(30)}]}>
            <Text style={pubS.font30_1}>{I18n.t('import')}</Text>
          </TouchableOpacity>
          {

            // <Text style={[pubS.font28_1,{marginTop: scaleSize(48)}]} onPress={this.termsOfService}>服务条款</Text>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bgStyle: {
    // width: scaleSize(750)
    // position: 'absolute',
    // top:0,
    // left:0,
  },
  logoStyle: {
    ...ifIphoneX(
      {
        position:'absolute',
        top: scaleSize(250),
        left: 135 ,
        width: scaleSize(166),
        height: scaleSize(242),
      },
      {
        position:'absolute',
        top: scaleSize(250),
        left: scaleSize(292),
        width: scaleSize(166),
        height: scaleSize(242),
      },
      {
        position:'absolute',
        top: scaleSize(250),
        left: scaleSize(292),
        width: scaleSize(166),
        height: scaleSize(242),
      }
    )
    
  },
  btnContainer:{
    ...ifIphoneX(
      {
        justifyContent:'center',
        position:'absolute',
        top: scaleSize(748),
        width: 376,
        alignItems:'center',
        // borderColor:'red',
        // borderWidth:1,
      },
      {
        justifyContent:'center',
        position:'absolute',
        top: scaleSize(748),
        width: scaleSize(750),
        alignItems:'center',
        // borderColor:'red',
        // borderWidth:1,
      },
      {
        justifyContent:'center',
        position:'absolute',
        top: scaleSize(748),
        width: scaleSize(750),
        alignItems:'center',
        // borderColor:'red',
        // borderWidth:1,
      }
    )
    
  },
  btnStyle: {
    height: scaleSize(94),
    width: scaleSize(610),
    borderRadius: 20,
    backgroundColor:'#2C56A1',

  },
})
export default Login