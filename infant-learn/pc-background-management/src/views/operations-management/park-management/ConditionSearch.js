import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, DatePicker, Select, message, Button} from 'antd'
import api from '../../../api'

const FormItem = Form.Item
const Option = Select.Option
const SearchInput = Input.Search

const getOption = (Type) => {
  const array = []
  Type.forEach(({Text, Value}) => {
    array.push(<Option value={Value} key={Value}>{Text}</Option>)
  })
  return array
}

const teachWayType = [{ID: '1', Name: '录播'}, {ID: '2', Name: '直播'}, {ID: '3', Name: '线下面授'},]
const auditSTIDType = [{ID: '1', Name: '待审核'}, {ID: '2', Name: '审核驳回'}, {ID: '3', Name: '审核通过'}, , {
  ID: '4',
  Name: '免审'
},]
const planIDType = [{Text: '全部', Value: '0'}]

class ConditionSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      planIDType,
    }
  }

  componentDidMount() {
    //获取当前用户的培训计划
    api.CourseManagement.GetGardenLevelList().then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({planIDType: [...planIDType, ...res.Data]})
        }
      } else {
        message.info(res.Msg)
      }
    })
    //首次加载传出值
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return message.info(err)
      this.props.onChange(fieldsValue)
      this.props.onSearch()
    })
  }

  //点击查询
  handleSearch = () => {
    this.props.onSearch()
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {style} = this.props
    return (
      <Form layout="inline" style={style}>
        <FormItem label='园所类型'>
          {getFieldDecorator('gardenLevel', {initialValue: '0'})(
            <Select style={{width: 200}}>
              {getOption(this.state.planIDType)}
            </Select>
          )}
        </FormItem>
        <FormItem label='园所名称'>
          {getFieldDecorator('gardenName', {initialValue: ''})(
            <Input placeholder='输入园所名称关键字查询'/>
          )}
        </FormItem>
        <FormItem label='园长姓名'>
          {getFieldDecorator('name', {initialValue: ''})(
            <Input placeholder='输入园长姓名关键字查询'/>
          )}
        </FormItem>
        <FormItem>
          <Button type='primary' onClick={this.handleSearch}>查询</Button>
        </FormItem>
      </Form>
    )
  }
}

//限定控件传入的属性类型
ConditionSearch.propTypes = {}

//设置默认属性
ConditionSearch.defaultProps = {}

export default Form.create({
  onValuesChange: (props, values) => {
    props.onChange(values)
  }
})(ConditionSearch)
