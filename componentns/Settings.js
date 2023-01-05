import React, {useEffect, useState} from "react";
import library from '../utils/Library'
import {Alert, Button, Input, Modal, Table, Tooltip, notification, Spin, Cascader, Skeleton, Switch} from 'antd';
import url from '../utils/Urls'
import {useRouter} from "next/router";
import apis from '../utils/CallApi'
import {inspect} from "util";
import styles from '../styles/index.module.css'
import constants from "../utils/Constants";
import {DeleteTwoTone, FileAddFilled} from "@ant-design/icons";
import urls from "../utils/Urls";
export default function Settings(props){
    const setPermisiion_ = props.setPermisiion_
    const [selectLimitKey,setSelectLimitKey] = useState(undefined)
    const [config,setConfig] = useState([])
    const [checkedMaintenance,setCheckedMaintenance] = useState(false)
    const [loadingMaintenance,setLoadingMaintenance] = useState(false)
    const [loadingLimitKey,setLoadingLimitKey] = useState(false)
    const columnsLimitKey = [
        {
            label: 'Bỏ tất cả giới hạn',
            value: 'NOMAL'
        },
        {
            label: '1 key/ ngày',
            value: 'ONE_KEY_DAY'
        },
        {
            label: '2 key/ ngày',
            value: 'TWO_KEY_DAY'
        }
    ]
    useEffect(()=>{
        apis().get(urls().URL_GET_CONFIG).then(response=>{
            if (response){
                if (response.status == constants().SUCCESS){
                    setConfig(response.body)
                }else {
                    setPermisiion_(false)
                }
            }else {
                setPermisiion_(false)
            }
        })
    },[]);

    useEffect(()=>{
        const filterLimitKey = config.filter(item => item.code == 'visits')[0]
        const filterMaintenance = config.filter(item => item.code == 'maintenance')[0]
        if (filterLimitKey){
            setSelectLimitKey(filterLimitKey.value)
        }
        if (filterMaintenance){
            console.log("Main",filterMaintenance.value)
            setCheckedMaintenance(filterMaintenance.value.toLowerCase() == 'true')
        }
    },[config])

    function handleSwitchMaintenance(checked){
        console.log("handleSwitchMaintenance",checked,typeof selectLimitKey)
        setCheckedMaintenance(checked)
    }

    function handleUpdate() {
        setLoadingMaintenance(true)
        apis().post(urls().URL_UPDATE_CONFIG,{
            value: checkedMaintenance.toString(),
            code: 'maintenance'
        }).then(response=>{
            if (response){
                setLoadingMaintenance(false)
            }else {
                setPermisiion_(false)
            }
        })
        if (typeof selectLimitKey != 'string'){

            setLoadingLimitKey(true)
            apis().post(urls().URL_UPDATE_CONFIG,{
                value: selectLimitKey[0],
                code: 'visits'
            }).then(response=>{
                if (response){
                    setLoadingLimitKey(false)
                }else {
                    setPermisiion_(false)
                }
            })
        }
    }

    return <>
        <div className={styles.borderSetting}>
            <div>
                <p>Cấu hình truy cập</p>
                <hr style={{marginTop:'10px'}}/>
                <div className={styles.itemSetting}>
                    <div>
                        <span>Giới hạn lượt nhận key</span>
                    </div>
                    <div>

                        <Spin style={{marginRight: '5px'}} spinning={loadingLimitKey} size={'small'}/>
                        <Cascader
                            allowClear={false}
                            onChange={(value)=>setSelectLimitKey(value)}
                            value={selectLimitKey}
                            placeholder={"Chọn phương thức giới hạn"}
                            options={columnsLimitKey}
                        />
                    </div>
                </div>
                <div className={styles.itemSetting}>
                    <div>
                        <span>Bảo trì máy chủ</span>
                    </div>
                    <div>
                        <Spin style={{marginRight: '5px'}} spinning={loadingMaintenance} size={'small'}/>
                        <Switch
                            checked={checkedMaintenance}
                            onChange={handleSwitchMaintenance}
                        />
                    </div>
                </div>
                <div className={styles.itemSettingv2}>
                    <div>
                        <button
                            onClick={handleUpdate}
                            className={styles.buttonUpdateSetting}>Cập nhật</button>
                    </div>
                </div>

            </div>

        </div>
    </>
}
