import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	PixelRatio,
	BackHandler,
	TextInput,
	Image,	
	TouchableOpacity,
	Alert,
	ScrollView,
	Keyboard
} from 'react-native'
import { pubS, DetailNavigatorStyle, } from '../../styles/'
import { scaleSize } from '../../utils/adapter'
import { coutryCode } from '../../utils/coutryCode'
import { Btn,TextInputComponent,Loading } from '../../components/' 
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'

import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import { checkI18nPhone } from '../../utils/checkI18nPhone'
import { sendVerifCodeAction,bindAddressAction,resetActivityStatusAction } from '../../actions/activityAction'
import DeviceInfo from 'react-native-device-info'
class BindPhone extends Component{
	constructor(props){
		super(props)
	    this.state = {
	    	verifCode: '',
			invCode: '',
			coutry: '',
			phoneNumber:'',
	        cca2: '',
	        callingCode: '',
	        loadingVisible: false,
			loadingText: '',
			countNum: 60,
			timerTitle: I18n.t('get_v_code'),
			touchabled: true,
	    }
	    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onFocus.bind(this))
	    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
	}

	componentDidMount(){
		clearInterval(this.interval)
	    let userLocaleCountryCode = DeviceInfo.getDeviceCountry()
	    const userCountryData = getAllCountries()
	      .filter(country => coutryCode.includes(country.cca2))
	      .filter(country => country.cca2 === userLocaleCountryCode)
	      .pop()

	    console.log('userLocaleCountryCode=====',userLocaleCountryCode)
	    console.log('userCountryData.callingCode===',userCountryData.callingCode)
	    this.setState({
	      cca2: userLocaleCountryCode,
	      callingCode:userCountryData.callingCode
	    })
	}

	componentWillReceiveProps(nextProps){
		//发送验证码成功
		//绑定手机号成功
		if(this.props.activityReducer.bindStatus !== nextProps.activityReducer.bindStatus){
			this.setState({
				loadingVisible: false
			})
			if(nextProps.activityReducer.bindStatus === 1){
				console.log('nextProps.activityReducer.inviteCode===',nextProps.activityReducer.inviteCode)
				this.props.navigator.push({
				    screen: 'recom_prize',
				    title:I18n.t('recom_prize'),
				    navigatorStyle: DetailNavigatorStyle,
				    backButtonTitle:I18n.t('back'),
				    backButtonHidden:false,
				    passProps: {
				    	inviteCode: nextProps.activityReducer.inviteCode.invite_code
				    }
				})
			}else{
				if(nextProps.activityReducer.bindStatus === 2){
					Alert.alert(nextProps.activityReducer.bindMsg)
				}
			}
			this.props.dispatch(resetActivityStatusAction())
		}

		
	}
	componentWillUnmount(){
		clearInterval(this.interval)
	}
	onNavigatorEvent(event) {

    switch (event.id) {
      case 'willAppear':
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        break;
      case 'willDisappear':
        this.backPressed = 0;
        this.backHandler.remove();
        break;
      default:
        break;
    }

  }
  	handleBackPress = () => {
    if (this.backPressed && this.backPressed > 0) {
    	this.setState({
    		loadingVisible: false
    	})
       return false
    }   
  }
	selectCoutry = (data) => {
		console.log('data1111111111',data)
	}
	onChangeVeriCode = (value) => {
		const { verifCode } = this.state
		
		this.setState({
			verifCode: value
		})
	}

	onChangeInvCode = (value) => {
		const { invCode } = this.state
		
		this.setState({
			invCode: value
		})
	}

	onPressBindBtn = () => {
		const { currentAccount } = this.props.accountManageReducer
		const { phoneNumber,callingCode,verifCode, invCode } = this.state 

		if(!DeviceInfo.isEmulator()){
			if(verifCode.length !== 6){
				Alert.alert(I18n.t('v_code_invalid'))
			}else{
				this.setState({
					loadingVisible: true,
					loadingText:I18n.t('binding'),
				},() => {
					this.props.dispatch(bindAddressAction({
						phoneNumber,
						callingCode,
						verifCode,
						invCode,
						uniqueId: DeviceInfo.getUniqueID(),
						systemName: DeviceInfo.getSystemName(),
						systemVersion:DeviceInfo.getSystemVersion(),
						address:`0x${currentAccount.address}`
					}))
				})
			}
		}else{
			Alert.alert('非法设备!')
		}

	}
	onChangePhone = (value) => {
		this.setState({
			phoneNumber: value
		})
	}
	onClearTime = () => {
		this.interval&&clearInterval(this.interval);
        this.setState({
          countNum: 60,
          timerTitle: I18n.t('get_v_code'),
          touchabled: true
        })
	}
	onSendCode = () => {
		//验证手机号合法性
		const { phoneNumber,cca2,callingCode } = this.state 
		this.onStartCountDown()
		try{
			let res = checkI18nPhone(cca2,callingCode,phoneNumber)
			if(res){
				this.setState({
					touchabled: false
				},() => {
					this.onStartCountDown()
					this.props.dispatch(sendVerifCodeAction(callingCode,phoneNumber))
				})
			}
		}catch (error) {
			Alert.alert(error)
		}

	}
	//验证码倒计时
	 onStartCountDown = () => {
	    const now = Date.now()
	    const overTimeStamp = now + 60 * 1000 + 100
	    this.interval = setInterval(() =>{
	      const nowStamp = Date.now()
	      if (nowStamp >= overTimeStamp) {
	         	this.onClearTime()
	      }else{
	          const leftTime = parseInt((overTimeStamp - nowStamp)/1000, 10)
	          this.setState({
	              countNum: leftTime,
	              timerTitle: `${I18n.t('rest_time')}${leftTime}s`,
	          })
	      }

	    },1000)

	  }
	onFocus = () => {
    	this.refs._scrollview.scrollToEnd({animated: true})
  	}
  	onChange = (value) => {
  		this.setState({ 
  			cca2: value.cca2,
  			callingCode: value.callingCode
  		})
  	}
  	onCloseCountry = () => {
  		this.setState({
  			loadingVisible: false
  		})
  	}
	render(){
		const { currentAccount,globalAccountsList } = this.props.accountManageReducer
		const { verifCode, invCode, coutry, phoneNumber, loadingVisible, loadingText, countNum, timerTitle, touchabled, cca2, callingCode} = this.state
		console.log('cca2===',cca2)
		console.log('callingCode===',callingCode)
		return(
			<View style={pubS.container}>
				<Loading loadingVisible={loadingVisible} loadingText={loadingText}/>
				<ScrollView 
					ref={'_scrollview'}
				>
		            <View style={[{justifyContent:'center'},pubS.textInputWH,pubS.bottomStyle1]}>
		            	<Text style={pubS.font26_4}>{`0x${currentAccount.address}`}</Text>
		            </View>
		            <View style={[pubS.textInputWH,pubS.bottomStyle1,pubS.rowCenterJus]}>
			            <CountryPicker
			              ref={'picker'}
				          countryList={coutryCode}
				          onChange={this.onChange}
				          cca2={cca2}
				          translation="eng"
				          closeable={true}
				          filterable={true}
				          filterPlaceholder={I18n.t('search_country')}
				          transparent={true}
				          closeButtonImage={require('../../images/xhdpi/btn_ico_collectionnobackup_close_def.png')}
				          showCallingCode={true}
				          onClose={this.onCloseCountry}
				        />
				        <View style={pubS.arrowViewStyle}>
			            	<Image source={require('../../images/xhdpi/btn_ico_payment_select_def.png')} style={{width: scaleSize(16),height: scaleSize(30)}}/>
			            </View>
 		            </View>
			        <View style={[pubS.rowCenterJus,pubS.bottomStyle1,pubS.textInputWH,{paddingRight: scaleSize(10)}]}>
			        	<Text style={[pubS.font26_5,{width: '13%'}]}>+{callingCode}</Text>
			        	<View style={{width: '67%',}}>
				            <TextInput
				              placeholder={I18n.t('phone_number')}
				              placeholderTextColor={'#C7CACF'}
				              style={{color:'#657CAB'}}
				              value={phoneNumber}
				              onChangeText={this.onChangePhone}
				              underlineColorAndroid={'transparent'}
				              keyboardType={'numeric'}
				            />
			        	</View>
			        	<TouchableOpacity 
			        		activeOpacity={touchabled ? .7 : 1} 
			        		onPress={touchabled ? () => this.onSendCode() : () => {return}}
			        		style={{width: '20%'}}
			        	>
			            	<Text style={[pubS.font24_7,{alignSelf:'flex-end'}]}>{timerTitle}</Text>
			        	</TouchableOpacity>
			        </View>
		            <TextInputComponent
		              placeholder={I18n.t('verif_code')}
		              value={verifCode}
		              onChangeText={this.onChangeVeriCode}
		              keyboardType={'numeric'}
		            />
		            <TextInputComponent
		              placeholder={I18n.t('Inv_code')}
		              value={invCode}
		              onChangeText={this.onChangeInvCode}
		              keyboardType={'numeric'}
		            />
		            <Btn
		              btnPress={touchabled ? () => this.onPressBindBtn() : () => {return}}
	                  btnText={I18n.t('bind_btn')}
	                  btnMarginTop={scaleSize(50)}
		            />
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	touchFlag:{
		height: 50
	},
    data: {
	    padding: 15,
	    marginTop: 10,
	    backgroundColor: '#ddd',
	    borderColor: '#888',
	    borderWidth: 1 / PixelRatio.get(),
	    color: '#777'
   }
})

export default connect(
	state => ({
		activityReducer: state.activityReducer,
		accountManageReducer: state.accountManageReducer
	})
)(BindPhone)