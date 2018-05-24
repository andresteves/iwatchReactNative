import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import {WatchState} from 'react-native-watch-connectivity'
import COLORS from '../Themes/Colors'

import styles from './Styles/ReachabilityTextStyle'

export default class ReachabilityText extends Component {
  
  renderReachabilityText () {
    const reachable        = this.props.reachable
    const style            = [styles.boldText, {color: reachable ? COLORS.green : COLORS.bloodOrange}]
    const reachabilityText = (
      <Text style={style}>
        {reachable ? 'REACHABLE' : 'UNREACHABLE'}
      </Text>
    )
    return reachabilityText
  }

  renderMessageTimeText () {
    const {timeTakenToReachWatch, timeTakenToReply} = this.props
    if (timeTakenToReachWatch && timeTakenToReply) {
      return (
        <Text style={styles.component}>
          The last message took <Text style={styles.boldText}>{timeTakenToReachWatch + 'ms '}</Text>
          to reach the watch. It then took <Text style={styles.boldText}>{timeTakenToReply + 'ms '}</Text>
          for the response to arrive
        </Text>
      )
    }
    return null
  }

  renderFileTransferTimeText () {
    const {fileTransferTime, useDataAPI} = this.props

    if (fileTransferTime) {
      return (
        <Text style={styles.component}>
          The image took
          <Text style={styles.boldText}>{' ' + fileTransferTime + 'ms '}</Text>
          to transfer using the {useDataAPI ? 'message data api' : 'file transfer api'}
        </Text>
      )
    }

    return null
  }

  renderWatchState () {
    const watchState = this.props.watchState
    const active     = watchState === WatchState.Activated
    const style      = [styles.boldText, {color: active ? COLORS.green : COLORS.bloodOrange}]
    return (
      <Text style={style}>
        {watchState.toUpperCase()}
      </Text>
    )
  }

  render () {
    return (
      <View>
        <Text style={styles.component}>
          Watch session is {this.renderWatchState()}
          &nbsp;and {this.renderReachabilityText()}
        </Text>
        {this.renderMessageTimeText()}
        {this.renderFileTransferTimeText()}
      </View>
    )
  }
}
