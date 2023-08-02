import {Tooltip} from "antd";

interface TypeProps {
    value: string,
    click?: boolean,
    lenght?: number
}
export default function ShortText({ value, click, lenght = 40 }: TypeProps) {
    return <>
        {
            value?.toString().length || 0 >= lenght + 1 ?
                <Tooltip title={value}>
                    <span>
                        {
                            click ?
                                <a target={'_blank'} href={value} rel="noreferrer">{value.substring(0, lenght) + "..."}</a>
                                : value.substring(0, lenght) + "..."
                        }
                    </span>
                </Tooltip>
                : <span>{
                    click ?
                        <a target={'_blank'} href={value} rel="noreferrer">{value}</a>
                        : value
                }</span>
        }
        </>
}