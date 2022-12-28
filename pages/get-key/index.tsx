import React, {useEffect, useState} from "react";
import apis from '../../utils/CallApi'
import urls from  '../../utils/Urls'
import library from '../../utils/Library'
import constants from  '../../utils/Constants'
import {useRouter} from "next/router";
import styles from '../../styles/index.module.css'
import {headers} from "next/headers";
import stylesCustom from "../../styles/index.module.css";
export default function GetKey(){
    const [key,setKey] = useState("Xin chờ đợi...")
    const router = useRouter()
    useEffect( () => {

        if (router.isReady) {
            if (router.query.code){
                getKey()
            }else {
                setKey("Nhận key thất bại!")
            }
        }

    },[router])

    const getKey = async () => {
        await fetch('https://api.ipify.org?format=json')
            .then(function (response){
                return response.json()
            })
            .then(function (json) {
                let ip = json.ip
                apis().post(urls().URL_GET_KEY, {
                    ip: ip,
                    code: library().base64Decode(router.query.code)
                }).then(response => {
                    if (response.status == constants().SUCCESS) {
                        setKey("Key: \n\n" + response.body.key)
                    } else {
                        setKey(response.message ? response.message : "Nhận key thất bại")
                    }
                })
        })
    }

    function handleClickGetKey() {
        setTimeout(function() {
            router.push("/")
        }, 250);

    }

    return <>
        <div>
            <div className={styles.keyGroup}>
                <div className={styles.key}>{key}</div>
            </div>
            <div className={styles.btnGetNewKeyGroup}>
                <button
                    onClick={()=>handleClickGetKey()}
                    className={styles.btnGetNewKey}>
                    Nhận Key Mới
                </button>
            </div>
        </div>

    </>
}
