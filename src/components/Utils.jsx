import React, { Component } from 'react'
import style from './css/util.module.less'
export default class Utils extends Component {
    constructor(props) {
        super(props)
        this.state = {
            utilList: ['选择', '画笔', '魔棒', '吸管', '矩形', '撤销','重做'],
            arrStyle: [],
            useArr: props.useArr
        }
    }

    componentDidMount() {
        let arr = this.state.utilList.map(() => {
            return style.out
        })
        arr[0] = style.on + ' ' + style.out
        this.setState({
            arrStyle: arr
        })
    }


    setList() {
        let arr = []
        this.state.utilList.map((e, i) => {
            let t = new Util(require(`../pngs/${e}.png`), i)
            let tmp = []
            let res = (<div className={this.state.arrStyle[i]} key={i} onClick={() => {
                if (i === this.state.utilList.length - 1) {
                    this.props.redo()
                    return
                }
                if (i === this.state.utilList.length - 2) {
                    this.props.reback()
                    return
                }
                let arrS = [...this.state.arrStyle]
                tmp = this.props.useArr.map((e, index) => {
                    arrS[index] = style.out
                    return false
                })
                tmp[i] = true
                arrS[i] = style.on + ' ' + style.out
                this.setState({
                    arrStyle: arrS
                })
                this.props.setUseArr(tmp)
            }}>{t.createEl()}</div>)
            arr.push(res)
        })
        return arr
    }


    render() {
        return (
            <div className={style.bg}>
                {this.setList()}
            </div>
        )
    }
}

class Util {
    constructor(url, index) {
        this.index = index
        this.src = url
    }

    createEl() {
        return (<img src={this.src}></img>)
    }
}
