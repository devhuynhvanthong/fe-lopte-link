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
    useEffect(()=>{

        if (router.isReady){
            apis().get('http://ip-api.com/json/?fields=61439').then(respone=> {
                const ip = respone.query
                apis().post(urls().URL_GET_KEY,{
                    ip: ip,
                    code: library().base64Decode(router.query.code)
                }).then(response => {
                    if (response.status == constants().SUCCESS){
                        setKey("Key: \n\n" + response.body.key)
                    }else{
                        setKey(response.message?response.message:"Nhận key thất bại")
                    }
                })
            })
        }

    },[router])
    return <>
        <div className={styles.key}>
            {key}
        </div>
    </>
}