import React from 'react'
import {LongListWrappedComp} from '../../../components'
import './YoungCoinRule.scss'
import moment from 'moment'

const YoungCoinRecordList = ({ActionName, Score, CDate, Desc}) => <div className='record-item'>
  <div>
    <span className='name'>{ActionName}</span>
    <span className='type'>{Desc}</span>
  </div>
  <div>
    <span className='count'>+{Score}</span>
    <span className='date'>{moment(CDate).format('YYYY-MM-DD HH:mm')}</span>
  </div>
</div>


//限定控件传入的属性类型
YoungCoinRecordList.propTypes = {}

//设置默认属性
YoungCoinRecordList.defaultProps = {}

const getNewFields = (fields) => {
  let newFields = {}
  for (const [key, value] of Object.entries(fields)) {
    if (key === 'pIndex') {
      newFields['pageIndex'] = value
    } else if (key === 'pSize') {
      newFields['pageSize'] = value
    } else {
      newFields[key] = value
    }
  }
  return newFields
}
export default LongListWrappedComp(null, null, getNewFields)(YoungCoinRecordList)
