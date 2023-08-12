import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import {DOMAIN_LINK_DEV} from "~/utils/Urls";
import {TypePropLayout} from "~/@type/main";

export default function AdminLayout({ children }: TypePropLayout) {
    const router = useRouter()
    const [ready, setReady] = useState(false)
    const [isMobile, setMobile] = useState(false)
    const [isShowModel, setShowModel] = useState(false)
    const [permission_, setPermisiion_] = useState(true)
    const urlLogin = `https://accounts.aigoox.com/login?domain=${library().base64Encode(`${DOMAIN_LINK_DEV}admin`)}==&session=expired`
    useEffect(() => {
        if (!library().checkLogin()) {
            router.push(urlLogin)
        }

        if (library().isMobile()) {
            alert("Trang điều khiển không hỗ trợ phiên bản mobile!")
            setMobile(true)
        } else {
            setReady(true)
            setMobile(false)
        }
    }, [])

    function getItem(label: string, key: string, pathName: string, icon: JSX.Element) {
        return {
            key,
            icon,
            pathName,
            label,
        };
    }
    // @ts-ignore
    const items = [

        getItem("Link", '1', '/admin/link',<KeyOutlined/>),

        getItem("Quảng Cáo", '2','/admin/ads', <AppstoreOutlined/>),

        getItem('Cài đặt', '3', '/admin/setting',<SettingOutlined/>),

        getItem('Đăng xuất', '4', '',<LogoutOutlined/>),
    ];

    function handleClickLogin() {
        setTimeout(function () {
            router.push(urlLogin)
        }, 300)
    }

    const RenderChildren = useCallback(() => {
        return <div className={styles.bodyContent}>
            {
                children
            }
        </div>
    }, [router.pathname])

    function handleClickMenu(key: string) {
        switch (key) {
            case '1':
                if (router.pathname !== "/admin/link") {
                    router.push("link")
                }
                break
            case '2':
                if (router.pathname !== "/admin/ads") {
                    router.push("ads")
                }
                break
            case '3':
                if (router.pathname !== "/admin/setting") {
                    router.push("setting")
                }
                break
            case "4":
                setShowModel(true)
                break
        }
    }

    return <>
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
                            <div className={styles.menu}>
                                {
                                    items.map((_item, index) => {
                                        return <div key={index.toString()} onClick={() => {
                                                handleClickMenu(_item.key)
                                            }}
                                            className={`${styles.menuItem} ${router.pathname == _item.pathName ? styles.activeMenu: ""}`}>
                                            {
                                                _item.icon
                                            }
                                            {
                                                _item.label
                                            }
                                        </div>
                                    })
                                }
                            </div>

                            </div>
                            <div className={styles.bodyAdmin}>
                                <label style={{
                                    color: 'white',
                                    fontSize: '2em'
                                }}>{
                                    items.filter((_item) => {
                                        return _item.pathName == router.pathname
                                    })[0].label
                                }</label>
                                <hr style={{marginTop: '5px', marginBottom: "20px"}}/>
                                <RenderChildren/>
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
                            <div>
                                <button
                                    onClick={() => handleClickLogin()}
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
                        onOk={() => {
                            router.push(urlLogin)
                        }}
                        onCancel={() => setShowModel(false)}
                    >
                        <p>Bạn chắt chắn muốn đăng xuất?</p>
                    </Modal>
                </div>
            </div>
        }
    </>
}
