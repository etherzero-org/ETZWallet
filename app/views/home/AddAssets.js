import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../utils/adapter'
import { connect } from 'react-redux'
import { Loading } from '../../components/'
import { deleteSelectedToListAction, addSelectedToListAction,fetchTokenAction,gloablTokenList } from '../../actions/tokenManageAction'

import I18n from 'react-native-i18n'
import accountDB from '../../db/account_db'

class AddAssets extends Component{
  constructor(props){
    super(props)
    this.state={
      tokenList: [],
      // loadingVisible: false,
      isRefreshing: false,
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentDidMount(){
    this.onFetch()
  }
  componentWillReceiveProps(nextProps){
    if(this.props.tokenManageReducer.fetchTokenList !== nextProps.tokenManageReducer.fetchTokenList){
      this.setState({
        isRefreshing: false
      })
    }
  }
  async onFetch(){
    //fetch token列表 并通过当前账户地址得到 token账户余额
    
    const { currentAccount } = this.props.accountManageReducer
    // console.log('添加资产当前账号currentAccount===',currentAccount)
    let selTokenRes = await accountDB.selectTable({
      sql: 'select * from token where account_addr = ?',
      parame: [currentAccount.address]
    })
    //如果token list已经有数据  那么不需要再去 fetch数据  不需要再去插入数据  只需要将查询到的selTokenRes放在reducers中 全局使用
    //切换账号后需要更新  当前账号下的token list
    // console.log('selTokenRes11111111===',selTokenRes)
    if(selTokenRes.length === 0){
      this.setState({
        isRefreshing: true
      })
      this.props.dispatch(fetchTokenAction(currentAccount.address,false))
    }else{
      this.props.dispatch(gloablTokenList(selTokenRes))
    }

    // const { fetchTokenList } = this.props.tokenManageReducer
    // if(fetchTokenList.length === 0){
    //   this.props.dispatch(fetchTokenAction(currentAccount.address))
    // }else{
    //   this.props.dispatch(gloablTokenList(fetchTokenList))
    // }
  }
  onNavigatorEvent(event){
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'search_token') {
        alert('search_token')
      }
    }
  }

  onPressSelect = (pressAddr,selected) => {
    const { currentAccount } = this.props.accountManageReducer
    if(selected){
      this.props.dispatch(deleteSelectedToListAction(pressAddr,currentAccount.address))
    }else{
      this.props.dispatch(addSelectedToListAction(pressAddr,currentAccount.address))
    }
  }
  onRefresh = () => {
    const { currentAccount } = this.props.accountManageReducer
    this.setState({
      isRefreshing: true
    })
    this.props.dispatch(fetchTokenAction(currentAccount.address,true))

  }
  render(){
    let selected = false
    const { fetchTokenList } = this.props.tokenManageReducer
    console.log('资产列表fetchTokenList===',fetchTokenList)
    return(
      <View style={{flex:1,backgroundColor:'#F5F7FB'}}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              tintColor={"#144396"}
              title={I18n.t('loading')}
              colors={['#fff']}
              progressBackgroundColor={"#1d53a6"}
            />
          }
        >
          <View style={[styles.listItemView,styles.whStyle]}>
            <Image source={require('../../images/xhdpi/etz_logo.png')} style={pubS.logoStyle}/>
            <View style={[styles.listItemTextView,pubS.rowCenterJus]}>
              <View>
                <Text style={pubS.font36_2}>ETZ</Text>
                <Text style={pubS.font24_2}>EtherZero</Text>
              </View>
            </View>
          </View>

          {
            fetchTokenList.map((res,index) => {
              if(res.tk_selected === 1){
                selected = true
              }else{
                selected = false
              }
              return(
                <TouchableOpacity style={[styles.listItemView,styles.whStyle]} key={index}  activeOpacity={.7} onPress={this.onPressSelect.bind(this,res.tk_address,selected)}>
                  <Image source={require('../../images/xhdpi/etz_logo.png')} style={pubS.logoStyle}/>
                  <View style={[styles.listItemTextView,pubS.rowCenterJus]}>
                    <View>
                      <Text style={pubS.font36_2}>{res.tk_symbol}</Text>
                      <Text style={pubS.font24_2}>{res.tk_name}</Text>
                    </View>
                    <View style={[styles.selectIcon,pubS.center,{borderWidth: selected?0:1,borderColor: selected?'transparent':'#CACDD2',backgroundColor:selected?'#2B8AFF':'#fff'}]}>
                      {
                        selected ? 
                        <Image source={require('../../images/xhdpi/btn_ico_addassets_pre.png')} style={styles.selectImage}/>
                        : null
                      }
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  
  selectImage:{
    height: scaleSize(40),
    width: scaleSize(40),
    zIndex: 1000,
  },
  selectIcon: {
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: 1000,  
  },
  listItemView:{
    backgroundColor:'#fff',
    ...ifIphoneX({marginLeft:30,marginRight:30},{paddingLeft: scaleSize(22),paddingRight: scaleSize(22)},{paddingLeft: scaleSize(22),paddingRight: scaleSize(22)}),
    justifyContent:'center',
    flexDirection:'row',
    borderRadius: 4,
    alignSelf:'center',
    marginTop: scaleSize(20),
  },
  whStyle: {
    ...ifIphoneX(
      {
        height: scaleSize(120),
        width: 345,
      },
      {
        height: scaleSize(120),
        width: scaleSize(702),
      },
      {
        height: scaleSize(120),
        width: scaleSize(702),
      }
    )

  },
  listItemTextView:{
    ...ifIphoneX(
      {
        width: 293,
        marginLeft:scaleSize(18),
        paddingTop: scaleSize(15),
        paddingBottom: scaleSize(22),
      },
      {
        width: scaleSize(618),
        marginLeft:scaleSize(18),
        paddingTop: scaleSize(15),
        paddingBottom: scaleSize(22),
      },
      {
        width: scaleSize(618),
        marginLeft:scaleSize(18),
        paddingTop: scaleSize(15),
        paddingBottom: scaleSize(22),
      }
    )
  },
})

export default connect(
  state => ({
    tokenManageReducer: state.tokenManageReducer,
    accountManageReducer: state.accountManageReducer
  })
)(AddAssets)
