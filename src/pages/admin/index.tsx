import React, {useEffect, useMemo, useState} from "react";
import styles from '../../styles/index.module.css'
import {Menu, Modal, notification} from 'antd';
import {
    LogoutOutlined,
    SettingOutlined,
    OrderedListOutlined,
    AppstoreOutlined,
    KeyOutlined
} from '@ant-design/icons';
import library from "../../utils/Library";
import {useRouter} from "next/router";
import Header from "~/component/Header";
import Link from "./link";
import Ads from "~/pages/admin/ads";
import Setting from "~/pages/admin/setting";
import {DOMAIN_LINK_DEV} from "~/utils/Urls";
export default function Admin(){
    const router = useRouter()
    const [ready, setReady] = useState(false)
    const [isMobile,setMobile] = useState(false)
    const [selectMenu,setSelectMenu] = useState("1")
    const [title,setTitle] = useState("Link")
    const [isShowModel,setShowModel] = useState(false)
    const [permission_,setPermisiion_] = useState(true)
    const urlLogin = `https://devaccounts.aigoox.com/login?domain=${library().base64Encode(`${DOMAIN_LINK_DEV}admin`)}==&session=expired`
    useEffect(()=>{
        if(!library().checkLogin()){
            router.push(urlLogin)
        }

        if (library().isMobile()){
            alert("Trang điều khiển không hỗ trợ phiên bản mobile!")
            setMobile(true)
        }else{
            setReady(true)
            setMobile(false)
        }
    },[])
    function getItem(label: string, key: string, icon: JSX.Element) {
        return {
            key,
            icon,
            label,
        };
    }

    // @ts-ignore
    const items = [

        getItem("Link", '1', <KeyOutlined />),

        getItem("Quảng Cáo", '2', <AppstoreOutlined />),

        getItem('Cài đặt', '3', <SettingOutlined />),

        getItem('Đăng xuất', '4', <LogoutOutlined />),
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
                setTitle("Link")
                break
            case '2':
                setSelectMenu(key)
                setTitle("Quảng Cáo")
                break
            case '3':
                setSelectMenu(key)
                setTitle("Cài đặt")
                break
            case "4":
                setShowModel(true)
                break
        }
    }
    function handleClickLogin() {
        setTimeout(function (){
            router.push(urlLogin)
        },300)
    }
    function RenderBody() {
        return <div className={styles.wrapperAdminBody}>
            {
                selectMenu === "1"
                    ? <Link notify={notify} context={Context}/>
                    : selectMenu === "2"
                        ? <Ads notify={notify} context={Context}/>
                        : selectMenu === "3"
                            ? <Setting notify={notify} context={Context}/>
                            : <span/>
            }
        </div>
    }
    const [notify, contextHolder] = notification.useNotification();
    const Context = React.createContext({ name: 'Default' });
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    return <Context.Provider value={contextValue}>

        {contextHolder}
        <Header title={"Lopte Link - Dashboard"} />
        {
            ready && <div className={styles.wrapper}>
                <div className={styles.wrapperAdmin}>
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
                                    selectedKeys={[selectMenu]}
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
                                <hr style={{marginTop: '5px', marginBottom: "20px"}}/>
                                <RenderBody />
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
                            router.push(urlLogin)
                        }}
                        onCancel={()=>setShowModel(false)}
                    >
                        <p>Bạn chắt chắn muốn đăng xuất?</p>
                    </Modal>
                </div>
            </div>
        }
    </Context.Provider>
}
