import React, { Component } from 'react'
import { Image, View, Text } from 'react-native'
import styles from './Styles/WatchImageStyle'

export default class WatchImage extends Component {

  static defaultProps = {
    heartbeat: 0
  };

  render () {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{uri: 'Watch'}}
          {...this.props}
        />

        <View style={styles.pings}>
          <Text style={styles.numPingsText}>{this.props.heartbeat}</Text>
          <Text style={styles.pingsText}>BPM</Text>
        </View>
      </View>
    )
  }
}
