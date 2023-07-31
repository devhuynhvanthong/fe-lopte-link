import React from "react";

export interface TableType {
    id: string,
    source: string,
    converted: string,
    created_at: any
}

export interface TypeData {
    totalPage: number,
    data: Array<TableType>
}