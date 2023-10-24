import {NotificationInstance} from "antd/es/notification/interface";
import React from "react";
import {typeNotify} from "~/pages/_app";

export interface TypePropLink {
    info?: IAPILink,
    getLink: () => void,
    isLoadingGetLink: boolean,
    timeConfig: number
}
export interface IAPIDashboardLinks {
    id: number,
    source: string,
    converted: string,
    created_time: number,
    code_account: string,
    view: number,
    lock: boolean
}
export interface IAPILink {
    id: number,
    ads: string,
    converted: string,
    created_time: number,
    code: string,
    lock: boolean
}
export interface IAPIPropsAddLink {
    source: string
}

export interface TypePropsLayout {
    openNotification: (message: string, type: string) => void,
    typeNotify: typeof typeNotify,
    domain?: string
}