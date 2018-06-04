import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Button
} from 'react-native'

import { pubS,DetailNavigatorStyle } from '../../../styles/'
import { setScaleText, scaleSize } from '../../../utils/adapter'
import { Btn,Loading } from '../../../components/'
import { deleteMnemonicAction, resetDeleteStatusAction,createAccountAction } from '../../../actions/accountManageAction'
import Modal from 'react-native-modal'
import { connect } from 'react-redux' 
import I18n from 'react-native-i18n'
import Toast from 'react-native-toast'
class VerifyMnemonic extends Component{
	constructor(props){ 
		super(props)
		this.state={
			mnemonicArr: [],
			isEmpty: true,
			visible: false,
			selectedContainer: [],
			selectedString: '',
			compareString: '',
			loadingVisible: false
		}
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
	}

	componentDidMount(){
		let arr = [],
			mneArr = [];
		arr = this.props.mnemonicText.split(" ")
        console.log('arr===',arr)
		for(let i = 0; i < arr.length; i ++){
               mneArr.push({
                       idx:i,
                       val: arr[i]
               })
        }
        console.log('mneArr===',mneArr)
        let newMnemonic = this.shuffle(mneArr)
        console.log('newMnemonic===',newMnemonic)
		this.setState({
			mnemonicArr: newMnemonic
		})
	}
	
	componentWillReceiveProps(nextProps){
		// if(this.props.accountManageReducer.delMnemonicSuc !== nextProps.accountManageReducer.delMnemonicSuc && nextProps.accountManageReducer.delMnemonicSuc){
		// 	this.props.dispatch(resetDeleteStatusAction())
		// 	this.props.navigator.pop()
		// }
		if(this.props.accountManageReducer.createSucc !== nextProps.accountManageReducer.createSucc && nextProps.accountManageReducer.createSucc){
	      this.setState({
	        loadingVisible: false
	      })
	      Toast.showLongBottom(I18n.t('create_account_successfully'))
	      this.props.navigator.push({
	        screen: 'create_account_success',
	        navigatorStyle: DetailNavigatorStyle,
	        backButtonTitle:I18n.t('back'),
	        backButtonHidden:false,
	        overrideBackPress: true,
	      })
	    }
	}	
	onNavigatorEvent(event){
		switch (event.id) {
	      case 'willAppear':
	        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
	        break
	      case 'willDisappear':
	        this.backHandler.remove()
	        break
	      default:
	        break
	    }
	}
	handleBackPress = () => {
		BackHandler.exitApp()
	}
	shuffle = (array) => {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  while (0 !== currentIndex) {

	    randomIndex = Math.floor(Math.random() * currentIndex)
	    currentIndex -= 1

	    temporaryValue = array[currentIndex]
	    array[currentIndex] = array[randomIndex]
	    array[randomIndex] = temporaryValue
	  }

	  return array
	}



	onSelectItem = (item,selected) => {
		const { selectedContainer,selectedString, compareString } = this.state
		let str = '',
			str1 = '';
		if(selected){
			let index = selectedContainer.findIndex((value) => {
				return value.idx === item.idx
			})
			selectedContainer.splice(index,1)
			
			selectedContainer.map((val) => {
				str = `${str}  ${val.val}`
				str1 = `${str1},${val.val}`
			})
			this.setState({
				isEmpty: false,
				selectedContainer,
				selectedString: str,
				compareString: str1
			})
		}else{
			selectedContainer.push(item)
			selectedContainer.map((val) => {
				str = `${str}  ${val.val}`
				str1 = `${str1},${val.val}`
			})
			this.setState({
				isEmpty: false,
				selectedContainer,
				selectedString: str,
				compareString: str1
			})
		}
	}

	onConfirm = () => {
		const { selectedContainer, compareString} = this.state
		this.setState({
			loadingVisible: false
		})
		if(this.props.mnemonicText.split(" ").toString() === compareString.slice(1,)){
			// this.setState({
			// 	visible: true,
			// })
			this.onCreateAction()
		}else{
			Alert.alert(
		        '',
		        I18n.t('try_again'),
		        [
		          {text: I18n.t('ok'), onPress:() => {console.log('1')}},
		        ],
		    )
			this.setState({
				selectedContainer: []
			})
		}

	}
	onHide = () => {
		this.setState({
			visible: false,
			selectedContainer: []
		})
	}

