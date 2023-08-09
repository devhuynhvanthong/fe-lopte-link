import {Tooltip} from "antd";

interface TypeProps {
    value: string,
    click?: boolean,
    length?: number
}
export default function ShortText({ value, click, length = 40 }: TypeProps) {
    return <>
        {
            value?.toString().length >= length + 1 ?
                <Tooltip title={value}>
                    <span>
                        {
                            click ?
                                <a target={'_blank'} href={value} rel="noreferrer">{value.substring(0, length) + "..."}</a>
                                : value.substring(0, length) + "..."
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