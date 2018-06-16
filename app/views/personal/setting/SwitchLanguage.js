import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize,ifIphoneX } from '../../../utils/adapter'
import { switchLanguageAction } from '../../../actions/switchLanguageAction'
import { connect } from 'react-redux' 
import { toSplash } from '../../../root' 
import I18n from 'react-native-i18n'
class Language extends Component {
	constructor(props){
		super(props)
		this.state={
			
		}
		
	}

	render(){
		const { languageText, isSelected,onSelect, bgColor } = this.props
		return(
			<TouchableOpacity style={[styles.lanViewStyle,pubS.rowCenterJus,pubS.paddingRow40,{backgroundColor:bgColor}]}  activeOpacity={.7} onPress={onSelect}>
				<Text style={pubS.font28_3}>{languageText}</Text>
				<View style={[styles.selectIcon,pubS.center,{borderWidth: isSelected?0:1,borderColor: isSelected?'transparent':'#CACDD2',backgroundColor:isSelected?'#2B8AFF':'#fff'}]}>
               		<Image source={require('../../../images/xhdpi/btn_ico_addassets_pre.png')} style={styles.selectImage}/>
           	   </View>
			</TouchableOpacity>
		)
	}
}

class SwitchLanguage extends Component{
  constructor(props){
  	super(props)
  	this.state={
  		selectedLan: '',
  		select_zh: false,
  		select_en: true,
  		select_ru: false,
  		languages: '',
  		bgColorZh: '#fff',
		bgColorEn: '#EEEEEE',
		bgColorRu: '#fff',
  	}
  	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  	onNavigatorEvent(event){
	    if (event.type == 'NavBarButtonPress') {
	    	if(event.id === 'save_switch_language'){
	    		localStorage.save({
	    			key: 'lang',
	    			expires: null,
	    			data:{
	    				selectedLan: this.state.selectedLan
	    			}
	    		})

				this.props.dispatch(switchLanguageAction(this.state.selectedLan))
				toSplash()
	    	}
	  	}
	}
	componentWillMount(){
		let a  =I18n.currentLocale()

	    I18n.currentLocale().search(/zh/) === 0 ? a = 'zh' : null
	    
	    if(Platform.OS === 'ios'){
	      switch(a){
	        case 'zh':
	          this.onSelectZh()
	          break
	        case 'en':
	          this.onSelectEn()
	          break
	        case 'ru-RU':
	          this.onSelectRu()
	          break
	        default:
	          break
	      }
	    }else{
	      switch(I18n.currentLocale()){
	        case 'zh-CN':
	          this.onSelectZh()
	          break
	        case 'en-US':
	          this.onSelectEn()
	          break
	        case 'ru-RU':
	          this.onSelectRu()
	          break
	        default:
	          break
	      }
	    }
    

  // 		localStorage.load({
  // 			key:'lang',
  // 			autoSync: true,
  // 		}).then( ret => {
  			
  // 		}).catch( err => {

  // 		})
  	// 	if(Platform.OS === 'ios'){
	  // 		switch(I18n.currentLocale()){
			// 	case 'zh-Hans-US':
			// 		this.onSelectZh()
			// 		break
			// 	case 'en':
			// 		this.onSelectEn()
			// 		break
			// 	case 'ru-RU':
			// 		this.onSelectRu()
			// 		break
			// 	default:
			// 		break
			// }
  	// 	}else{
  			switch(I18n.currentLocale()){
				case 'zh-CN':
					this.onSelectZh()
					break
				case 'en-US':
					this.onSelectEn()
					break
				case 'ru-RU':
					this.onSelectRu()
					break
				default:
					break
			}
  		// }
  			
  	}

	onSelectZh = () => {
		if(!this.state.select_zh){
			this.setState({
				select_zh: true,
		  		select_en: false,
		  		select_ru: false,
		  		bgColorZh: '#eee',
				bgColorEn: '#fff',
				bgColorRu: '#fff',
			},() => {
				this.setState({
					selectedLan: 'zh-CN'
				})
			})
		}
	}
	onSelectEn = () => {
		if(!this.state.select_en){
			this.setState({
				select_zh: false,
		  		select_en: true,
		  		select_ru: false,
		  		bgColorZh: '#fff',
				bgColorEn: '#eee',
				bgColorRu: '#fff',
			},() => {
				this.setState({
					selectedLan: 'en-US'
				})
			})
		}
	}
	onSelectRu = () => {
		if(!this.state.select_ru){
			this.setState({
				select_zh: false,
		  		select_en: false,
		  		select_ru: true,
				bgColorZh: '#fff',
				bgColorEn: '#fff',
				bgColorRu: '#eee',
			},() => {
				this.setState({
					selectedLan: 'ru-RU'
				})
			})
		}
	}
  	render(){
  		const { select_zh, select_en, select_ru,bgColorZh, bgColorEn, bgColorRu } = this.state
	    return(
	      <View style={{flex:1,backgroundColor: '#F5F7FB'}}>
	      	{
	          Platform.OS === 'ios' ?
			  <StatusBar backgroundColor="#000000"  barStyle="dark-content" animated={true} />
	          : null
	        }
	      	<Language
	      		languageText={'简体中文'}
	      		isSelected={select_zh}
	      		onSelect={this.onSelectZh}
	      		bgColor={bgColorZh}
	      	/>
	      	<Language
	      		languageText={'English'}
	      		isSelected={select_en}
	      		onSelect={this.onSelectEn}
	      		bgColor={bgColorEn}
	      	/>
	      	{
		      	// <Language
		      	// 	languageText={'Русский язык'}
		      	// 	isSelected={select_ru}
		      	// 	onSelect={this.onSelectRu}
		      	// 	bgColor={bgColorRu}
		      	// />
	      	}
	      </View>
	    )
  	}
}

const styles = StyleSheet.create({
	lanViewStyle:{
		...ifIphoneX(
			{
				height: scaleSize(120),
				width: 375,
				// backgroundColor:'#fff',
				borderTopWidth:StyleSheet.hairlineWidth,
				borderColor:'#EEEEEE',
			},
			{
				height: scaleSize(120),
				width: scaleSize(750),
				// backgroundColor:'#fff',
				borderTopWidth:StyleSheet.hairlineWidth,
				borderColor:'#EEEEEE',
			},
			{
				height: scaleSize(120),
				width: scaleSize(750),
				// backgroundColor:'#fff',
				borderTopWidth:StyleSheet.hairlineWidth,
				borderColor:'#EEEEEE',
			},
		)
	},
	selectImage:{
	    height: scaleSize(40),
	    width: scaleSize(40),
	    zIndex: 1000,
	},
	selectIcon: {
	    height: scaleSize(40),
	    width: scaleSize(40),
	    borderRadius: 100,  
	},
})
export default connect(
	state => ({
		switchLanguageReducer: state.switchLanguageReducer
	})
)(SwitchLanguage)