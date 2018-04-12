import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import style from './HeadBarComp.less'

export default class HeadBarComp extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {onClose, value, onlyValue, onClick} = this.props
        let element = null
        if (value || onlyValue) {
            element = <div className={style.HeadBarComp}>
                <a onClick={onClick}>
                    <img src={require('../../public/assets/提示@2x.png')} alt=""/>
                    {onlyValue && <span className={'overflow-hidden'}>{onlyValue}</span>}
                    {value && <span className={'overflow-hidden'}>上次学习：[{value.SubjectName}]{value.CoursePeriodName}</span>}

                    {onClose && <div onClick={e => {
                        e.stopPropagation()
                        onClose()
                    }}>
                        <img src={require('../../public/assets/tabbar_close.png')} alt=""/>
                    </div>}
                </a>
            </div>
        }
        return element
    }
}

//限定控件传入的属性类型
HeadBarComp.PropTypes = {}

//设置默认属性
HeadBarComp.defaultProps = {
    onClick: f => f,
    onClose: f => f
}