	onCreateAction = () => {
		const { mnemonicValue, create_usernane, create_psd, create_prompt,create_from } = this.props.accountManageReducer
		this.setState({
			loadingVisible: true,
			// visible: false,
			selectedContainer: []
		},() => {
		    setTimeout(() => {
		      this.props.dispatch(createAccountAction({
		      	mnemonicValue: mnemonicValue,
		        userNameVal: create_usernane,
		        psdVal: create_psd,
		        promptVal: create_prompt,
		        from: create_from
		      }))
		    },1000)
		})

		// this.props.navigator.popToRoot({ animated: false })
		

	}
    render(){
    	const { isEmpty, mnemonicArr, visible, selectedContainer, selectedString, loadingVisible} = this.state
    	let selected = false
    	const { delMnemonicSuc } = this.props.accountManageReducer
    	console.log('delMnemonicSuc===',delMnemonicSuc)
	    return(
	    	<View style={[{flex:1,backgroundColor:'#F5F7FB',alignItems:'center'},pubS.paddingRow35]}>
	    		<Loading loadingVisible={loadingVisible} loadingText={I18n.t('creating')}/>
	    		<View style={[styles.selectViewBox,pubS.center,pubS.paddingRow35]}>
	    			{
	    				isEmpty ? 
	    				<Text style={pubS.font26_5}>Please select the mnemonic you just wrote on the paper</Text>
	    				: 
	    				<Text style={pubS.font28_3}>{selectedString}</Text>
	    			}	
	    		</View>

	    		<View style={{flexWrap: 'wrap',marginTop: scaleSize(10),flexDirection:'row',width: scaleSize(680),justifyContent: 'space-around'}}>
	    			{
	    				mnemonicArr.map((item,index) => {
	    					selected = selectedContainer.find((value) => {
	    						if(value.idx === item.idx){
	    						 	return true 
	    						}else{
	    							return false
	    						}
	    					})
	    					return(
				    			<TouchableOpacity key={index} activeOpacity={.7} onPress={this.onSelectItem.bind(this,item,selected)} style={[styles.selectItem,pubS.center,{backgroundColor: selected ? '#2B8AFF' : '#fff'}]}>
				    				<Text style={ selected ? pubS.font28_4 : pubS.font28_3}>{item.val}</Text>
				    			</TouchableOpacity>
	    					)
	    				})
	    			}
	    		</View>
		      	<Btn
		      		btnMarginTop={scaleSize(60)}
			        btnPress={this.onConfirm}
			        btnText={I18n.t('confirm')}
		      	/>
		      	<Modal
			        isVisible={visible}
			        onBackButtonPress={this.onHide}
			        onBackdropPress={this.onHide}
			        backdropOpacity={.8}
			      >
					 <View style={[{backgroundColor:'#fff',},pubS.center,styles.modalView]}>
					 	<Text style={[pubS.font34_4,{marginTop: -50,textAlign:'center'}]}>{I18n.t('operation_successful')}</Text>
					 	<Text style={[pubS.font26_6,{marginTop: 10,textAlign:'center'}]}>{I18n.t('keep_mnemonic')}</Text>
					 	<TouchableOpacity activeOpacity={.7} style={[styles.modalBtnStyle,pubS.center]} onPress={this.onModalBtn}> 
					 		<Text style={pubS.font34_3}>{I18n.t('ok')}</Text>
					 	</TouchableOpacity>
					 </View>
			    </Modal>

	        </View>
	    )
    }
}

const styles = StyleSheet.create({
	modalBtnStyle:{
		height: scaleSize(87),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor:'#E6E6E6',//
		borderBottomLeftRadius: scaleSize(26),
		borderBottomRightRadius: scaleSize(26),
		// backgroundColor:'red',
		width: '100%',
		position:'absolute',
		bottom:0,
	},
	modalView: {
		width: scaleSize(540),
		height: scaleSize(256),
		borderRadius: scaleSize(26),
		alignSelf:'center'
	},
	selectViewBox:{
		height: scaleSize(280),
		width: scaleSize(680),
		backgroundColor:'#fff',
		marginTop: scaleSize(30)
	},
	selectItem: {
		height: scaleSize(80),
		width: scaleSize(200),
		borderRadius: 3,
		marginTop: scaleSize(20)

	},
})
export default connect(
	state => ({
		accountManageReducer: state.accountManageReducer
	})
)(VerifyMnemonic)