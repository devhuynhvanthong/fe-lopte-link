import React, {useEffect, useState} from "react";
import styles from '../../styles/index.module.css'
import Keys from "~/src/componentns/Keys";
import {Menu, Modal} from 'antd';
import {
    LogoutOutlined,
    SettingOutlined,
    OrderedListOutlined,
    AppstoreOutlined,
    KeyOutlined
} from '@ant-design/icons';
import Games from "~/src/componentns/Games";
import Statictis from "~/src/componentns/Statictis";
import Settings from "~/src/componentns/Settings";
import library from "../../utils/Library";
import {useRouter} from "next/router";
export default function index(){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isMobile,setMobile] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectMenu,setSelectMenu] = useState("1")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [title,setTitle] = useState("Keys")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isShowModel,setShowModel] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [permission_,setPermisiion_] = useState(true)
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    function getItem(label: string, key: string, icon: JSX.Element, children: undefined, type: undefined) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    // @ts-ignore
    const items = [

        // @ts-ignore
        getItem('Keys', '1', <KeyOutlined />),

        // @ts-ignore
        getItem('Games', '2', <AppstoreOutlined />),

        // @ts-ignore
        getItem('Key đã sử dụng', '3', <OrderedListOutlined />),

        // @ts-ignore
        getItem('Cài đặt', '4', <SettingOutlined />),

        // @ts-ignore
        getItem('Đăng xuất', '5', <LogoutOutlined />),
    ];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    function handleSelectMenu(key: any) {
        switch (key){
            case '1':
                setSelectMenu(key)
                setTitle("Keys")
                break
            case '2':
                setSelectMenu(key)
                setTitle("Games")
                break
            case '3':
                setSelectMenu(key)
                setTitle("Key đã sử dụng")
                break
            case '4':
                setSelectMenu(key)
                setTitle("Cài đặt")
                break
            case "5":
                setShowModel(true)
                break
        }
    }
    function handleClickLogin() {
        setTimeout(function (){
            router.push('https://accounts.aigoox.com/login?domain=Z2FtZWxvcHRlX3NoYXJlZA==&session=expired')
        },300)
    }

    return <>
        <div className={styles.wapper}>
            <div className={styles.wapperAdmin}>
                {
                    !isMobile && permission_ &&
                    <>
                        <div
                            style={{
                                width: 256,
                                marginTop: '20px',
                                marginLeft: '5px',
                            }}
                        >
                            <Menu
                                style={{
                                    borderRadius: '20px',
                                    padding: '10px'
                                }}
                                onSelect={(key:any)=>{
                                    handleSelectMenu(key.key)
                                }}
                                defaultSelectedKeys={['1']}
                                mode="inline"
                                theme="dark"
                                inlineCollapsed={collapsed}
                                items={items}
                            />

                        </div>
                        <div className={styles.bodyAdmin}>

                            <label style={{
                                color: 'white',
                                fontSize: '2em'
                            }}>{title}</label>
                            <hr style={{marginTop: '5px'}}/>
                            {
                                selectMenu == "1" &&
                                <Keys setPermisiion_={setPermisiion_}/>
                            }
                            {
                                selectMenu == "2" &&
                                <Games  setPermisiion_={setPermisiion_}/>
                            }
                            {
                                selectMenu == "3" &&
                                <Statictis  setPermisiion_={setPermisiion_}/>
                            }
                            {
                                selectMenu == "4" &&
                                <Settings  setPermisiion_={setPermisiion_}/>
                            }
                        </div>
                    </>
                }
                {
                    !permission_ &&
                    <div>
                        <img
                            style={{
                                height: '60vh',
                                position: 'absolute',
                                left: '50%',
                                top: '30%',
                                transform: 'translate(-50%,-40%)',
                                border: '2px solid #B21065',
                                borderRadius: 30
                            }}
                            src='/permission.jpg' alt={"Accept Permission"}/>
                        <div >
                            <button
                                onClick={()=>handleClickLogin()}
                                className={styles.btnLogin}>
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                }

                <Modal
                    title={"Thông báo"}
                    centered
                    open={isShowModel}
                    onOk={()=> {
                        router.push('https://accounts.aigoox.com/login?domain=Z2FtZWxvcHRlX3NoYXJlZA==&session=expired')
                    }}
                    onCancel={()=>setShowModel(false)}
                >
                    <p>Bạn chắt chắn muốn đăng xuất?</p>
                </Modal>
            </div>
        </div>
    </>
}
