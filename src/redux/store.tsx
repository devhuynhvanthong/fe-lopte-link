import rootReducer from './reducer'
import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
