import {ColumnsType} from "antd/es/table";
import {TypeData} from "~/@type/table";
import {Table} from "antd";
import {QuestionOutlined} from "@ant-design/icons";
import {TypePropsLayout} from "~/@type/link";
import React, {useEffect, useState} from "react";
import CallApi from "~/utils/apis";
import {URL_ADS} from "~/utils/Urls";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import Loading from "~/component/loading";
import {IAPIDashboardAccountITem, IAPIDashboardAds, IAPIDashboardAdsGroup} from "~/@type/ads";
import Header from "~/component/Header";

export default function Ads({openNotification, typeNotify}: TypePropsLayout) {
    const [data, setData] = useState<TypeData<IAPIDashboardAds>>()
    const api = CallApi()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const constant = Constants()

    function handleLoadingDataLink() {
        setLoading(true)
        api.get(URL_ADS, {page_offset: router.query.page_offset || 1, search: router.query.search})
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

    const column: ColumnsType<IAPIDashboardAds> = [
        {
            key: "stt",
            title: "STT",
            render: (__, value, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: "link",
            dataIndex: "link",
            title: "Link quảng cáo",
            render: (text) => {
                return <a target={"_blank"} href={`https://www.youtube.com/watch?v=${text}`}
                          style={{wordWrap: "break-word", wordBreak: "break-word"}}
                          rel="noreferrer">{`https://www.youtube.com/watch?v=${text}`}</a>
            }
        },
        {
            key: "name",
            dataIndex: "name",
            title: "Tên",
            render: (text) => {
                return <span>{text}</span>;
            }
        },
        {
            key: "group",
            dataIndex: "group",
            title: "Nhóm",
            render: (value: IAPIDashboardAdsGroup) => {
                return <span>{value.name || <QuestionOutlined />}</span>;
            }
        },
        {
            key: "account",
            dataIndex: "account",
            title: "Chủ sở hữu",
            render: (value: IAPIDashboardAccountITem) => {
                return <span>{value?.username}</span>;
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
        <Header title={"Lopte Dashboard - Quảng cáo"}/>
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

Ads.layout = "dashboard"