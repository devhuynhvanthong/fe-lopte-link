import {combineReducers} from 'redux'
import {InfoReducer} from "~/redux/info/info.reducer";

const rootReducer = combineReducers({
    info: InfoReducer
})

export default rootReducer
