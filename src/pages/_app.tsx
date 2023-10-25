import '../styles/globals.css'
import AdminLayout from "~/component/desktop/AdminLayout";
import {notification} from "antd";
import wrapperStore from '~/redux'
import React, {useEffect, useMemo} from "react";
import {NotificationPlacement} from "antd/es/notification/interface";
import Cookies from "~/utils/Cookies";
import {Provider} from "react-redux";
import {store} from "~/redux/store";
import DashboardLayout from "~/component/desktop/DashboardLayout";
import Header from "~/component/Header";
import Head from "next/head";

export const typeNotify = {success: "success", failed: "failed", info: "info"}

function App({Component, pageProps}: any) {

    const Layout: any = Component?.layout === "dashboard" ? DashboardLayout : (Component?.layout || AdminLayout)
    const cookie = Cookies()
    const [notify, contextHolder] = notification.useNotification();
    const Context = React.createContext({name: 'Default'});
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);

    useEffect(() => {

        if (!cookie.getAccessToken()) {
            if (location.pathname != "/not-authen") {
                window.location.href = '/not-authen'
            }
        }
    }, [])
    const openNotification = (message: string, type: string, place: NotificationPlacement = 'topRight') => {
        switch (type) {
            case typeNotify.success: {
                notify.success({
                    message: "Thành công",
                    description: <Context.Consumer>{() => message}</Context.Consumer>,
                    // @ts-ignore
                    place,
                })
                break
            }
            case typeNotify.failed: {
                notify.error({
                    message: "Thất bại",
                    description: <Context.Consumer>{() => message}</Context.Consumer>,
                    // @ts-ignore
                    place,
                });
                break
            }
            case typeNotify.info: {
                notify.info({
                    message: "Thông báo",
                    description: <Context.Consumer>{() => message}</Context.Consumer>,
                    // @ts-ignore
                    place,
                });
                break
            }
        }
    };
    return <Context.Provider value={contextValue}>
        {contextHolder}
        {

            <Provider store={store}>
                <Head>
                    <title>{'Lopte link'}</title>
                    <link rel="icon" href={'/logo.png'} />
                    <meta name="description" content="Lopte link" />
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="keywords" content="aigoox" />
                    <link href={'https://fonts.googleapis.com/css2?family=Source+Serif+Pro&display=swap'} rel="stylesheet" type="text/css" />
                </Head>
                <Layout>
                    <Component {...pageProps}
                               notify={notify}
                               context={Context}
                               typeNotify={typeNotify}
                               openNotification={openNotification}
                    />
                </Layout>
            </Provider>
        }
    </Context.Provider>

}

export default wrapperStore.withRedux(App)