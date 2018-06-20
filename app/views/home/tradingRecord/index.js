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
import { setScaleText, scaleSize } from '../../../utils/adapter'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view'
import Picker from 'react-native-picker'
import RecordAll from './RecordAll'
import RecordPay from './RecordPay'
import RecordCollection from './RecordCollection' 
import I18n from 'react-native-i18n'
import accountDB from '../../../db/account_db'
import { connect } from 'react-redux'

const PickerData = [
  ['January ','February','March','April','May','June','July','August','September','October','November','December'],
  ['2015','2016','2017','2018'],
];
class TradingRecord extends Component{
  constructor(props){
    super(props)
    this.state = {
      tradingList: []
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }


  onNavigatorEvent(event){
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'calendar_picker') {
        Picker.show()
      }
    }
  }
  componentWillMount(){

    this.getTradingList()

  }

  componentDidMount(){
    Picker.init({
      pickerConfirmBtnText: I18n.t('confirm'),
      pickerCancelBtnText: I18n.t('cancel'),
      pickerTitleText: '',
      pickerConfirmBtnColor: [21, 126, 251, 1],
      pickerCancelBtnColor: [21, 126, 251, 1],
      pickerToolBarBg: [247, 247, 247, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarFontSize: 14,
      pickerFontSize: 22,
      pickerFontColor: [51, 51, 51, 1],
      pickerData: PickerData,
      onPickerConfirm: pickedValue => {

        console.log('pickedValue===',pickedValue)

      },
    })
  }
  async getTradingList(){
    const { currentAccount } = this.props.accountManageReducer
    // console.log('currentAccount==============',currentAccount)
    let selRes = await accountDB.selectTable({
      sql: 'select * from trading where tx_sender = ?',
      parame: [`0x${currentAccount.address}`]
    })
    // console.log('selRes===========',selRes)

    this.setState({
      tradingList: selRes
    })
  }
  render(){
    const { tradingList } = this.state
    return(
      <View style={pubS.container}>
        <ScrollableTabView
          tabBarActiveTextColor={'#FFE822'}
          tabBarInactiveTextColor={'#fff'}
          tabBarTextStyle={{fontSize:setScaleText(26)}}
          animationEnabled={false}
          tabBarPosition={'top'}

          renderTabBar={() => (
            <ScrollableTabBar
              underlineStyle={[ styles.underlineStyle ]}
              style={{backgroundColor:'#144396',height: scaleSize(84)}}
              activeTextColor={'#333'}
              inactiveTextColor={'#9b9b9b'}
              tabBarBackgroundColor={'#fff'}
            />
          )}
        >
            <RecordAll key={1} tabLabel={I18n.t('all')} list={tradingList}/>
            <RecordPay key={2} tabLabel={I18n.t('sended')} list={tradingList}/>
            {
              //<RecordCollection key={3} tabLabel={'Receive'}/>
            }

        </ScrollableTabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  underlineStyle: {
    borderColor: '#FFE822',
    backgroundColor: '#2B8AFF',
    borderBottomWidth:3,
    height:0,
  }
})
export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(TradingRecord)
