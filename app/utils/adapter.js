/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */




import { Dimensions, PixelRatio, Platform } from 'react-native'

const devicesPR = null
export function getPixelRatio () {
  devicesPR = PixelRatio.get() // 设备的像素密度
}
getPixelRatio()

export const deviceWidth = Dimensions.get('window').width // 设备的宽度  dp
export const deviceHeight = Dimensions.get('window').height // 设备的高度
let fontScale = PixelRatio.getFontScale() // 返回字体大小缩放比例

//iponeX
const X_WIDTH = 375;
const X_HEIGHT = 812;

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX() {
  return (
      Platform.OS === 'ios' &&
      ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
          (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
  )
}


// px转换成dp
const w2 = 750 / devicesPR //inch  750
const h2 = 1334 / devicesPR // 1334
const scale = Math.max(deviceHeight / h2, deviceWidth / w2) // 获取缩放比例
console.log('获取缩放比例==',scale)
// 1080*2160

/**
 * 根据是否是iPhoneX返回不同的样式
 * @param iphoneXStyle
 * @param iosStyle
 * @param androidStyle
 * @returns {*}
 */
export function ifIphoneX(iphoneXStyle, iosStyle = {}, androidStyle) {
  if (isIphoneX()) {
      return iphoneXStyle;
  } else if (Platform.OS === 'ios') {
      return iosStyle
  } else {
      if (androidStyle) return androidStyle;
      return iosStyle
  }
}
/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
// 字体缩放
export function setScaleText (size: number) {
  size = Math.round(size * scale + 0.5)
  return size / devicesPR
}

// 宽 高 尺寸缩放
export function scaleSize (size: number) {
  let s;
  if(Platform.OS == 'ios'){
    s = scale
  }else{
    if(scale > 1.5 && scale < 1.7){
      s = 1.5
    }else{
      s = scale
    }
  }
  size = Math.round(size * s + 0.5)
  return size / devicesPR
}
