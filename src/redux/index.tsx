import {configureStore} from '@reduxjs/toolkit'
import rootReducer from '~/redux/reducer'
import {createWrapper} from 'next-redux-wrapper'
import thunk, {ThunkMiddleware} from 'redux-thunk'
import {initialState as reduxInfo} from '~/redux/info/info.reducer'

const bindMiddleware = (middleware: Array<ThunkMiddleware>): any => {
    return [...middleware, thunk]
}

const makeStore = (): any => {
    return configureStore({
        reducer: rootReducer,
        preloadedState: {
            info: reduxInfo
        } as any,
        middleware: bindMiddleware([thunk]),
    })
}
export default createWrapper(makeStore)
