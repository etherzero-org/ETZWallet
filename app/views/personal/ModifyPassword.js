import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	Alert,
	Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { TextInputComponent,Btn,Loading, } from '../../components/'
import { pubS,DetailNavigatorStyle } from '../../styles/'
import I18n from 'react-native-i18n'
import { modifyPasswordAction } from '../../actions/accountManageAction'
import { setScaleText, scaleSize, ifIphoneX } from '../../utils/adapter'
class ModifyPassword extends Component {
	constructor(props){
		super(props)
		this.state={
			currentPsdVal: '',
			newPsdVal: '',
			reNewPsdVal: '',
			visible: false,
			currentList:this.props.accountManageReducer.pass_currentList,
			keyStore:this.props.accountManageReducer.pass_keyStore,
		}
	}

	componentWillMount(){

	}

	componentWillReceiveProps(nextProps){
		if(this.props.accountManageReducer.accountManageReducer !== nextProps.accountManageReducer.modifyStatus){
			this.setState({
				visible: false
			})
			setTimeout(() => {
				if(nextProps.accountManageReducer.modifyStatus === 1){
				//成功
				// Alert.alert(nextProps.accountManageReducer.modifyText)
				
				Alert.alert(
		          '',
		          nextProps.accountManageReducer.modifyText,
		          [
		            {text:I18n.t('ok'),onPress:() => this.props.navigator.pop()}
		          ]
		        ) 

				}else{
					if(nextProps.accountManageReducer.modifyStatus === 2){
						//失敗
						Alert.alert(nextProps.accountManageReducer.modifyText)
					}
				}
			},1000)
		}
	}

	onPressBtn = () => {
		const { currentPsdVal, newPsdVal, reNewPsdVal} = this.state
		let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/

		if(!reg.test(newPsdVal)){
			Alert.alert(I18n.t('password_verification'))
		}else{
			if(newPsdVal !== reNewPsdVal){
				Alert.alert(I18n.t('passwords_different'))
			}else{
				this.onModify()
			}
		}
	}

	onModify = () => {
		//判断是哪个账号  判断原密码是否正确  重新生成keystore  重新存储该账号下的信息
		const { currentPsdVal, newPsdVal, currentList, keyStore} = this.state

		console.log('currentList===',currentList)
		console.log('keyStore===',keyStore)
		this.setState({
			visible: true
		})
		setTimeout(() => {
			this.props.dispatch(modifyPasswordAction({
				currentList: currentList,
				keys: keyStore,
				oldPsd: currentPsdVal,
				newPsd: newPsdVal
			}))
		},1000)
	}
	importNow = () => {
	    this.props.navigator.push({
	      screen: 'import_account',
	      title:I18n.t('import'),
	      backButtonTitle:I18n.t('back'),
	      backButtonHidden:false,
	      navigatorStyle: DetailNavigatorStyle,
	    })
	}

	onChangCurPsd = (value) => {
		this.setState({
			currentPsdVal: value
		})
	}
	onChangNewPsd = (value) => {
		this.setState({
			newPsdVal: value
		})
	}
	onChangRePsd = (value) => {
		this.setState({
			reNewPsdVal: value
		})
	}
	render(){
		const { currentPsdVal, newPsdVal, reNewPsdVal, visible} = this.state
		return(
			<View style={pubS.container}>
				<Loading loadingVisible={visible} loadingText={I18n.t('modifying')}/>
				<TextInputComponent
				    placeholder={I18n.t('cur_password')}
	              	value={currentPsdVal}
	              	onChangeText={this.onChangCurPsd}
	              	secureTextEntry={true}
				/>
				<TextInputComponent
				    placeholder={I18n.t('new_password')}
	              	value={newPsdVal}
	              	onChangeText={this.onChangNewPsd}
	              	secureTextEntry={true}
				/>
				<TextInputComponent
				    placeholder={I18n.t('re_new_password')}
	              	value={reNewPsdVal}
	              	onChangeText={this.onChangRePsd}
	              	secureTextEntry={true}
				/>
				<Btn
					btnPress={this.onPressBtn}
					btnText={I18n.t('modify_psd_btn')}
					btnMarginTop={scaleSize(60)}
				/>
				<View style={[pubS.rowCenter,{alignSelf:'center',justifyContent:'center',marginTop: scaleSize(30),width: scaleSize(680)}]} >
					<Text style={pubS.font26_5}>{I18n.t('password_text')}
						<Text onPress={this.importNow} style={pubS.font26_7}>{`    ${I18n.t('import_now')}`}</Text>
					</Text>
					
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({

})

export default connect(
  state => ({
    accountManageReducer: state.accountManageReducer
  })
)(ModifyPassword)