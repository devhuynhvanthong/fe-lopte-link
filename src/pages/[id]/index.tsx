import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LinkDesktop from "~/component/desktop/link"
import LinkMobile from "~/component/mobile/link"
import Loading from "~/component/loading";
import CallApi from "~/utils/apis";
import {DOMAIN_LINK, URL_AD, URL_ADS, URL_CONFIG_BY_USER, URL_LINK} from "~/utils/Urls";
import {IAPILink} from "~/@type/link";
import Library from "~/utils/Library";
import Constants from "~/utils/Constants";
import NotFound from "~/component/NotFound";
export default function GetLink() {
    const router = useRouter()
    const [isMobile, setMobile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingGetLink, setLoadingGetLink] = useState(false)
    const [info, setInfo] = useState<IAPILink>()
    const [isMaintenance, setMaintenance] = useState(false)
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
                const body = response.body[0]
                if (body?.value == 'true') {
                    setMaintenance(true)
                    setReady(true)
                }else {
                    handleGetAds()
                }
            }
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
                info ?
                    <div>
                        {

                            loading ?
                                <Loading open={loading}/>
                                : isMobile ?
                                    <LinkMobile
                                        isLoadingGetLink={loadingGetLink}
                                        getLink={handleGetLink}
                                        info={info} />
                                    : <LinkDesktop
                                        isLoadingGetLink={loadingGetLink}
                                        getLink={handleGetLink}
                                        info={info} />
                        }
                    </div> : <NotFound isMaintenance={isMaintenance}/>
            }
        </>
    }</>
}