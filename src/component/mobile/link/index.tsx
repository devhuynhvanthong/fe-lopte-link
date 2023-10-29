import {TypePropLink} from "~/@type/link";
import YoutubeComponent from "~/component/YoutubeComponent";
import _style from "./style.module.scss"
import {useEffect, useState} from "react";
import {Spin} from "antd";

export default function LinkMobile ( {info, getLink, isLoadingGetLink, timeConfig} : TypePropLink) {
    const [ready, setReady] = useState(false)
    const [timeout, setTimeout] = useState(timeConfig)

    function handleGetLink() {
        if (timeout <= 0) {
            getLink()
        }
    }

    return <div className={_style.wrapper}>
        <div className={_style.header}>
            <img src={'logo.png'}/>
            <div className={_style.headerContext}>
                <label>LopteYT</label>
                <hr/>
                <span>Phát Triển Kênh, Tăng Đề Xuất</span>
            </div>
        </div>

        <div className={_style.container}>
            <YoutubeComponent
                className={_style.containerYoutube}
                idVideo={info?.ads || ""}
                onTime={(time) => {
                    if (timeConfig - time < 0) {
                        setReady(true)
                    }else {
                        setTimeout(timeConfig - time)
                    }
                }}
                isCount={!ready}
            />

            <div className={_style.containerContent}>
                <div className={_style.containerCenterTime}>
                    <span>{timeout}</span>
                </div>

                <div className={_style.containerCenterNote}>
                    <span>Vui lòng bấm play video và xem ít nhất {timeConfig} giây để mở khóa</span>
                    <span>Please click play video and watch at least {timeConfig} seconds to unlock</span>
                </div>
                {
                    ready ?
                        <div
                            onClick={handleGetLink}
                            className={_style.containerCenterSubmit}>
                            <span>Get Link</span>
                            <Spin
                                className={_style.customSpin}
                                spinning={isLoadingGetLink} />
                        </div>
                        : <div className={_style.containerCenterWaiting}>
                            <span>Please wait...</span>
                        </div>
                }
            </div>
        </div>

        <div className={_style.footer}>
            <div className={_style.contact}>
                <img src={'/logo.png'}/>
                <div className={_style.contactInfo}>
                    <div className={_style.itemContact}>
                        <a target={"_blank"}
                           href={"https://t.me/loptegroup"} rel="noreferrer">
                            <div className={_style.itemContactBody}>
                                <img src={"/icon_telegram.webp"}/>
                                <label>Group Support Telegram</label>
                            </div>
                        </a>
                    </div>

                </div>

            </div>
        </div>
    </div>
}