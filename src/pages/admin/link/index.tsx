import _style from './style.module.scss'
import {Form, Input, Modal, notification, Popconfirm, Spin, Table, Tooltip} from "antd";
import {TableTypeLink, TypeData} from "~/@type/table";
import {ColumnsType} from "antd/es/table";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import { URL_LINK, URL_LINKS} from "~/utils/Urls";
import CallApi from "~/utils/apis";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {IAPILink, IAPIPropsAddLink, TypePropsMenu} from "~/@type/link";
import {TypePropsModalLink} from "~/@type/modal.d";
import ShortText from "~/component/ShortText";
import { NotificationPlacement } from 'antd/es/notification/interface';
import {VALIDATE_ADD_SUCCESS, VALIDATE_DELETE_SUCCESS, VALIDATE_EXIST_DATA} from "~/utils/validate";
import {Exception} from "sass";
import Loading from "~/component/loading";
export default function Link({ notify, context} : TypePropsMenu) {
    const [data, setData] = useState<TypeData<TableTypeLink>>({data: [], totalPage: 0})
    const api = CallApi()
    const [formData] = Form.useForm()
    const router = useRouter()
    const constants = Constants()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const handleLoadingData = useCallback(() => {
        api.get(URL_LINKS, {page_offset: router.query.page_offset || 1}).then((response) => {
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
    function handleDeleteLink(id: number) {
        setLoading(true)
        api.deleteApi(URL_LINK,
            {id: id}).then(() => {
            openNotification(VALIDATE_DELETE_SUCCESS,typeNoti.success)
            handleLoadingData()
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        handleLoadingData()
    }, [])
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
                return <ShortText value={text} click />
            }
        },
        {
            key: "key",
            dataIndex: "key",
            title: "Key",
            render: (text) => {
                return <span style={{wordWrap: "break-word", wordBreak: "break-word"}}>{text}</span>;
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
                    openNotification(VALIDATE_EXIST_DATA, typeNoti.info)
                }else {
                    handleLoadingData()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNoti.success)
                }
            }else {
                openNotification(response?.message, typeNoti.failed)
            }
        }).catch((e: Exception) => {
            openNotification(e.message, typeNoti.failed)
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
    return <div className={_style.wrapper}>
            <div className={_style.contentAction}>
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
}