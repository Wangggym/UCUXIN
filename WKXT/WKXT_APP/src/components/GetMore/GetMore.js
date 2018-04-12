import React from 'react'
import style from './GetMore.less'

const GetMore = ({onClick}) =>
    <div className={style.getMore} onClick={onClick}>
        点击加载更多...
    </div>

export default GetMore