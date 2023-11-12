import styles from './style.module.scss'
import Header from "~/component/Header";
import React from "react";
import Login from "~/component/login";

export default function NotAuthentication() {

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
                <Login />
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