import styles from './style.module.scss'
import {useRouter} from "next/router";
import {BASE_URL_LOGIN_ADMIN, BASE_URL_LOGIN_DASHBOARD} from "~/utils/Urls";
import Header from "~/component/Header";
import React from "react";
import Library from "~/utils/Library";
export default function NotAuthentication() {
    const router = useRouter()
    const library = Library()
    function handleClickLogin() {
        setTimeout(function() {
            if (library.base64Decode((router.query?.c || "").toString()).toLowerCase() == "dashboard") {
                router.push(BASE_URL_LOGIN_DASHBOARD)
            }else {
                router.push(BASE_URL_LOGIN_DASHBOARD)
            }
        }, 300)
    }
    return <>
        <Header title={"Lopte Link - Not Authentication"}/>
        <div style={{
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
    </>
}
NotAuthentication.layout = "client"