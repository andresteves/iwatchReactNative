import { StyleSheet } from 'react-native'
import Metrics from '../../Themes/Metrics'

export default StyleSheet.create({
  component: {
    marginBottom: Metrics.doubleBaseMargin,
    color:        'white',
    marginLeft:   Metrics.doubleBaseMargin,
    marginRight:  Metrics.doubleBaseMargin,
    textAlign:    'center',
  },
  boldText:  {
    fontWeight: 'bold'
  },
})
