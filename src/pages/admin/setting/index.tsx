import {TypePropsMenu} from "~/@type/link";
import _style from "./style.module.scss"
import React, {useCallback, useEffect, useState} from "react";
import {IAPIConfig, IAPIConfigItem, TypeUpdateSetting} from "~/@type/setting";
import {URL_CONFIG, URL_LINKS} from "~/utils/Urls";
import {TableTypeLink, TypeData} from "~/@type/table";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import CallApi from "~/utils/apis";
import ShortText from "~/component/ShortText";
import {Input, Radio, Select, Spin, Switch} from "antd";
import {NotificationPlacement} from "antd/es/notification/interface";
import {VALIDATE_UPDATE_FAILED, VALIDATE_UPDATE_SUCCESS} from "~/utils/validate";
import {EditOutlined} from "@ant-design/icons";
export default function Setting({ notify, context} : TypePropsMenu) {
    const router = useRouter()
    const constants = Constants()
    const api = CallApi()
    const [data, setData] = useState<IAPIConfig>([])
    const [selectAd, setSelectAd] = useState<number>(0)
    const [isMaintenance, setMaintenance] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const [descriptionAd, setDescription] = useState("")
    const [updateAdsDescription,setAdsDescription] = useState(false)
    useEffect(() => {
        handleLoadingData()
    }, [])
    const handleLoadingData = useCallback(() => {
        api.get(URL_CONFIG, {page_offset: router.query.page_offset || 1}).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: IAPIConfig = response.body
                const filterAd = data.filter((item) => {
                    return item.name === "ads"
                })[0]
                const filterMaintenance = data.filter((item) => {
                    return item.name === "maintenance"
                })[0].value
                setDescription(filterAd?.description || "")
                setSelectAd(filterAd?.value === "true" ? 1 : 0)
                setMaintenance(filterMaintenance === "true")
                setData(data)
            }else {
                setData([])
            }
        })
    }, [])
    const typeNoti = {success: "success",failed: "failed",info: "info"}
    const openNotification = (message: string, type: string, place : NotificationPlacement = 'topRight') => {
        switch (type) {
            case typeNoti.success: {
                notify.success({
                    message: "Thành công",
                    description: <context.Consumer>{() => message}</context.Consumer>,
                    // @ts-ignore
                    place,
                })
                break
            }
            case typeNoti.failed: {
                notify.error({
                    message: "Thất bại",
                    description: <context.Consumer>{() => message}</context.Consumer>,
                    // @ts-ignore
                    place,
                });
                break
            }
            case typeNoti.info: {
                notify.info({
                    message: "Thông báo",
                    description: <context.Consumer>{() => message}</context.Consumer>,
                    // @ts-ignore
                    place,
                });
                break
            }
        }
    };
    function handleUpdate() {
        const filter = data?.filter((item) => {
            return item.name === "ads"
        })[0]
        const filterDes = data?.filter((item) => {
            return item.name === "ads"
        })[0]?.description
        const filterMaintenance = data?.filter((item) => {
            return item.name === "maintenance"
        })[0]?.value.toLowerCase()
        if (selectAd.toString() !== filter?.value.toLowerCase()) {
            setLoading(true)
            api.put(URL_CONFIG, {
                name: "ads",
                value: selectAd ? "true" : "false"
            }).then((response) => {
                if (response?.status === constants.SUCCESS) {
                    openNotification(typeNoti.success, VALIDATE_UPDATE_SUCCESS)
                }else {
                    openNotification(typeNoti.failed, VALIDATE_UPDATE_FAILED)
                }
            }).catch(() => {
                openNotification(typeNoti.failed, VALIDATE_UPDATE_FAILED)
            }).finally(() => {
                if (descriptionAd === filterDes && isMaintenance.toString() === filterMaintenance) {
                    setLoading(false)
                }
            })
        }

        if (descriptionAd !== filterDes) {
            if (loading) {
                setLoading(true)
            }
            api.put(URL_CONFIG, {
                name: "ads",
                description: descriptionAd
            }).then((response) => {
                if (response?.status === constants.SUCCESS) {
                    setData(prevState => {
                        return [
                            ...prevState,
                            {
                                ...filter,
                                description: descriptionAd
                            }
                        ]
                    })
                    openNotification(typeNoti.success, VALIDATE_UPDATE_SUCCESS)
                }else {
                    openNotification(typeNoti.failed, VALIDATE_UPDATE_FAILED)
                }
            }).catch(() => {
                openNotification(typeNoti.failed, VALIDATE_UPDATE_FAILED)
            }).finally(() => {
                if (isMaintenance.toString() === filterMaintenance) {
                    setLoading(false)
                }
            })
        }
        if (isMaintenance.toString() !== filterMaintenance) {
            if (loading) {
                setLoading(true)
            }
            api.put(URL_CONFIG, {
                name: "maintenance",
                value: isMaintenance.toString()
            }).then((response) => {
                if (response?.status === constants.SUCCESS) {
                    setData(prevState => {
                        return [
                            ...prevState,
                            {
                                ...filter,
                                value: isMaintenance.toString()
                            }
                        ]
                    })
                    openNotification(typeNoti.success, VALIDATE_UPDATE_SUCCESS)
                }else {
                    openNotification(typeNoti.failed, VALIDATE_UPDATE_FAILED)
                }
            }).catch(() => {
                openNotification(typeNoti.failed, VALIDATE_UPDATE_FAILED)
            }).finally(() => {
                setLoading(false)
            })
        }
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
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={descriptionAd}
                                    placeholder={"Nhập link ID youtube"} />
                                :
                                <a href={`https://www.youtube.com/watch?v=${descriptionAd}`}>{`https://www.youtube.com/watch?v=${descriptionAd}`}</a>
                        }

                    </div>
                    <div style={{
                        display: "flex",
                        gap: 20,
                        alignItems: "center",
                        justifyItems: "center"
                    }}>
                        <label>Chế độ: </label>
                        <Select
                            style={{
                                width: "200px"
                            }}
                            value={selectAd}
                            onSelect={(item) => {
                                setSelectAd(item)
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
                            checked={isMaintenance}
                            onChange={(item) => {
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