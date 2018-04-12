import React from 'react'
import PropTypes from 'prop-types'
import './ImageText.scss'
import initImgUrl from '../../../assets/images/yx_teacher_press.png'
//园所item

const ImageText = ({ TeaName, Tel, imgUrl, TeacherTypeDesc }) => {
    imgUrl = imgUrl || initImgUrl
    return (
        < div className='ImageText' >
            <div className='icon'>
                <img src={imgUrl} />
            </div>
            <div className='content'>
                <div className='name'>
                    {TeaName}
                </div>
                {TeacherTypeDesc && <div className='history'> {TeacherTypeDesc} </div>}
                {Tel && <div className='history'> 联系电话：{Tel} </div>}
            </div>
        </div >
    )
}

//限定控件传入的属性类型
ImageText.PropTypes = {

}

//设置默认属性
ImageText.defaultProps = {

}

export default ImageText
