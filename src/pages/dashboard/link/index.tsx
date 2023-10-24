import {ColumnsType} from "antd/es/table";
import {TypeData} from "~/@type/table";
import {Popconfirm, Table, Tooltip, Typography} from "antd";
import {StopOutlined} from "@ant-design/icons";
import ShortText from "~/component/ShortText";
import {IAPIDashboardLinks, TypePropsLayout} from "~/@type/link";
import _style from "~/pages/admin/link/style.module.scss";
import React, {useEffect, useState} from "react";
import CallApi from "~/utils/apis";
import {URL_LINKS, URL_LOCK_LINK} from "~/utils/Urls";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {VALIDATE_UPDATE_FAILED, VALIDATE_UPDATE_SUCCESS} from "~/utils/validate";
import Loading from "~/component/loading";

export default function Link({openNotification, typeNotify}: TypePropsLayout) {
    const [dataLink, setDataLink] = useState<TypeData<IAPIDashboardLinks>>()
    const api = CallApi()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const constant = Constants()

    function handleLoadingDataLink() {
        setLoading(true)
        api.get(URL_LINKS, {page_offset: router.query.page_offset || 1, search: router.query.search})
            .then((response) => {
                if (response.status == constant.SUCCESS) {
                    const data = response.body
                    setDataLink({
                        data: data.data,
                        total_page: data.total_page
                    })
                }
            })
            .catch(() => {
                setDataLink(undefined)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        handleLoadingDataLink()
    }, [router.query?.page_offset, router.query?.search])

    function handleLockLink(id: number, type: boolean) {
        api.post(URL_LOCK_LINK, {
            id: id,
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

    const column: ColumnsType<IAPIDashboardLinks> = [
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
            key: "source",
            dataIndex: "source",
            title: "Link trỏ tới",
            render: (text) => {
                return <Typography>
                    <Typography.Paragraph style={{marginBottom: 'unset', display: 'flex', alignItems: 'center'}}
                                          copyable={{text: text, tooltips: true}}>
                        <ShortText value={text} click/>
                    </Typography.Paragraph>
                </Typography>
            }
        },
        {
            key: "converted",
            dataIndex: "converted",
            title: "Key",
            render: (text) => {
                return <Typography>
                    <Typography.Paragraph style={{marginBottom: 'unset', display: 'flex', alignItems: 'center'}}
                                          copyable={{text: `${location.origin}/${text}`, tooltips: true}}>
                        <a href={`${location.origin}/${text}`} target={"_blank"}
                           style={{wordWrap: "break-word", wordBreak: "break-word"}} rel="noreferrer">{text}</a>
                    </Typography.Paragraph>
                </Typography>
            }
        },
        {
            key: "view",
            dataIndex: "view",
            title: "Lượt truy cập",
            render: (text) => {
                return <span>{Number(text).toLocaleString()}</span>
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
            key: "code_account",
            dataIndex: "code_account",
            title: "Chủ sở hữu",
            render: (text) => {
                return <span>{text}</span>;
            }
        },
        {
            key: "action",
            title: "Thao tác",
            render: (value: IAPIDashboardLinks) => {
                return <div className={_style.actionGroup}>
                    <div className={_style.styleButton}>
                        <Tooltip title={value.lock ? "Mở khóa" : "Khóa"}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"Cảnh báo"}
                                description={`Bạn thật sự muốn ${value.lock ? "mở khóa" : "khóa"} link này?`}
                                onConfirm={() => {
                                    handleLockLink(value.id, value.lock)
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
        <Loading visible={loading}/>
        <Table
            style={{background: 'white', borderRadius: 20}}
            dataSource={dataLink?.data || []}
            pagination={
                (dataLink?.data || []).length ? {
                    showSizeChanger: false,
                    current: Number(router.query.page_offset || 1),
                    total: (dataLink?.total_page || 0) * 10,
                    onChange: onChangePagination
                } : false
            }
            columns={column}/>
    </div>
}

Link.layout = "dashboard"