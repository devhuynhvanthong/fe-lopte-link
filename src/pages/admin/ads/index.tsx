import {TypePropsLayout} from "~/@type/link";
import _style from "./style.module.scss";
import {Form, Input, Modal, Popconfirm, Select, Table, Tabs, TabsProps, Tooltip} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {TableTypeAds, TableTypeAdsGroup, TypeData, TypeGroupAds} from "~/@type/table";
import CallApi from "~/utils/apis";
import {useRouter} from "next/router";
import Constants from "~/utils/Constants";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined, QuestionOutlined} from "@ant-design/icons";
import {TypePropsModalLink} from "~/@type/modal.d";
import {URL_ADS, URL_ADS_BY_USER, URL_GROUP_AD} from "~/utils/Urls";
import {VALIDATE_ADD_SUCCESS, VALIDATE_DELETE_SUCCESS, VALIDATE_EXIST_DATA} from "~/utils/validate";
import {Exception} from "sass";
import {IAPIAddAds, IAPIPropsAddAds, IAPIPropsAddAdsGroup, IAPIPropsAddAdsToGroup} from "~/@type/ads";
import Loading from "~/component/loading";

export default function Ads({openNotification, typeNotify}: TypePropsLayout) {
    const [data, setData] = useState<TypeData<TableTypeAds>>({data: [], total_page: 0})
    const [dataGroup, setDataGroup] = useState<Array<TableTypeAdsGroup>>([])
    const api = CallApi()
    const [formDataAds] = Form.useForm()
    const [formDataGroup] = Form.useForm()
    const [formAddGroup] = Form.useForm()
    const router = useRouter()
    const constants = Constants()
    const [loading, setLoading] = useState(false)
    const [showModalAds, setShowModalAds] = useState(false)
    const [showModalAdsGroup, setShowModalAdsGroup] = useState<number>()
    const [updateGroup, setShowUpdateGroup] = useState<number>()
    const [currentPage, setCurrentPage] = useState(1)

    function handleDeleteGroupFromAd(id: number) {
        api.put(URL_ADS, {id: id, id_group: -1}).then((response) => {
            if (response?.status === constants.SUCCESS) {
                handleLoadingDataAds()
                openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                setShowUpdateGroup(undefined)
                formAddGroup.resetFields()
            } else {
                openNotification(response?.response?.data?.message || response?.message, typeNotify.failed)
            }
        }).catch((e: Exception) => {
            openNotification(e.message, typeNotify.failed)
        })
    }

    const column: ColumnsType<TableTypeAds> = [
        {
            key: "stt",
            title: "STT",
            render: (__: any, _: any, index) => {
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
                return <a target={"_blank"} href={`https://www.youtube.com/watch?v=${text}`}
                          style={{wordWrap: "break-word", wordBreak: "break-word"}}
                          rel="noreferrer">{`https://www.youtube.com/watch?v=${text}`}</a>
            }
        },
        {
            key: "group",
            dataIndex: "group",
            title: "Nhóm",
            render: (value: TypeGroupAds) => {
                return <span>{value?.name || <QuestionOutlined/>}</span>
            }
        },
        {
            key: "action",
            title: "Thao tác",
            render: (value: TableTypeAds) => {
                return <div className={_style.actionGroup}>
                    <div className={_style.styleButton}>
                        <Tooltip title={value.group.id ? "Xóa nhóm" : "Thêm vào group"}>
                            {
                                value.group.id ?
                                    <Popconfirm
                                        placement="bottomRight"
                                        title={"Cảnh báo"}
                                        description={"Bạn thật sự muốn xóa quảng cáo này khỏi nhóm?"}
                                        onConfirm={() => {
                                            handleDeleteGroupFromAd(value.id)
                                        }}
                                        okText="Đồng ý"
                                        cancelText="Từ chối"
                                    >
                                        <CloseOutlined
                                            style={{
                                                color: "red"
                                            }}
                                            className={_style.styleIconButton}/>
                                    </Popconfirm>
                                    : <PlusCircleOutlined
                                        style={{
                                            color: "green"
                                        }}
                                        onClick={() => {
                                        setShowUpdateGroup(value.id)
                                    }} className={_style.styleIconButton}/>
                            }
                        </Tooltip>
                        <Tooltip title={"Xóa"}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"Cảnh báo"}
                                description={"Bạn thật sự muốn xóa quảng cáo này?"}
                                onConfirm={() => {
                                    handleDeleteAds(value.id)
                                }}
                                okText="Đồng ý"
                                cancelText="Từ chối"
                            >
                                <DeleteOutlined
                                    className={_style.styleIconButton}/>
                            </Popconfirm>

                        </Tooltip>
                    </div>
                </div>
            }
        }
    ]

    const columnGroup: ColumnsType<TableTypeAdsGroup> = [
        {
            key: "stt",
            title: "STT",
            render: (__: any, _: any, index) => {
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
            key: "action",
            title: "Thao tác",
            render: (value: TableTypeAdsGroup) => {
                return <div className={_style.actionGroup}>
                    <div className={_style.styleButton}>
                        <Tooltip title={"Chĩnh sửa"}>
                            <EditOutlined onClick={() => {
                                formDataGroup.setFieldsValue({
                                    name: dataGroup.filter((e) => {
                                        return e.id == value.id
                                    })[0].name
                                })
                                setShowModalAdsGroup(value.id)
                            }} className={_style.styleIconButton}/>
                        </Tooltip>
                        <Tooltip title={"Xóa"} style={{
                            cursor: "pointer"
                        }}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"Cảnh báo"}
                                description={"Bạn thật sự muốn xóa quảng cáo này?"}
                                onConfirm={() => {
                                    handleDeleteAdsGroup(value.id)
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
    useEffect(() => {
        handleLoadingDataAds()
        handleLoadingDataAdsGroup()
    }, [])

    function handleDeleteAds(id: number) {
        api.deleteApi(URL_ADS,
            {id: id}).then(() => {
            openNotification(VALIDATE_DELETE_SUCCESS, typeNotify.success)
            handleLoadingDataAds()
        })
    }

    function handleDeleteAdsGroup(id: number) {
        api.deleteApi(URL_GROUP_AD,
            {id: id}).then(() => {
            openNotification(VALIDATE_DELETE_SUCCESS, typeNotify.success)
            handleLoadingDataAdsGroup()
        })
    }

    const handleLoadingDataAds = useCallback(() => {

        setLoading(true)
        api.get(URL_ADS_BY_USER, {page_offset: currentPage || 1}).then((response) => {
            if (response?.status == constants.SUCCESS) {
                const data: TypeData<TableTypeAds> = response.body
                setData({
                    total_page: data.total_page,
                    // @ts-ignore
                    data: data.data?.map((item, index) => {
                        return {
                            id: item.id,
                            name: item.name,
                            link: item.link,
                            group: item.group
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
    }, [router.query])

    const handleLoadingDataAdsGroup = useCallback(() => {
        setLoading(true)
        api.get(URL_GROUP_AD).then((response) => {
            if (response?.status == constants.SUCCESS) {
                setDataGroup(response.body || [])
            } else {
                setDataGroup([])
            }
        }).finally(() => setLoading(false))
    }, [router.query])

    function handleFinishAds(value: IAPIPropsAddAds) {
        setShowModalAds(false)

        api.post(URL_ADS, value).then((response) => {
            if (response?.status === constants.SUCCESS) {
                if (response?.body.category === "exist") {
                    openNotification(VALIDATE_EXIST_DATA, typeNotify.info)
                } else {
                    handleLoadingDataAds()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                }
            } else {
                openNotification(response?.response?.data?.message || response?.message, typeNotify.failed)
            }
        }).catch((e: Exception) => {
            console.log('err', e)
            openNotification(e.message, typeNotify.failed)
        })

        formDataAds.resetFields()
    }

    function handleFinishAddAdsToGroup(value: IAPIPropsAddAdsToGroup) {

        api.put(URL_ADS, {id: updateGroup, id_group: value.id}).then((response) => {
            if (response?.status === constants.SUCCESS) {
                handleLoadingDataAds()
                openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                setShowUpdateGroup(undefined)
                formAddGroup.resetFields()
            } else {
                openNotification(response?.response?.data?.message || response?.message, typeNotify.failed)
            }
        }).catch((e: Exception) => {
            openNotification(e.message, typeNotify.failed)
        })
    }

    function handleFinishAdsGroup(value: IAPIPropsAddAdsGroup) {
        if (showModalAdsGroup == -1) {
            api.post(URL_GROUP_AD, {name: value.name}).then((response) => {
                if (response?.status === constants.SUCCESS) {
                    handleLoadingDataAdsGroup()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                    setShowModalAdsGroup(undefined)
                    formDataGroup.resetFields()
                } else {
                    openNotification(response?.response?.data?.message || response?.message, typeNotify.failed)
                }
            }).catch((e: Exception) => {
                openNotification(e.message, typeNotify.failed)
            })
        } else {
            api.put(URL_GROUP_AD, {name: value.name, id: showModalAdsGroup}).then((response) => {
                if (response?.status === constants.SUCCESS) {
                    handleLoadingDataAdsGroup()
                    openNotification(VALIDATE_ADD_SUCCESS, typeNotify.success)
                    setShowModalAdsGroup(undefined)
                    formDataGroup.resetFields()
                } else {
                    openNotification(response?.response?.data?.message || response?.message, typeNotify.failed)
                }
            }).catch((e: Exception) => {
                openNotification(e.message, typeNotify.failed)
            })
        }
    }

    function RenderModalDataAds({show}: TypePropsModalLink) {

        return <>
            <Modal
                centered
                onCancel={() => {
                    setShowModalAds(false)
                    formDataAds.resetFields()
                }}
                onOk={() => {
                    formDataAds.submit()
                }}
                title={"Thêm mới"}
                open={show}>
                <Form
                    layout={"vertical"}
                    onFinish={handleFinishAds}
                    form={formDataAds}>
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

    function RenderModalDataAdsGroup({show}: TypePropsModalLink) {

        return <>
            <Modal
                centered
                onCancel={() => {
                    setShowModalAdsGroup(undefined)
                    formDataGroup.resetFields()
                }}
                onOk={() => {
                    formDataGroup.submit()
                }}
                title={showModalAdsGroup != -1 ? "Chỉnh sửa" : "Thêm mới"}
                open={show}>
                <Form
                    layout={"vertical"}
                    onFinish={handleFinishAdsGroup}
                    form={formDataGroup}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Tên nhóm là bắt buộc"
                            }
                        ]}
                        name={"name"}
                        label={"Name"}>
                        <Input placeholder={"Vui lòng nhập tên nhóm"}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    }

    function RenderModalAddGroup({show}: TypePropsModalLink) {

        return <>
            <Modal
                centered
                onCancel={() => {
                    setShowUpdateGroup(undefined)
                    formAddGroup.resetFields()
                }}
                onOk={() => {
                    formAddGroup.submit()
                }}
                title={"Cập nhật"}
                open={show}>
                <Form
                    layout={"vertical"}
                    onFinish={handleFinishAddAdsToGroup}
                    form={formAddGroup}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Chọn nhóm là bắt buộc"
                            }
                        ]}
                        name={"id"}
                        label={"Nhóm"}>
                        <Select
                            style={{
                                userSelect: "none"
                            }}
                            placeholder={"Chọn nhóm quảng cáo"}
                            options={dataGroup.map((item) => {
                                return {
                                    label: item.name,
                                    value: item.id
                                }
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    }

    const onChangePagination = (page: number) => {
        setCurrentPage(page)
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Quảng cáo',
            children: <div className={_style.contentADs}>
                <div className={_style.header}>
                    <label className={_style.title}>Quảng cáo</label>
                    <div
                        onClick={() => {
                            setShowModalAds(true)
                        }}
                        className={_style.buttonAdd}>
                        <span>Thêm mới</span>
                    </div>
                </div>
                <Table
                    style={{background: 'white', borderRadius: 20}}
                    dataSource={data.data}
                    pagination={data.data.length ?
                        {
                            showSizeChanger: false,
                            current: currentPage,
                            total: data.total_page * 10,
                            onChange: onChangePagination
                        } : false
                    }
                    columns={column}/>
            </div>,
        },
        {
            key: '2',
            label: 'Nhóm quảng cáo',
            children: <div className={_style.contentADs}>
                <div className={_style.header}>
                    <label className={_style.title}>Nhóm quảng cáo</label>
                    <div
                        onClick={() => {
                            setShowModalAdsGroup(-1)
                        }}
                        className={_style.buttonAdd}>
                        <span>Thêm mới</span>
                    </div>
                </div>
                <Table
                    style={{background: 'white', borderRadius: 20}}
                    dataSource={dataGroup}
                    pagination={false}
                    columns={columnGroup}/>
            </div>,
        }
    ];

    function onChangeTab(key: string) {
        if (key == "2") {
            handleLoadingDataAdsGroup()
        } else {
            handleLoadingDataAds()
        }
    }

    return <div className={_style.wrapper}>

        <Loading visible={loading}/>
        <div className={_style.body}>
            <Tabs
                style={{
                    userSelect: 'none',
                    background: "#1a536e",
                    color: "white",
                    padding: 20,
                    borderRadius: 20
                }}
                onChange={(key) => {
                    onChangeTab(key)
                }}
                defaultActiveKey="1" items={items}/>;
        </div>
        <RenderModalDataAds
            show={showModalAds}
        />
        <RenderModalDataAdsGroup
            show={showModalAdsGroup !== undefined}
        />
        <RenderModalAddGroup
            show={updateGroup !== undefined}
        />
    </div>
}