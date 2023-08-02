export interface IAPIConfigItem {
    name: string,
    description?: string,
    value: string
}

export type IAPIConfig = Array<IAPIConfigItem>

export interface TypeUpdateSetting {
    ads: string,
    maintenance: string
}