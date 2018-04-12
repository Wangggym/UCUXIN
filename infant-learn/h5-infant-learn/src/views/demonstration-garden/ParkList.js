import React from 'react'
import PropTypes from 'prop-types'
import { trainPlan } from '../../api'
import { Link,withRouter } from 'react-router-dom'
import { ParkItem, LongListWrappedComp } from '../../components'

class ParkList extends React.Component {
    render() {
        return (
                <ParkItem {...this.props} onClick={()=>this.props.history.push({pathname:`/parkDetail/${this.props.ID}`})}/>
        )
    }
}

//限定控件传入的属性类型
ParkList.propTypes = {

}

//设置默认属性
ParkList.defaultProps = {

}

export default LongListWrappedComp(trainPlan.getPageByCondition)(withRouter(ParkList))
