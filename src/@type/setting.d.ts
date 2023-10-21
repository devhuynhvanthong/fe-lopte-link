export interface IAPIConfigItem {
    name: string,
    description?: string,
    value: string
}

export interface IAPIConfig {
    ads?: number,
    mode_screen?: boolean,
    time_ads?: number
}
