import { createSelector } from 'reselect'
import {TypeInfo} from "~/@type/info";
import {IAPIDataAnalytic} from "~/@type/layout";

const selectInfo = (state: {
    info: TypeInfo,
    analytic: IAPIDataAnalytic
}) => state

const selectInfos = () => createSelector(selectInfo, state => state.info)

export { selectInfos }
