import { createSelector } from 'reselect'
import {TypeInfo} from "~/@type/info";

const selectInfo = (state: {info: TypeInfo}) => state

const selectInfos = () => createSelector(selectInfo, state => state.info)

export { selectInfos }
