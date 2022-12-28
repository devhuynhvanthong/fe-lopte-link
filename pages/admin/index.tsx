import React, {useEffect, useState} from "react";
import library from '../../utils/Library'
import {Alert, Button, Input, Modal, Table, Tooltip,notification} from 'antd';
import url from '../../utils/Urls'
import {useRouter} from "next/router";
import apis from '../../utils/CallApi'
import {inspect} from "util";
import styles from '../../styles/index.module.css'
import constants from "../../utils/Constants";
import {DeleteTwoTone} from "@ant-design/icons";
export default function Admin(){
    const router = useRouter()
    const [isMobile,setMobile] = useState(false)
    const [input,setInput] = useState("")
    const [data,setData] = useState([])
    const [totalPage,setTotalPage] = useState(1)
    const [curentPage,setCurentPage] = useState(1)
    const [permission_,setPermisiion] = useState(true)
    const [idDelete,setIdDelete] = useState(undefined)
    const [isShowModel,setShowModel] = useState(false)

    useEffect(()=>{
        if(!library().checkLogin()){
           router.push('https://accounts.aigoox.com/login?domain=Z2FtZWxvcHRlX3NoYXJlZA==&session=expired')
        }

        if (library().isMobile()){
            alert("Trang điều khiển không hỗ trợ phiên bản mobile!")
            setMobile(true)
        }else{
            setMobile(false)
        }
    },[])

    useEffect(()=>{
        loadingData()
    },[curentPage])

    function handleClickDelete(text: any) {
        setIdDelete(text)
        setShowModel(true)
    }

    const columns = [
        {
            title: 'Key',
            dataIndex: 'code',
            key: 'code',
            render: (text:any) => <a>{text}</a>,
        },
        {
            title: 'Alias',
            dataIndex: 'alias_code',
            key: 'alias_code',
            render: (text:any) => <a>{text}</a>,
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'time_create',
            key: 'time_create',
            render: (text:any) => <a>{text}</a>,
        },
        {
            title: 'Thao tác',
            dataIndex: 'id',
            key: 'id',
            render: (text: any) => <div>
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
        apis().post(url().URL_ADD_KEY,{
            code: input
        }).then(response=>{
            if (response.status==constants().SUCCESS){
                alert("Thêm dữ liệu thành công!")
                loadingData()
            }else{
                alert("Thêm dữ liệu thất bại!")
            }
        })
    }


    function loadingData(){
        apis().get(url().URL_GET_KEYS,{
            page_offet: curentPage
        }).then(response=>{
            if (response){
                if (response.status==constants().SUCCESS) {
                    setTotalPage(response.body.total_page)
                    setData(response.body.data)
                }else{
                    if (response.category == "authentication"){
                        setPermisiion(false)
                    }
                }
            }else{
                setPermisiion(false)
            }
        })
    }

    const onChangePagination = (page: number) =>{
        setCurentPage(page)
    }

    function handleClickLogin() {
        setTimeout(function (){
            router.push('https://accounts.aigoox.com/login?domain=Z2FtZWxvcHRlX3NoYXJlZA==&session=expired')
        },300)
    }

    function handleDeleteKey() {
        apis().post(url().URL_REMOVE_KEY,{'id_key':idDelete}).then(response=>{
            if (response){
                if (response.status = constants().SUCCESS){
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
        setIdDelete(undefined)
    }

    return <>
        {
            <div>
                {
                    !isMobile && permission_ &&
                    <div className={styles.wapperAdmin}>
                        <div className={styles.formInputKey}>
                            <div>
                                <span className={styles.labelAdd}>Thêm key mới!</span>
                                <Input onChange={(e)=>setInput(e.target.value)} onPressEnter={()=>handleAdd()} placeholder="Nhập giá trị key..." />
                            </div>
                            <Button onClick={()=>handleAdd()} className={styles.btnAdd}>Thêm mới</Button>
                        </div>
                        <div className={styles.formData}>
                            <span className={styles.labelData}>Danh sách key</span>
                            <Table
                                style={{background:"white", borderRadius:20}}
                                columns={columns}
                                dataSource={data}
                                pagination={{
                                    current: curentPage,
                                    total: totalPage*10,
                                    onChange:onChangePagination
                                }}
                            />;
                        </div>
                    </div>
                }

                {
                    !permission_ &&
                    <div>
                        <img
                            style={{
                                width: 'auto',
                                height: '60vh',
                                position: 'absolute',
                                left: '50%',
                                top: '30%',
                                transform: 'translate(-50%,-40%)',
                                border: '2px solid #B21065',
                                borderRadius: 30
                            }}
                            src='/permission.jpg'/>
                        <div >
                            <button
                                onClick={()=>handleClickLogin()}
                                className={styles.btnLogin}>
                                Đăng nhập
                            </button>
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
    </>
}
