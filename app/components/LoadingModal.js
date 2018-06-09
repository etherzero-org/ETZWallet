import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import Modal from 'react-native-modal'
import { pubS } from '../styles/'
import I18n from 'react-native-i18n'

import { connect } from 'react-redux'

import { showLoadingAction } from '../actions/tradingManageAction'

class LoadingModal extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      visible: false
    };
  }
  componentWillReceiveProps(nextProps){
    if(this.props.tradingManageReducer.loadingVisible !== nextProps.tradingManageReducer.loadingVisible){
      console.log('nextProps.tradingManageReducer.loadingVisible1111111',nextProps.tradingManageReducer.loadingVisible)
      this.setState({
        visible: nextProps.tradingManageReducer.loadingVisible
      })
    }
  }
  static defaultProps = {
    opacity: .3,
    loadingText:I18n.t('loading'),
    bgColor: '#fff'

  }
  onPressClose = () => {
    this.props.dispatch.showLoadingAction(false,'')
  }
  render(){
    const { loadingVisible, loadingText} = this.props.tradingManageReducer
    console.log('loadingText=====',loadingText)
    return(
        <Modal
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          isVisible={this.props.visible} 
          onBackButtonPress={() => this.onPressClose()}
          style={[pubS.center,{flex:1,}]}
          backdropColor={'#fff'}
          backdropOpacity={.3}
          useNativeDriver={true}
        >
         <View style={{alignSelf:'center'}}>
           <ActivityIndicator  
              color={'#144396'}
              indeterminate={true}
              size={'large'}
            />
            <Text style={{color:'#144396'}}>{loadingText}</Text>
         </View> 
        </Modal>
    )
  }
}

export default connect(
  state => ({
    tradingManageReducer: state.tradingManageReducer
  })
)(LoadingModal)
