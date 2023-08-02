import _style from './style.module.scss'
interface TypeProp {
    isMaintenance?: boolean
}
export default function NotFound({isMaintenance}: TypeProp) {
    return <div className={_style.wrapper}>
        <div className={_style.content}>
            {
                isMaintenance
                ? <img src={'maintenance.jpg'} />
                    : <>
                        <label>404</label>
                        <span>This page could not be found!</span>
                    </>
            }
        </div>
    </div>
}