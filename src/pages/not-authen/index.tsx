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
        setTimeout(function () {
            if (library.base64Decode((router.query?.c || "").toString()).toLowerCase() == "dashboard") {
                router.push(BASE_URL_LOGIN_DASHBOARD)
            } else {
                router.push(BASE_URL_LOGIN_ADMIN)
            }
        }, 300)
    }

    return <>
        <Header title={"Lopte Link - Not Authentication"}/>
        <div style={{
            display: "flex",
            position: "absolute",
            width: '100%',
            height: '100%',
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <div style={{
                background: '#022533',
                width: '100%',
                height: '100%',
                display: "flex",
                flexDirection: "column",
                position: 'relative',
                userSelect: "none",
                gap: 20,
                alignItems: "center",
                padding: 30
            }}>
                <img
                    style={{
                        height: '60vh',
                        position: "relative",
                        border: '2px solid #B21065',
                        borderRadius: 30,
                    }}
                    src='/permission.jpg' alt={'Accept Permission'}/>

                <div>
                    <button
                        onClick={() => handleClickLogin()}
                        className={styles.btnLogin}>
                        Đăng nhập
                    </button>
                </div>
            </div>
            <div className={styles.footer}>
                <label className={styles.coppyRight}>Copyright by Lopte</label>
                <div className={styles.contact}>
                    <img src={'/logo.png'}/>
                    <div className={styles.contactInfo}>
                        <div className={styles.itemContact}>
                            <a target={"_blank"}
                               href={"https://t.me/loptegroup"} rel="noreferrer">
                                <div className={styles.itemContactBody}>
                                    <img src={"/icon_telegram.webp"}/>
                                    <label>Group Support Telegram</label>
                                </div>
                            </a>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    </>
}
NotAuthentication.layout = "client"