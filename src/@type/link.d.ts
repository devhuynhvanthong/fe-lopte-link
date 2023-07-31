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