import React, { Component } from 'react'
import { ScrollView, Text, LayoutAnimation, TextInput, View } from 'react-native'
import * as watch from 'react-native-watch-connectivity'
import COLORS from '../Themes/Colors'
import WatchImage from '../Components/WatchImage'
import ReachabilityText from '../Components/ReachabilityText'
import DualButton from '../Components/DualButton'
import {pickImage} from '../Transforms/PickImageDevice'
import {listenToKeyboard} from '../Transforms/KeyBoard'

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
      locationText:   '',
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

  receiveApplicationContext = (err, applicationContext) => {
    if (!err) {
      console.log('received application context', applicationContext)
      this.setState({applicationContext})
    }
    else {
      console.error('error receiving application context', err)
    }
  }

  subscribeToWatchEvents () {
    this.subscriptions = [
      watch.subscribeToMessages(this.receiveMessage),
      watch.subscribeToWatchState(this.receiveWatchState),
      watch.subscribeToWatchReachability(this.receiveWatchReachability),
      watch.subscribeToApplicationContext(this.receiveApplicationContext),
    ]
  }

  componentDidMount() {
    this.listenToKeyboard()
    this.subscribeToWatchEvents()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
      },null,null
    );

    watch.updateApplicationContext({context: 'context'})
  }

  _pickImage = () => {
    return pickImage('Send Image To Watch', !this.state.fileAPI)
  }

  pickImage = () => {
    const fileAPI = this.state.fileAPI
    this._pickImage().then(image => {
      this.configureNextAnimation
      if (!image.didCancel) {
        this.setLoading();
        const startTransferTime = new Date().getTime()
        let promise

        if (fileAPI && image.uri) promise = watch.transferFile(image.uri)
        else if (image.data) promise = watch.sendMessageData(image.data)
        else promise = Promise.reject()

        promise.then(resp => {
          const endTransferTime = new Date().getTime()
          const elapsed         = endTransferTime - startTransferTime
          console.log(`successfully transferred in ${elapsed}ms`, resp)
          this.configureNextAnimation()
          this.setState({
            fileTransferTime:      elapsed,
            useDataAPI:            !fileAPI,
            timeTakenToReachWatch: null,
            timeTakenToReply:      null
          })
        }).catch(err => {
          console.warn('Error sending message data', err, err.stack)
          this.configureNextAnimation
        }).finally(() => {
          this.setState({loading: false})
        })
      }
    }).catch(err => {
      console.error(`Error picking image`, err)
    })
  }

  setLoading () {
    this.setState({
      loading:               true,
      timeTakenToReachWatch: null,
      timeTakenToReply:      null,
      fileTransferTime:      null
    })
  }

  sendMessage = () => {
    const text = this.state.text
    if (text.trim().length) {
      const timestamp = new Date().getTime()
      this.configureNextAnimation
      this.setLoading()

      watch.sendMessage({text, timestamp}, (err, resp) => {
        if (!err) {
          console.log('response received', resp)
          const timeTakenToReachWatch = resp.elapsed
          const timeTakenToReply      = new Date().getTime() - parseInt(resp.timestamp)
          this.configureNextAnimation
          this.setState({timeTakenToReachWatch, timeTakenToReply, loading: false})
        }
        else {
          console.error('error sending message to watch', err)
        }
      })
    }
  }

  receiveWatchReachability = (err, reachable) => {
    if (!err) {
      console.log('received watch reachability', reachable)
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

  receiveMessage = (err, message, replyHandler) => {
    if (err) console.error(`Error receiving message`, err)
    else {
      console.log('app received message', message)
      
      if (message.message === 'ping') {
        this.setState({pings: this.state.pings + 1})
        if (replyHandler) {
          replyHandler({message: 'pong'})
        }
        else {
          console.error('no reply handler...')
        }
      }else{
        this.setState({locationText:message.latitude+","+message.longitude})
      }

      this.configureNextAnimation
      this.setState({messages: [...this.state.messages, message]})
    }
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
      <View>
        <DualButton
          textButtonDisabled={!text.trim().length || !reachable}
          imageButtonDisabled={!reachable}
          onTextButtonPress={this.sendMessage}
          onImageButtonPress={this.pickImage}
          disabled={!reachable}
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
            timeTakenToReachWatch={this.state.timeTakenToReachWatch}
            timeTakenToReply={this.state.timeTakenToReply}
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
          value={this.state.locationText}
          placeholder="iWatch Location"
        />
       
      </View>
    )
  }
}

export default WatchConnectScreen
