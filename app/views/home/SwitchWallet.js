import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	Image,
	StyleSheet,
} from 'react-native'
import { pubS,ScanNavStyle,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize } from '../../utils/adapter'
import { connect } from 'react-redux'
import { switchAccountAction,changeBackupModalTimesAction } from '../../actions/accountManageAction'
import { switchTokenAction,refreshTokenAction } from '../../actions/tokenManageAction'


import I18n from 'react-native-i18n'
class SwitchWallet extends Component {
	constructor(props){
		super(props)
		this.state={

		}
		// this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
	}
	componentWillMount(){
		
	}
	// onNavigatorEvent(event){
		
	// }
	onScan = () => {
		this.props.thisPorps.props.navigator.push({
	      screen: 'scan_qr_code',
		  title:I18n.t('scan'),
		  backButtonTitle:I18n.t('back'),
          backButtonHidden:false,
	      navigatorStyle: Object.assign({},DetailNavigatorStyle,{
	        navBarTextColor:'#fff',
	        navBarBackgroundColor:'#000',
	        statusBarColor:'#000',
	        statusBarTextColorScheme:'light',
	      }),
	    })
		this.props.onCloseSwitchDrawer()
	}
	onCreate = () => {
		this.props.thisPorps.props.navigator.push({
	      screen: 'create_account',
		  title:I18n.t('create'),
		  backButtonTitle:I18n.t('back'),
          backButtonHidden:false,
	      navigatorStyle: DetailNavigatorStyle,
	    })
	    this.props.onCloseSwitchDrawer()
	}
	onSwitch = (addr) => {
		const { fetchTokenList } = this.props.tokenManageReducer

		this.props.dispatch(switchAccountAction(addr))
		//切换账号后 执行一条查询语句  找出切换的账号下的token list  
		this.props.dispatch(switchTokenAction(addr))

		//刷新 etz和代币数量

		this.props.dispatch(refreshTokenAction(addr,fetchTokenList))

		this.props.dispatch(changeBackupModalTimesAction(0))
		this.props.onCloseSwitchDrawer()


	}
	closeDrawer = () => {
		this.props.onCloseSwitchDrawer()
	}
	render(){
		const { currentAccount, globalAccountsList } = this.props.accountManageReducer
		return(
			<View style={styles.switchView}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					
				>
					{
						globalAccountsList.map((val,index) => {
							return(
								<TouchableOpacity 
									key={index} 
									style={[pubS.rowCenter,{height: scaleSize(100),backgroundColor: val.is_selected===1 ? '#E9ECF0' : '#fff'}]} 
									activeOpacity={.7} 
									onPress={val.is_selected === 1 ? () => this.closeDrawer : () => this.onSwitch(val.address)}
								>
									<Image source={require('../../images/xhdpi/Penguin.png')} style={[{marginLeft: scaleSize(33)},styles.imgStyle]}/>
									<Text style={[pubS.font24_2,{marginLeft: scaleSize(33)}]}>{val.account_name}</Text>
								</TouchableOpacity>
							)
						})
					}
					<View style={styles.lineStyle}></View>
					<TouchableOpacity 
						style={[pubS.rowCenter,{marginLeft: scaleSize(53)}]} 
						activeOpacity={.7} 
						onPress={this.onScan}
					>
						<Image source={require('../../images/xhdpi/btn_ico_more_scan_def.png')} style={styles.imgStyle}/>
						<Text style={[pubS.font26_4,{marginLeft: scaleSize(30)}]}>{I18n.t('scan')}</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[pubS.rowCenter,{marginLeft: scaleSize(53),marginTop: scaleSize(40)}]} 
						activeOpacity={.7} 
						onPress={this.onCreate}
					>
						<Image source={require('../../images/xhdpi/btn_ico_more_createaccount_def.png')} style={styles.imgStyle}/>
						<Text style={[pubS.font26_4,{marginLeft: scaleSize(30)}]}>{I18n.t('create')}</Text>
					</TouchableOpacity>
				</ScrollView>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	lineStyle:{
		width: '100%',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor:'#F2F2F2',
		marginTop:scaleSize(30),
		marginBottom: scaleSize(50)
	},
	switchView:{
		backgroundColor:'#fff',
		flex:1,
		width:scaleSize(450),
		paddingTop: scaleSize(50)
	},
	imgStyle: {
		width: scaleSize(56),
		height: scaleSize(56),
	}
})

export default connect(
	state => ({
		accountManageReducer: state.accountManageReducer,
		tokenManageReducer: state.tokenManageReducer
	})
)(SwitchWallet)