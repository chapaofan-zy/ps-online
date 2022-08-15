import React, { useImperativeHandle, useState, useEffect, useRef } from 'react'
import { forwardRef } from 'react'
import styles from './css/cav.module.less'
import Ctrl from './Ctrl'
import Draggable from 'react-draggable'
import Utils from './Utils'
import { EventEmitter } from 'events'
import { message } from 'antd'
import Painter from './Painter'
import { loadConfig } from 'browserslist'


let useArr = [true, false, false, false, false, false, false, false, false]

let selectArr = []

export default function Cav(props) {
    const [style, setstyle] = useState({})
    const [width, setwidth] = useState('')
    const [height, setheight] = useState('')
    const [keydown, setkeydown] = useState(false)
    const [num, setnum] = useState(0)
    const [imgsize, setimgsize] = useState(100)
    const [drag, setdrag] = useState(true)

    function setUseArr(arr) {
        useArr = arr
    }

    //监听鼠标位置
    const [mouse, setmouse] = useState({x: 0, y: 0})
    useEffect(() => {
        document.onmousemove = (e) => {
            let x = e.offsetX
            let y = e.offsetY
            setmouse({'x': x, 'y': y})
        }
    }, [mouse])

    function getMouse() {
        let e = window.event
        return {'x': e.offsetX, 'y': e.offsetY}
    }

    const cav = useRef(null)
    const out = useRef(null)

    //控制器
    const [ctx, setctx] = useState(null)
    useEffect(() => {
        setctx(cav.current.getContext('2d'))
    }, [cav])

    const [reset, setreset] = useState([])


    

    //画布移动控制
    useEffect(() => {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') setdrag(true)
        })
        let down = cav.current.onmousedown
        let move = cav.current.onmousemove
        let up = cav.current.onmouseup
        document.onkeydown = function(e) {
            if (e.key === 'Alt') {
                cav.current.onmousedown = null
                cav.current.onmousemove = null
                cav.current.onmouseup = null
                setdrag(false)
            }
        }
        document.onkeyup = function(e) {
            if (e.key === 'Alt') {
                setdrag(true)
                cav.current.onmousedown = down
                cav.current.onmousemove = move
                cav.current.onmouseup = up
            }
        }
    }, [cav])

    //初始化画布
    useEffect(() => {
        setcav(props.url)
    }, [ctx, props.url, width, height])

    function setcav(url) {
        const img = new Image()
        img.src = url
        //if (!img.width) return 
        img.onload = () => {
            let style = {
                transform: 'scale(100%)',
                transition: '0.3s'
            }
            setwidth(img.width + 'px')
            setheight(img.height + 'px')
            setstyle(style)
                
            setTimeout(() => {
                let ctx = cav.current.getContext('2d')
                ctx.drawImage(img, 0, 0)
                let arr = [...reset]
                arr.push(ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1))
                setreset(arr)
                let tmp = new Array(height.slice(0, -2) * 1).fill().map(() => {
                    return new Array(width.slice(0, -2) * 1).fill(false)
                })
            }, 0)
        }
    }

    function setSize(i) {
        let n = cav.current.style.transform.slice(6, -1) * 100
        i === 0 ? n -= 5 : n += 5
        setimgsize(n)
        cav.current.style.transform = `scale(${Math.round(n)}%)`
    }

    //绘制完成压栈
    const [resetS, setresetS] = useState(0)
    function onreset(ctx/* , reset, resetS, setreset, setresetS, width, height */) {
        let arr = [...reset]
        if (resetS !== arr.length - 1) {
            arr = arr.slice(0, resetS + 1)
        }
        setresetS(resetS + 1)
        arr.push(ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1))
        setreset(arr)
    }

    //撤销
    function reback() {
        if (resetS === 0) return
        setresetS(resetS - 1)
        ctx.putImageData(reset[resetS - 1], 0, 0)
    }
    //重做
    function redo() {
        if (resetS === reset.length - 1) return
        setresetS(resetS + 1)
        ctx.putImageData(reset[resetS + 1], 0, 0)
    }

    //鼠标函数
    function mouseUtil() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
    }

    //画笔参数
    const [color, setcolor] = useState({r: 0, g: 0, b: 0, a: 1})
    const [lineWidth, setlineWidth] = useState(3)

    //draw函数
    const [ismove, setismove] = useState(false)
    function draw(/* color, lineWidth, ismove, reset, resetS, setreset, setresetS */) {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        let ctx = cav.current.getContext('2d')
        let mouse
        cav.current.onmousedown = (e) => {
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
            ctx.lineWidth = lineWidth
            ctx.lineJoin = 'round'
            ctx.lineCap = 'round'
            ctx.beginPath()
            mouse = getMouse()
            ctx.moveTo(mouse.x, mouse.y)
            setismove(true)
            //ismove = true
        }
        cav.current.onmousemove = (e) => {
            if (ismove) {
                mouse = getMouse()
                ctx.lineTo(mouse.x, mouse.y)
                ctx.stroke()
            }
        }
        cav.current.onmouseup = (e) => {
            setismove(false)
            //ismove = false
            onreset(ctx/* , reset, resetS, setreset, setresetS, width, height */)
        }
    }

    //绘制矩形
    const [rectarr, setrectarr] = useState([])
    const [imgdata, setimgdata] = useState(null)
    const [isFull, setisFull] = useState(false)
    function rect(/* color, lineWidth, width, height, ismove, reset, resetS, setreset, setresetS */) {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        let ctx = cav.current.getContext('2d')
        let mouse
        //let imgdata
        //let arr = []
        cav.current.onmousedown = (e) => {
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
            ctx.lineWidth = lineWidth
            ctx.lineJoin = 'round'
            ctx.lineCap = 'round'
            mouse = getMouse()
            let arr = [...rectarr]
            arr[0] = mouse.x
            arr[1] = mouse.y
            setrectarr(arr)
            setismove(true)
            //ismove = true
            setimgdata(ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1))
            //imgdata = ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1)
        }
        cav.current.onmousemove = (e) => {
            if (ismove) {
                ctx.putImageData(imgdata, 0, 0)
                let arr = [...rectarr]
                mouse = getMouse()
                arr[2] = mouse.x
                arr[3] = mouse.y
                setrectarr(arr)
                if (isFull) {
                    ctx.fillRect(arr[0], arr[1], arr[2] - arr[0], arr[3] - arr[1])
                } else {
                    ctx.strokeRect(arr[0], arr[1], arr[2] - arr[0], arr[3] - arr[1])
                }
                
            }
        }
        cav.current.onmouseup = (e) => {
            setrectarr([])
            //arr = []
            setismove(false)
            //ismove = false
            onreset(ctx/* , reset, resetS, setreset, setresetS, width, height */)
        }
    }

    //吸管
    function straw() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        let ctx = cav.current.getContext('2d')
        let mouse
        cav.current.onmousedown = () => {
            mouse = getMouse()
            let onePx = ctx.getImageData(mouse.x, mouse.y, 1, 1).data
            let obj = {...color}
            obj.r = onePx[0]
            obj.g = onePx[1]
            obj.b = onePx[2]
            obj.a = onePx[3] / 255
            setcolor(obj)
        }
    }

    //魔棒
    const [mLimit, setmLimit] = useState(50)
    const [mColor, setmColor] = useState({r: 0, g: 0, b: 0})
    //全部遍历一遍（弃用）
    function magic1() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        let ctx = cav.current.getContext('2d')
        let mouse
        let onePx
        let allImageData = ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1)
        let allData1 = ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1).data
        cav.current.onmousedown = () => {
            mouse = getMouse()
            onePx = ctx.getImageData(mouse.x, mouse.y, 1, 1).data
            let l = 0, r = width.slice(0, -2) * 1, up = 0, down = height.slice(0, -2) * 1
            if (selectArr.length > 0) {
                l = selectArr[0]
                r = selectArr[2] - l
                up = selectArr[1]
                down = selectArr[3] - up
            }
            for (let i = 0; i < allImageData.data.length; i += 4) {
                let allData = allImageData.data
                let s2 = Math.pow((onePx[0] - allData[i]), 2) + Math.pow((onePx[1] - allData[i + 1]), 2) + Math.pow((onePx[2] - allData[i + 2]), 2)
                if (s2 / 3 <= mLimit) {
                    allData[i] = allData1[i] + mColor.r
                    allData[i + 1] = allData1[i + 1] + mColor.g
                    allData[i + 2] = allData1[i + 2] + mColor.b
                }
            }
            ctx.putImageData(allImageData, 0, 0)
            onreset(ctx)
        }
    }

    function magic() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        let ctx = cav.current.getContext('2d')
        let mouse
        let onePx
        let arr = new Array(height.slice(0, -2) * 1).fill().map(() => {
            return new Array(width.slice(0, -2) * 1).fill(false)
        })
        cav.current.onmousedown = () => {
            mouse = getMouse()
            onePx = ctx.getImageData(mouse.x, mouse.y, 1, 1).data
            dfs(arr, mouse.x, mouse.y, onePx, ctx)
            onreset(ctx)
        }
    }

    /* function bibao(fn, arr, x, y, onePx, ctx) {
        let val = fn(arr, x, y, onePx, ctx)
        while (typeof val === 'function') {
            val = val()
        }
    } */

    //深度优先遍历
    function dfs1(arr, x, y, onePx, ctx) {
        if (x < 0 || x >= arr.length || y < 0 || y >= arr[0].length) return null
        if (arr[x][y]) return null
        arr[x][y] = true
        let allData = ctx.getImageData(x, y, 1, 1)
        let data = allData.data
        let s = Math.pow((onePx[0] - data[0]), 2) + Math.pow((onePx[1] - data[1]), 2) + Math.pow((onePx[2] - data[2]), 2)
        if (s / 3 <= mLimit) {
            data[0] = data[0] + mColor.r
            data[1] = data[1] + mColor.g
            data[2] = data[2] + mColor.b
            console.log(111);
            ctx.putImageData(allData, x, y)
            setTimeout(() => {
                dfs(arr, x + 1, y, onePx, ctx)
                dfs(arr, x - 1, y, onePx, ctx)
                dfs(arr, x, y + 1, onePx, ctx)
                dfs(arr, x, y - 1, onePx, ctx)
            }, 0);
        }
    }
    //广度优先遍历
    function dfs(arr, x, y, onePx, ctx) {
        if (x < 0 || x >= arr.length || y < 0 || y >= arr[0].length) return
        let queue = [[x, y]]
        while (queue.length > 0) {
            let [x, y] = queue.shift()
            if (arr[x][y]) continue
            arr[x][y] = true
            let allData = ctx.getImageData(x, y, 1, 1)
            let data = allData.data
            let s = Math.pow((onePx[0] - data[0]), 2) + Math.pow((onePx[1] - data[1]), 2) + Math.pow((onePx[2] - data[2]), 2)
            if (s / 3 <= mLimit) {
                data[0] = data[0] + mColor.r
                data[1] = data[1] + mColor.g
                data[2] = data[2] + mColor.b
                ctx.putImageData(allData, x, y)
                if (y >= 1 && y <= arr.length - 2) {
                    queue.push([x, y - 1], [x, y + 1])
                }
                if (x >= 1 && x <= arr[0].length - 2) {
                    queue.push([x - 1, y], [x + 1, y])
                }
            }
        }
        console.log('down');
    }

    //选区
    //const [start, setstart] = useState([])
    function select() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        let ctx = cav.current.getContext('2d')
        let mouse
        //let imgdata
        //let arr = []
        cav.current.onmousedown = (e) => {
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
            ctx.lineWidth = lineWidth
            ctx.lineJoin = 'round'
            ctx.lineCap = 'round'
            mouse = getMouse()
            let arr = [...rectarr]
            arr[0] = mouse.x
            arr[1] = mouse.y
            setrectarr(arr)
            setismove(true)
            //ismove = true
            setimgdata(ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1))
            //imgdata = ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1)
        }
        cav.current.onmousemove = (e) => {
            if (ismove) {
                ctx.putImageData(imgdata, 0, 0)
                let arr = [...rectarr]
                mouse = getMouse()
                arr[2] = mouse.x
                arr[3] = mouse.y
                setrectarr(arr)
                ctx.strokeRect(arr[0], arr[1], arr[2] - arr[0], arr[3] - arr[1])
            }
        }
        cav.current.onmouseup = (e) => {
            selectArr = rectarr
            setrectarr([])
            //arr = []
            setismove(false)
            //ismove = false
            //onreset(ctx/* , reset, resetS, setreset, setresetS, width, height */)
        }
    }

    const [mir, setmir] = useState({
        r: 'r',
        g: 'g',
        b: 'b'
    })
    const [mirHandler, setmirHandler] = useState(false)

    //滤镜
    function mirror() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        if (mir.r === 'r' && mir.g === 'g' && mir.b === 'b') {
            return
        }
        let ctx = cav.current.getContext('2d')
        let allImageData = ctx.getImageData(0, 0, width.slice(0, -2) * 1, height.slice(0, -2) * 1)
        let rgb = {...mir}
        rgb.r = rgb.r.replace(/r/g, 'allData[i]')
        rgb.r = rgb.r.replace(/g/g, 'allData[i + 1]')
        rgb.r = rgb.r.replace(/b/g, 'allData[i + 2]')
        rgb.g = rgb.g.replace(/r/g, 'allData[i]')
        rgb.g = rgb.g.replace(/g/g, 'allData[i + 1]')
        rgb.g = rgb.g.replace(/b/g, 'allData[i + 2]')
        rgb.b = rgb.b.replace(/r/g, 'allData[i]')
        rgb.b = rgb.b.replace(/g/g, 'allData[i + 1]')
        rgb.b = rgb.b.replace(/b/g, 'allData[i + 2]')
        for (let i = 0; i < allImageData.data.length; i += 4) {
            let allData = allImageData.data
            try {
                allData[i] = eval(rgb.r)
                allData[i + 1] = eval(rgb.g)
                allData[i + 2] = eval(rgb.b)
            } catch {
                message.error('输入不是数字')
                return
            }
        }
        ctx.putImageData(allImageData, 0, 0)
        onreset(ctx)
    }
    

    //下载
    function downLoad() {
        cav.current.onmousedown = null
        cav.current.onmousemove = null
        cav.current.onmouseup = null
        cav.current.toBlob(function(blob) {
            let a = document.createElement("a")
            let body = document.getElementsByTagName("body")
            document.body.appendChild(a)
            a.download = "img" + ".jpg"
            a.href = window.URL.createObjectURL(blob)
            a.click()
            body.removeChild("a")
        })
    }

    useEffect(() => {
        if (useArr[useArr.length - 1]) {
            downLoad()
        }
    }, [useArr[useArr.length - 1]])

    useEffect(() => {
        if (useArr[5]) {
            mirror()
        }
    }, [mir, mirHandler])


    //工具栏

    useEffect(() => {
        if (useArr[1]) {
            draw()
        }
    }, [mouse, ctx, rectarr, mLimit, mColor, isFull])

    useEffect(() => {
        if (useArr[0]) {
            mouseUtil()
        }
        if (useArr[1]) {
            draw()
        }
        if (useArr[2]) {
            magic()
        }
        if (useArr[3]) {
            straw()
        }
        if (useArr[4]) {
            rect()
        }
    }, [useArr[0], useArr[2], useArr[3], useArr[4], ctx, rectarr, mLimit, mColor, isFull])


    //设置cav的位置top
    /* const bg = useRef(null)
    useEffect(() => {
        let height = cav.current.height

        bg.current.style.top = height + 'px'
    }, [cav]) */

    return (
        <div className=''>
            <div className={styles.bg}>
                <Draggable disabled={drag}>
                    <div className="cavbox" ref={out}>
                        <div className={style.cav}>
                            <canvas width={width} height={height} style={style} ref={cav} className="cav"></canvas>
                        </div>
                    </div>
                </Draggable>
            </div>
            <Draggable disabled={drag}>
                <div>
                    <Painter 
                        setC={setcolor}
                        setlineWidth={setlineWidth} 
                        color={color} mLimit={mLimit} 
                        setmLimit={setmLimit}
                        mColor={mColor}
                        setmColor={setmColor}
                        useArr={useArr}
                        reset={reset}
                        resetS={resetS}
                        setisFull={setisFull}
                        mir={mir}
                        setmir={setmir}
                        setmirHandler={setmirHandler}
                        mirHandler={mirHandler}></Painter>
                </div>
            </Draggable>
            {props.vis && <Ctrl imgsize={imgsize} setSize={setSize}></Ctrl>}
            <Utils useArr={useArr} setUseArr={setUseArr} reback={reback} redo={redo}></Utils>
        </div>
    )
}

