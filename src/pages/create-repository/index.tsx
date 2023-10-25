import styles from './style.module.scss'
import {useRouter} from "next/router";
import {URL_CREATE} from "~/utils/Urls";
import React, {useState} from "react";
import Header from "~/component/Header";
import Loading from "~/component/loading";
import CallApi from "~/utils/apis";
import Constants from "~/utils/Constants";
import {TypePropsLayout} from "~/@type/link";

export default function CreateRepository({openNotification, typeNotify}: TypePropsLayout) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const api = CallApi()
    const constant = Constants()

    function handleRegister() {
        setLoading(true)
        api.post(URL_CREATE).then((response) => {
            if (response.status == constant.SUCCESS) {
                openNotification(response.body.message, typeNotify.success)
                router.push('/admin')
            } else {
                setLoading(false)
                openNotification(response?.message, typeNotify.failed)
            }
        }).catch((err) => {
            setLoading(false)
            openNotification(err?.message, typeNotify.failed)
        })
    }

    return <>
        <Loading visible={loading}/>
        <Header title={"Lopte Link - Đăng ký"}/>
        <div style={{
            background: '#022533',
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifyItems: "center",
            alignItems: "center",
            gap: 50,
            userSelect: "none",
            color: "yellow"
        }}>
            <img
                style={{
                    width: '50%',
                    borderRadius: 30,
                }}
                src='/repository.png' alt={'Accept Permission'}/>
            <label onClick={handleRegister} className={styles.btnLogin}>Đăng ký</label>
        </div>
    </>
}
CreateRepository.layout = "client"