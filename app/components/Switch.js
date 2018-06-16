import React, { Component } from 'react'
import { 
	View,
	Text,
	StyleSheet,
	Animated,
	TouchableOpacity
} from 'react-native'
import {pubS} from '../styles/'
import { scaleSize, setScaleText,isIphoneX } from '../utils/adapter'
import I18n from 'react-native-i18n'
export default class Switch extends Component {
	constructor(props){
		super(props)
		this.state={
			pollLeft: new Animated.Value(0),
			isOpen: false,//球在左边是关闭  在右边是开
			lineBg: '#ABAEB2',
			pollBg: '#fff',
			pollBd: 1,
		}
	}

	static defaultProps = {

	}

	onSwitch = () => {
		const { isOpen } = this.state
		if(isOpen){
			Animated.timing(
				this.state.pollLeft,
				{
					toValue: 0,
					duration: 100,
				}
			).start(() => {
				this.setState({
					isOpen: false,
					lineBg: '#ABAEB2',
					pollBg: '#fff',
					pollBd: 1,
				})
			})
			this.props.closeSwitch()

		}else{
			Animated.timing(
				this.state.pollLeft,
				{
					toValue: scaleSize(40),
					duration: 100,
				}	
			).start(() => {
				this.setState({
					isOpen: true,
					lineBg: '#2B8AFF',
					pollBg: '#2B8AFF',
					pollBd: 0
				})
			})

			this.props.openSwitch()
		}
	}
	render(){
		const { pollLeft, pollBg, pollBd, lineBg} = this.state
		return(
			<TouchableOpacity style={pubS.rowCenter} onPress={this.onSwitch} activeOpacity={.7} >
	            <Text style={pubS.font26_5}>{I18n.t('advance')}</Text>
	            <View style={[styles.conView,pubS.rowCenter]}>
	              <Animated.View style={[styles.pollView,{left: pollLeft,backgroundColor:pollBg,borderWidth:pollBd}]}></Animated.View>
	              <Animated.View style={[styles.lineView,{backgroundColor: lineBg}]}></Animated.View>
	            </View>
          	</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	conView: {
		height: scaleSize(30),
		width: scaleSize(70),
		marginLeft: scaleSize(30)
		
	},
	container: {

	},
	pollView:{
		height: scaleSize(30),
		width: scaleSize(30),
		borderRadius: 100,
		borderColor:'#ccc',
		position:'absolute',
		zIndex:999,
	},
	lineView:{
		height: scaleSize(3),
		width: scaleSize(70),

	},
})