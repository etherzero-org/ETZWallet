// 按钮   一种是  宽度与屏幕宽度一致  一种是左右padding  30px
import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import {pubS} from '../styles/'
import { scaleSize, setScaleText,isIphoneX } from '../utils/adapter'
export default class Btn extends Component {
  static defaultProps = {
    btnWidth: isIphoneX() ? 345 : scaleSize(680),
    bgColor: '#2B8AFF',
    btnMarginTop: 0,
    opacity: .7,
    textStyle: pubS.font26_1
  }
  render () {
    const {  btnWidth, btnPress, btnText,btnMarginTop,bgColor,opacity,textStyle } = this.props    
    return (
      <TouchableOpacity style={[{width: btnWidth ,marginTop: btnMarginTop,backgroundColor:bgColor,}, pubS.center, styles.btnView]} activeOpacity={opacity} onPress={btnPress}>
        <Text style={textStyle}>{btnText}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btnView: {
    height: scaleSize(90),
    alignSelf: 'center',
    borderRadius: 4,
  }
})
