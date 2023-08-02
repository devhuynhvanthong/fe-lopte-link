import {NotificationInstance} from "antd/es/notification/interface";
import React from "react";

export interface TypePropLink {
    info?: IAPILink,
    getLink: () => void,
    isLoadingGetLink: boolean
}

export interface IAPILink {
    id: number,
    ads: string,
    converted: string,
    created_time: number,
    code: string
}
export interface IAPIPropsAddLink {
    source: string
}

export interface TypePropsMenu {
    notify: NotificationInstance
    context: React.Context<any>
}