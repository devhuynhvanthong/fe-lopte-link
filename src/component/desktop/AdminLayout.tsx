import React, {useCallback, useEffect, useState} from "react";
import styles from '../../styles/index.module.css'
import {Modal} from 'antd';
import {AppstoreOutlined, KeyOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import library from "../../utils/Library";
import {useRouter} from "next/router";
import {DOMAIN_ACCOUNT_DEV} from "~/utils/Urls";
import {TypePropLayout} from "~/@type/main";

export default function AdminLayout({children}: TypePropLayout) {
    const router = useRouter()
    const [isShowModel, setShowModel] = useState(false)
    let urlLogin = ""
    useEffect(() => {
        urlLogin = `${DOMAIN_ACCOUNT_DEV}/login?domain=${library().base64Encode(`${location?.origin}/admin`)}==&session=expired`
        if (!library().checkLogin()) {
            router.push(urlLogin)
        }

        if (library().isMobile()) {
            router.push('not-support-mobile')
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

        getItem("Link", '1', '/admin/link', <KeyOutlined/>),

        getItem("Quảng Cáo", '2', '/admin/ads', <AppstoreOutlined/>),

        getItem('Cài đặt', '3', '/admin/setting', <SettingOutlined/>),

        getItem('Đăng xuất', '4', '', <LogoutOutlined/>),
    ];

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
            <div className={styles.wrapper}>
                <div className={styles.wrapperAdmin}>
                    {
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
                                                        className={`${styles.menuItem} ${router.pathname == _item.pathName ? styles.activeMenu : ""}`}>
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
                                    fontSize: '2em',
                                    userSelect: "none"
                                }}>{
                                    items.filter((_item) => {
                                        return _item.pathName == router.pathname
                                    })[0]?.label
                                }</label>
                                <hr style={{marginTop: '5px', marginBottom: "20px"}}/>
                                <RenderChildren/>
                            </div>
                        </>
                    }

                    <Modal
                        title={"Thông báo"}
                        centered
                        open={isShowModel}
                        onOk={() => {
                            router.push(`${DOMAIN_ACCOUNT_DEV}/login?domain=${library().base64Encode(`${location?.origin}/admin`)}==&session=expired`)
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
