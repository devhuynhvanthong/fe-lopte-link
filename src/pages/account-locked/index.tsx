import Header from "~/component/Header";
import React from "react";
import {useRouter} from "next/router";
import {Typography} from "antd";
import Library from "~/utils/Library";

export default function NotFound() {
    const router = useRouter()
    return <>
        <Header title={"Lopte Link - Tài khoản bị khóa"}/>
        <div style={{
            width: '100%',
            height: '100%',
            background: "white",
            position: 'absolute',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifyItems: "center",
            alignItems: "center",
            userSelect: "none"
        }}>
            <img
                style={{
                    width: '100%',
                    height: '100%',
                }}
                src='/prison_full.jpg' alt={'Accept Permission'}/>
            <label style={{
                position: "absolute",
                borderRadius: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                background: "white",
                padding: 20,
                backgroundColor: "red",
                color: "yellow",
                border: "2px solid white",
                maxWidth: "80%",
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center"
            }}>
                <span>Tài khoản của bạn đã bị khóa</span>
                {
                    Library().base64Decode((router.query.code || '').toString()) &&
                    <Typography>
                        <Typography.Paragraph style={{marginBottom: 'unset', display: 'flex', alignItems: 'center'}}
                                              copyable={{text: Library().base64Decode((router.query.code || '').toString()), tooltips: true}}>
                            <span style={{
                                color: "#ffffff",
                            }}>{`Code: ${Library().base64Decode((router.query.code || '').toString())}`}</span>
                        </Typography.Paragraph>
                    </Typography>
                }
            </label>

        </div>
    </>
}
NotFound.layout = "client"