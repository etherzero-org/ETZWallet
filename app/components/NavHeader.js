import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	StyleSheet,
	Platform,
} from 'react-native'
import {pubS} from '../styles/'
import { scaleSize, setScaleText,isIphoneX } from '../utils/adapter'
import I18n from 'react-native-i18n'
export default class NavHeader extends Component {

	static defaultProps = {
		navBgColor: '#fff',
		isAccount: true,
		navTitleColor: '#657CAB',
		marginTopValue: scaleSize(30)
	} 

	render(){
		const { navTitle, pressBack, navBgColor, isAccount, toScan,navTitleColor, marginTopValue} = this.props
		return(
			<View style={[Platform.OS === 'ios' ? styles.ios_navbarStyle : styles.navbarStyle,pubS.rowCenterJus,{paddingLeft: scaleSize(15),paddingRight: scaleSize(15),backgroundColor: navBgColor,marginTop: marginTopValue}]}>
	            <TouchableOpacity activeOpacity={.6} onPress={pressBack} style={[pubS.rowCenter,{width:scaleSize(145)}]}>
	              <Image source={Platform.OS === 'ios' ? require('../images/xhdpi/nav_ico_createaccount_back_def.png') : require('../images/xhdpi/send_page_back_ios.png')}style={styles.navImgStyle}/>
	              {
	              	Platform.OS === 'ios' ?
	              	<Text style={{color:'#c4c7cc',fontSize: setScaleText(32)}}>{I18n.t('back')}</Text>
	              	: null
	              }
	            </TouchableOpacity>
	            <View style={{alignSelf:'center'}}>
	              <Text style={{fontSize: setScaleText(32),color:navTitleColor}}>{navTitle}</Text>
	            </View>
	            {
	            	isAccount ? 
		            <TouchableOpacity activeOpacity={.6} onPress={toScan} style={styles.drawerStyle}>
		              <Image source={require('../images/xhdpi/btn_ico_payment_scan_def.png')} style={styles.navImgStyle}/>
		            </TouchableOpacity>
		            : <View style={styles.drawerStyle}/>
	            }
          	</View>  
		)
	}
}

const styles = StyleSheet.create({
	navbarStyle:{
      // marginTop: scaleSize(30),   
      height: scaleSize(67),
      // height: scaleSize(87),
      paddingLeft: scaleSize(24),
      paddingRight: scaleSize(24)
    },
    navImgStyle: {
      width:scaleSize(40),
      height: scaleSize(40)
    },
    drawerStyle:{
      height: scaleSize(83),
      width: scaleSize(145),
      justifyContent:'center',
      marginRight: scaleSize(10),
      alignItems:'flex-end',
    },

    ios_navbarStyle:{
      // marginTop: scaleSize(30),   
      height: scaleSize(87),
      backgroundColor: '#fff',
      // backgroundColor:'#000'
    },
})