import {Input} from "antd";
import { debounce } from 'lodash'
import { useCallback } from "react";
import {useRouter} from "next/router";

interface TypeProp {
    placeholder?: string,
    textColor?: string
}
export default function SearchComponent({ placeholder, textColor }: TypeProp) {
    const router = useRouter()
    const handleSearch = useCallback(
        debounce((str: String) => {
            if (str) {
                // @ts-ignore
                router.push({ query: { ...router.query, search: str, page_offset: 1 } }, undefined, { shallow: true })
            } else {
                delete router.query?.search
                // @ts-ignore
                router.push({ query: { ...router.query, page_offset: 1 } }, undefined, { shallow: true })
            }
        }, 1200),
        [],
    )
    return <div style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "70%",
        gap: 10
    }}>
        <label style={{
            color: textColor || "white"
        }}>Tìm kiếm</label>
        <Input
            style={{
                width: "350px",
            }}
            allowClear
            defaultValue={router.query.search}
            placeholder={placeholder || "Nhập [link trỏ tới | key] để tìm kiếm"}
            onChange={(e) => {
                handleSearch(e.target.value)
            }}/>
    </div>
}