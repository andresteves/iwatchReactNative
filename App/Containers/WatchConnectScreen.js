import React, { Component } from 'react'
import { ScrollView, Text, LayoutAnimation, TextInput, View, Button } from 'react-native'
import * as watch from 'react-native-watch-connectivity'
import COLORS from '../Themes/Colors'
import WatchImage from '../Components/WatchImage'
import ReachabilityText from '../Components/ReachabilityText'
import DualButton from '../Components/DualButton'
import {pickImage} from '../Transforms/PickImageDevice'
import {listenToKeyboard} from '../Transforms/KeyBoard'
import { connect } from 'react-redux'
import WatchActions from '../Redux/WatchRedux'

const LAYOUT_ANIM_PRESET = LayoutAnimation.Presets.easeInEaseOut;

// Styles
import styles from './Styles/WatchConnectScreenStyle'

class WatchConnectScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      messages:   [],
      reachable:  false,
      loading:    false,
      text:       '',
      // heartbeat: 0,
      // timeTakenToReachWatch: '',
      // timeTakenToReply:      '',
      // locationText:   '',
      watchState: watch.WatchState.Inactive,
      fileAPI:    true,
    }
  }

  listenToKeyboard () {
    this.unsubscribeFromKeyboardEvents = listenToKeyboard(height => {
      this.configureNextAnimation
      this.setState({spacerStyle: {height}})
    })
  }

  subscribeToWatchEvents () {
    this.subscriptions = [
      watch.subscribeToWatchState(this.receiveWatchState),
      watch.subscribeToWatchReachability(this.receiveWatchReachability),
    ]
  }

  componentDidMount() {
    this.listenToKeyboard()
    this.subscribeToWatchEvents()
    this.props.getLocation()
    this.props.getHeartBeat()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
      },null,null
    );

    //Being unable to send a route we can only send start and end points
    this.props.sendMessage('{"start":{"latitude": 39.815089, "longitude": -7.507531}, "end":{"latitude": 39.813690, "longitude": -7.505750}}')
  }

  receiveWatchReachability = (err, reachable) => {
    if (!err) {
      this.configureNextAnimation
      this.setState({reachable})
    }
    else {
      console.error('error receiving watch reachability', err)
    }
  }

  configureNextAnimation = () => {
    LayoutAnimation.configureNext(LAYOUT_ANIM_PRESET)
  }

  unsubscribeFromWatchEvents () {
    this.subscriptions.forEach(fn => fn())
  }

  componentWillUnmount () {
    this.unsubscribeFromWatchEvents()
    this.unsubscribeFromKeyboardEvents()
  }

  receiveWatchState = (err, watchState) => {
    if (err) console.error(`Error receiving watch state`, err)
    else {
      console.log('received watch state', watchState)
      this.configureNextAnimation
      this.setState({watchState})
    }
  }

  renderButtons () {
    const {reachable, fileAPI, text}  = this.state
    return (
      <View style={styles.buttons}>
        <Button
          onPress={()=>this.props.sendMessage(this.state.text)}
          title="Send message"
          color="#fff"
        />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <WatchImage />
        <View>
          <ReachabilityText
            watchState={this.state.watchState}
            reachable={this.state.reachable}
            fileTransferTime={this.state.fileTransferTime}
            useDataAPI={this.state.useDataAPI}
            timeTakenToReachWatch={this.props.timeTakenToReachWatch}
            timeTakenToReply={this.props.timeTakenToReply}
          />
        </View>
        <TextInput
          style={styles.textInput}
          ref={e => this.textField = e}
          value={this.state.text}
          onChangeText={text => this.setState({text})}
          placeholder="Message"
        >
        </TextInput>
        {!this.state.loading && this.renderButtons()}
        
        <View style={this.state.spacerStyle}/>

        <TextInput
          style={styles.locationText}
          value={this.props.locationText}
          placeholder="iWatch Location"
        />
       
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    timeTakenToReachWatch: state.watch.timeTakenToReachWatch,
    timeTakenToReply: state.watch.timeTakenToReply,
    locationText: state.watch.locationText,
    heartbeat: state.watch.heartbeat
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage:(watchText) => { dispatch(WatchActions.sendText(watchText)) },
    getLocation: () => { dispatch(WatchActions.getLocationText()) },
    getHeartBeat: () => { dispatch(WatchActions.getHeartBeat()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchConnectScreen)
