import React, {useEffect} from "react";
import {useRouter} from "next/router";

export default function Dashboard() {
    const router = useRouter()
    useEffect(() => {
        if (router.pathname == "/dashboard") {
            router.push("/dashboard/user")
        }
    }, [])
    return <></>
}

Dashboard.layout = "dashboard"