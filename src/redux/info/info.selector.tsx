import { createSelector } from 'reselect'
import {TypeInfo} from "~/@type/info";

const selectInfo = (state: TypeInfo) => state

const selectInfos = () => createSelector(selectInfo, state => state)

export { selectInfos }
