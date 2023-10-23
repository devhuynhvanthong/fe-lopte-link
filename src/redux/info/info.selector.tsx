import { createSelector } from 'reselect'
import {ReduxPayload} from "~/redux/info/info.reducer";

const selectInfo = (state: ReduxPayload) => state.info

const selectInfos = () => createSelector(selectInfo, state => state)

export { selectInfos }
