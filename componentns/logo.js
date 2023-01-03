import style from '../styles/index.module.css'
export default function Logo(props){

    return <div className={props.className}>
        <div className={style.div}>GameLopte</div>
        <p className={style.p}>Own by:
            <a className={style.a} href="https://gamelopte.com" target={"_blank"} rel="noreferrer"> https://gamelopte.com</a>
        </p>
    </div>
}