import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'
import './style.scss'
const cssRoot = 'Statistics'

export default class Statistics extends React.Component {
    constructor(props) {
        super(props)
    }

    handleChange = (value) => {
        this.props.onChange(value)
    }

    render() {

        const { QtyQuestion, TotalScore, TotalTime, } = this.props
        return (
            <ul className={`${cssRoot}-ul`}>
                <li >
                    <div style={{ flex: 1 }}>总题数：</div>
                    <div ><span className={`${cssRoot}-number`}>{QtyQuestion}</span>道</div>
                </li>
                <li >
                    <div style={{ flex: 1 }}>总分数：</div>
                    <div ><span className={`${cssRoot}-number`}>{TotalScore}</span>分</div>
                </li>
                <li >
                    <div style={{ flex: 1 }}>总时长：</div>
                    <div>
                        <span className={`${cssRoot}-number`}><InputNumber value={TotalTime} onChange={this.handleChange} /></span>分钟
                    </div>
                </li>
            </ul>
        )
    }
}

//限定控件传入的属性类型
Statistics.propTypes = {
    QtyQuestion: PropTypes.number.isRequired,
    TotalScore: PropTypes.number.isRequired,
    TotalTime: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}

//设置默认属性
Statistics.defaultProps = {

}