import React from "react";

interface TypePropLayout extends TypePropsContainer{
    layout?: any,
    domain?: string
}
export interface TypePropsContainer {
    children: React.ReactElement
}