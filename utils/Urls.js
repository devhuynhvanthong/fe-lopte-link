export default function Urls(){
    const BASE_URL = "http://127.0.0.1:8000/"
    const API = BASE_URL + "api/"

    const URL_VERIFY_KEY = API + "verify_key"
    const URL_GET_KEY = API + "get_key"
    const URL_GET_KEYS = API + "get_all_key"
    const URL_ADD_KEY = API + "add_key"
    const URL_REMOVE_KEY = API + "remove_key"
    const URL_REMOVE_CATEGORY = API + "remove_category"
    const URL_CATEGORY = API + "get_categorys"
    const URL_ALL_CATEGORY = API + "get_all_category"
    const URL_ADD_CATEGORY = API + "add_categogy"
    const URL_GET_ALL_KEY_USED = API + "get_all_key_useds"

    return{
        URL_GET_KEY,
        URL_VERIFY_KEY,
        URL_GET_KEYS,
        URL_ADD_KEY,
        URL_REMOVE_KEY,
        URL_CATEGORY,
        URL_ALL_CATEGORY,
        URL_REMOVE_CATEGORY,
        URL_ADD_CATEGORY,
        URL_GET_ALL_KEY_USED
    }
}
