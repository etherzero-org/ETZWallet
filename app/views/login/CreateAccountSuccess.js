import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import { Btn } from '../../components/'
import { toHome } from '../../root'
import I18n from 'react-native-i18n'
import { onExitApp } from '../../utils/exitApp'
class CreateAccountSuccess extends Component{
  constructor(props){
    super(props)
    this.state = {
      userName: '',
      address: '',
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
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
  onNavigatorEvent(event){
    // if (event.type == 'NavBarButtonPress') {
    //   if(event.id === 'backPress'){
    //       toHome()
    //   }
    // }
    // if(event.type == 'ScreenChangedEvent'){   //成功后点击返回到首页
    //   if(event.id == 'willDisappear'){
    //     toHome()
    //   }
    // }
  }


  onPressBackUp = () => {
    toHome()
  }
  render(){
    return(
      <View style={pubS.container}>
        <View style={{alignItems:'center'}}>
          <Image source={require('../../images/xhdpi/ico_createaccount_succeed.png')} style={styles.imgStyle}/>
          <Text style={[pubS.font36_1,{marginTop: scaleSize(70),textAlign:'center',}]}>{I18n.t('create_account_successful_1')}</Text>
          <Text style={[pubS.font26_2,{width:'90%',marginTop: scaleSize(27),textAlign:'center',lineHeight:25,}]}>{I18n.t('create_account_successful_2')}</Text>
          <Btn
            btnMarginTop={scaleSize(97)}
            btnPress={this.onPressBackUp}
            btnText={I18n.t('backup_now')}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imgStyle:{
    width: scaleSize(150),
    height: scaleSize(150),
    alignSelf:'center',
    marginTop: scaleSize(100),

  },
})
export default CreateAccountSuccess
