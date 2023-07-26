import _style from './style.module.scss'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import YoutubeComponent from "~/component/YoutubeComponent";
import {TypePropLink} from "~/@type/link";
export default function LinkDesktop ( {info} : TypePropLink) {
    const [ready, setReady] = useState(false)
    const [timeout, setTimeout] = useState(30)
    return <div className={_style.wrapper}>
        <div className={_style.header}>
            <img src={'logo.png'}/>
            <div className={_style.headerContext}>
                <label>LopteLink</label>
                <hr/>
                <span>TRANG WEB CHIA SẺ CÁC BẢN MOD APP & GAME</span>
            </div>
        </div>
        <div className={_style.container}>
            <div className={`${_style.containerQC} ${_style.leftQC}`}>
                <img src={'qc_test.png'} />
            </div>
            <div className={_style.containerCenter}>
                <YoutubeComponent
                    className={_style.containerCenterYoutube}
                    idVideo={info?.ads || ""}
                    onTime={(time) => {
                        if (30 - time < 0) {
                            setReady(true)
                        }else {
                            setTimeout(30 - time)
                        }
                    }}
                    isCount={!ready}
                />
                <div className={_style.containerCenterTime}>
                    <span>{timeout}</span>
                </div>

                <div className={_style.containerCenterNote}>
                    <span>Vui lòng bấm play video và xem ít nhất 30 giây để mở khóa</span>
                    <span>Please click play video and watch at least 30 seconds to unlock</span>
                </div>
                {
                    ready ?
                        <a href={info?.source}>
                            <div className={_style.containerCenterSubmit}>
                                <span>Get Link</span>
                            </div>
                        </a>
                        : <div className={_style.containerCenterWaiting}>
                            <span>Please wait...</span>
                        </div>
                }
            </div>
            <div className={`${_style.containerQC} ${_style.rightQC}`}>
                <img src={'qc_test.png'} />
            </div>
        </div>
        <div className={_style.footer}>
            <img
                className={_style.iconAigooX}
                src={'/logo_aigoox.png'}/>
            <div className={_style.contact}>
                <img
                    src={'/logo.png'}/>
                <div className={_style.contactInfo}>
                    <label className={_style.contactInfoTitle}>
                        <a target={"_blank"}
                        href={'https://gamelopte.com'} rel="noreferrer">GameLopte.com</a> </label>
                    <div className={_style.itemContact}>
                        <a target={"_blank"}
                            href={"https://www.youtube.com/@gamelopte1799"} rel="noreferrer">
                            <div className={_style.itemContactBody}>
                                <img src={"/icon_youtube.png"}/>
                                <label>GameLopte</label>
                            </div>
                        </a>
                    </div>

                    <div className={_style.itemContact}>
                        <a target={"_blank"}
                           href={"https://t.me/ModGameAppTrick"} rel="noreferrer">
                            <div className={_style.itemContactBody}>
                                <img src={"/icon_telegram.webp"}/>
                                <label>ModGameAppTrick</label>
                            </div>
                        </a>
                    </div>

                    <div className={_style.itemContact}>
                        <a target={"_blank"}
                           href={"https://www.facebook.com/cnlopte"} rel="noreferrer">
                            <div className={_style.itemContactBody}>
                                <img src={"/icon_facebook.png"}/>
                                <label>Lopte Game và Công Nghệ</label>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
}