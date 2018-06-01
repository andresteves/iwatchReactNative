import { StyleSheet } from 'react-native'
import Metrics from '../../Themes/Metrics'
import COLORS from '../../Themes/Colors'

export default StyleSheet.create({
  container:    {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: COLORS.banner,
    width:           Metrics.screenWidth
  },
  welcome:      {
    fontSize:  20,
    textAlign: 'center',
    margin:    10,
  },
  instructions: {
    textAlign:    'center',
    color:        '#333333',
    marginBottom: 5,
  },
  locationText:    {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height:          60,
    width:           300,
    color:           'white',
    marginTop:    Metrics.doubleBaseMargin,
    borderRadius:    6,
    padding:         20,
    alignSelf:       'center'
  },
  textInput:    {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height:          60,
    width:           300,
    color:           'white',
    marginBottom:    Metrics.doubleBaseMargin,
    borderRadius:    6,
    padding:         20,
    alignSelf:       'center'
  },
  disabled:     {
    opacity: 0.4
  },
  buttons:          {
    borderRadius: 6,
    backgroundColor:        COLORS.facebook,
    height:                 44,
    padding:                5,
    width:                  150,
    marginRight:            1,
  },
  buttonText:       {
    color:         COLORS.silver,
    fontSize:      20,
    letterSpacing: 0.5,
    fontWeight:    'bold'
  },
})
