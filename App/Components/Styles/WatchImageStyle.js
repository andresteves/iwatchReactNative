import { StyleSheet } from 'react-native'
import Metrics from '../../Themes/Metrics'

const imageSize = {
  width:  146,
  height: 269,
}

export default StyleSheet.create({
  image:        {
    ...imageSize,
    position: 'absolute',
    top:      0,
    left:     0
  },
  pings:        {
    backgroundColor: 'transparent',
  },
  numPingsText: {
    color:      'white',
    fontWeight: 'bold',
    fontSize:   36,
    textAlign:  'center',
    right:      1,
    width:      100,
  },
  pingsText:    {
    color:      'white',
    fontWeight: 'bold',
    fontSize:   11,
    textAlign:  'center',
    width:      100,
  },
  container:    {
    ...imageSize,
    position:       'relative',
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   Metrics.doubleBaseMargin
  }
})
