//交易记录 收款

import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize } from '../../../utils/adapter'
import RecordListItem from './RecordListItem'
const DATA = [
  {
    a_type: 'ETZ',
    a_total_name: 'Bitcoin',
    a_dollar: '123,45',
    a_mrb: '123,345,67',
  },
]
class RecordCollection extends Component{
  renderColl = () => {
    return(
      <RecordListItem
        moneyTextColor={'#2CD560'}
      />
    )
  }
  render(){
    return(
      <View style={[pubS.container,{backgroundColor:'#F5F7FB',paddingTop: scaleSize(10)}]}>
        <FlatList
          data={DATA}
          renderItem={this.renderColl}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}
export default RecordCollection
