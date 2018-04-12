import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
const cssRoot = 'AddTestPaper'
const ButtonGroup = Button.Group

export default class MoveButtonGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    handleClick(field) {
        const { onClick } = this.props
        onClick && onClick(field)
    }
    render() {
        const { index, length } = this.props
        return (
            <ButtonGroup style={{ verticalAlign: 'top', margin: '0 5px' }}>
                <Button disabled={index === 0} onClick={() => this.handleClick('up')}>上移</Button>
                <Button disabled={index === length - 1} onClick={() => this.handleClick('down')}>下移</Button>
            </ButtonGroup>
        )
    }
}

//限定控件传入的属性类型
MoveButtonGroup.propTypes = {
    index: PropTypes.number,
    length: PropTypes.number,
    onClick: PropTypes.func.isRequired,
}

//设置默认属性
// MoveButtonGroup.defaultProps = {

// }