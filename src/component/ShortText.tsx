import {Tooltip} from "antd";

interface TypeProps {
    value: string,
    click?: boolean
}
export default function ShortText({ value, click }: TypeProps) {
    return <>
        {
            value.length >= 41 ?
                <Tooltip title={value}>
                    <span>
                        {
                            click ?
                                <a target={'_blank'} href={value} rel="noreferrer">{value.substring(0, 40) + "..."}</a>
                                : value.substring(0, 40) + "..."
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