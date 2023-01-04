import Head from 'next/head'
import styles from '../styles/Home.module.css'
import stylesCustom from '../styles/index.module.css'
import apis from '../utils/CallApi'
import urls from  '../utils/Urls'
import library from '../utils/Library'
import constants from  '../utils/Constants'
import {useRouter} from "next/router";
import {Cascader, Spin, Alert,Space} from "antd";
import React, {useEffect, useState} from "react";
import Logo from '../componentns/logo'
export default function Home() {
  const router = useRouter()
  const [isLoading,setLoading] = useState(false)
  const [text,setText] = useState("Preparing key...")
  const [category,setCategory] = useState([])
  const [selectCategory,setSelectCategory] = useState(undefined)
  const sha256 = require('sha256')
  const [error,setError] = useState(undefined)
  useEffect(()=>{
    apis().get(urls().URL_CATEGORY).then(response=>{
      if (response){
        const  data = response.body
        let arr: any[] = []
        data.map((item:any)=>{
          arr = [...arr,{
            label: item.name,
            value: item.code,
          }]
        })
        // @ts-ignore
        setCategory(arr)
      }
    })
  },[]);
  async function verifyKey() {

    setText("Preparing key...")
    let verify = sha256(library().getDateTime()).split('')
    let _verify = ""
    verify.map((item:any,index:number)=>{
      switch (index){
        case 1:
          _verify = _verify + "a"
          break
        case 3:
          _verify = _verify + "i"
          break
        case 5:
          _verify = _verify + "g"
          break
        case 7:
          _verify = _verify + "o"
          break
        case 9:
          _verify = _verify + "o"
          break
        case 11:
          _verify = _verify + "x"
          break
        default:
          _verify = _verify + item
      }
    })
    apis().post(urls().URL_VERIFY_KEY, {
      info: _verify,
      category: selectCategory
    }).then(response => {
      if (response.status == constants().SUCCESS) {
        router.push('https://loptelink.com/st?api=ceca3b7645d9cfe99f8d483dcea35738cb0aa57b&url=https://gamelopte.aigoox.com/get-key?code=' + library().base64Encode(response.body.code) + "&v="+library().base64Encode(_verify))
        setText("Receive key successfully")
      } else {
        setError(response.message)
        setTimeout(()=>{
          setError(undefined)
        },3000)
        setLoading(false)
      }
    }).catch((e) => {
      // @ts-ignore
      setError("Receiving key failed!")
      setLoading(false)
    })
  }

  function handleClickGetKey() {
    if (!selectCategory){
      alert("Please choose a game")
      return
    }
    setLoading(true)
    if(!isLoading){
      verifyKey()
    }
  }

  return (
      <>
        <Head>
          <title>Get Key - Gamelopte</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/logo99.png" />
        </Head>
        <main className={styles.main}>
          <Logo />

          <div className={stylesCustom.butonGroup}>
            <div>
              <div className={stylesCustom.cascader}>
                <p style={{
                  color:'white',
                  marginBottom: 10,
                  fontSize: '1.2em'

                }}>Choose game...</p>
                <Cascader
                    allowClear={false}
                    onChange={(value:any)=>setSelectCategory(value)}
                    value={selectCategory}
                    placeholder={"Choose Game"}
                    options={category}
                />
              </div>
              <button
                  onClick={()=>handleClickGetKey()}
                  className={stylesCustom.btnGetKey}>
                Get Key
              </button>
            </div>
            {
              <div className={stylesCustom.textNoti}> {isLoading && <div><Spin style={{color:"white", marginRight:5}} /> {text}</div>}</div>
            }

          </div>
        </main>
        <Space
            direction="vertical"
            style={{
              width: '100%',
            }}
        >
          {error &&<Alert
              style={{
                position: "absolute",
                top:'5%',
                right:'5%',
                transform: 'translate(-50%,-50%)'
              }}
              message={error}
              type="error"
              showIcon />}

        </Space>
      </>
  )
}
