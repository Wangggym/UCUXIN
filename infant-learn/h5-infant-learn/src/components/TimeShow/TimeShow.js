import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
export default class TimeShow extends React.Component {
    getTime(time) {
        return moment(time, "YYYY-MM-DD HH:mm:ss").format('HH:mm')
    }
    showDay(time) {
        return moment(time, "YYYY-MM-DD HH:mm:ss").format('MM-DD')
    }

    render() {
        const { SDate, EDate } = this.props
        return (
            <div>{this.showDay(SDate)}日 {this.getTime(SDate)}-{this.getTime(EDate)}</div>
        )
    }
}

//限定控件传入的属性类型
TimeShow.propTypes = {

}

//设置默认属性
TimeShow.defaultProps = {

}

