import { InfoReducer } from './info/info.reducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    info: InfoReducer,
})

export default rootReducer
