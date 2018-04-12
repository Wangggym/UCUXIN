import React from 'react'
import {PullRefreshWrappedComp, Course} from '../../components'

const CourseList = (props) => <div className='plan'>
  <Course {...props} />
</div>


export default PullRefreshWrappedComp()(CourseList)
