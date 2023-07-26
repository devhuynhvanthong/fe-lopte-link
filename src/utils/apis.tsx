import axios from 'axios'
import Cookies from "~/utils/Cookies";

export default function CallApi() {
    const API_URL = process.env.REACT_APP_API_URL
    const cookie = Cookies()
    const post = async(endpoint: string, body = {}, header_ = { }) => {
        if (cookie.getAccessToken()) {
            axios.defaults.headers.common.Authorization = cookie.getAccessToken()
        }
        return axios({
            method: 'POST',
            url: `${endpoint}`,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...header_,
            },
        })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                return err
            })
    }

    const put = async(endpoint: string, body = null) => {
        if (cookie.getAccessToken()) {
            axios.defaults.headers.common.Authorization = cookie.getAccessToken()
        }
        return axios({
            method: 'PUT',
            url: `${API_URL}/${endpoint}`,
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
            // withCredentials: true,
        })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const deleteApi = async(endpoint: string, body = null) => {
        if (cookie.getAccessToken()) {
            axios.defaults.headers.common.Authorization = cookie.getAccessToken()
        }
        return axios({
            method: 'DELETE',
            url: `${API_URL}/${endpoint}`,
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
            // withCredentials: true,
        })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const get = async(endpoint: string, params_ = {}, header_ = {}) => {
        if (cookie.getAccessToken()) {
            axios.defaults.headers.common.Authorization = cookie.getAccessToken()
        }
        return axios({
            method: 'GET',
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                ...header_,
            },
            params: params_,
        })
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        post, get, put, deleteApi
    }
}