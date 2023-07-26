import _style from "./style.module.scss"
import {Spin} from "antd";
import {TypePropsLoading} from "~/@type/loading";
export default function Loading({ open }: TypePropsLoading) {
    return <div className={_style.wrapper}>
        <Spin
            className={_style.loading}
            spinning={open}
            tip="Waiting..."
            size="large" />
    </div>
}