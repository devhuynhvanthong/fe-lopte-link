import React, {useEffect} from "react";
import {router} from "next/client";
import {useRouter} from "next/router";
export default function Home() {
    const router = useRouter()
    useEffect(() => {
        router.push("https://gamelopte.com")
    })
    return <></>
}

Home.layout = "client"