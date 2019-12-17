import React from 'react'
import no_qualification from '../../assets/images/121.png'
import './NoContent.less'
const NoContent = ({children}) =>
    <div className="NoContent">
    <div className="wrap">
        <img src={no_qualification} alt=""/>
    </div>
    <p>{children}</p>
</div>

export default NoContent