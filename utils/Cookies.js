
import Cookie from "js-cookie"
import Library from "./Library"

export default function Cookies  () {

    const library = Library()
    const Set = (key, text) =>
    {
        const encrypt = library.base64Encode(JSON.stringify(text))
        Cookie.set(key,encrypt,{
            expires:30,
            secure: true,
            sameSite:'strict',
            //domain: 'aigoox.com'
        })
    }

    const Get = (key,isParseJson = true) =>{
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

    const Remove = (key) => {
        Cookie.remove(key)
    }

    const Clear = () => {
        //Cookie.ge()
    }
    return {
        Set,
        Get,
        Remove,
        Clear
    }
}
