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
export default class Loading extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      visible: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.loadingVisible !== this.props.loadingVisible && nextProps.loadingVisible){
      this.setState({visible:true})
    }else{
      this.setState({visible:false})
    }
  }
  static defaultProps = {
    opacity: .3,
    loadingText:I18n.t('loading'),
    bgColor: '#fff'

  }
  onPressClose = () => {
    this.setState({
      visible: false
    })
  }
  render(){
    return(
        <Modal
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          isVisible={this.state.visible} 
          onBackButtonPress={() => this.onPressClose()}
          style={[pubS.center,{flex:1,}]}
          backdropColor={this.props.bgColor}
          backdropOpacity={this.props.opacity}
          useNativeDriver={true}
        >
         <View style={{alignSelf:'center'}}>
           <ActivityIndicator  
              color={'#144396'}
              indeterminate={true}
              size={'large'}
            />
            <Text style={{color:'#144396'}}>{this.props.loadingText}</Text>
         </View> 
        </Modal>
    )
  }
}
