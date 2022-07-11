import React, { useImperativeHandle, useState, useEffect } from 'react'

export default function Cav(props) {
    const [imgsrc, setimgsrc] = useState('')
    useEffect(() => {
        if (window.sessionStorage.getItem('img')) {
            setimgsrc(window.sessionStorage.getItem('img'))
        }
    }, [imgsrc])
    return (
        <div style={{background: 'red'}}>
            <canvas width="100px" height="100px"></canvas>
            <img src={imgsrc} alt="" />
        </div>
    )
}
