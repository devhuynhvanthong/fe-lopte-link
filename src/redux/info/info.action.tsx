import {TypeInfo} from "~/@type/info";
import * as types from './info.constants'
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
