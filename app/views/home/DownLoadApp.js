import React, { Component } from 'react'
import {
  View,
  Text,
  WebView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../utils/adapter'

class DownLoadApp extends Component{
  renderLoading = () => {
		return(
			<View style={{flex:1,alignSelf:'center',marginTop: '50%'}}>
	           <ActivityIndicator  
	              color={'#144396'}
	              indeterminate={true}
	              size={'large'}
	            />
	        </View> 
		)
	}
  render(){
    return(
      <View style={{flex:1}}>
        {
          Platform.OS === 'ios' ?
          <StatusBar backgroundColor={"#000000"}  barStyle={"dark-content"}  animated={true} />
          : null
        }
        <WebView  
          source={{uri:Platform.OS === 'ios' ? 'https://www.pgyer.com/1C9W' : 'https://www.pgyer.com/NgAH'}}
          style={styles.webViewStyle}
          startInLoadingState={true}
          renderLoading={this.renderLoading }
          domStorageEnabled={true}//开启dom存贮
          javaScriptEnabled={true}//开启js
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
   webViewStyle:{
     ...ifIphoneX(
       {
         width:375,
         flex:1,
         alignSelf:'center',
       },
       {
        width: scaleSize(750),
        flex:1,
        alignSelf:'center',
       },
       {
        width: scaleSize(750),
        flex:1,
        alignSelf:'center',
       }
     )
   }
})
export default DownLoadApp
