import { StackNavigator } from 'react-navigation'
import WatchConnectScreen from '../Containers/WatchConnectScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export const PrimaryNav = StackNavigator({
  WatchConnectScreen: { screen: WatchConnectScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
