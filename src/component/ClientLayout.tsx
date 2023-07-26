import {TypePropLayout} from "~/@type/main";
import Header from "~/component/Header";
import {useEffect} from "react";
import {useRouter} from "next/router";

const ClientLayout = ({ children }: TypePropLayout) => {
    const router = useRouter()
    // useEffect(() => {
    //     if (router.asPath === "/") {
    //         router.push("https://www.gamelopte.com/")
    //     }
    // }, [])
    return <div>
        <Header />
        {
            children
        }
    </div>
}
export default ClientLayout
