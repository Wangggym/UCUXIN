import React from 'react'
import './NoContent.scss'
const NoContent = ({ firstLoading }) => {
    return (
        <div> {firstLoading ? null : <div className="no-content" >暂无内容 </div>}</div>
    )
}
export default NoContent
