import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize } from '../../../utils/adapter'
import { connect } from 'react-redux'
import { Btn } from '../../../components/'
import I18n from 'react-native-i18n'
class WriteMnemonic extends Component{
	constructor(props){
		super(props)
		this.state={
			mnemonicText: [],
			touchable: true,
			originMneStr: ''
		}
	}
	componentWillMount(){
    	console.log("写下主几次",this.props.mnemonicValue)
    	this.setState({
    		mnemonicText: this.props.mnemonicValue.split(" "),
    		originMneStr: this.props.mnemonicValue
    	})
	}
	
	onNextStep = () => {
		const { originMneStr } = this.state
		this.props.navigator.push({
	      screen: 'verify_mnemonic',
		  title: I18n.t('verify_mnemonic'),
		  backButtonTitle:I18n.t('back'),
          backButtonHidden:false,
	      navigatorStyle: DetailNavigatorStyle,
	      passProps: {
	      	mnemonicText: originMneStr,
	      }
	    })
	}
    render(){
    	const { touchable } = this.state
	    return(
	      <View style={[{flex:1,backgroundColor:'#F5F7FB',alignItems:'center'},pubS.paddingRow35]}>
	      	<Text style={[pubS.font34_1,{marginTop: scaleSize(60)}]}>{I18n.t('write_down_mnemonic')}</Text>
	      	<Text style={[pubS.font24_2,{textAlign :'center',marginTop: scaleSize(20)}]}>{I18n.t('safe_place_mnemonic')}</Text>
	      	<View style={[styles.mneViewStyle,pubS.center]}>
	      		<View style={[{width: scaleSize(600),flexDirection:'row',flexWrap: 'wrap',paddingTop: scaleSize(20),paddingBottom: scaleSize(20)}]}>
		      		{
		      			this.state.mnemonicText.map((val,index) => {
		      				return(
		      					<View key={index} style={{paddingLeft: scaleSize(5),paddingRight: scaleSize(5)}}>  
		      						<Text style={[pubS.font28_4,{}]}>{val}</Text>
		      					</View>
		      				)
		      			})
		      		}
	      		</View>
	      	</View>
	      	{
	   //    	<Btn
	   //    		btnMarginTop={scaleSize(80)}
		  //       btnPress={touchable ? () => this.onNextStep() : () => {return}}
		  //       bgColor={touchable ? '#2B8AFF':'#BDC0C6' }
				// opacity={touchable ? .7 : 1}
		  //       btnText={I18n.t('next')}
	   //    	/>
	      		
	      	}
	      	<Btn
	      		btnMarginTop={scaleSize(80)}
		        btnPress={this.onNextStep}
		        bgColor={'#2B8AFF'}
				opacity={.7}
		        btnText={I18n.t('next')}
	      	/>
	      </View>
	    )
    }
}
const styles = StyleSheet.create({
	mneViewStyle: {
		width: scaleSize(680),
		backgroundColor: '#808691',
		borderRadius: scaleSize(10),
		marginTop: scaleSize(40),
	}
})
export default connect(
	state => ({
		accountManageReducer: state.accountManageReducer
	})
)(WriteMnemonic)
