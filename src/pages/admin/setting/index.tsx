import {TypePropsLayout} from "~/@type/link";
import _style from "./style.module.scss"
import React, {useCallback, useEffect, useState} from "react";
import {IAPIConfig} from "~/@type/setting";
import {URL_CONFIG} from "~/utils/Urls";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import CallApi from "~/utils/apis";
import ShortText from "~/component/ShortText";
import {Input, Radio, Select, Spin, Switch} from "antd";
import {NotificationPlacement} from "antd/es/notification/interface";
import {VALIDATE_DELETE_SUCCESS, VALIDATE_UPDATE_FAILED, VALIDATE_UPDATE_SUCCESS} from "~/utils/validate";
import {EditOutlined} from "@ant-design/icons";
export default function Setting({ openNotification, typeNotify} : TypePropsLayout) {
    const router = useRouter()
    const constants = Constants()
    const api = CallApi()
    const [data, setData] = useState<IAPIConfig>([])
    const [selectAd, setSelectAd] = useState<number>(0)
    const [selectAdTime, setSelectAdTime] = useState<number>()
    const [isMaintenance, setMaintenance] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const [updateAdsDescription,setAdsDescription] = useState(false)
    useEffect(() => {
        handleLoadingData()
    }, [])
    const handleLoadingData = useCallback(() => {
        api.get(URL_CONFIG, {page_offset: router.query.page_offset || 1}).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: IAPIConfig = response.body
                setData(data)
            }else {
                setData([])
            }
        })
    }, [])
    function handleUpdate() {
        setLoading(true)
        api.put(URL_CONFIG, {
            data: JSON.stringify(data)
        }).then((response) => {
            if (response?.status === constants.SUCCESS) {
                openNotification(VALIDATE_UPDATE_SUCCESS,typeNotify.success)
            }else {
                openNotification(VALIDATE_UPDATE_FAILED,typeNotify.failed)
            }
        }).catch(() => {
            openNotification(VALIDATE_UPDATE_FAILED, typeNotify.failed)
        }).finally(() => {
            setLoading(false)
        })
    }

    return <div className={_style.wrapper}>
        <div className={_style.contentGroup}>
            <div className={_style.contentItem}>
                <label>Quảng cáo</label>
                <div className={_style.contentItemRight}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        <div>
                            <label>Link quảng cáo: </label>
                            <EditOutlined
                                onClick={() => setAdsDescription(true)}
                                style={{
                                cursor: "pointer"
                            }}/>
                        </div>
                        {
                            updateAdsDescription ?
                                <Input
                                    onPressEnter={() => setAdsDescription(false)}
                                    onChange={(e) => {
                                        const filter =  data.findIndex((item) => {
                                            return item.name === "ads"
                                        })

                                        setData(prevState => {
                                            const value = [...prevState]
                                            value[filter].description = e.target.value
                                            return value
                                        })
                                    }}
                                    value={data.filter((_item) => {
                                        return _item.name == "ads"
                                    })[0]?.description}
                                    placeholder={"Nhập link ID youtube"} />
                                :
                                <a href={`https://www.youtube.com/watch?v=${data.filter((_item) => {
                                    return _item.name == "ads"
                                })[0]?.description}`}>{`https://www.youtube.com/watch?v=${data.filter((_item) => {
                                    return _item.name == "ads"
                                })[0]?.description || ""}`}</a>
                        }

                    </div>
                    <div style={{
                        display: "flex",
                        gap: 50,
                        alignContent: "center",
                        justifyContent: "space-between",
                        justifyItems: "center",
                        alignItems: "center"
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            alignItems: "start",
                            justifyItems: "center"
                        }}>
                            <label>Chế độ: </label>
                            <label>Thời gian quảng cáo : </label>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            alignItems: "end",
                            justifyItems: "center"
                        }}>
                            <Select
                                style={{
                                    width: "200px"
                                }}
                                value={data.filter((item) => {
                                    return item.name === "ads"
                                })[0]?.value === "true" ? 1 : 0}
                                onSelect={(item) => {
                                    const filter =  data.findIndex((item) => {
                                        return item.name === "ads"
                                    })

                                    setData(prevState => {
                                        const value = [...prevState]
                                        value[filter].value = item === 1 ? "true" : "false"
                                        return value
                                    })
                                }}
                                options={[
                                    {
                                        label: "Một quảng cáo",
                                        value: 1
                                    },
                                    {
                                        label: "Nhiều quảng cáo",
                                        value: 0
                                    },
                                ]}
                            />
                            <Select
                                style={{
                                    width: "200px"
                                }}
                                value={data.filter((item) => {
                                    return item.name === "time_ads"
                                })[0]?.value}
                                onSelect={(item) => {
                                    const filter =  data.findIndex((item) => {
                                        return item.name === "time_ads"
                                    })

                                    setData(prevState => {
                                        const value = [...prevState]
                                        value[filter].value = item.toString()
                                        return value
                                    })
                                }}
                                options={[
                                    {
                                        label: "15 Giây",
                                        value: "15"
                                    },
                                    {
                                        label: "30 Giây",
                                        value: "30"
                                    },
                                    {
                                        label: "45 Giây",
                                        value: "45"
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <div style={{
                    justifyContent: "space-between"
                }} className={_style.contentItem}>
                    <label>Bảo trì</label>
                    <div className={_style.contentItemRight}>
                        <Switch
                            checked={data.filter((item) => {
                                return item.name === "maintenance"
                            })[0]?.value.toLowerCase() === "true"}
                            onChange={(item) => {
                                const filter =  data.findIndex((item) => {
                                    return item.name === "maintenance"
                                })

                                setData(prevState => {
                                    const value = [...prevState]
                                    value[filter].value = item.toString()
                                    return value
                                })
                                setMaintenance(item)
                        }} />
                    </div>
                </div>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <Spin spinning={loading}>
                    <div
                        onClick={handleUpdate}
                        style={{
                            padding: "10px 30px",
                            borderRadius: "10px",
                            background: "#008BB7",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                            userSelect: "none"
                        }}>
                        <span>Cập nhật</span>
                    </div>
                </Spin>
            </div>
        </div>
    </div>
}