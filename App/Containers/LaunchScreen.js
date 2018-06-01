//@flow

import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'


export default class LaunchScreen extends Component {

  async componentDidMount()
  {
    setTimeout(()=>{
      this.props.navigation.navigate('WatchConnectScreen')
    },3000)
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.watchImage} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              Getting info from the iWatch into React-Native apps
            </Text>
          </View>

        </ScrollView>
      </View>
    )
  }
}
