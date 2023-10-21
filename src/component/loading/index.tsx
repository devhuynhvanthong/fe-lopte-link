import _style from "./style.module.scss"
import {TypePropsLoading} from "~/@type/loading";

export default function Loading({visible}: TypePropsLoading) {
    return <>
        {visible &&
            <div className={_style.wrapper}>
                <div className={_style.borderLoading}>
                    <label className={_style.loading}>Waiting...</label>
                </div>
            </div>}
    </>
}