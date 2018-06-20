import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Button,
  Platform,
  NativeModules,
  StatusBar
} from 'react-native'
import { toHome, toLogin} from '../root'
import { connect } from 'react-redux'

import { DetailNavigatorStyle} from '../styles/'

import I18n from 'react-native-i18n'

import accountDB from '../db/account_db'
import { platform } from 'os';
import * as launchImage from 'react-native-launch-image';

class Splash extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  
  componentWillMount(){
    // this.onDelete()
    // this.onDrop3()
    // this.onDrop1()
    // this.onDrop2()

    // localStorage.remove({
    //   key: 'lang'
    // })
    
    localStorage.load({
      key: 'lang',
      autoSync: true,
    }).then( ret => {
      I18n.locale  = `${ret.selectedLan}`
    }).catch (err => {
      // this.setDefaultLang()
    })
  }



  onDrop1 = () => {
    accountDB.dropTable({
      sql: 'drop table token'
    })
  }
  onDrop2 = () => {
    accountDB.dropTable({
      sql: 'drop table account'
    })
  }
  onDrop3 = () => {
    accountDB.dropTable({
      sql: 'drop table trading'
    })
  }
  
  componentDidMount(){
    this.getAccounts()
  } 
  async getAccounts(){
    let res = await accountDB.selectTable({
      sql: 'select id,address,account_name from account',
      parame: []
    })
    if(res.length === 0){
      //还没有账户信息
      toLogin()  
      launchImage.hide();
      return;
      //此时  没有任何账户信息  

    }else{
      console.log('select语句结果',res)

      this.updateAssetsTotal(res)

    }
  }
  async updateAssetsTotal(infos){
    let updateRes = false
    for(let i = 0; i < infos.length; i ++){
      let balance = await web3.eth.getBalance(`0x${infos[i].address}`)
      let newTotal = web3.utils.fromWei(balance,'ether')

      updateRes = await accountDB.updateTable({
        sql: 'update account set assets_total = ? where account_name = ?',
        parame:[newTotal, infos[i].account_name]
      })
    }

    console.log('更新结果',updateRes)
    if(updateRes === 'success'){
      // setTimeout(() => {
      toHome()
      launchImage.hide();
      return;
      // },1000)
    }else{
      console.log('还没有更新完')
    }
  }
  // setDefaultLang = () => {
  //   I18n.locale  = 'en-US'
  //   localStorage.save({
  //     key: 'lang',
  //     data:{
  //       selectedLan: 'en-US'
  //     }
  //   })
  // }


  render(){
  	return(
      <View style={{flex:1}}>
        {
          Platform.OS === 'ios' ?
          <StatusBar backgroundColor="#FFFFFF"  barStyle="light-content" hidden={true} />
          : null
        }
         {
           Platform.OS == 'ios' ?
           null :
           <Image source={require('../images/xhdpi/splash.png')} style={{width: '100%', height:'100%'}}/>
         }
      </View>
  	)
  }
}
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(Splash)
