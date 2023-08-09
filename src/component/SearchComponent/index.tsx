import {Input} from "antd";
import { debounce } from 'lodash'
import { useCallback } from "react";
import {useRouter} from "next/router";
interface TypeProp {
    onSearch: () => void
}
export default function SearchComponent() {
    const router = useRouter()
    const handleSearch = useCallback(
        debounce((str: String) => {
            // @ts-ignore
            router.push({ query: { ...router.query, search: str, page_offset: 1 } }, undefined, { shallow: true })
        }, 1200),
        [],
    )
    return <div style={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        gap: 10
    }}>
        <label style={{
            color: "white"
        }}>Tìm kiếm</label>
        <Input
            style={{
                maxWidth: '50%'
            }}
            defaultValue={router.query.search}
            placeholder={"Nhập [link trỏ tới | key] để tìm kiếm"}
            onChange={(e) => {
                handleSearch(e.target.value)
            }}/>
    </div>
}