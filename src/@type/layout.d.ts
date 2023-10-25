import React from "react";

export interface PropsItemAnalytics {
    icon: React.ReactElement
    label: string
    value: string | number | undefined
}

export interface IAPIDataAnalytic {
    link?: number,
    ads?: number,
    account?: number,
    view?: number
}