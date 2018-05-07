import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native'

import { pubS } from '../../../styles/'
import { setScaleText, scaleSize, ifIphoneX } from '../../../utils/adapter'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view'
import  PrivateKey from './PrivateKey'
import KeyStore from './KeyStore'
import Mnemonic from './Mnemonic'
import { connect } from 'react-redux'
import { toHome } from '../../../root'
import { resetDeleteStatusAction } from '../../../actions/accountManageAction'
import { Loading } from '../../../components/' 
import I18n from 'react-native-i18n'
import Toast from 'react-native-toast'
class ImportAccount extends Component{
  constructor(props){
    super(props)
    this.state={
      visible: false
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.accountManageReducer.importLoading !== this.props.accountManageReducer.importLoading){
      if(nextProps.accountManageReducer.importLoading){
        this.setState({
          visible: true
        })
      }else{
        this.setState({
          visible: false
        })
      }
    }

    if(nextProps.accountManageReducer.importStatus !== this.props.accountManageReducer.importStatus){
      this.setState({
        visible: false
      })
      if(nextProps.accountManageReducer.importStatus === 'success'){
        Toast.showLongBottom(I18n.t('import_successful'))
          setTimeout(() => {
            toHome()
          },100)
        
      }else{
        if(nextProps.accountManageReducer.importStatus === 'fail'){
          Toast.showLongBottom(I18n.t('import_fail'))
        }
      }
    }
  }

  render(){
    const { importSucc } = this.props.accountManageReducer
    return(
      <View style={pubS.container}>
        {
          Platform.OS === 'ios' ?
            <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
          : null
        }

        <Loading loadingVisible={this.state.visible} loadingText={'importing'}/>
          
        <ScrollableTabView
          style={styles.TabViewStyle}
          tabBarActiveTextColor={'#2B8AFF'}
          tabBarInactiveTextColor={'#CACED4'}
          tabBarTextStyle={{fontSize: setScaleText(26)}}

          renderTabBar={() => (
            <DefaultTabBar
              underlineStyle={[styles.underlineStyle]}  
              tabBarBackgroundColor={'#fff'}
              style={styles.tabBarStyle}
              tabStyle={{ paddingTop: 10, height: 45, zIndex: 999, }}
            />
          )}
        >
            <Mnemonic key={1} tabLabel={I18n.t('mnemonic_phrase')} thisProps={this} fromLogin={this.props.fromLogin}/>
            <KeyStore key={2} tabLabel={"Keystore"} thisProps={this} fromLogin={this.props.fromLogin}/>
            <PrivateKey key={3} tabLabel={I18n.t('private_key')} thisProps={this} fromLogin={this.props.fromLogin}/>
        </ScrollableTabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  TabViewStyle:{
    ...ifIphoneX(
      {
        width:375
      },
      {
        width: scaleSize(750)
      },
      {
        width: scaleSize(750)
      }
    )
  },
  underlineStyle: {
    borderColor: '#2B8AFF',
    backgroundColor: '#2B8AFF',
    borderBottomWidth:3,
    height:0,
  },
  tabBarStyle:{
    ...ifIphoneX(
      {
         width: 375,
         alignItems: 'center',
         backgroundColor: '#fff',
         borderColor:'transparent',
         marginBottom:-1
      },
      {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor:'transparent',
        marginBottom:-1
      },
      {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor:'transparent',
        marginBottom:-1
      }
    )
  }
})

export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(ImportAccount)