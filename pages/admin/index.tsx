import {useEffect, useState} from "react";
import library from '../../utils/Library'
import {Button, Input,Table} from 'antd';
import url from '../../utils/Urls'
import {useRouter} from "next/router";
import apis from '../../utils/CallApi'
import {inspect} from "util";
import styles from '../../styles/index.module.css'
import constants from "../../utils/Constants";
export default function Admin(){
    const router = useRouter()
    const [isMobile,setMobile] = useState(false)
    const [input,setInput] = useState("")
    const [data,setData] = useState([])
    const [totalPage,setTotalPage] = useState(1)
    const [curentPage,setCurentPage] = useState(1)

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
            console.log("STATUs",response)
            if (response){
                if (response.status==constants().SUCCESS) {
                    setTotalPage(response.body.total_page)
                    setData(response.body.data)
                }else{
                    if (response.category == "authentication"){
                        router.push('https://accounts.aigoox.com/login?domain=Z2FtZWxvcHRlX3NoYXJlZA==&session=expired')
                    }
                }
            }else{
                router.push('https://accounts.aigoox.com/login?domain=Z2FtZWxvcHRlX3NoYXJlZA==&session=expired')
            }
        })
    }

    const onChangePagination = (page: number) =>{
        setCurentPage(page)
    }
    return <>
        {!isMobile &&
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
    </>
}
