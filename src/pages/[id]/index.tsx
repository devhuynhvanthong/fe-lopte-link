import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LinkDesktop from "~/component/desktop/link"
import LinkMobile from "~/component/mobile/link"
import Loading from "~/component/loading";
import CallApi from "~/utils/apis";
import {DOMAIN_LINK, URL_LINK} from "~/utils/Urls";
import {IAPILink} from "~/@type/link";
export default function GetLink() {
    const router = useRouter()
    const [id, setId] = useState("")
    const [isMobile, setMobile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState<IAPILink>()
    const api = CallApi()
    function handleGetLink(id: string) {
        api.get(URL_LINK, {converted: `${DOMAIN_LINK}${id}`}).then((response) => {
            if (response.status) {
                const body = response.body
                setInfo(body)
            }
        }).catch(() => {

        })
    }


    useEffect(() => {
        if (router.isReady) {
            if (typeof router.query?.id == "string")
            {
                setId(router.query?.id)
                handleGetLink(router.query?.id)
            }
            setLoading(false)
        }
    }, [router])

    return <div>
        {
            loading ?
                <Loading open={loading}/>
                : isMobile ?
                <LinkMobile info={info} />
                : <LinkDesktop info={info} />
        }
    </div>
}