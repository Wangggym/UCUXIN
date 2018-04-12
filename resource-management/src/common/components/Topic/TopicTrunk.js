import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
export default class TopicTrunk extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { Options, Type } = this.props
        return (
            <ul style={{ padding: '10px 0' }}>
                {
                    Options && Options.length && Options.map(({ Name, Section }, index) => {
                        return (
                            <li key={index}>
                                {/*<Checkbox className='TopicTrunk'>{Section}、 {Name}</Checkbox>*/}
                              {Section}、 {Name}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

//限定控件传入的属性类型
TopicTrunk.propTypes = {
    Options: PropTypes.array.isRequired,

}

//设置默认属性
TopicTrunk.defaultProps = {

}
