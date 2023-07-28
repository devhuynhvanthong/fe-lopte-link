export interface TypePropLink {
    info?: IAPILink,
    getLink: () => void,
    isLoadingGetLink: boolean
}

export interface IAPILink {
    ads: string,
    converted: string,
    created_time: number,
    code: string
}