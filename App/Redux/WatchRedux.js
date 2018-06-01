import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    getLocationText: ['location'],
    sendText: ['text'],
    getTextResponse:['timeTakenToReachWatch','timeTakenToReply'],
    locationTextResponse:["locationText"],
    getHeartBeat: ['heartBeat']
  })
  
  export const WatchTypes = Types
  export default Creators
  
  /* ------------- Initial State ------------- */
  
  export const INITIAL_STATE = Immutable({
    locationText: "",
    loading:               false,
    text: null,
    timeTakenToReachWatch: null,
    timeTakenToReply:      null,
    fileTransferTime:      null,
    heartBeat:  0,
  })

  /* ------------- Reducers ------------- */


// fetch Location from iWatch
export const getLocationText = (state, action) => {
    const { locationText } = action
    return state.merge({ locationText })
}

// send text to iWatch
export const sendText = (state, {text}) => 
    state.merge({ text, locationText:'', loading:true, timeTakenToReachWatch:'', timeTakenToReply:'' })


export const getTextResponse = (state, action) => {
    const { timeTakenToReachWatch, timeTakenToReply } = action
    return state.merge({ text:'', locationText:'', loading:true, timeTakenToReachWatch, timeTakenToReply })
}

export const locationTextResponse = (state,action) => {
    const { locationText } = action
    return state.merge({ locationText: locationText.locationText })
}

export const getHeartBeat = (state,action) => {
    const {heartBeat} = action
    return state.merge({ heartBeat: heartBeat })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_LOCATION_TEXT]: getLocationText,
    [Types.SEND_TEXT]: sendText,
    [Types.GET_TEXT_RESPONSE]: getTextResponse,
    [Types.LOCATION_TEXT_RESPONSE]: locationTextResponse,
    [Types.GET_HEART_BEAT]: getHeartBeat,
})