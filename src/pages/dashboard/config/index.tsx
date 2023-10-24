import {ColumnsType} from "antd/es/table";
import {TypeData} from "~/@type/table";
import {Table, Tooltip} from "antd";
import {PauseCircleFilled, QuestionOutlined, StopFilled} from "@ant-design/icons";
import {TypePropsLayout} from "~/@type/link";
import React, {useEffect, useState} from "react";
import CallApi from "~/utils/apis";
import {URL_CONFIGS} from "~/utils/Urls";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import Loading from "~/component/loading";
import {IAPIDashboardAccountITem, IAPIDashboardAdsGroup} from "~/@type/ads";
import {IAPIDashboardConfig} from "~/@type/config";

export default function Configs({openNotification, typeNotify}: TypePropsLayout) {
    const [data, setData] = useState<TypeData<IAPIDashboardConfig>>()
    const api = CallApi()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const constant = Constants()

    function handleLoadingDataLink() {
        setLoading(true)
        api.get(URL_CONFIGS, {page_offset: router.query.page_offset || 1, search: router.query.search})
            .then((response) => {
                if (response.status == constant.SUCCESS) {
                    const data = response.body
                    setData({
                        data: data.data,
                        total_page: data.total_page
                    })
                }
            })
            .catch(() => {
                setData(undefined)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        handleLoadingDataLink()
    }, [router.query?.page_offset, router.query?.search])

    const column: ColumnsType<IAPIDashboardConfig> = [
        {
            key: "stt",
            title: "STT",
            render: (__, value, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: "ads",
            dataIndex: "ads",
            title: "Quảng cáo",
            render: (value: IAPIDashboardAdsGroup) => {
                return <span>{value.name || <QuestionOutlined/>}</span>
            }
        },
        {
            key: "time_ads",
            dataIndex: "time_ads",
            title: "Thời gian quảng cáo",
            render: (text) => {
                return <span>{`${text} giây`}</span>;
            }
        },
        {
            key: "mode_screen",
            dataIndex: "mode_screen",
            title: "Hiển thị quảng cáo",
            render: (value: boolean) => {
                return <Tooltip title={value ? "Bật" : "Tắt"}>
                    <span>{value ? <PauseCircleFilled style={{fontSize: 30, color: "green"}}/> :
                        <StopFilled style={{fontSize: 30, color: "red"}}/>}</span>
                </Tooltip>
            }
        },
        {
            key: "account",
            dataIndex: "account",
            title: "Người dùng",
            render: (value: IAPIDashboardAccountITem) => {
                return <span>{value.code}</span>;
            }
        }
    ]

    function onChangePagination(e: number) {
        router.push({
            query: {
                ...router.query,
                page_offset: e
            }
        })
    }

    return <div>
        <Loading visible={loading}/>
        <Table
            style={{background: 'white', borderRadius: 20}}
            dataSource={data?.data || []}
            pagination={
                (data?.data || []).length ? {
                    showSizeChanger: false,
                    current: Number(router.query.page_offset || 1),
                    total: (data?.total_page || 0) * 10,
                    onChange: onChangePagination
                } : false
            }
            columns={column}/>
    </div>
}

Configs.layout = "dashboard"