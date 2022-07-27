import React,{ useEffect } from 'react'
import styles from './css/ctrl.module.less' 

export default function Ctrl(props) {

    function setS(i) {
        props.setSize(i)
    }

    return (
        <div className={styles.bg}>
            <div className={styles.label}>
                <div className={styles.fh} onClick={() => setS(1)}>+</div>
                <span style={{userSelect: 'none'}}>{Math.round(props.imgsize) + '%'}</span>
                <div className={styles.fh} onClick={() => setS(0)}>-</div>
            </div>
        </div>
    )
}
