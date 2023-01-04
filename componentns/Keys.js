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
export default function Keys(props){
    const setPermisiion_ = props.setPermisiion_
    const [input,setInput] = useState("")
    const [data,setData] = useState([])
    const [totalPage,setTotalPage] = useState(1)
    const [curentPage,setCurentPage] = useState(1)
    const [idDelete,setIdDelete] = useState(undefined)
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
        apis().get(urls().URL_CATEGORY).then(response=>{
            if (response){
                const  data = response.body
                let arr = []
                data.map((item)=>{
                    arr = [...arr,{
                        label: item.name,
                        value: item.code,
                    }]
                })
                // @ts-ignore
                setCategory(arr)
            }
        })
    },[]);
    useEffect(()=>{
        loadingData()
    },[curentPage])

    function handleClickDelete(text) {
        setIdDelete(text)
        setShowModel(true)
    }

    const columns = [
        {
            title: 'Key',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Alias',
            dataIndex: 'alias_code',
            key: 'alias_code',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Game',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'time_create',
            key: 'time_create',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Thao tác',
            dataIndex: 'id',
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
        if (!selectCategory){
            alert("Hãy chọn một game")
            return
        }
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

        apis().post(url().URL_ADD_KEY,{
            code: JSON.stringify(arrayData),
            category: selectCategory
        }).then(response=>{
            console.log("Response",response)
            setResponse(true)
            if (response){
                if (response.status==constants().SUCCESS){
                    const data = response.body.data
                    setFail("")
                    setTotalSuccess(data.total_success)
                    setTotalProccess(data.total_processed)
                    setTotalKeySened(data.total_key)
                    setTotalExist(data.total_error.total_exist)
                    setTotalError(data.total_error.total_error)
                }else{
                    setFail("Thêm dữ liệu thất bại")
                }
            }else {
                setFail("Thêm dữ liệu thất bại")
            }
        }).catch((e) => {
            setFail("Thêm dữ liệu thất bại")
        })
        loadingData()
        setDisable(false)
    }


    function loadingData(){
        setLoading(true)
        apis().get(url().URL_GET_KEYS,{
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

    function handleDeleteKey() {
        apis().post(url().URL_REMOVE_KEY,{'id_key':idDelete}).then(response=>{
            if (response){
                if (response.status == constants().SUCCESS){
                    alert("Xóa key thành công!")
                    loadingData()
                }else{
                    alert("Xóa key thất bại!")
                }
            }else {

                console.log(response)
                alert("Xóa key thất bại!")
            }
        })
        setShowModel(false)
        setIdDelete(undefined)
    }

    return <>
        {
            <div>
                {
                    <div className={styles.wapper}>
                        <div className={styles.formInputKey}>
                            <div>
                                <span className={styles.labelAdd}>Thêm key mới!</span>
                                <div>
                                    <textarea
                                        className={styles.inputKey}
                                        onChange={(e)=>{
                                            setInput(e.target.value)
                                            setDisable(e.target.value == "")
                                        }}
                                        placeholder="Nhập giá trị key..." />
                                </div>
                                <p style={{
                                    fontSize:'1.2em',
                                    color: 'white',
                                    marginBottom:'8px'
                                }}>Chọn game</p>
                                <Cascader
                                    allowClear={false}
                                    onChange={(value)=>setSelectCategory(value[0])}
                                    value={selectCategory}
                                    placeholder={"Choose Game"}
                                    options={category}
                                />
                            </div>
                            <div>
                                <Button onClick={()=>handleAdd()} className={styles.btnAdd} disabled={isDisable}>Thêm mới</Button>
                            </div>
                        </div>
                        <div className={styles.formData}>
                            <span className={styles.labelData}>Danh sách key</span>
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
            <p>Bạn chắt chắn muốn xóa key này?</p>
        </Modal>
        <Modal
            onCancel={()=>{
                setTotalKey(0)
                setDisable(false)
            }}
            maskClosable={isRespone}
            closable={isRespone}
            title={<span style={{
                userSelect:"none",
                fontSize:"1.1em",}}><Spin size={"default"}/> Thêm dữ liệu mới</span>}
            centered
            open={totalKey > 0}
            footer={
            <span style={{
                userSelect:"none"
            }}>{
               "Thành công: " + totalSuccess + " / " + totalKey
            }</span>
            }>
            {
                isRespone ?
                    <div>
                        {
                            fail == ""?
                                <div style={{
                                    position:"relative"
                                }}>
                                    <div>
                                    <span style={{
                                        fontSize: "1em"
                                    }}><b>- Tổng Key nhập vào: </b>{totalKey}</span>
                                            </div>
                                            <div>
                                     <span style={{
                                         fontSize: "1em"
                                     }}><b>- Tổng Key gửi đi: </b>{totalKeySened}</span>
                                            </div>
                                            <div>
                                     <span style={{
                                         fontSize: "1em"
                                     }}><b>- Tổng Key được sử lý: </b>{totalProccess}</span>
                                            </div>
                                            <div>
                                     <span style={{
                                         fontSize: "1em"
                                     }}><b>- Tổng Key lỗi: </b>{totalError}</span>
                                            </div>
                                            <div>
                                     <span style={{
                                         fontSize: "1em"
                                     }}><b>- Tổng Key đã tồn tại: </b>{totalExist}</span>
                                            </div>
                                    </div>: <span style={{fontSize:'1.3em'}}>{fail}</span>
                            }
                        </div>
                    :
                    <div style={{textAlign: "center"}}>
                        <div>
                            <Spin size={"large"}/>
                        </div>
                        <span style={{fontSize:'1.3em'}}>Đang trong quá trình tải lên...</span>
                    </div>
            }
        </Modal>
    </>
}
