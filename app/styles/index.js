import { setScaleText, scaleSize } from '../utils/adapter'
import { StyleSheet,ifIphoneX } from 'react-native'
import { switchDrawer } from '../utils/switchDrawer'
import { Platform } from 'react-native'
//main theme color:   #144396
      
const ScanNavStyle = Object.assign({},DetailNavigatorStyle,{
        navBarTextColor:'#fff',
        navBarBackgroundColor:'#000',
        statusBarColor:'#000',
        statusBarTextColorScheme:'light',
      })

const AssetsNavStyle = {
  navBarTextColor: '#FFFFFF',
  navBarTextFontSize: setScaleText(30),
  navBarBackgroundColor: '#144396',//
  navBarComponentAlignment: 'center',
  // navBarButtonColor: '#D2D5DB',//
  // navBarLeftButtonColor:'#D2D5DB',//only ios
  // navBarRightButtonColor:'#2B8AFF',//only ios
  // statusBarHidden: false,
  statusBarColor: '#144396',
  statusBarTextColorScheme: 'light',
  
  screenBackgroundColor: 'white',
  navBarTitleTextCentered: true,
  navBarHeight: scaleSize(87),
  topBarElevationShadowEnabled: false,
  navBarNoBorder: false,

  tabBarHidden: switchDrawer(), 
  navBarHidden: switchDrawer(),
}
const DetailNavigatorStyle = {
  tabBarHidden: true,
  navBarTextColor: '#657CAB',
  navBarTextFontSize: 14,
  navBarBackgroundColor: '#fff',
  navBarComponentAlignment: 'center',
  navBarButtonColor: '#c4c7cc',//back btn
  navBarLeftButtonColor:'#D2D5DB',//only ios
  navBarRightButtonColor:'#2B8AFF',//only ios
  navBarHidden: false,
  statusBarHidden: false,
  screenBackgroundColor: 'white',
  navBarTitleTextCentered: true,
  navBarHeight: scaleSize(87),
  statusBarColor: '#fff',
  statusBarTextColorScheme: 'dark',
  topBarElevationShadowEnabled: false,
  navBarNoBorder: true,
}
const MainThemeNavColor = Object.assign({},DetailNavigatorStyle,{
  navBarTextColor:'#fff',
  navBarBackgroundColor:'#144396',
  statusBarColor:'#144396',
  statusBarTextColorScheme:'light'
})
const TabBarIOSStyle = {
  tabBarHidden: false, // make the tab bar hidden
  //tabBarButtonColor: '#C7CAD0', // change the color of the tab icons and text (also unselected)
  //tabBarSelectedButtonColor: '#2B8AFF', // change the color of the selected tab icon and text (only selected)
  //tabBarBackgroundColor: '#fff', // change the background color of the tab bar
  tabBarTranslucent: false, // change the translucent of the tab bar to false
  // tabBarTextFontFamily: 'Avenir-Medium', //change the tab font family
  // tabBarLabelColor: '#ffb700', // iOS only. change the color of tab text
  // tabBarSelectedLabelColor: 'red', // iOS only. change the color of the selected tab text
  // forceTitlesDisplay: true, // Android only. If true - Show all bottom tab labels. If false - only the selected tab's label is visible.
  // tabBarHideShadow: true // Remove default tab bar top shadow (hairline)

  navBarHeight: 45, // Optional, set the navBar height in pixels.
  topTabsHeight: scaleSize(98),
}
const TabBarAppStyle = {
  keepStyleAcrossPush: false,
  tabBarHidden: false, // make the tab bar hidden
  tabBarButtonColor: '#C7CAD0',
  tabBarSelectedButtonColor: '#2B8AFF', 
  tabBarBackgroundColor: '#fff',
  tabBarTranslucent: false, // change the translucent of the tab bar to false
  forceTitlesDisplay: true, // Android only. If true - Show all bottom tab labels. If false - only the selected tab's label is visible.
  tabBarHideShadow: true, // iOS only. Remove default tab bar top shadow (hairline)

  tabBarTextFontFamily: 'Avenir-Medium', //change the tab font family
  // tabBarLabelColor: '#ffb700', // iOS only. change the color of tab text
  // tabBarSelectedLabelColor: 'red', // iOS only. change the color of the selected tab text

}

