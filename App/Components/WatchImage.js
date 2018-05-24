import React, { Component } from 'react'
import { Image, View, Text } from 'react-native'
import styles from './Styles/WatchImageStyle'

export default class WatchImage extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{uri: 'Watch'}}
          {...this.props}
        />
      </View>
    )
  }
}
