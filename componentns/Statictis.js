import React, {useEffect, useState} from "react";
import library from '../utils/Library'
import {Alert, Button, Input, Modal, Table, Tooltip, notification, Spin, Cascader, Skeleton} from 'antd';
import url from '../utils/Urls'
import {useRouter} from "next/router";
import apis from '../utils/CallApi'
import {inspect} from "util";
import styles from '../styles/index.module.css'
import constants from "../utils/Constants";
import {DeleteTwoTone, FileAddFilled} from "@ant-design/icons";
import urls from "../utils/Urls";
export default function Statictis(props){
    const setPermisiion_ = props.setPermisiion_
    const [isLoading,setLoading] = useState(true)
    const [data,setData] = useState([])
    const [totalPage,setTotalPage] = useState(1)
    const [curentPage,setCurentPage] = useState(1)

    useEffect(()=>{
        loadingData()
    },[])
    function loadingData(){
        setLoading(true)
        apis().get(url().URL_GET_ALL_KEY_USED,{
            page_offet: curentPage
        }).then(response=>{
            if (response){
                if (response.status==constants().SUCCESS) {
                    setTotalPage(response.body.total_page)
                    setData(response.body.data)
                    setLoading(false)
                }else{
                    if (response.category == "authentication"){
                        setPermisiion_(false)
                    }
                }
            }else{
                setPermisiion_(false)
            }
        })
    }

    const onChangePagination = (page) =>{
        setCurentPage(page)
    }
    function getIP(text) {
        const t = text.toString().split(".")
        let ip = ""
        t.map((value,index)=>{
            if(index!=0){
                ip += value + "."
            }
        })
        return ip.substring(0,ip.length-1)
    }

    const columns = [
        {
            title: 'Key',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Thời gian nhận',
            dataIndex: 'time_create',
            key: 'time_create',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            render: (text) => <a>{getIP(text)}</a>,
        }
    ]
    return <>
        <div className={styles.formData}>
            <p className={styles.labelData}>Danh sách key đã sử dụng</p>
            <Spin
                style={{marginTop:'20px'}}
                spinning={isLoading}
                tip="Loading...">
                <Table
                    style={{background:"white", borderRadius:20}}
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        current: curentPage,
                        total: totalPage*10,
                        onChange:onChangePagination
                    }}
                />
            </Spin>
        </div>
    </>
}
