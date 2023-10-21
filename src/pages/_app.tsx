import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ClientLayout from "~/component/ClientLayout";
import AdminLayout from "~/component/desktop/AdminLayout";
import {notification} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {NotificationPlacement} from "antd/es/notification/interface";
import Cookies from "~/utils/Cookies";
import {useRouter} from "next/router";

export const typeNotify = {success: "success",failed: "failed",info: "info"}
export default function App({ Component, pageProps }: any) {

  const Layout: any = Component?.layout || AdminLayout
  const cookie = Cookies()
  const [notify, contextHolder] = notification.useNotification();
  const Context = React.createContext({ name: 'Default' });
  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  useEffect(() => {

    if (!cookie.getAccessToken()) {
      if (location.pathname != "/not-authen") {
        window.location.href = '/not-authen'
      }
    }
  },[])
  const openNotification = (message: string, type: string, place : NotificationPlacement = 'topRight') => {
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
        <Layout>
          <Component {...pageProps}
                     notify={notify}
                     context={Context}
                     typeNotify={typeNotify}
                     openNotification={openNotification}
          />
        </Layout>
    }
  </Context.Provider>

}
