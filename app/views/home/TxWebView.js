import React, { Component } from 'react'
import {
	View,
	WebView,
	StyleSheet,
	StatusBar,
	Platform,
	ActivityIndicator
} from 'react-native'
import { scaleSize,ifIphoneX } from '../../utils/adapter'
import { NavHeader } from '../../components/'
import I18n from 'react-native-i18n'
export default class TxWebView extends Component{
	renderLoading = () => {
		return(
			<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
	           <ActivityIndicator  
	              color={'#144396'}
	              indeterminate={true}
	              size={'large'}
	            />
	        </View> 
		)
	}
	onPressBack = () => {
	    this.props.navigator.pop()
  	}

	render(){
		return(
			<View style={{flex:1,}}>
				{
		          Platform.OS === 'ios' ?
		          <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
		          : null
		        }	
		        <NavHeader
		          navTitle={I18n.t('tx_records_1')}
		          pressBack={this.onPressBack}
		          isAccount={false}
		        />		
				<WebView
			        source={{uri:`https://explorer.etherzero.org/tx/${this.props.hash}`,method:'GET'}}
					style={styles.WebViewStyle}
					startInLoadingState={true}
					renderLoading={this.renderLoading }
	                domStorageEnabled={true}//开启dom存贮
	                javaScriptEnabled={true}//开启js
		      	>	
				</WebView>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	WebViewStyle:{
		...ifIphoneX(
			{flex:1,alignSelf:'center',width: 375},
			{flex:1,alignSelf:'center',width: scaleSize(750)},
			{flex:1,alignSelf:'center',width: scaleSize(750)}
		)
	}
})