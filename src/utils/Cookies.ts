
// @ts-ignore
import Cookie from "js-cookie"
import Library from "./Library"
import Constants from "~/utils/Constants";

export default function Cookies  () {

    const library = Library()
    const constant = Constants()
    const Set = (key: string, text: any) =>
    {
        const encrypt = library.base64Encode(JSON.stringify(text))
        Cookie.set(key,encrypt,{
            expires:30,
            secure: true,
            sameSite:'strict',
            //domain: 'aigoox.com'
        })
    }

    const getAccessToken = () => {
        return Get(constant.KEY_ACCESS_TOKEN)
    }
    const Get = (key: string,isParseJson = true) =>{
        const input = Cookie.get(key)
        if(input!=null){
            if(!isParseJson){
                return input
            }
            const output = JSON.parse(library.base64Decode(input))
            return output.accsessToken
        }else{
            return null
        }

    }

    const Remove = (key: string) => {
        Cookie.remove(key)
    }

    const Clear = () => {
        //Cookie.ge()
    }
    return {
        Set,
        Get,
        Remove,
        Clear,
        getAccessToken
    }
}
