import * as types from './info.constants'
import {TypeInfo} from "~/@type/info";

export interface TypeActionRedux {
    payload: any,
    type: string
}

export interface TypeReduxPayload {
    info: TypeInfo
}

export const updateInfo = (payload: TypeReduxPayload) => ({
    type: types.UPDATE,
    payload,
})

export const resetInfo = () => ({
    type: types.RESET,
})
