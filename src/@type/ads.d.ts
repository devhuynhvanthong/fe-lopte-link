export interface IAPIPropsAddAds {
    name: string,
    link: string
}
export interface IAPIPropsAddAdsGroup {
    id: number,
    name: string,
}
export interface IAPIDashboardAdsGroup {
    id?: number,
    name?: string,
}
export interface IAPIDashboardAccountITem {
    id: number,
    code: string,
}
export interface IAPIDashboardAds {
    id: number
    name: string
    link: string
    group?: IAPIDashboardAdsGroup
    account: IAPIDashboardAccountITem
}
export interface IAPIPropsAddAdsToGroup {
    id: number,
}
export interface IAPIAddAds {
    id: number,
    name: string,
    link: string
}