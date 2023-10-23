import * as types from './info.constants'
import {TypeInfo} from "~/@type/info";

export interface TypeActionRedux {
    payload: TypeInfo,
    type: string
}

export const updateInfo = (payload: TypeInfo) => ({
    type: types.UPDATE,
    payload,
})

export const resetInfo = () => ({
    type: types.RESET,
})
