import { call, put, cps} from 'redux-saga/effects'
import { path } from 'ramda'
import WatchActions, {WatchTypes} from '../Redux/WatchRedux'
import * as watch from 'react-native-watch-connectivity'
import AppleHealthkit from 'rn-apple-healthkit'

export function * getLocationText()
{
    const cb = yield cps(watch.subscribeToMessages);
    if(cb.latitude)
    {
        yield put(WatchActions.locationTextResponse({locationText:cb.latitude+","+cb.longitude}))
    }
}


export function * sendText(action)
{
    const {text} = action

    try{
        if (text.trim().length) {
            const timestamp = new Date().getTime();
            const cb = yield cps(watch.sendMessage,{text, timestamp})
            if(cb.elapsed)
            {
                const timeTakenToReachWatch = cb.elapsed
                const timeTakenToReply      = new Date().getTime() - parseInt(cb.timestamp)
                yield put(WatchActions.getTextResponse(timeTakenToReachWatch, timeTakenToReply))
            }
        }
    }catch(error)
    {
        console.warn(error)
    }
}


export function * getHeartbeat()
{
    const PERMS = AppleHealthKit.Constants.Permissions;
    const healthKitOptions = {
        permissions: {
            read:  [
                PERMS.HeartRate
            ]
        }
    };

    try{
        const cb = yield cps(AppleHealthKit.isAvailable)
        const initCB = yield cps(AppleHealthkit.initHealthKit, healthKitOptions)

        let fetchDate = new Date()
        fetchDate.setSeconds(fetchDate.getSeconds() - 15)

        let options = {
            unit: 'bpm',
            startDate: fetchDate.toISOString(), // required
            endDate: (new Date()).toISOString(), // optional; default now
            ascending: false,
            limit:2,
          }

          const result = yield cps(AppleHealthkit.getHeartRateSamples,options)
          console.warn(result)
          yield put(WatchActions.getHeartBeat(result.value))
    }catch(error)
    {
        console.warn(err)
    }
}