import Library from "~/utils/Library";

const BASE_URL = "https://api-link.aigoox.com/"
const BASE_URL_DEV = "https://api-dev-loptelink.aigoox.com/"
const BASE_URL_LOCAL = "http://127.0.0.1:8000/"
export const DOMAIN_ACCOUNT_DEV = "https://devaccounts.aigoox.com"
export const BASE_ACCOUNT_DEV = "https://api-dev-accounts.aigoox.com"
export const BASE_ACCOUNT = "https://api-account.aigoox.com"
export const DOMAIN_ACCOUNT = "https://accounts.aigoox.com"
const API = BASE_URL_DEV + "api/"
export const URL_ADS = API + "ads"
export const URL_INFO = BASE_ACCOUNT_DEV + "/api/info"
export const URL_ANALYSIS = API + "analysis"
export const URL_ADS_BY_USER = API + "ads_by_user"
export const URL_GROUP_AD = API + "group_ad"
export const BASE_URL_LOGIN_ADMIN = `${DOMAIN_ACCOUNT_DEV}/login?domain=${Library().base64Encode("https://dev-link.aigoox.com/admin")}&session=expired`
export const BASE_URL_LOGIN_DASHBOARD = `${DOMAIN_ACCOUNT_DEV}/login?domain=${Library().base64Encode("https://dev-link.aigoox.com/dashboard")}&session=expired`
export const URL_AD = API + "ad"
export const URL_LINK = API + "link"
export const URL_CREATE = API + "create"
export const URL_LINKS = API + "links"
export const URL_USERS = API + "users"
export const URL_LOCK_LINK = API + "lock_link"
export const URL_LOCK_USER = API + "lock_user"
export const URL_LINKS_BY_USER = API + "links_by_user"
export const URL_CONFIG = API + "config"
export const URL_CONFIGS = API + "configs"
export const URL_CONFIG_BY_ADMIN = API + "configs_by_admin"
export const URL_CONFIG_BY_USER = API + "config_by_user"