// login register screen  nav bar style
const SingleScreenAppNavigatorStyle = {
  // Common
  navBarTextColor: '#fff', // change the text color of the title (remembered across pushes)
  navBarTextFontSize: 18, // change the font size of the title
  // navBarTextFontFamily: 'font-name', // Changes the title font
  navBarBackgroundColor: '#000', // change the background color of the nav bar (remembered across pushes)
  // navBarCustomView: 'example.CustomTopBar', // registered component name
  navBarComponentAlignment: 'center', // center/fill
  navBarButtonColor: '#fff', // Change color of nav bar buttons (eg. the back button) (remembered across pushes)

  navBarHidden: false, // make the nav bar hidden
  // navBarHideOnScroll: false, // make the nav bar hidden only after the user starts to scroll
  // navBarTranslucent: false, // make the nav bar semi-translucent, works best with drawUnderNavBar:true
  // navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
  navBarNoBorder: true, // hide the navigation bar bottom border (hair line). Default false
  // drawUnderNavBar: false, // draw the screen content under the nav bar, works best with navBarTranslucent:true
  // drawUnderTabBar: false, // draw the screen content under the tab bar (the tab bar is always translucent)
  // navBarBlur: false, // blur the entire nav bar, works best with drawUnderNavBar:true
  // tabBarHidden: false, // make the screen content hide the tab bar (remembered across pushes)
  statusBarHidden: false, // make the status bar hidden regardless of nav bar state
  statusBarTextColorScheme: 'light', // text color of status bar, 'dark' / 'light' (remembered across pushes)
  // navBarSubtitleColor: 'red', // subtitle color
  // navBarSubtitleFontFamily: 'font-name', // subtitle font
  screenBackgroundColor: 'white', // Default screen color, visible before the actual react view is rendered
  // orientation: 'portrait' // Sets a specific orientation to a modal and all screens pushed to it. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
  // disabledButtonColor: '#ff0000' // chnaged the navigation bar button text color when disabled.

  // iOS only
  // statusBarTextColorSchemeSingleScreen: 'light', // same as statusBarTextColorScheme but does NOT remember across pushes
  // statusBarHideWithNavBar: false, // hide the status bar if the nav bar is also hidden, useful for navBarHidden:true
  // statusBarBlur: true, // blur the area under the status bar, works best with navBarHidden:true

  // disabledBackGesture: false, // default: false. Disable the back gesture (swipe gesture) in order to pop the top screen.
  // disabledSimultaneousGesture: true, // default: true. Disable simultaneous gesture recognition.
  // screenBackgroundImageName: '<name of image in Images.xcassets>', // Optional. default screen background image.
  // rootBackgroundImageName: '<name of image in Images.xcassets>', // Static while you transition between screens. Works best with screenBackgroundColor: 'transparent'

  navBarButtonFontSize: 20, // Change font size nav bar buttons (eg. the back button) (remembered across pushes)
  navBarButtonFontWeight: '400', // Change font weight nav bar buttons (eg. the back button) (remembered across pushes)

  navBarLeftButtonFontSize: 17, // Change font size of left nav bar button
  // navBarLeftButtonColor: 'red', // Change color of left nav bar button
  navBarLeftButtonFontWeight: '400', // Change font weight of left nav bar button

  navBarRightButtonFontSize: 17, // Change font size of right nav bar button
  navBarRightButtonColor: 'red', // Change color of right nav bar button
  navBarRightButtonFontWeight: '400', // Change font weight of right nav bar button

  // // Android only
  // navigationBarColor: '#000000', // change the background color of the bottom native navigation bar.
  navBarTitleTextCentered: true, // default: false. centers the title.
  topBarElevationShadowEnabled: false, // default: true. Disables TopBar elevation shadow on Lolipop and above
  // statusBarColor: '#000', // change the color of the status bar.
  // collapsingToolBarImage: "http://lorempixel.com/400/200/", // Collapsing Toolbar image.
  // collapsingToolBarImage: require('../../img/topbar.jpg'), // Collapsing Toolbar image. Either use a url or require a local image.
  // navBarTextFontBold: false, // Optional. Set the title to bold.
  navBarHeight: 45 // Optional, set the navBar height in pixels.
  // topTabsHeight: scaleSize(98), // Optional, set topTabs height in pixels.
  // topBarBorderColor: 'red', //Optional, set a flat border under the TopBar.
  // topBarBorderWidth: 2, // Optional, set the width of the border
}

