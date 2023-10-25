import React from "react";

export interface TableTypeLink {
    id: string,
    source: string,
    converted: string,
    created_at: any
    view: number,
    lock: boolean
}

export interface TypeGroupAds {
    id: number,
    name: string
}
export interface TableTypeAds {
    id: int,
    name: string,
    link: string,
    group: TypeGroupAds
}

export interface TableTypeAdsGroup {
    id: int,
    name: string,
}

export interface TypeData<T> {
    total_page: number,
    data: Array<T>
}