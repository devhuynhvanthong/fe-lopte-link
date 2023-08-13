import React from "react";

export interface TableTypeLink {
    id: string,
    source: string,
    converted: string,
    created_at: any
}

export interface TableTypeAds {
    id: string,
    name: string,
    link: string
}

export interface TypeData<T> {
    total_page: number,
    data: Array<T>
}