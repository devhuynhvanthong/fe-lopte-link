import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '~/redux/reducer'
import { createWrapper } from 'next-redux-wrapper'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { initialState as reduxInfo } from '~/redux/info/info.reducer'
const bindMiddleware = (middleware: Array<ThunkMiddleware>): any => {
    return [...middleware, thunk]
}
const preload: any = {
    info: reduxInfo,
}
const makeStore = (): any => {
    return configureStore({
        reducer: rootReducer,
        preloadedState: preload as any,
        middleware: bindMiddleware([thunk]),
    })
}
export default createWrapper(makeStore)
