import {IAPIDashboardAccountITem, IAPIDashboardAdsGroup} from "~/@type/ads";

export interface IAPIDashboardConfig {
    id: number
    ads: IAPIDashboardAdsGroup
    time_ads: number
    mode_screen: boolean
    account: IAPIDashboardAccountITem
}