const pubS = {
  posCenter: {
    position: 'absolute',
    alignSelf: 'center',
  },
  logoStyle:{
    width: scaleSize(44),
    height:scaleSize(44),
    marginTop: scaleSize(22)
  },

  paddingCloumn20:{
    paddingTop: scaleSize(20),
    paddingBottom: scaleSize(20)
  },
  paddingRow40:{
    paddingLeft: scaleSize(40),
    paddingRight: scaleSize(40)
  },
  paddingRow35:{
    paddingLeft: scaleSize(35),
    paddingRight: scaleSize(35)
  },
  padding50:{
    paddingLeft: scaleSize(50),
    paddingRight: scaleSize(50)
  },
  rowCenter2: {
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  rowCenterJus: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  rowCenterAro: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-around',
  },
  rowCenter:{
    flexDirection:'row',
    alignItems: 'center',
  },
  rowBetween:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  rowEnd:{
    flexDirection:'row',
    alignItems:'flex-end',
  },
  textInputWH: {
    height: scaleSize(99),
    width: scaleSize(664),
    alignSelf:'center'
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  arrowViewStyle:{
    width: scaleSize(45),
    height: scaleSize(43),
    alignItems:'flex-end',
    position:'absolute',
    right:4,
    top:scaleSize(32)
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomStyle1:{
    borderColor:'#DBDFE6',
    borderBottomWidth:1,
  },
  bottomStyle: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor:'#dce4e6',
  },
  topBorderStyle: {
    borderColor: '#dce4e6',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  borderStyle: {
    borderColor: '#dce4e6',
    borderWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flex: 1,
    backgroundColor:'#fff',
    // width: scaleSize(750),
  },
  fullWH:{
    width:'100%',
    height: '100%'
  },
  paddingRow_24: {
    paddingLeft: scaleSize(24),
    paddingRight: scaleSize(24),
  },
  font22_1:{
    color:'#FF9126',
    fontSize: setScaleText(22)
  },
  font22_2:{
    color:'#FEFEFE',
    fontSize: setScaleText(22)
  },
  font22_3:{
    color:'#657CAB',
    fontSize: setScaleText(22)
  },
  font22_4:{
    color:'#A1A4A8',
    fontSize: setScaleText(22)
  },
  font22_5:{
    color:'#FF6060',
    fontSize: setScaleText(22)
  },
  font24_1:{
    color:'#FF6060',
    fontSize: setScaleText(24)
  },
  font24_2:{
    color:'#657CAB',
    fontSize: setScaleText(24)
  },
  font24_3:{
    color:'#A1C0FF',
    fontSize: setScaleText(24)
  },
  font24_4:{
    color:'#C7CACF',
    fontSize: setScaleText(24)
  },
  font24_5:{
    color:'#A1A4A8',
    fontSize: setScaleText(24)
  },
  font24_6:{
    color:'#fff',
    fontSize: setScaleText(24)
  },
  font24_7:{
      color:'#2B8AFF',
      fontSize: setScaleText(24)
  },
  font24_8:{
      color:'#080E5D',
      fontSize: setScaleText(24)
  },
  font26_1:{
    color:'#fff',
    fontSize: setScaleText(26)
  },
  font26_2:{
    color:'#A1A4A8',
    fontSize: setScaleText(26)
  },
  font26_3:{
    color:'#fff',
    fontSize: setScaleText(26)
  },
  font26_4:{
    color:'#657CAB',
    fontSize: setScaleText(26)
  },
  font26_5:{
    color:'#C7CACF',
    fontSize: setScaleText(26)
  },
  font26_6:{
    color:'#000',
    fontSize: setScaleText(26)
  },
  font26_7:{
      color:'#2B8AFF',
      fontSize: setScaleText(26)
  },
  font28_1:{
      color:'#95C4FF',
      fontSize: setScaleText(28)
  },
  font28_2:{
      color:'#2B8AFF',
      fontSize: setScaleText(28)
  },
  font28_3:{
      color:'#657CAB',
      fontSize: setScaleText(28)
  },
  font28_4:{
      color:'#fff',
      fontSize: setScaleText(28)
  },
  font28_5:{
      color:'##FEFEFE',
      fontSize: setScaleText(28)
  },
  font30_1:{
    color:'#fff',
    fontSize: setScaleText(30)
  },
  font30_2:{
    color:'#657CAB',
    fontSize: setScaleText(30)
  },
  font30_3:{
    color:'#FEFEFE',
    fontSize: setScaleText(30)
  },
  font30_4:{
    color:'#FFF422',
    fontSize: setScaleText(30)
  },
  font32_1:{
    color:'#2B8AFF',
    fontSize: setScaleText(32)
  },
  font34_1:{
    color:'#657CAB',
    fontSize: setScaleText(34)
  },
  font34_2:{
    color:'#000',
    fontSize: setScaleText(34)
  },
  font34_3:{
    color:'#157EFB',
    fontSize: setScaleText(34)
  },
  font34_4:{
    color:'#000',
    fontSize: setScaleText(34)
  },
  font36_1:{
    color:'#657CAB',
    fontSize: setScaleText(36)
  },
  font36_2:{
    color:'#080E5D',
    fontSize: setScaleText(36)
  },
  font36_3:{
    color:'#FFF222',
    fontSize: setScaleText(36)
  },
  font36_4:{
    color:'#FFF',
    fontSize: setScaleText(36)
  },
  font36_5:{
    color:'#B92B31',
    fontSize: setScaleText(36)
  },
  font54_1:{
    color:'#fff',
    fontSize: setScaleText(54)
  },
  font60_1:{
    color:'#657CAB',
    fontSize: setScaleText(60)
  },
  font60_2:{
    color:'#4C69FF',
    fontSize: setScaleText(60)
  },
  font72_1:{
    color:'#fff',
    fontSize: setScaleText(72)
  },
}
export {
  DetailNavigatorStyle,
  SingleScreenAppNavigatorStyle,
  pubS,
  AssetsNavStyle,
  MainThemeNavColor,
  TabBarAppStyle,
  ScanNavStyle,
  TabBarIOSStyle
}
