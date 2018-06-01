import { takeLatest, all, take } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

// import { StartupTypes } from '../Redux/StartupRedux'
// import { GithubTypes } from '../Redux/GithubRedux'
import { WatchTypes } from '../Redux/WatchRedux'

/* ------------- Sagas ------------- */

// import { startup } from './StartupSagas'
// import { getUserAvatar } from './GithubSagas'
import { sendText, getLocationText } from './WatchSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    // takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(WatchTypes.SEND_TEXT, sendText),

    takeLatest(WatchTypes.GET_LOCATION_TEXT, getLocationText),

    // some sagas receive extra parameters in addition to an action
    // takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api)
  ])
}
