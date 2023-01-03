export default function Urls(){
    const BASE_URL = "https://api-gamelopte.aigoox.com/"
    const API = BASE_URL + "api/"

    const URL_VERIFY_KEY = API + "verify_key"
    const URL_GET_KEY = API + "get_key"
    const URL_GET_KEYS = API + "get_all_key"
    const URL_ADD_KEY = API + "add_key"
    const URL_REMOVE_KEY = API + "remove_key"
    const URL_CATEGORY = API + "get_categorys"

    return{
        URL_GET_KEY,
        URL_VERIFY_KEY,
        URL_GET_KEYS,
        URL_ADD_KEY,
        URL_REMOVE_KEY,
        URL_CATEGORY
    }
}
