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
      year: '2017',
      uid: props.uid
    }
  }

  componentDidMount() {
    this.GetMember()
  }


  //提交值
  getValidateFields() {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return message.info(err)
      const {year, uid} = this.state
      this.props.onChange({...fieldsValue, year, uid})
    })
  }

  //切换时
  handleSelectChange = (fields, value) => {
    this.setState({[fields]: value}, () => this.getValidateFields())
  }

  //获取学员
  GetMember = () => {
    // 培训类型
    api.ParkInfo.GetMember().then(res => {
      if (!res) return message.error('res为空')
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          const member = res.Data.map(({UserName, UID}) => {
            return {key: UserName, value: String(UID)}
          })
          this.setState({member}, () => this.getValidateFields())
        }
        // this.setState({courseType}, () => this.checkGetStatus())
      } else {
        message.info(res.Msg)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {style} = this.props
    return (
      <Form layout="inline" style={style}>
        <FormItem label="学员">
          {this.state.member &&
          <Select defaultValue={this.state.uid} style={{width: 120}}
                  onChange={(value) => this.handleSelectChange('uid', value)}>
            {getOption(this.state.member)}
          </Select>}
        </FormItem>
        <FormItem label="选择年份">
          <Select defaultValue={this.state.year} style={{width: 120}}
                  onChange={(value) => this.handleSelectChange('year', value)}>
            <Option value="2017">2017年</Option>
            <Option value="2016">2016年</Option>
            <Option value="2015">2015年</Option>
          </Select>
        </FormItem>
      </Form>
    )
  }
}

//限定控件传入的属性类型
Search.propTypes = {}

//设置默认属性
Search.defaultProps = {}

export default Form.create()(Search)
