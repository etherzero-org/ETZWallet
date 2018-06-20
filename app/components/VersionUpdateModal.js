import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,

} from 'react-native'
import Modal from 'react-native-modal'
import { pubS } from '../styles/'
import I18n from 'react-native-i18n'
import { scaleSize, setScaleText,isIphoneX } from '../utils/adapter'
export default class VersionUpdateModal extends Component{
	constructor(props){
		this.state={
			visible: false
		}
	}


	onCloseModal = () => {

	}

	render(){
		return(
			<Modal
			  animationIn={'slideInUp'}
	          animationOut={'slideOutDown'}
	          isVisible={true} 
	          style={[pubS.center,{flex:1,position: 'absolute', height: scaleSizee(630),width: scaleSizee(500),backgroundColor:'transparent'}]}
	          backdropColor={'#fff'}
	          backdropOpacity={.3}
	          useNativeDriver={true}
			>	
				<TouchableOpacity activeOpative={.7} onPress={this.onCloseModal} style={styles.closeStyle}>
					<Image source={require('../images/xhdpi/version_update_bg_close.png')} />
				</TouchableOpacity>
				<View style={styles.container}>
					<Image source={require('../images/xhdpi/version_update_bg.png')} style={styles.bgStyle}/>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	bgStyle:{
		
	},
	container: {
		height: scaleSize(630),
		width: scaleSize(500),
		borderRadius: scaleSize(10),

	},
	closeStyle: {
		height: scaleSize(44),
		width: scaleSize(44),
		position: 'absolute',
		top: 100,
		right: 10,

	},
})