import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LinkDesktop from "~/component/desktop/link"
import LinkMobile from "~/component/mobile/link"
import Loading from "~/component/loading";
import CallApi from "~/utils/apis";
import {DOMAIN_LINK, URL_AD, URL_ADS, URL_CONFIG_BY_USER, URL_LINK} from "~/utils/Urls";
import {IAPILink, TypePropsLayout} from "~/@type/link";
import Library from "~/utils/Library";
import Constants from "~/utils/Constants";
import NotFound from "~/component/NotFound";
interface TypeConfig {
    time_ads: number,
    isMaintenance: boolean,
}
export default function GetLink({ openNotification, typeNotify} : TypePropsLayout) {
    const router = useRouter()
    const [isMobile, setMobile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingGetLink, setLoadingGetLink] = useState(false)
    const [info, setInfo] = useState<IAPILink>()
    const [config, setConfig] = useState<TypeConfig>({time_ads: 30, isMaintenance: false})
    const [ready, setReady] = useState(false)
    const api = CallApi()
    const library = Library()
    const constants = Constants()
    function handleGetAds() {
        api.get(URL_AD,
            {converted: `${DOMAIN_LINK}${router?.query?.id}`},
            {},
            false
        ).then((response) => {
            if (response?.status === constants.SUCCESS) {
                const body = response.body
                setInfo(body)
            }
        }).finally(() => {
            setReady(true)
        })
    }

    function handleGetConfig() {
        api.get(URL_CONFIG_BY_USER,
            {},
            {},
            false
        ).then((response) => {
            if (response?.status === constants.SUCCESS) {
                const body = response.body
                body.map((item: {
                    value: string;
                    name: string;
                }) => {
                    if (item.name == "maintenance") {
                        setConfig(prevState => {
                            return {
                                ...prevState,
                                isMaintenance: item.value === "true"
                            }
                        })
                    } else {
                        setConfig(prevState => {
                            return {
                                ...prevState,
                                time_ads: Number(item.value)
                            }
                        })
                    }
                })
                const filter = body.filter((item: { name: string; }) => {
                    return item.name === "maintenance"
                })
                if (filter.value === "true") {
                    setReady(true)
                }else  {
                    handleGetAds()
                }
            }
        }).catch((e: any) => {
            setInfo(undefined)
            setConfig(prevState => {
                return {
                    ...prevState,
                    isMaintenance : true
                }
            })
            setReady(true)
        })
    }
    function handleGetLink() {
        setLoadingGetLink(true)
        api.get(URL_LINK,
            {code: info?.code},
            {},false
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
            if (typeof router.query?.id == "string")
            {
                handleGetConfig()
            }
            setLoading(false)
            setMobile(library.isMobile)
        }
    }, [router])

    return <>{
        ready &&
        <>
            {
                info && !config.isMaintenance ?
                    <div>
                        {

                            loading ?
                                <Loading open={loading}/>
                                : isMobile ?
                                    <LinkMobile
                                        timeConfig={config.time_ads}
                                        isLoadingGetLink={loadingGetLink}
                                        getLink={handleGetLink}
                                        info={info} />
                                    : <LinkDesktop
                                        timeConfig={config.time_ads}
                                        isLoadingGetLink={loadingGetLink}
                                        getLink={handleGetLink}
                                        info={info} />
                        }
                    </div> : <NotFound isMaintenance={config.isMaintenance}/>
            }
        </>
    }</>
}

GetLink.layout = "client"