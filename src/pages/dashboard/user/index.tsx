import {ColumnsType} from "antd/es/table";
import {TypeData} from "~/@type/table";
import {Popconfirm, Table, Tooltip, Typography} from "antd";
import {StopOutlined} from "@ant-design/icons";
import {TypePropsLayout} from "~/@type/link";
import _style from "~/pages/admin/link/style.module.scss";
import React, {useEffect, useState} from "react";
import CallApi from "~/utils/apis";
import {URL_LOCK_USER, URL_USERS} from "~/utils/Urls";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {VALIDATE_UPDATE_FAILED, VALIDATE_UPDATE_SUCCESS} from "~/utils/validate";
import {IAPIDashboardUsers} from "~/@type/user";
import Loading from "~/component/loading";
import Header from "~/component/Header";

export default function User({openNotification, typeNotify}: TypePropsLayout) {
    const [data, setData] = useState<TypeData<IAPIDashboardUsers>>()
    const api = CallApi()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const constant = Constants()

    function handleLoadingDataLink() {
        setLoading(true)
        api.get(URL_USERS, {page_offset: router.query.page_offset || 1, search: router.query.search})
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

    function handleLockUser(username: string, type: boolean) {
        api.post(URL_LOCK_USER, {
            username: username,
            category: type ? "unlock" : "lock"
        }).then((response) => {
            if (response.status == constant.SUCCESS) {
                handleLoadingDataLink()
                openNotification(VALIDATE_UPDATE_SUCCESS, typeNotify.success)
            } else {
                openNotification(VALIDATE_UPDATE_FAILED, typeNotify.failed)
            }
        })
    }

    const column: ColumnsType<IAPIDashboardUsers> = [
        {
            key: "stt",
            title: "STT",
            render: (__, value, index) => {
                return <div style={{
                    display: "flex",
                    gap: 5,
                    alignItems: "center"
                }}>
                    <span>{index + 1}</span>
                    {
                        value.lock && <Tooltip title={"Link đã bị khóa"}>
                            <StopOutlined style={{
                                color: "red"
                            }}/>
                        </Tooltip>
                    }
                </div>;
            }
        },
        {
            key: "created_at",
            dataIndex: "created_at",
            title: "Thời gian tạo",
            render: (text) => {
                return <span>{new Date(text * 1000).toLocaleString()}</span>;
            }
        },
        {
            key: "username",
            dataIndex: "username",
            title: "Người dùng",
            render: (text) => {
                return <Typography>
                    <Typography.Paragraph style={{marginBottom: 'unset', display: 'flex', alignItems: 'center'}}
                                          copyable={{text: text, tooltips: true}}>
                        <span>{text}</span>
                    </Typography.Paragraph>
                </Typography>
            }
        },
        {
            key: "action",
            title: "Thao tác",
            render: (value: IAPIDashboardUsers) => {
                return <div className={_style.actionGroup}>
                    <div className={_style.styleButton}>
                        <Tooltip title={value.lock ? "Mở khóa" : "Khóa"}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"Cảnh báo"}
                                description={`Bạn thật sự muốn ${value.lock ? "mở khóa" : "khóa"} người dùng này?`}
                                onConfirm={() => {
                                    handleLockUser(value.username, value.lock)
                                }}
                                okText="Đồng ý"
                                cancelText="Từ chối"
                            >
                                <img className={_style.styleIconButton} src={value.lock ? "/key.png" : "/lock.png"}/>
                            </Popconfirm>

                        </Tooltip>
                    </div>
                </div>
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
        <Header title={"Lopte Dashboard - Người dùng"}/>
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

User.layout = "dashboard"