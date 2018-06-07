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
export default class NavHeader extends Component {

	static defaultProps = {
		navBgColor: '#fff',
		isAccount: true,
		navTitleColor: '#657CAB'
	} 

	render(){
		const { navTitle, pressBack, navBgColor, isAccount, toScan,navTitleColor} = this.props
		return(
			<View style={[Platform.OS === 'ios' ? styles.ios_navbarStyle : styles.navbarStyle,pubS.rowCenterJus,{backgroundColor: navBgColor}]}>
	            <TouchableOpacity activeOpacity={.6} onPress={pressBack} style={pubS.rowCenter}>
	              <Image source={require('../images/xhdpi/send_page_back_ios.png')}style={styles.navImgStyle}/>
	            </TouchableOpacity>
	            <View style={{marginLeft: 50}}>
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
      marginTop: scaleSize(30),   
      height: scaleSize(87),
      backgroundColor: '#fff',
      // backgroundColor:'#000'
    },
})