import React, { useState, useEffect, useRef } from 'react'
import { ChromePicker } from 'react-color'
import { Col, Slider, InputNumber, Radio, Input, Button } from 'antd'
import style from './css/painter.module.less'


const utilList = ['选择', '画笔', '魔棒', '吸管', '矩形', '滤镜', '撤销','重做']

export default function Painter(props) {

    const cav = useRef(null)

    //画笔颜色
    const [color, setcolor] = useState(props.color)
    const [colorhandler, setcolorhandler] = useState(false)

    useEffect(() => {
        let t = {...dot}
        t.background = `rgba(${props.color.r},${props.color.g},${props.color.b},${props.color.a})`
        setdot(t)
        setcolor(props.color)
    }, [props.color])

    //dot
    const [dot, setdot] = useState({background: `rgba(${color.r},${color.g},${color.b},${color.a})`, width: `6px`, height: `6px`})

    //画笔尺寸
    function onChange(v) {
        props.setlineWidth(v)
        let t = {...dot}
        t.width = `${v * 2}px`
        t.height = `${v * 2}px`
        setdot(t)
    }

    function onChangeColor(color) {
        setcolor(color.rgb)
        props.setC(color.rgb)
        let t = {...dot}
        t.background = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
        setdot(t)
    }

    //魔棒阈值
    function onMagicChange(v) {
        props.setmLimit(v)
    }

    //rect
    function rectOnChange(e) {
        props.setisFull(e.target.value)
    }

    const [name, setname] = useState(0)

    useEffect(() => {
        props.useArr.map((e, i) => {
                    if (e) {
                        setname(i)
                    }
                })
    }, [props.useArr])

    const [myRGB, setmyRGB] = useState({
        r: 'r',
        g: 'g',
        b: 'b'
    })

    function setMirror(e) {
        let t = e.target.value
        let obj
        switch (t) {
            case 'fanse':
                obj = {
                    r: '255 - r',
                    g: '255 - g',
                    b: '255 - b'
                }
                setmyRGB(obj)
                break;
            
            case 'gray':
                obj = {
                    r: '(r + g + b) / 3',
                    g: '(r + g + b) / 3',
                    b: '(r + g + b) / 3'
                }
                setmyRGB(obj)
                break;
        
            default:
                break;
        }
    }


    return (
        <div className={style.bg}>
            <div className={style.title}>{utilList[name]}</div>
            <div className={style.slider}>
                <Slider min={1} max={20} defaultValue={3} onChange={onChange}/>
            </div>
            <div className={style.color}>
                <div className={style.cbtn} onClick={() => setcolorhandler(!colorhandler)}>
                    <div style={{background: `rgba(${props.color.r},${props.color.g},${props.color.b},${props.color.a})`}} className={style.cc}></div>
                </div>
                {colorhandler && <div className={style.picker}><ChromePicker color={color} onChange={onChangeColor} className={style.handler}></ChromePicker></div>}
            </div>
            {/* 矩形是否空心 */}
            {props.useArr[4] && <div className={style.rect}>
                <Radio.Group onChange={rectOnChange} defaultValue={false}>
                    <Radio.Button value={false}>空心</Radio.Button>    
                    <Radio.Button value={true}>实心</Radio.Button>    
                </Radio.Group>    
            </div>}
            {/* 阈值 */}
            {props.useArr[2] && <div className={style.slider}>容差
                <Slider min={0} max={400} defaultValue={props.mLimit} onChange={onMagicChange}/>
            </div>}
            {/* rgb */}
            {props.useArr[2] && <div className={style.slider}>R
                <Slider min={-255} max={255} defaultValue={props.mColor.r} onChange={(v) => {
                    let obj = {...props.mColor}
                    obj.r = v
                    props.setmColor(obj)
                }}/>
            </div>}
            {props.useArr[2] && <div className={style.slider}>G
                <Slider min={-255} max={255} defaultValue={props.mColor.g} onChange={(v) => {
                    let obj = {...props.mColor}
                    obj.g = v
                    props.setmColor(obj)
                }}/>
            </div>}
            {props.useArr[2] && <div className={style.slider}>B
                <Slider min={-255} max={255} defaultValue={props.mColor.b} onChange={(v) => {
                    let obj = {...props.mColor}
                    obj.b = v
                    props.setmColor(obj)
                }}/>
            </div>}
            
            {/* 画笔 */}
            {(props.useArr[1] || props.useArr[4] || props.useArr[0]) && <div className={style.showbox}>
                <div className={style.dot} style={dot}></div>
            </div>}
            {/* 滤镜 */}
            {(props.useArr[5]) && <div className={style.mirror}>
                <div>
                    <Radio.Group onChange={setMirror} defaultValue={false}>
                        <Radio.Button value={'fanse'}>反色</Radio.Button>    
                        <Radio.Button value={'gray'}>灰色调</Radio.Button>    
                    </Radio.Group>
                </div>
                <span className={style.zdy}>自定义：</span>
                <div className={style.three}>
                    <div className={style.zidingyi}>
                        <span>R:</span>
                        <Input value={myRGB.r} onChange={(e) => {
                            let obj = {...myRGB}
                            obj.r = e.target.value
                            setmyRGB(obj)
                        }}/>
                    </div>
                    <div className={style.zidingyi}>
                        <span>G:</span>
                        <Input value={myRGB.g} onChange={(e) => {
                            let obj = {...myRGB}
                            obj.g = e.target.value
                            setmyRGB(obj)
                        }}/>
                    </div>
                    <div className={style.zidingyi}>
                        <span>B:</span>
                        <Input value={myRGB.b} onChange={(e) => {
                            let obj = {...myRGB}
                            obj.b = e.target.value
                            setmyRGB(obj)
                        }}/>
                    </div> 
                </div>
                <Button type="primary" onClick={() => {
                    props.setmir(myRGB)
                    props.setmirHandler(!props.mirHandler)
                }}>确定</Button>
            </div>}
        </div>
    )
}
