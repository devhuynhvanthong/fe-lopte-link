import styles from './style.module.scss'
import {useRouter} from "next/router";
import {BASE_URL_LOGIN} from "~/utils/Urls";
export default function NotAuthentication() {
    const router = useRouter()

    function handleClickLogin() {
        setTimeout(function() {
            router.push(BASE_URL_LOGIN)
        }, 300)
    }
    return <div style={{
        background: '#022533',
        width: '100%',
        height: '100%',
        position: 'absolute',
        userSelect: "none"
    }}>
        <img
            style={{
                height: '60vh',
                position: 'absolute',
                left: '50%',
                top: '30%',
                transform: 'translate(-50%,-40%)',
                border: '2px solid #B21065',
                borderRadius: 30,
            }}
            src='/permission.jpg' alt={'Accept Permission'}/>
        <div >
            <button
                onClick={() => handleClickLogin()}
                className={styles.btnLogin}>
                Đăng nhập
            </button>
        </div>
    </div>
}
NotAuthentication.layout = "client"