import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../utils/adapter'
import { connect } from 'react-redux'
import { sliceAddress,splitDecimal } from '../../utils/splitNumber'
import I18n from 'react-native-i18n'
import { refreshManageBalanceAction } from '../../actions/accountManageAction'
class AccountCard extends Component {
  render(){
    const { accountName, accountPsd, accountTotal, accountUnit, accountBackUp, backupState} = this.props
    return(
      <TouchableOpacity style={styles.cardView} activeOpacity={.7} onPress={accountBackUp}>
        <View style={[styles.cardTopView,pubS.bottomStyle,pubS.rowCenterJus]}>
          {
            Platform.OS === 'ios' ?
            <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
            : null
          }
          <View style={[pubS.rowCenter]}>
            <Image source={require('../../images/xhdpi/Penguin.png')} style={{height: scaleSize(55),width: scaleSize(55)}}/>
            <View style={{marginLeft: scaleSize(30)}}>
              <Text style={pubS.font28_3}>{accountName}</Text>
              <Text style={pubS.font22_4}>{accountPsd}</Text>
            </View>
          </View>
          <Image source={require('../../images/xhdpi/btn_ico_payment_select_def.png')} style={{width:scaleSize(16),height: scaleSize(30)}}/>
        </View>
        <View style={[styles.cardBottomView,pubS.rowCenterJus]}>
          {
            backupState===0 ? 
            <View style={[styles.backupBtn,pubS.center]}>
              <Text style={pubS.font22_5}>{I18n.t('not_yet_backup')}</Text>
            </View>
            : <View/>
          }
          <View style={pubS.rowCenter}>
            <Text style={pubS.font34_1}>{accountTotal}</Text>
            <Text style={[pubS.font24_5,{marginLeft: 2,marginTop:2,}]}>{accountUnit}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

class AccountManage extends Component{
  constructor(props){
    super(props)
    this.state = {
      
    } 
  }

  componentWillMount(){
    //更新balance数据
    const { globalAccountsList } = this.props.accountManageReducer
    this.props.dispatch(refreshManageBalanceAction(globalAccountsList))
  }

  componentWillReceiveProps(nextProps){
    if(this.props.accountManageReducer.deleteSuc !== nextProps.accountManageReducer.deleteSuc && nextProps.accountManageReducer.deleteSuc){
      //console.log('删除成功')
    }
    if(this.props.accountManageReducer.updateBackupSucc !== nextProps.accountManageReducer.updateBackupSucc && nextProps.accountManageReducer.updateBackupSucc){
      console.log('更新备份状态成功')
    }
  }

  toDetail = (address,name,id,pro) => {
    const { currentAccount, globalAccountsList } = this.props.accountManageReducer
    this.props.navigator.push({
      screen: 'back_up_account',
      title: name,
      navigatorStyle: DetailNavigatorStyle,
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      // overrideBackPress:true,
      passProps: {
        userName: name,
        address: address,
        b_id: id,
        accountsNumber: globalAccountsList.length,
        currentAccountId: currentAccount.id,
        psdPrompt: pro || ''
      },
      // navigatorButtons: {
      //   rightButtons: [
      //     {
      //       title: 'save',
      //       id: 'save_change'
      //     }
      //   ]
      // }
    })
  }

  createAccountBtn = () => {
    this.props.navigator.push({
      screen: 'create_account',
      title:I18n.t('create'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }
  importAccountBtn = () => {
    this.props.navigator.push({
      screen: 'import_account',
      title:I18n.t('import'),
      backButtonTitle:I18n.t('back'),
      backButtonHidden:false,
      navigatorStyle: DetailNavigatorStyle,
    })
  }

 
  render(){
    const { currentAccount, globalAccountsList } = this.props.accountManageReducer
    return(
      <View style={[pubS.container,{backgroundColor:'#F5F7FB'}]}>
        <View style={{marginBottom: scaleSize(96)}}>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              globalAccountsList.map((res,index) => {
                return(
                  <AccountCard
                    key={index}
                    accountName={res.account_name}
                    accountPsd={sliceAddress(`0x${res.address}`,10)}
                    accountTotal={splitDecimal(res.assets_total)}
                    accountUnit={'ether'}
                    accountBackUp={() => this.toDetail(res.address,res.account_name,res.id,res.password_promp)}
                    backupState={res.backup_status}
                  />
                )
              })
            }
          </ScrollView>
        </View>
        <View style={[{width: '100%',bottom:0,position:'absolute'},pubS.rowCenter]}>
          <TouchableOpacity activeOpacity={.7} onPress={this.createAccountBtn} style={[styles.btnStyle,pubS.center,{backgroundColor:'#2B8AFF'}]}>
            <Text style={pubS.font30_3}>{I18n.t('create')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.7} onPress={this.importAccountBtn} style={[styles.btnStyle,pubS.center,{backgroundColor:'#2B58FF'}]}>
            <Text style={pubS.font30_3}>{I18n.t('import')}</Text>
          </TouchableOpacity>
       </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btnStyle:{
    height: scaleSize(96),
    width: '50%',
  },
  backupBtn:{
    ...ifIphoneX(
      {
        height: scaleSize(34),
        width:scaleSize(88),
        borderWidth:1,
        borderColor: '#FF6060',
        borderRadius: scaleSize(6),
      },
      {
        height: scaleSize(34),
        width:scaleSize(104),
        borderWidth:1,
        borderColor: '#FF6060',
        borderRadius: scaleSize(6),
      },
      {
        height: scaleSize(34),
        width:scaleSize(104),
        borderWidth:1,
        borderColor: '#FF6060',
        borderRadius: scaleSize(6),
      }
    )


  },
  cardBottomView: {
    ...ifIphoneX(
      {
        height: scaleSize(114),
        width: 345,
        alignSelf:'center',
      },
      {
        height: scaleSize(114),
        width: scaleSize(620),
        alignSelf:'center',
      },
      {
        height: scaleSize(114),
        width: scaleSize(620),
        alignSelf:'center',
      }
    )

  },
  cardTopView: {
    ...ifIphoneX(
      {
        height: scaleSize(140),
        width: 345,
        alignSelf:'center',
      },
      {
        height: scaleSize(140),
        width: scaleSize(620),
        alignSelf:'center',
      },
      {
        height: scaleSize(140),
        width: scaleSize(620),
        alignSelf:'center',
      }
    )


  },
  cardView: {
    ...ifIphoneX(
      {
        width: 355,
        height: scaleSize(255),
        backgroundColor: '#fff',
        borderRadius: 4,
        alignSelf:'center',
        marginTop: scaleSize(30),
      },
      {
        width: scaleSize(702),
        height: scaleSize(255),
        backgroundColor: '#fff',
        borderRadius: 4,
        alignSelf:'center',
        marginTop: scaleSize(30),
      },
      {
        width: scaleSize(702),
        height: scaleSize(255),
        backgroundColor: '#fff',
        borderRadius: 4,
        alignSelf:'center',
        marginTop: scaleSize(30),
      }
    )
  },
})
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(AccountManage)
