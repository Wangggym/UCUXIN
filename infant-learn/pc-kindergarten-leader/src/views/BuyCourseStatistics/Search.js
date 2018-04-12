import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, DatePicker, Select, message, Button, Row} from 'antd'
import api from '../../api'
import moment from 'moment'

const FormItem = Form.Item
const {MonthPicker, RangePicker} = DatePicker;
const Option = Select.Option
const SearchInput = Input.Search

const getOption = (data) => {
  const array = []
  if (!(data && data.length)) return array
  data.forEach(({key, value}) => {
    array.push(<Option value={value} key={value}>{key}</Option>)
  })
  return array
}

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sDate: moment().subtract(1, 'y'),
      eDate: moment(),
    }
  }

  componentDidMount() {
    // 培训类型
    api.ParkInfo.GetTrainTypeList().then(res => {
      if (!res) return message.error('res为空')
      if (res.Ret === 0) {
        const courseType = [{Value: '0', Text: '全部'}, ...res.Data].map(({Text, Value}) => {
          return {key: Text, value: Value}
        })
        this.setState({courseType}, () => this.checkGetStatus())
      } else {
        message.info(res.Msg)
      }
    })
    //获取职务
    api.ParkInfo.GetBusinessMemberRoles().then(res => {
      if (!res) return message.error('res为空')
      if (res.Ret === 0) {
        const roleID = [{ID: '0', Name: '全部'}, ...res.Data].map(({ID, Name}) => {
          return {key: Name, value: ID}
        })
        this.setState({roleID}, () => this.checkGetStatus())
      } else {
        message.info(res.Msg)
      }
    })
  }

  //检查获取状态 poss后提交初始数据
  checkGetStatus = () => {
    const {courseType, roleID} = this.state
    if (courseType && roleID) this.getValidateFields()
  }

  //提交值
  getValidateFields() {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return message.info(err)
      const {sDate, eDate} = this.state
      this.props.onChange({...fieldsValue, sDate, eDate})
    })
  }

  //时间改变
  handleTimeChange = (fields, value) => {
    this.setState({[fields]: value}, () => {
      this.correctTime()
    })
  }

  //校准时间
  correctTime() {
    const {sDate, eDate} = this.state
    if (Math.abs(sDate.diff(eDate, 'month')) > 12) {
      this.setState({eDate: moment(sDate.format()).add(1, 'y')}, () => {
        message.info('最多只能选择一年时间！')
        return this.getValidateFields()
      })
    }
    return this.getValidateFields()
  }


  render() {
    const {getFieldDecorator} = this.props.form
    const {style} = this.props
    const {sDate, eDate} = this.state
    return (
      <Form layout="inline" style={style}>
        <FormItem label='课程类型'>
          {getFieldDecorator('courseType', {initialValue: '0'})(
            <Select style={{width: 200}}>
              {getOption(this.state.courseType)}
            </Select>
          )}
        </FormItem>
        <FormItem label='职务'>
          {getFieldDecorator('roleID', {initialValue: '0'})(
            <Select style={{width: 200}}>
              {getOption(this.state.roleID)}
            </Select>
          )}
        </FormItem>
        <FormItem label="培训时间">
          <MonthPicker value={sDate} onChange={(value) => this.handleTimeChange('sDate', value)} />
        </FormItem>
        <span style={{marginRight: '20px'}}>~</span>
        <FormItem>
          <MonthPicker value={eDate} onChange={(value) => this.handleTimeChange('eDate', value)} />
        </FormItem>
      </Form>
    )
  }
}

//限定控件传入的属性类型
Search.propTypes = {}

//设置默认属性
Search.defaultProps = {}

export default Form.create({
  onValuesChange: (props, values) => {
    props.onChange(values)
  }
})(Search)
