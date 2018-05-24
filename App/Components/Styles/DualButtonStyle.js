import { StyleSheet } from 'react-native'
import COLORS from '../../Themes/Colors'

export default StyleSheet.create({
  buttons:          {
    flexDirection: 'row',
  },
  button:           {
    borderTopLeftRadius:    6,
    borderBottomLeftRadius: 6,
    backgroundColor:        COLORS.facebook,
    padding:                10,
    height:                 44,
    marginRight:            1,
  },
  cameraButton:     {
    backgroundColor:         COLORS.facebook,
    width:                   56,
    height:                  44,
    borderTopRightRadius:    6,
    borderBottomRightRadius: 6,
    alignItems:              'center',
    justifyContent:          'center',
    alignSelf:               'center'
  },
  cameraImageStyle: {
    width:  34.68,
    height: 24.31,
  },
  buttonText:       {
    color:         COLORS.silver,
    fontSize:      20,
    letterSpacing: 0.5,
    fontWeight:    'bold'
  },
})
