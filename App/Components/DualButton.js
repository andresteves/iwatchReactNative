import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/DualButtonStyle'

export default class DualButton extends Component {
  static defaultProps = {
    disabled:            false,
    textButtonDisabled:  false,
    imageButtonDisabled: false,
    onTextButtonPress:   function () {},
    onImageButtonPress:  function () {}
  };

  render () {
    const {disabled, textButtonDisabled, imageButtonDisabled, onImageButtonPress, onTextButtonPress} = this.props
    const disabledStyle = disabled ? {} : styles.disabled

    return (
      <View style={[styles.buttons, disabledStyle]}>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled || textButtonDisabled}
          onPress={onTextButtonPress}
        >
          <Text style={styles.buttonText}>
            CHANGE MESSAGE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={onImageButtonPress}
          disabled={disabled || imageButtonDisabled}
        >
          <Image
            style={styles.cameraImageStyle}
            source={{uri: 'Camera'}}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
