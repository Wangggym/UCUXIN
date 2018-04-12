import React from 'react'
import style from './page.less'

const CollectComp = ({IsFav, onClick}) =>{
    return <a href="javascript:void(0);" onClick={() => onClick(!IsFav)}>
        <div className={IsFav ? style.collect : null}/>
    </a>
}

export default CollectComp