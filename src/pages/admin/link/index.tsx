import _style from './style.module.scss'
import {Form, Input, Modal, Popconfirm, Table, Tooltip, Typography} from "antd";
import {TableTypeLink, TypeData} from "~/@type/table";
import {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import {DeleteOutlined, StopOutlined} from "@ant-design/icons";
import {URL_LINK, URL_LINKS_BY_USER} from "~/utils/Urls";
import CallApi from "~/utils/apis";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {IAPILink, IAPIPropsAddLink, TypePropsLayout} from "~/@type/link";
import {TypePropsModalLink} from "~/@type/modal.d";
import ShortText from "~/component/ShortText";
import {VALIDATE_ADD_SUCCESS, VALIDATE_DELETE_SUCCESS, VALIDATE_EXIST_DATA} from "~/utils/validate";
import {Exception} from "sass";
import SearchComponent from "~/component/SearchComponent";
import Header from "~/component/Header";
import Loading from "~/component/loading";

export default function Link({openNotification, typeNotify}: TypePropsLayout) {
    const [data, setData] = useState<TypeData<TableTypeLink>>({data: [], total_page: 0})
    const api = CallApi()
    const [formData] = Form.useForm()
    const router = useRouter()
    const constants = Constants()
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const handleLoadingData = () => {
        api.get(URL_LINKS_BY_USER, {page_offset: currentPage, search: router.query.search}).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: TypeData<TableTypeLink> = response.body
                setData({
                    total_page: data.total_page,
                    // @ts-ignore
                    data: data.data?.map((item, index) => {
                        return {
                            id: item.id,
                            link: item.source,
                            key: item.converted,
                            view: item.view,
                            created_at: new Date(item.created_at * 1000).toLocaleString(),
                            lock: item.lock || false
                        }
                    }) || []
                })
            } else {
                setData(prevState => {
                    return {
                        ...prevState,
                        data: []
                    }
                })
            }
        }).finally(() => setLoading(false))
    }

    function handleDeleteLink(id: number) {
        setLoading(true)
        api.deleteApi(URL_LINK,
            {id: id}).then(() => {
            openNotification(VALIDATE_DELETE_SUCCESS, typeNotify.success)
            handleLoadingData()
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        handleLoadingData()
    }, [currentPage, router.query.search])

    const column: ColumnsType<TableTypeLink> = [
        {
            key: "stt",
            title: "STT",
            render: (__, value, index) => {
                console.log(value)
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
            key: "link",
            dataIndex: "link",
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
            key: "key",
            dataIndex: "key",
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
                return <span>{text}</span>
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
                                <DeleteOutlined className={_style.styleIconButton}/>
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
        api.post(URL_LINK, value).then((response) => {
            if (response?.status === constants.SUCCESS) {
                if (response?.body.category === "exist") {
                    openNotification(VALIDATE_EXIST_DATA, typeNotify.info)
                } else {
                    handleLoadingData()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                }
            } else {
                openNotification(response?.response?.data?.message, typeNotify.failed)
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
                onOk={() => {
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
                        label={"Vui lòng nhập link bạn muốn trỏ tới"}>
                        <Input placeholder={"https://loptefile.com/...."}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    }

    const onChangePagination = (page: number) => {
        setCurrentPage(page)
    }

    return <>
        <Header title={"Lopte Link - Dashboard"}/>
        <div className={_style.wrapper}>
            <Loading visible={loading}/>
            <div className={_style.contentAction}>
                <SearchComponent/>
                <div
                    onClick={() => {
                        setShowModal(true)
                    }}
                    className={_style.buttonAdd}>
                    <span>Thêm mới</span>
                </div>
            </div>
            <div className={_style.body}>
                <Table
                    style={{background: 'white', borderRadius: 20}}
                    dataSource={data.data}
                    pagination={
                        {
                            showSizeChanger: false,
                            current: currentPage,
                            total: data.total_page * 10,
                            onChange: onChangePagination
                        }
                    }
                    columns={column}/>
            </div>
            <RenderModalData
                show={showModal}
            />
        </div>
    </>
}