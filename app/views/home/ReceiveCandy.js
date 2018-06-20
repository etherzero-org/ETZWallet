import React, { Component } from 'react'
import {
	Linking,
	Text,
	View,
	TouchableOpacity
} from 'react-native'
export default class ReceiveCandy extends Component {
	onPress = () => {
		let url = 'https://t.me/Wisdomcoinofficials'

		Linking.canOpenURL(url).then(supported => {
			console.log('supported===',supported)
		  if (!supported) {
		    console.log('Can\'t handle url: ' + url);
		  } else {
		    return Linking.openURL(url);
		  }
		}).catch(err => console.log('An error occurred', err));
	}

	render(){
		return(
			<View>
				<TouchableOpacity onPress={this.onPress}>
					<Text>https://t.me/Wisdomcoinofficials</Text>
				</TouchableOpacity>
			</View>
		)
	}
}