import React, {useCallback, useEffect, useState} from "react";
import styles from '../../styles/admin.module.scss'
import {Modal, Typography} from 'antd';
import {AppstoreOutlined, KeyOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import library from "../../utils/Library";
import {useRouter} from "next/router";
import {URL_INFO} from "~/utils/Urls";
import {TypePropLayout} from "~/@type/main";
import CallApi from "~/utils/apis";
import {TypeInfo} from "~/@type/info";
import Constants from "~/utils/Constants";
import {useDispatch, useSelector} from "react-redux";
import {selectInfos} from "~/redux/info/info.selector";
import {updateInfo} from "~/redux/info/info.action";
import Cookies from "~/utils/Cookies";

export default function AdminLayout({children}: TypePropLayout) {
    const router = useRouter()
    const [isShowModel, setShowModel] = useState(false)
    const useSelect = useSelector(selectInfos())
    const [info, setInfo] = useState<TypeInfo>()
    const constant = Constants()
    const dispatch = useDispatch()
    const api = CallApi()
    const cookie = Cookies()
    useEffect(() => {
        if (!cookie.getAccessToken()) {
            if (location.pathname != "/not-authen") {
                window.location.href = '/not-authen'
            }
        }

        if (library().isMobile()) {
            router.push('not-support-mobile')
        }
        console.log(useSelect)
        if (useSelect.username !== undefined && useSelect.username !== '') {
            if (!info) {
                setInfo(useSelect)
            }
        } else {
            handleLoadingAccount()
        }

    }, [])

    function handleLoadingAccount() {
        api.get(URL_INFO).then((response) => {
            if (response?.status == constant.SUCCESS) {
                const data = {
                    username: response?.body?.username
                }
                setInfo(data)
                dispatch(updateInfo(data))
            }
        })
    }

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
            typeof window != undefined &&
            <div className={styles.wrapper}>
                <div className={styles.wrapperAdmin}>
                    {
                        <>
                            <div className={styles.wrapperMenu}>
                                <label className={styles.titlePage}>NGƯỜI DÙNG</label>
                                <div className={styles.info}>
                                    <img src={"/logo.png"} className={styles.avatar}/>
                                    <div className={styles.code}>
                                        <label>Xin chào</label>
                                        <span>{info?.username || "NO NAME"}</span>
                                    </div>
                                </div>

                                <hr/>
                                <br/>
                                <label className={styles.titleCategory}>Danh mục</label>
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
                            cookie.Remove()
                            window.location.href = '/not-authen'
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
