import React from 'react'
import PropTypes from 'prop-types'
import './YoungCoinRule.scss'
const youngCoinRuleDataDayTask = [
    {
        name: '登录', count: '+1', limit: '+1',

    },
    {
        name: '购买', count: '购买金额', limit: '不限',

    },
    {
        name: '课程评价', count: '+1', limit: '+5',

    },
]
const youngCoinRuleDataFixedTask = [
    {
        name: '注册', count: '+30',

    }
]

export default class YoungCoinRule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className='young-coin-rule'>
                <div className='rule-item'>
                    <div className='type'>每日任务</div>
                    <div className='title'>
                        <span>任务名称</span>
                        <span>单次可获幼学币</span>
                        <span>每日上限</span>
                    </div>
                    <div className='content'>
                        {
                            youngCoinRuleDataDayTask.map(({ name, count, limit }, index) => {
                                return (
                                    <div key={index}>
                                        <span>{name}</span>
                                        <span className='green-color'>{count}</span>
                                        <span>{limit}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='border-bottom1PX'></div>
                <div className='rule-item'>
                    <div className='type'>固定任务</div>
                    <div className='content'>
                        {
                            youngCoinRuleDataFixedTask.map(({ name, count, limit }, index) => {
                                return (
                                    <div key={index}>
                                        <span>{name}</span>
                                        <span className='green-color'>{count}</span>
                                        <span>{limit}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

//限定控件传入的属性类型
YoungCoinRule.propTypes = {

}

//设置默认属性
YoungCoinRule.defaultProps = {

}
