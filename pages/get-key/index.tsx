import React, {useEffect, useState} from "react";
import apis from '../../utils/CallApi'
import urls from  '../../utils/Urls'
import library from '../../utils/Library'
import constants from  '../../utils/Constants'
import {useRouter} from "next/router";
import styles from '../../styles/index.module.css'
import Logo from '../../componentns/logo'
import stylesCustom from "../../styles/index.module.css";
import Maintenance from "../../componentns/Maintenance";
export default function GetKey(){
    const [key,setKey] = useState("Please wait...")
    const router = useRouter()
    const [maintenance,setMaintenance] = useState("")
    useEffect( () => {

        if (router.isReady) {
            apis().get(urls().URL_GET_CONFIG).then(response => {
                if (response){
                    response.body.map((item: any) => {
                        if (item.code == 'maintenance'){
                            switch (item?.value.toLowerCase()){
                                case "true":
                                    setMaintenance("maintenance")
                                    break;
                                case "false":
                                    setMaintenance("non-maintenance")
                                    break;
                                default:
                                    setMaintenance("")
                            }
                            return
                        }
                    })
                }
            })
            if (router.query.code){
                getKey()
            }else {
                setKey("Receiving key failed!")
            }
        }

    },[router])

    const getKey = async () => {
        apis().post(urls().URL_GET_KEY, {
            info: library().base64Decode(router.query.v),
            code: library().base64Decode(router.query.code)
        }).then(response => {
            if (response.status == constants().SUCCESS) {
                setKey(response.body.key)
            } else {
                setKey(response.message ? response.message : "Receiving key failed!")
            }
        }).catch((e) => setKey(e))
    }

    function handleClickGetKey() {
        setTimeout(function() {
            router.push("/")
        }, 250);

    }

    return <>
        {
            maintenance == 'non-maintenance' &&
            <div>
                <Logo className={stylesCustom.logo}/>
                <div className={styles.keyGroup}>
                    <div className={styles.key}>{key}</div>
                    <div className={styles.textDescription}>
                        <p style={{fontSize:'1.15em'}}>Coppy the key and paste in the app to Login</p>
                        <p style={{fontSize:'1.15em', marginTop:'10px'}}>Sao chép key và dán vào ứng dụng để Login</p>
                    </div>
                </div>

                <div className={styles.btnGetNewKeyGroup}>
                    <button
                        onClick={()=>handleClickGetKey()}
                        className={styles.btnGetNewKey}>
                        Get new key
                    </button>
                </div>
            </div>
        }
        {
            maintenance == 'maintenance' &&
            <Maintenance />
        }
    </>
}
