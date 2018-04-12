import React from 'react'
import {Form, Icon, Input, Button, AutoComplete, message} from 'antd';
import api from '../../../api'

const FormItem = Form.Item;
const Option = AutoComplete.Option

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ConditionSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
    }
    this.timer = null
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) this.props.onSearch(values)
    })
  }

  //自动完成查询
  handleSearch = (keyword) => {
    // if (this.timer === null) this.GetSchoolsByKeyword(keyword)
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.GetSchoolsByKeyword(keyword);
      // this.timer = null
    }, 500)
  }

  GetSchoolsByKeyword(keyword) {
    api.Menu.GetSchoolsByKeyword({rid: 430000, phase: 30010, keyword}).then(result => {
      if (!result) return message.info('res为空')
      if (result.Msg) return message.error(result.Msg)
      this.setState({dataSource: result.Data})
    })
  }


  //自动查询选择
  handleSelect = (value) => {
    console.log(value)
  }

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const {dataSource} = this.state;
    const children = dataSource.map(({Name, ID}) => {
      return <Option key={ID} value={ID}>{Name}</Option>;
    });

    return (
      <Form layout="inline">
        <FormItem label="学校信息：" validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
          {getFieldDecorator('gid', {
            rules: [{required: true, message: '请输入学校信息'}],
          })(
            <AutoComplete
              dataSource={this.state.dataSource}
              style={{width: 200}}
              onSelect={this.handleSelect}
              onSearch={this.handleSearch}
              placeholder="请输入学校信息"
            >
              {children}
            </AutoComplete>
          )}
        </FormItem>
        <FormItem label="人员信息：" validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('mName', {
            rules: [{required: true, message: '请输入人员信息'}],
          })(
            <Input placeholder="请输入人员信息"/>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
            onClick={this.handleSubmit}
          >
            查询
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ConditionSearch);

