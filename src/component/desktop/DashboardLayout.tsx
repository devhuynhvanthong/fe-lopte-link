import React, {useCallback, useEffect, useState} from "react";
import styles from '../../styles/dashboard.module.scss'
import {Modal, Typography} from 'antd';
import {
    AppstoreOutlined,
    EyeOutlined,
    KeyOutlined,
    LinkOutlined,
    LogoutOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import Library from "../../utils/Library";
import {useRouter} from "next/router";
import {BASE_URL_LOGIN_DASHBOARD, URL_ANALYSIS, URL_INFO} from "~/utils/Urls";
import {TypePropLayout} from "~/@type/main";
import CallApi from "~/utils/apis";
import {TypeInfo} from "~/@type/info";
import Constants from "~/utils/Constants";
import {useDispatch, useSelector} from "react-redux";
import {selectInfos} from "~/redux/info/info.selector";
import {updateInfo} from "~/redux/info/info.action";
import {IAPIDataAnalytic, PropsItemAnalytics} from "~/@type/layout";
import SearchComponent from "~/component/SearchComponent";
import Cookies from "~/utils/Cookies";

export default function DashboardLayout({children}: TypePropLayout) {
    const router = useRouter()
    const [isShowModel, setShowModel] = useState(false)
    const cookie = Cookies()
    const useSelectInfo = useSelector(selectInfos())
    const constant = Constants()
    const library = Library()
    const dispatch = useDispatch()
    const [analytics, setAnalytics] = useState<IAPIDataAnalytic>()
    const [info, setInfo] = useState<TypeInfo>()
    const api = CallApi()
    useEffect(() => {
        if (!cookie.getAccessToken()) {
            if (location.pathname != "/not-authen") {
                window.location.href = '/not-authen?c=' + library.base64Encode("dashboard")
            }
        }

        if (library.isMobile()) {
            router.push('not-support-mobile')
        }
        handleLoadingAnalytic()
        if (useSelectInfo.code !== undefined && useSelectInfo.code !== '') {
            if (!info) {
                setInfo(useSelectInfo)
            }
        } else {
            handleLoadingAccount()
        }

    }, [])

    function handleLoadingAnalytic() {
        api.get(URL_ANALYSIS).then((response) => {
            if (response?.status == constant.SUCCESS) {
                const data = {
                    link: response?.body?.link,
                    view: response?.body?.view,
                    account: response?.body?.account,
                    ads: response?.body?.ads
                }
                setAnalytics(data)
            }
        })
    }

    function handleLoadingAccount() {
        api.get(URL_INFO).then((response) => {
            if (response?.status == constant.SUCCESS) {
                const data = {
                    code: response?.body?.info?.code,
                    name: response?.body?.info?.name,
                    avatar: response?.body?.info?.avatar
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

        getItem("Người dùng", '1', '/dashboard/user', <KeyOutlined/>),
        getItem("Links", '2', '/dashboard/link', <AppstoreOutlined/>),
        getItem('Quảng cáo', '3', '/dashboard/ad', <SettingOutlined/>),
        getItem('Cấu hình', '4', '/dashboard/config', <SettingOutlined/>),
        getItem('Đăng xuất', '5', '', <LogoutOutlined/>),
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
                if (router.pathname !== "/dashboard/user") {
                    router.push("user")
                }
                break
            case '2':
                if (router.pathname !== "/dashboard/link") {
                    router.push("link")
                }
                break
            case '3':
                if (router.pathname !== "/dashboard/ad") {
                    router.push("ad")
                }
                break
            case '4':
                if (router.pathname !== "/dashboard/config") {
                    router.push("config")
                }
                break
            case "5":
                setShowModel(true)
                break
        }
    }

    function getPlaceholder() {
        switch (router?.pathname) {
            case "/dashboard/user":
                return "Nhập code người dùng"
            case "/dashboard/link":
                return "Nhập link trỏ tới, key"
            case "/dashboard/ad":
                return "Nhập link, tên quảng cáo"
            case "/dashboard/config":
                return "Nhập code chủ kho"
        }
        return ""
    }

    function RenderItemAnalytics({icon, label, value}: PropsItemAnalytics) {
        return <div className={styles.containerItemAnalytics}>
            <div style={{
                display: "flex",
                gap: 5
            }}>
                {icon}
                <label style={{
                    fontWeight: "bold",
                    fontSize: 20
                }}>{`Tổng ${label.toLowerCase()}`}</label>
            </div>
            <label style={{
                fontWeight: "bold",
                fontSize: 25,
            }}>{value?.toLocaleString()}</label>
            <label>{label}</label>
        </div>
    }

    return <>
        {
            typeof window != undefined &&
            <div className={styles.wrapper}>
                <div className={styles.wrapperAdmin}>
                    {
                        <>
                            <div className={styles.wrapperMenu}>
                                <label className={styles.titlePage}>QUẢN TRỊ VIÊN</label>
                                <div className={styles.info}>
                                    <img src={info?.avatar || "/logo.png"} className={styles.avatar}/>
                                    <div className={styles.code}>
                                        <label>Xin chào</label>
                                        <span>{info?.name || "NO NAME"}</span>
                                    </div>
                                </div>
                                <Typography>
                                    <Typography.Paragraph style={{
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                    }}
                                                          copyable={{text: info?.code, tooltips: true}}>
                                        <span className={styles.codeAccount}>{`Code Account: ${info?.code}`}</span>
                                    </Typography.Paragraph>
                                </Typography>

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
                                <div style={{
                                    display: "flex",
                                    gap: 30
                                }}>
                                    <RenderItemAnalytics
                                        icon={<UserOutlined/>}
                                        label={"Người dùng"}
                                        value={analytics?.account || 0}/>
                                    <hr/>
                                    <RenderItemAnalytics
                                        icon={<LinkOutlined/>}
                                        label={"Links"}
                                        value={analytics?.link || 0}/>

                                    <hr/>

                                    <RenderItemAnalytics
                                        icon={<EyeOutlined/>}
                                        label={"Lượt truy cập"}
                                        value={analytics?.view || 0}/>
                                </div>
                                <hr style={{marginTop: '20px', marginBottom: "20px"}}/>
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    justifyItems: "center"
                                }}>
                                    <label style={{
                                        fontWeight: "bold",
                                        fontSize: '2em',
                                        userSelect: "none",
                                        marginBottom: 20
                                    }}>
                                        {
                                            items.filter((_item) => {
                                                return _item.pathName == router.pathname
                                            })[0]?.label
                                        }
                                    </label>

                                    <SearchComponent
                                        textColor={"black"}
                                        placeholder={getPlaceholder()}/>
                                </div>
                                <RenderChildren/>
                            </div>
                        </>
                    }

                    <Modal
                        title={"Thông báo"}
                        centered
                        open={isShowModel}
                        onOk={() => {
                            router.push(BASE_URL_LOGIN_DASHBOARD)
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
