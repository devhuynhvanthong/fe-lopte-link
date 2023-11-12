import React, {useState} from 'react'
import {Button, Form, Input} from 'antd'
import apis from '~/utils/apis'
import {useRouter} from 'next/router'
import Cookies from '~/utils/Cookies'
import constants from '~/utils/Constants'
import {URL_LOGIN, URL_REGISTER} from "~/utils/Urls";
import Library from "~/utils/Library";

export default function Login() {
    const router = useRouter()
    const [form] = Form.useForm()
    const cookie = Cookies()
    const [isLogin, setLogin] = useState(true)

    function tranferAdmin() {
        setTimeout(function () {
            if (Library().base64Decode((router.query?.c || "").toString()).toLowerCase() == "dashboard") {
                router.push("dashboard")
            } else {
                router.push("admin")
            }
        }, 300)
    }
    
    function handleLogin(username: string, password: string) {
        apis().post(URL_LOGIN, {
            username,
            password,
        }).then((response: any) => {
            if (response) {
                if (response.status === constants().SUCCESS) {
                    cookie.Set(constants().KEY_ACCESS_TOKEN, {
                        access_token: response.body.accsessToken,
                    })
                    tranferAdmin()
                } else {
                    alert(response.message)
                }
            } else {
                alert('Xẫy ra lỗi')
            }
        })
    }

    function handleRegister(username: string, password: string, confirm_password: string) {
        if (password != confirm_password) {
            alert("Xác nhận lại mật khẩu không đúng!")
            return
        }
        apis().post(URL_REGISTER, {
            username,
            password,
        }).then((response: any) => {
            if (response) {
                if (response.status === constants().SUCCESS) {
                    alert("Đăng ký thành công")
                    router.reload()
                } else {
                    alert(response.message)
                }
            } else {
                alert('Xẫy ra lỗi')
            }
        })
    }

    function handleSubmit({ username, password, confirm_password }: any) {
        if (isLogin) {
            handleLogin(username, password)
        } else {
            handleRegister(username, password, confirm_password)
        }
    }

    return <>
        <div style={{
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            alignItems: 'center',
        }}>
            <div style={{
                padding: 20,
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                borderRadius: 10,
                height: 'fit-content',
            }}>
                <label style={{
                    fontSize: 23,
                    width: 400,
                    maxWidth: '80%',
                    fontWeight: 'bold',
                }}>{isLogin ? 'Đăng nhập': 'Đăng ký'}</label>
                <Form
                    onFinish={handleSubmit}
                    form={form}
                    layout={'vertical'}
                >
                    <Form.Item
                        rules={[{
                            required: true,
                            message: <span>{'Tài khoản là bắt buộc'}</span>,
                        }]}
                        name={'username'}
                        label={'Tài khoản'}>
                        <Input
                            placeholder="Nhập tài khoản..."/>
                    </Form.Item>

                    <Form.Item
                        rules={[{
                            required: true,
                            message: <span>{'Mật khẩu là bắt buộc'}</span>,
                        }]}
                        name={'password'}
                        label={'Mật khẩu'}>
                        <Input
                            type={'password'}
                            placeholder="Nhập mật khẩu..."/>
                    </Form.Item>

                    {
                        !isLogin &&
                        <Form.Item
                            rules={[{
                                required: true,
                                message: <span>{'Xác nhận mật khẩu là bắt buộc'}</span>,
                            }]}
                            name={'confirm_password'}
                            label={'Nhập lại mật khẩu'}>
                            <Input
                                type={'password'}
                                placeholder="Nhập lại mật khẩu..."/>
                        </Form.Item>
                    }
                </Form>
                <Button style={{
                    background: '#0f1b29',
                    color: 'white',
                }} onClick={() => {
                    form.submit()
                }}>{isLogin ? 'Đăng nhập': 'Đăng ký'}</Button>
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <label style={{
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "underline"
                    }} onClick={() => {
                        setLogin(prevState => !prevState)
                    }}>{!isLogin ? 'Đăng nhập': 'Đăng ký'}</label>
                </div>
            </div>
        </div>
    </>
}
