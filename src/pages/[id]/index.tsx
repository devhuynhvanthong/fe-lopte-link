import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LinkDesktop from "~/component/desktop/link"
import LinkMobile from "~/component/mobile/link"
import Loading from "~/component/loading";
import CallApi from "~/utils/apis";
import {DOMAIN_LINK, URL_ADS, URL_LINK} from "~/utils/Urls";
import {IAPILink} from "~/@type/link";
import Library from "~/utils/Library";
export default function GetLink() {
    const router = useRouter()
    const [id, setId] = useState("")
    const [isMobile, setMobile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingGetLink, setLoadingGetLink] = useState(false)
    const [info, setInfo] = useState<IAPILink>()
    const api = CallApi()
    const library = Library()
    function handleGetAds(id: string) {
        api.get(URL_ADS, {converted: `${DOMAIN_LINK}${id}`}).then((response) => {
            if (response.status) {
                const body = response.body
                setInfo(body)
            }
        })
    }

    function handleGetLink() {
        setLoadingGetLink(true)
        api.get(URL_LINK, {code: info?.code}).then((response) => {
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
                setId(router.query?.id)
                handleGetAds(router.query?.id)
            }
            setLoading(false)
            setMobile(library.isMobile)
        }
    }, [router])

    return <div>
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
    </div>
}