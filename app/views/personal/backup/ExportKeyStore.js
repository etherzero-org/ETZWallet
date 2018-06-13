import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableOpacity,
    StyleSheet,
    ScrollView,
    Clipboard,
    TextInput
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize } from '../../../utils/adapter'
import { connect } from 'react-redux'
import { Btn } from '../../../components/'
import I18n from 'react-native-i18n'
import { copyKeystoreAction } from '../../../actions/accountManageAction'
import Toast from 'react-native-root-toast'
class NoticeText extends Component{
	render(){
		return(
			<View style={{marginTop: scaleSize(40)}}>
				<Text style={pubS.font24_8}>{this.props.text1}</Text>
				<Text style={[pubS.font22_3,{marginTop:scaleSize(10)}]}>{this.props.text2}</Text>
			</View>
		)
	}
}

class ExportKeyStore extends Component{
	constructor(props){
		super(props)
		this.state={
			copyed: false,//是否已复制 
			keyStore: `${JSON.stringify(this.props.accountManageReducer.pass_keyStore)}`
		}
	}
	componentWillUnmount(){
		this.setState({
			copyed: false
		})
	}
	onCopyBtn = () => {
		this.setState({
			copyed: true
		})
		Clipboard.setString(this.state.keyStore)

		let t = Toast.show(I18n.t('copyed_to_clipboard'))
	    setTimeout(() => {
	      Toast.hide(t)
	    },1000)

		// this.props.dispatch(copyKeystoreAction(this.props.curAddr))
	}
	render(){
		const { copyed,keyStore } = this.state 
		return(
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={{width: scaleSize(680),alignSelf:'center'}}>
						<NoticeText
							text1={I18n.t('offline_save')}
							text2={I18n.t('offline_save_1')}
						/>
						<NoticeText
							text1={I18n.t('no_use_net')}
							text2={I18n.t('no_use_net_1')}
						/>
						<NoticeText
							text1={I18n.t('psd_save_safe')}
							text2={I18n.t('psd_save_safe_1')}
						/>
						<NoticeText
							text1={I18n.t('no_screenshots')}
							text2={I18n.t('no_screenshots_1')}
						/>
					</View>
					
					<View style={[styles.mneViewStyle,pubS.center]}>
			      		<Text 
			      			style={pubS.font22_3}
			      			onLongPress={this.onCopyBtn}
			      		>{keyStore}</Text>
		      		</View>
		      		<View style={{marginBottom: scaleSize(60)}}>
						<Btn
				      		btnMarginTop={scaleSize(80)}
					        btnPress={copyed ? () => {return} : () => this.onCopyBtn()}
					        bgColor={'#2B8AFF'}
							opacity={.7}
					        btnText={copyed ? I18n.t('copy_ed') : I18n.t('copy_keystore')}
				      	/>
		      		</View>
				</ScrollView>
				
		)
	}
}

const styles = StyleSheet.create({
	mneViewStyle: {
		width: scaleSize(680),
		backgroundColor: '#e3e8f1',
		borderRadius: scaleSize(3),
		marginTop: scaleSize(40),
		alignSelf:'center',
		paddingTop:scaleSize(40),
		paddingBottom: scaleSize(40),
		paddingLeft: scaleSize(30),
		paddingRight: scaleSize(30),
	}
})

export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(ExportKeyStore)
