import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LinkDesktop from "~/component/desktop/link"
import LinkMobile from "~/component/mobile/link"
import Loading from "~/component/loading";
import CallApi from "~/utils/apis";
import {URL_AD, URL_CONFIG_BY_USER, URL_LINK} from "~/utils/Urls";
import {IAPILink, TypePropsLayout} from "~/@type/link";
import Library from "~/utils/Library";
import Constants from "~/utils/Constants";
import {Exception} from "sass";

interface TypeConfig {
    time_ads: number,
    ads?: number,
    mode_screen: boolean
}

export default function GetLink({openNotification, typeNotify}: TypePropsLayout) {
    const router = useRouter()
    const [isMobile, setMobile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingGetLink, setLoadingGetLink] = useState(false)
    const [info, setInfo] = useState<IAPILink>()
    const [config, setConfig] = useState<TypeConfig>()
    const [ready, setReady] = useState(false)
    const api = CallApi()
    const library = Library()
    const constants = Constants()
    let domain = ""

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        domain = location.host
    }, [])

    function handleGetAds() {
        api.get(URL_AD,
            {converted: `${domain === "localhost:3000" ? "https://localhost.com" : domain}/${router?.query?.id}`},
            {},
            false
        )
            .then((response) => {
                if (response?.status === constants.SUCCESS) {
                    const body = response.body
                    if (body?.source) {
                        router.push(body?.source)
                    } else {
                        setInfo(body)
                        setReady(true)
                    }
                }
            })
            .catch(() => {
                setReady(true)
            })
    }

    function handleGetConfig() {
        api.get(URL_CONFIG_BY_USER,
            {converted: `${domain === "localhost:3000" ? "https://localhost.com" : domain}/${router?.query?.id}`},
            {},
            false
        ).then((response) => {
            if (response == undefined) {
                router.push("not-found")
            }
            if (response?.status === constants.SUCCESS) {
                const body = response.body
                setConfig(body)
                handleGetAds()
            }
        }).catch(() => {
            setInfo(undefined)
            setReady(true)
        })
    }

    function handleGetLink() {
        setLoadingGetLink(true)
        api.get(URL_LINK,
            {code: info?.code},
            {}, false
        ).then((response) => {
            if (response.status) {
                const body = response.body
                if (body) {
                    router.push(body)
                }
            } else {
                openNotification(response?.message, typeNotify.failed)
            }
        }).finally(() => {
            setLoadingGetLink(false)
        })
    }


    useEffect(() => {
        if (router.isReady) {
            if (typeof router.query?.id == "string") {
                handleGetConfig()
            }
            setLoading(false)
            setMobile(library.isMobile)
        }
    }, [router])

    return <>{
        ready ?
            <>
                {
                    info &&
                    <div>
                        {

                            loading ?
                                <Loading visible={loading}/>
                                : isMobile ?
                                    <LinkMobile
                                        timeConfig={config?.time_ads || 30}
                                        isLoadingGetLink={loadingGetLink}
                                        getLink={handleGetLink}
                                        info={info}/>
                                    : <LinkDesktop
                                        timeConfig={config?.time_ads || 30}
                                        isLoadingGetLink={loadingGetLink}
                                        getLink={handleGetLink}
                                        info={info}/>
                        }
                    </div>
                }
            </>
            : <div style={{
                width: '100%',
                height: '100%',
                position: "absolute"
            }}>
                <label style={{
                    fontSize: 50,
                    position: "absolute",
                    left: '50%',
                    top: '50%',
                    transform: "translate(-50%, -50%)"
                }}>Loading...</label>
            </div>
    }</>
}

GetLink.layout = "client"