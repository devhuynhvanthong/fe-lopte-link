import Constants from './Constants'
import { encrypt,decrypt } from 'n-krypta';
import date from 'date-and-time';
// @ts-ignore
import { encode as base64Encode_,decode as base64Decode_ } from "base-64"
import Cookies from './Cookies';
import { toast, TypeOptions } from 'react-toastify'
import * as url from "url";

export default function Library(){
  const constants = Constants()
  const keyStorage = constants.KEY_ACCESS_TOKEN

  const isMobile = () => {
    let check = false
    if(navigator.userAgent.toString().search("Mobile") > -1){
      check = true
    }
    return check;
  };

  const reloadPage = () => {
    window.location.reload();
  }
  const startPageUrl = (url: string) => {
    window.location.href = url
  }
  const base64Encode = (data: any) =>{
    return base64Encode_(data)
  }

  const base64Decode = (data: string) =>{
    try {
      return base64Decode_(data)
    }catch (e){
      return false
    }
  }

  const encryptData = (data: any, key: string) =>{
    return encrypt(data,key)
  }

  const decryptData = (data: string,key: string) =>{
    return decrypt(data,key)
  }

  const getDateTime = () =>{
    const now = new Date();
    return date.format(now, 'YYYY/MM/DD HH:mm:ss');
  }

  const getDate = () => {
    var today = new Date()
    return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
  }

  const getSessionStorage = () => {
    let session = sessionStorage.getItem(keyStorage)
    return JSON.parse(session || "")
  }

  const setSessionStorage = (assetToken_: string, date_: any) => {
    let data = {
      assetToken: assetToken_,
      date: date_
    }
    sessionStorage.setItem(keyStorage, JSON.stringify(data))
  }

  const getSessionStorageByKey = (key: string) => {
    let session = sessionStorage.getItem(key)
    return JSON.parse(session || "")
  }

  const setSessionStorageByKey = (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  const getLocalStorage = () => {
    let local = localStorage.getItem(keyStorage)
    return JSON.parse(local || "")
  }

  const setLocalStorage = (assetToken_: string, date_: any) => {
    let data = {
      accessToken: assetToken_,
      date: date_
    }
    localStorage.setItem(keyStorage, JSON.stringify(data))
  }

  const clearLocalStorage = () => {
    localStorage.clear()
  }

  const removeItemLocalStorege = () => {
    localStorage.removeItem(keyStorage)
  }

  const clearSessionStorage = () => {
    sessionStorage.clear()
  }

  const removeItemSessionStorege = () => {
    sessionStorage.removeItem(keyStorage)
  }

  const createNotification = (type: string, message: string, timeAutoClose = 3000) => {

    switch (type) {
      case constants.INFO:
        toast.info(message, {
          position: "top-right",
          autoClose: timeAutoClose,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case constants.SUCCESS:
        toast.success(message, {
          position: "top-right",
          autoClose: timeAutoClose,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case constants.WARNING:
        toast.warning(message, {
          position: "top-right",
          autoClose: timeAutoClose,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case constants.ERROR:
        toast.error(message, {
          position: "top-right",
          autoClose: timeAutoClose,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      default:
        toast('🦄 ' + message, {
          position: "top-right",
          autoClose: timeAutoClose,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break
    }

  }

  const load = (img: any) => {
    const url = img.getAttribute('lazy-src')
    img.setAttribute('src', url)
    //img.removeAttribute('lazy-src')
  }
  const ready = () => {
    if ('IntersectionObserver' in window) {
      var lazyImgs = document.querySelectorAll('[lazy-src]')
      let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          load(entry.target)
        })
      })
      lazyImgs.forEach(img => {
        observer.observe(img)
      })
    }
  }

  const checkLogin = () => {
    const cookie = Cookies().Get(Constants().KEY_ACCESS_TOKEN)
    if(cookie!=null){
        return true
    }else{
      return false
    }
  }

  return {
    getSessionStorage,
    setSessionStorage,
    setLocalStorage,
    getLocalStorage,
    createNotification,
    ready,
    getDate,
    clearLocalStorage,
    clearSessionStorage,
    removeItemLocalStorege,
    removeItemSessionStorege,
    encryptData,
    decryptData,
    getDateTime,
    base64Decode,
    base64Encode,
    startPageUrl,
    reloadPage,
    isMobile,
    checkLogin,
    getSessionStorageByKey,
    setSessionStorageByKey
  }

}
