import React ,{Component}from 'react'
import PropTypes from 'prop-types'
import {PullRefreshWrappedComp, NoAccordionCourse} from '../../components'



// const PlanList = (props) => <NoAccordionCourse  {...this.props} />
class PlanList extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <NoAccordionCourse {...this.props}/>
    )
  }
}

export default PullRefreshWrappedComp()(PlanList)
