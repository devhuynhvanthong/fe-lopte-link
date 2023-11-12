import * as types from './info.constants'
import {TypeInfo} from "~/@type/info";
import {TypeActionRedux} from "~/redux/info/info.action";

export const initialState: TypeInfo = {
    username: undefined
}
export const InfoReducer = (state = initialState, action: TypeActionRedux) => {
    if (action.payload) {
        switch (action.type) {
        case types.UPDATE:
            return {
                ...state,
                ...action.payload,
                ready: true,
            }
        case types.RESET:
            return initialState
        }
    } else {
        return initialState
    }
}
