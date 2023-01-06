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
export default function Games(props){
    const setPermisiion_ = props.setPermisiion_
    const router = useRouter()
    const [input,setInput] = useState("")
    const [data,setData] = useState([])
    const [totalPage,setTotalPage] = useState(1)
    const [curentPage,setCurentPage] = useState(1)
    const [codeDelete,setCodeDelete] = useState(undefined)
    const [isShowModel,setShowModel] = useState(false)
    const [isDisable,setDisable] = useState(true)
    const [totalKey,setTotalKey] = useState(0)
    const [totalKeySened,setTotalKeySened] = useState(0)
    const [totalExist,setTotalExist] = useState(0)
    const [totalSuccess,setTotalSuccess] = useState(0)
    const [totalProccess,setTotalProccess] = useState(0)
    const [totalError,setTotalError] = useState(0)
    const [fail,setFail] = useState("")
    const [isRespone,setResponse] = useState(false)
    const [category,setCategory] = useState([])
    const [selectCategory,setSelectCategory] = useState(undefined)
    const [isLoading,setLoading] = useState(true)

    useEffect(()=>{
        loadingData()
    },[curentPage])

    function handleClickDelete(text) {
        setCodeDelete(text)
        setShowModel(true)
    }

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Game',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tổng key',
            dataIndex: 'total_key',
            key: 'total_key',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Thao tác',
            dataIndex: 'code',
            key: 'id',
            render: (text) => <div>
                <Tooltip title={'Xóa key'}>
                    <DeleteTwoTone
                        style={{
                            color:"red",
                            textAlign:'center'
                        }}
                        onClick={()=>handleClickDelete(text)}
                    />
                </Tooltip>
                </div>
        }
    ]
    function handleAdd() {
        setDisable(true)
        setResponse(false)
        setTotalError(0)
        setFail("")
        setTotalKeySened(0)
        setTotalSuccess(0)
        setTotalKey(0)
        let arrayData = []
        let arr_ = input.replaceAll("\n",",").split(",")

        arr_.map( function (value_,index_){
            if(index_ % 3==0){
                arrayData.push(value_)
            }
        })

        // @ts-ignore
        setTotalKey(arrayData.length)

        apis().post(url().URL_ADD_CATEGORY,{
            name: input
        }).then(response=>{
            setResponse(true)
            if (response){
                if (response.status==constants().SUCCESS){

                    loadingData()
                    alert("Thêm dữ liệu thành công")
                    setFail("")
                }else{
                    alert(response.message)
                }
            }else {
                alert("Thêm dữ liệu thất bại")
            }
        }).catch((e) => {
            alert("Thêm dữ liệu thất bại")
        })
        setDisable(false)
    }


    function loadingData(){
        setLoading(true)
        apis().get(urls().URL_ALL_CATEGORY,{
            page_offet: curentPage
        }).then(response=>{
            if (response){
                if (response.status == constants().SUCCESS) {
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
    function handleDeleteKey() {
        apis().post(url().URL_REMOVE_CATEGORY,{'code':codeDelete}).then(response=>{
            if (response){
                if (response.status == constants().SUCCESS){
                    alert("Xóa key thành công!")
                    loadingData()
                }else{
                    alert("Xóa key thất bại!")
                }
            }else {
                alert("Xóa key thất bại!")
            }
        })
        setShowModel(false)
        setCodeDelete(undefined)
    }

    return <>
        {
            <div>
                {
                    <div className={styles.wapper}>
                        <div className={styles.formInputKey}>
                            <div>
                                <span className={styles.labelAdd}>Thêm game mới!</span>
                                <div>
                                    <Input
                                        onPressEnter={()=>handleAdd()}
                                        onChange={(e)=>{
                                            setInput(e.target.value)
                                            setDisable(e.target.value == "")
                                        }}
                                        placeholder="Nhập giá trị game..." />
                                </div>
                            </div>
                            <div>
                                <Button onClick={()=>handleAdd()} className={styles.btnAdd} disabled={isDisable}>Thêm mới</Button>
                            </div>
                        </div>
                        <div className={styles.formData}>
                            <span className={styles.labelData}>Danh sách game</span>
                            <Spin
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
                    </div>
                }
            </div>
        }
        <Modal
            title={"Cảnh báo"}
            centered
            open={isShowModel}
            onOk={()=> handleDeleteKey()}
            onCancel={()=>setShowModel(false)}
        >
            <p>Bạn chắt chắn muốn xóa game này?<br/><font color={'red'}>Khi game bị xóa dẫn đến tất cả key thuộc game sẽ bị xóa toàn bộ!</font></p>
        </Modal>
    </>
}
