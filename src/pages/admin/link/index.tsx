import _style from './style.module.scss'
import {Form, Input, Modal, notification, Popconfirm, Spin, Table, Tooltip, Typography} from "antd";
import {TableTypeLink, TypeData} from "~/@type/table";
import {ColumnsType} from "antd/es/table";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {DOMAIN_LINK, URL_LINK, URL_LINKS, URL_SEARCH_LINK} from "~/utils/Urls";
import CallApi from "~/utils/apis";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {IAPILink, IAPIPropsAddLink, TypePropsLayout} from "~/@type/link";
import {TypePropsModalLink} from "~/@type/modal.d";
import ShortText from "~/component/ShortText";
import { NotificationPlacement } from 'antd/es/notification/interface';
import {VALIDATE_ADD_SUCCESS, VALIDATE_DELETE_SUCCESS, VALIDATE_EXIST_DATA} from "~/utils/validate";
import {Exception} from "sass";
import Loading from "~/component/loading";
import SearchComponent from "~/component/SearchComponent";
import Header from "~/component/Header";
export default function Link({ openNotification, typeNotify } : TypePropsLayout) {
    const [data, setData] = useState<TypeData<TableTypeLink>>({data: [], totalPage: 0})
    const api = CallApi()
    const [formData] = Form.useForm()
    const router = useRouter()
    const constants = Constants()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const handleLoadingData = useCallback(() => {
        api.get(URL_LINKS, {page_offset: router.query.page_offset || 1, search: router.query.search}).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: TypeData<TableTypeLink> = response.body
                setData({
                    totalPage: data.totalPage,
                    // @ts-ignore
                    data: data.data?.map((item, index) => {
                        return {
                            id: item.id,
                            link: item.source,
                            key: item.converted,
                            created_at: new Date(item.created_at * 1000).toLocaleString()
                        }
                    }) || []
                })
            }else {
                setData(prevState => {
                    return {
                        ...prevState,
                        data: []
                    }
                })
            }
        })
    }, [router.query.search, router.query.page_offset])

    function handleDeleteLink(id: number) {
        setLoading(true)
        api.deleteApi(URL_LINK,
            {id: id}).then(() => {
            openNotification(VALIDATE_DELETE_SUCCESS,typeNotify.success)
            handleLoadingData()
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        handleLoadingData()
    }, [router.query.page_offset, router.query.search])
    const column: ColumnsType<TableTypeLink> = [
        {
            key: "stt",
            title: "STT",
            render: (__: any,_: any,index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            key: "link",
            dataIndex: "link",
            title: "Link trỏ tới",
            render: (text) => {
                return <Typography>
                    <Typography.Paragraph style={{ marginBottom: 'unset', display: 'flex', alignItems: 'center' }}
                                          copyable={{ text: text, tooltips: true }}>
                            <ShortText value={text} click />
                    </Typography.Paragraph>
                </Typography>
            }
        },
        {
            key: "key",
            dataIndex: "key",
            title: "Key",
            render: (text) => {
                return <Typography>
                    <Typography.Paragraph style={{ marginBottom: 'unset', display: 'flex', alignItems: 'center' }}
                                          copyable={{ text: `${DOMAIN_LINK}${text}`, tooltips: true }}>
                        <span style={{wordWrap: "break-word", wordBreak: "break-word"}}>{text}</span>
                    </Typography.Paragraph>
                </Typography>
            }
        },
        {
            key: "created_at",
            dataIndex: "created_at",
            title: "Thời gian tạo",
            render: (text) => {
                return <span>{text}</span>;
            }
        },
        {
            key: "action",
            title: "Thao tác",
            render: (value: IAPILink) => {
                return <div className={_style.actionGroup}>
                    <div className={_style.styleButton}>
                        <Tooltip title={"Xóa"}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"Cảnh báo"}
                                description={"Bạn thật sự muốn xóa link này?"}
                                onConfirm={() => {
                                    handleDeleteLink(value.id)
                                }}
                                okText="Đồng ý"
                                cancelText="Từ chối"
                            >
                                <DeleteOutlined  className={_style.styleIconButton}/>
                            </Popconfirm>

                        </Tooltip>
                    </div>
                </div>
            }
        }
    ]
    function handleFinish(value: IAPIPropsAddLink) {
        setShowModal(false)
        setLoading(true)
        api.post(URL_LINK,value).then((response) => {
            if (response?.status === constants.SUCCESS) {
                if (response?.body.category === "exist") {
                    openNotification(VALIDATE_EXIST_DATA, typeNotify.info)
                }else {
                    handleLoadingData()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                }
            }else {
                openNotification(response?.message, typeNotify.failed)
            }
        }).catch((e: Exception) => {
            openNotification(e.message, typeNotify.failed)
        }).finally(() => {
            setLoading(false)
        })
        formData.resetFields()
    }
    function RenderModalData({show}: TypePropsModalLink) {

        return <>
            <Modal
                centered
                onCancel={() => {
                    setShowModal(false)
                    formData.resetFields()
                }}
                onOk={()=>{
                    formData.submit()
                }}
                title={data ? "Chỉnh sửa" : "Thêm mới"}
                open={show}>
                <Form
                    layout={"vertical"}
                    onFinish={handleFinish}
                    form={formData}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Link là bắt buộc"
                            }
                        ]}
                        name={"source"}
                        label={"Link"}>
                        <Input placeholder={"Vui lòng nhập link bạn muốn trỏ tới"}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    }

    return <>
    <Header title={"Lopte Link - Dashboard"} />
    <div className={_style.wrapper}>
            <div className={_style.contentAction}>
                <SearchComponent />
                <div
                    onClick={() => {
                        setShowModal(true)
                    }}
                    className={_style.buttonAdd}>
                    <span>Thêm mới</span>
                </div>
            </div>
            <div className={_style.body}>
                <Spin spinning={loading}>
                    <Table
                        dataSource={data.data}
                        pagination={
                            {
                                total: data.totalPage,
                            }
                        }
                        columns={column} />
                </Spin>
            </div>
            <RenderModalData
                show={showModal}
            />
        </div>
    </>
}