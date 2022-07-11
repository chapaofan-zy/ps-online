import React, { useState, useRef } from 'react'
import './css/upimg.less'
import { Button } from 'antd'

export default function Upimg(props) {

    const [img, setimg] = useState('')
    const fileinput = useRef<HTMLInputElement>(null)
    const [vis, setvis] = useState(false)

    function upload(e) {
        let file = e.target.files[0]
        let img = window.URL.createObjectURL(file)
        window.sessionStorage.setItem("img", img)
        setimg(img)
        props.vishandle()
        setvis(true)
    }
    function onfile() {
        if (fileinput.current) {
            fileinput.current.click()
        }
    }
    return (
        <div className="bg" hidden={vis}>
            <Button type="primary" onClick={onfile}>上传图片</Button>
            <input ref={fileinput} type="file" className="upimg" accept="image/png, image/jpeg" onChange={upload} />
        </div>
    )
}
