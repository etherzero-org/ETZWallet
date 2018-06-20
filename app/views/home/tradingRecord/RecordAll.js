//交易记录 全部

import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize } from '../../../utils/adapter'
import RecordListItem from './RecordListItem'
import { sliceAddress,timeStamp2Date } from '../../../utils/splitNumber'
import I18n from 'react-native-i18n'
class RecordAll extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  renderAll = (item) => {
    let res = item.item
    return(
      <RecordListItem
        receiverAddress={sliceAddress(res.tx_receiver)}
        receiverTime={timeStamp2Date(res.tx_time)}
        receiverVal={`-${res.tx_value}`}
        unit={res.tx_token}
      />
    )
  }
  ListEmptyComponent = () => {
    return(
      <View style={{marginTop: 10,alignItems:'center'}}>
        <Text style={pubS.font24_4}>{I18n.t('no_tx_info')}</Text>
      </View>
    )
  }
  render(){
    return(
      <View style={[pubS.container,{backgroundColor:'#F5F7FB',paddingTop: scaleSize(10)}]}>
        <FlatList
          data={this.props.list}
          renderItem={this.renderAll}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this.ListEmptyComponent}
        />
      </View>
    )
  }
}
export default RecordAll
