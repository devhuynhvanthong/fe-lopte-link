import {useEffect, useState} from "react";
import apis from '../../utils/CallApi'
import urls from  '../../utils/Urls'
import library from '../../utils/Library'
import constants from  '../../utils/Constants'
import {useRouter} from "next/router";
import styles from '../../styles/index.module.css'
import {headers} from "next/headers";
export default function GetKey(){
    const [key,setKey] = useState("Xin chờ đợi...")
    const router = useRouter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // @ts-ignore
    useEffect( () => {

        if (router.isReady) {
            getKey()
        }

    },[router])

    const getKey = async () => {
        await fetch('https://api.ipify.org?format=json')
        await fetch('http://ip-api.com/json/?fields=61439')
       .then(respone => {
           let ip = respone.body
           // @ts-ignore
           ip = ip.query | undefined
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
    return <>
        <div className={styles.key}>
            {key}
        </div>
    </>
}