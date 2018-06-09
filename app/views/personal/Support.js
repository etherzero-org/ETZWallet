import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import { TextInputComponent,Loading } from '../../components/'
// import Mailer from 'react-native-mail'
import I18n from 'react-native-i18n'
class Support extends Component{
  constructor(props){
    super(props)
    this.state = {
      emaiVal: '',
      eNameWarning: '',
      contentVal: '',
      contentWarning: '',
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  onNavigatorEvent(event){
    if (event.type == 'NavBarButtonPress') {
      switch(event.id){
        case 'send_email':
          this.sendEmail()
          break
        default:
          break
      }
    }
  }

  sendEmail = () => {
    // const { emaiVal, contentVal } = this.state
    // let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    // if(!reg.test(emaiVal)){
    //   this.setState({
    //     eNameWarning: 'please input correct email'
    //   })
    // }else{
    //   if(contentVal.length === 0){
    //     this.setState({
    //       contentWarning: 'please input your problem'
    //     })
    //   }else{
    //     this.onSend()
    //   }
    // }
  }
    
  // sendEmail = () => {
  //   Mailer.mail({
  //     subject: 'need help',
  //     recipients: ['liujiantao86@foxmail.com'],
  //     //ccRecipients: ['supportCC@example.com'],
  //     //bccRecipients: ['supportBCC@example.com'],
  //     body: '<b>A Bold Body</b>',
  //     isHTML: true,
  //     attachment: {
  //       path: '',  // The absolute path of the file from which to read data.
  //       type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
  //       name: '',   // Optional: Custom filename for attachment
  //     }
  //   }, (error, event) => {
  //     Alert.alert(
  //       error,
  //       event,
  //       [
  //         {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
  //         {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
  //       ],
  //       { cancelable: true }
  //     )
  //   })


  // ToastAndroid.show('sendEmail==',3000)

  // }
  onChangeEName = (val) => {
    this.setState({
      emaiVal: val,
      eNameWarning: ''
    })
  }
  onChangelContent = (val) => {
    this.setState({
      contentVal: val,
      contentWarning: ''
    })
  }
  render(){
    const { emaiVal, eNameWarning, contentVal, contentWarning, } = this.state
    return(
      <View style={{flex:1,backgroundColor:'#fff'}}>  
        {
          Platform.OS === 'ios' ?
          <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
          : null
        }
        <TextInputComponent
          placeholder={I18n.t('your_email')}
          value={emaiVal}
          onChangeText={this.onChangeEName}
          warningText={eNameWarning}
        />
        <TextInputComponent
          isMultiline={true}
          placeholder={I18n.t('input_des_problem')}
          value={contentVal}
          onChangeText={this.onChangelContent}
          warningText={contentWarning}
          iptMarginTop={scaleSize(60)}
        />
      </View>
    )
  }
}
export default Support
