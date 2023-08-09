import {notification} from "antd";
import React, {useEffect} from "react";
import {useRouter} from "next/router";

export default function Admin() {
    const router = useRouter()
    useEffect(() => {
        if (router.pathname == "/admin") {
            router.push("/admin/link")
        }
    }, [])
    return <></>
}

Admin.layout = "ad"