import {IAPILink, IAPIPropsAddLink, TypePropsLayout} from "~/@type/link";
import _style from "~/pages/admin/link/style.module.scss";
import {Form, Input, Modal, Popconfirm, Spin, Table, Tooltip} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {TableTypeAds, TableTypeLink, TypeData} from "~/@type/table";
import CallApi from "~/utils/apis";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {ColumnsType} from "antd/es/table";
import ShortText from "~/component/ShortText";
import {DeleteOutlined} from "@ant-design/icons";
import {TypePropsModalLink} from "~/@type/modal.d";
import {URL_ADS} from "~/utils/Urls";
import {VALIDATE_ADD_SUCCESS, VALIDATE_DELETE_SUCCESS, VALIDATE_EXIST_DATA} from "~/utils/validate";
import {Exception} from "sass";
import {IAPIAddAds, IAPIPropsAddAds} from "~/@type/ads";
import {NotificationPlacement} from "antd/es/notification/interface";

export default function Ads({ openNotification, typeNotify } : TypePropsLayout) {
    const [data, setData] = useState<TypeData<TableTypeAds>>({data: [], totalPage: 0})
    const api = CallApi()
    const [formData] = Form.useForm()
    const router = useRouter()
    const constants = Constants()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const column: ColumnsType<TableTypeAds> = [
        {
            key: "stt",
            title: "STT",
            render: (__: any,_: any,index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            key: "name",
            dataIndex: "name",
            title: "Tên",
            render: (text) => {
                return <span style={{wordWrap: "break-word", wordBreak: "break-word"}}>{text}</span>
            }
        },
        {
            key: "link",
            dataIndex: "link",
            title: "Link youtube",
            render: (text) => {
                return <span style={{wordWrap: "break-word", wordBreak: "break-word"}}>{`https://www.youtube.com/watch?v=${text}`}</span>
            }
        },
        {
            key: "action",
            title: "Thao tác",
            render: (value: IAPIAddAds) => {
                return <div className={_style.actionGroup}>
                    <div className={_style.styleButton}>
                        <Tooltip title={"Xóa"}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"Cảnh báo"}
                                description={"Bạn thật sự muốn xóa quảng cáo này?"}
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
    useEffect(() => {
        handleLoadingData()
    }, [])
    function handleDeleteLink(id: number) {
        setLoading(true)
        api.deleteApi(URL_ADS,
            {id: id}).then(() => {
            openNotification(VALIDATE_DELETE_SUCCESS,typeNotify.success)
            handleLoadingData()
        }).finally(() => {
            setLoading(false)
        })
    }
    const handleLoadingData = useCallback(() => {
        api.get(URL_ADS, {page_offset: router.query.page_offset || 1}).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: TypeData<TableTypeAds> = response.body
                setData({
                    totalPage: data.totalPage,
                    // @ts-ignore
                    data: data.data?.map((item, index) => {
                        return {
                            id: item.id,
                            name: item.name,
                            link: item.link
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
    }, [router.query])
    function handleFinish(value: IAPIPropsAddAds) {
        setShowModal(false)
        setLoading(true)
        api.post(URL_ADS,value).then((response) => {
            if (response?.status === constants.SUCCESS) {
                if (response?.body.category === "exist") {
                    openNotification(VALIDATE_EXIST_DATA, typeNotify.info)
                }else {
                    handleLoadingData()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                }
            }else {
                openNotification(response?.response?.data?.message || response?.message, typeNotify.failed)
            }
        }).catch((e: Exception) => {
            console.log('err',e)
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
                                message: "Tên video là bắt buộc"
                            }
                        ]}
                        name={"name"}
                        label={"Name"}>
                        <Input placeholder={"Vui lòng nhập tên video"}/>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "ID Youtube là bắt buộc"
                            }
                        ]}
                        name={"link"}
                        label={"ID Youtube (ex: https://www.youtube.com/watch?v=1q5GStbpx8U)"}>
                        <Input placeholder={"Vui lòng nhập ID video youtube (ex: 1q5GStbpx8U)"}/>
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