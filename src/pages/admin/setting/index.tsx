import {TypePropsLayout} from "~/@type/link";
import _style from "./style.module.scss"
import React, {useCallback, useEffect, useState} from "react";
import {IAPIConfig} from "~/@type/setting";
import {URL_CONFIG, URL_CONFIG_BY_ADMIN, URL_GROUP_AD} from "~/utils/Urls";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import CallApi from "~/utils/apis";
import {Select, Switch} from "antd";
import {VALIDATE_UPDATE_FAILED, VALIDATE_UPDATE_SUCCESS} from "~/utils/validate";
import Loading from "~/component/loading";
import {TableTypeAdsGroup} from "~/@type/table";
import * as process from "process";
import Header from "~/component/Header";

export default function Setting({openNotification, typeNotify}: TypePropsLayout) {
    const constants = Constants()
    const api = CallApi()
    const [data, setData] = useState<IAPIConfig>({ads: undefined, mode_screen: undefined, time_ads: undefined})
    const [loading, setLoading] = useState(false)
    const [dataGroup, setDataGroup] = useState<Array<TableTypeAdsGroup>>([])

    useEffect(() => {
        handleLoadingData()
        handleLoadingDataAdsGroup()
    }, [])

    const handleLoadingDataAdsGroup = useCallback(() => {
        setLoading(false)
        api.get(URL_GROUP_AD).then((response) => {
            if (response?.status == constants.SUCCESS) {
                setDataGroup(response.body || [])
            } else {
                setDataGroup([])
            }
        }).finally(() => setLoading(false))
    }, [])

    const handleLoadingData = useCallback(() => {
        api.get(URL_CONFIG_BY_ADMIN).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: IAPIConfig = response.body
                setData(data)
            } else {
                setData({ads: undefined, mode_screen: undefined, time_ads: undefined})
            }
        })
    }, [])

    function handleUpdate() {
        let _data = {
            ...data
        }
        if (data.ads === undefined) {
            _data.ads = -1
        }
        setLoading(true)
        api.put(URL_CONFIG, {
            data: JSON.stringify(_data)
        }).then((response) => {
            if (response?.status === constants.SUCCESS) {
                openNotification(VALIDATE_UPDATE_SUCCESS, typeNotify.success)
            } else {
                openNotification(VALIDATE_UPDATE_FAILED, typeNotify.failed)
            }
        }).catch(() => {
            openNotification(VALIDATE_UPDATE_FAILED, typeNotify.failed)
        }).finally(() => {
            setLoading(false)
        })
    }

    return <>
        <Header title={"Lopte Admin - Cài đặt"}/>
        <Loading visible={loading}/>
        <div className={_style.wrapper}>
            <div className={_style.contentGroup}>
                <div className={_style.contentItem}>
                    <div className={_style.contentItemRight}>
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
                                <label>Quảng cáo: </label>
                                <label>Thời gian quảng cáo : </label>
                                <label>Trạng thái:</label>
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
                                        width: "200px",
                                        userSelect: "none"
                                    }}
                                    value={data?.ads}
                                    placeholder={"Nhóm quảng cáo"}
                                    onSelect={(item) => {
                                        setData(prevState => {
                                            return {
                                                ...prevState,
                                                ads: item
                                            }
                                        })
                                    }}
                                    allowClear
                                    onClear={() => {
                                        setData(prevState => {
                                            return {
                                                ...prevState,
                                                ads: undefined
                                            }
                                        })
                                    }}
                                    options={dataGroup.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.name
                                        }
                                    })}
                                />
                                <Select
                                    style={{
                                        width: "200px",
                                        userSelect: "none"
                                    }}
                                    placeholder={'Thời gian quảng cáo'}
                                    value={data?.time_ads}
                                    onSelect={(item) => {
                                        setData(prevState => {
                                            return {
                                                ...prevState,
                                                time_ads: item
                                            }
                                        })
                                    }}
                                    options={[
                                        {
                                            label: "15 Giây",
                                            value: 15
                                        },
                                        {
                                            label: "30 Giây",
                                            value: 30
                                        },
                                        {
                                            label: "45 Giây",
                                            value: 45
                                        },
                                    ]}
                                />
                                <div style={{
                                    display: "flex",
                                    gap: 10
                                }}>
                                    <span>{data?.mode_screen ? 'Bật' : "Tắt"}</span>
                                    <Switch checked={data?.mode_screen}
                                            onChange={(item) => {
                                                setData(prevState => {
                                                    return {
                                                        ...prevState,
                                                        mode_screen: item
                                                    }
                                                })
                                            }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <hr/>

                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
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
                        Cập Nhật
                    </div>
                </div>
            </div>
        </div>
    </>
}