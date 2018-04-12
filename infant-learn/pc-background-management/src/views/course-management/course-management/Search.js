import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, DatePicker, Select, message, Button, Row} from 'antd'
import api from '../../../api'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
const SearchInput = Input.Search

const getOption = (Type) => {
  const array = []
  Type.forEach(({ID, Name}) => {
    array.push(<Option value={ID} key={ID}>{Name}</Option>)
  })
  return array
}

const teachWayType = [{ID: '0', Name: '全部'}, {ID: '1', Name: '录播'}, {ID: '2', Name: '直播'}, {ID: '3', Name: '线下面授'},]
const auditSTIDType = [{ID: '0', Name: '全部'}, {ID: '10', Name: '未发布'}, {ID: '20', Name: '已发布'}, {
  ID: '30',
  Name: '待审核'
}, , {ID: '40', Name: '审核驳回'}, {ID: '50', Name: '审核通过'},]
const planIDType = [
  {ID: '1', Name: '培训课程'},
]

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      planIDType,
    }
  }

  componentDidMount() {
    //获取当前用户的培训计划
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    console.log(userInfo)
    if (userInfo && userInfo.ManageLevel == 1) {
      this.setState({
        planIDType: [
          {ID: '2', Name: '专家讲座'},
          {ID: '3', Name: '名师示范课'},
          {ID: '4', Name: '专辑'},
        ]
      }, () => this.props.form.validateFields((err, fieldsValue) => {
        if (err) return message.info(err)
        this.props.onChange(fieldsValue)
      }))
    } else {
      this.setState({
        planIDType: [
          {ID: '1', Name: '培训课程'},
        ]
      }, () => this.props.form.validateFields((err, fieldsValue) => {
        if (err) return message.info(err)
        this.props.onChange(fieldsValue)
      }))
    }

  }

  handleSearch = () => {
    this.props.onSearch()
  }

  handleKeyDown = (e) => {
    if (e.watch === 13) {
      this.props.onSearch()
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {style} = this.props
    return (
      <Form layout="inline" style={style}>
        {
          this.state.planIDType.length === 1 ? <FormItem label='培训项目'>
            {getFieldDecorator('CourseType', {initialValue: '1'})(
              <Select style={{width: 200}}>
                {getOption(this.state.planIDType)}
              </Select>
            )}
          </FormItem> : <FormItem label='培训项目'>
            {getFieldDecorator('CourseType', {initialValue: '2'})(
              <Select style={{width: 200}}>
                {getOption(this.state.planIDType)}
              </Select>
            )}
          </FormItem>
        }
        <FormItem label="培训时间">
          {getFieldDecorator('times')(
            <RangePicker/>
          )}
        </FormItem>
        <FormItem label='授课方式'>
          {getFieldDecorator('teachWay', {initialValue: '0'})(
            <Select style={{width: 200}}>
              {getOption(teachWayType)}
            </Select>
          )}
        </FormItem>
        <Row style={{marginTop: "1rem"}}>
          <FormItem label='审核状态'>
            {getFieldDecorator('auditSTID', {initialValue: '0'})(
              <Select style={{width: 200}}>
                {getOption(auditSTIDType)}
              </Select>
            )}
          </FormItem>
          <FormItem label='课程名称'>
            {getFieldDecorator('name', {initialValue: ''})(
              <Input placeholder='输入课程关键字查询'/>
            )}
            {/*<SearchInput placeholder='输入课程关键字查询' onSearch={this.handleSearch} onKeyDown={this.handleKeyDown} />*/}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => this.handleSearch()}>查询</Button>
          </FormItem>
        </Row>
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
