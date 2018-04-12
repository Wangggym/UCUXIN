/**
 *  Create by xj on 2017/11/21.
 *  fileName: index
 */
import React, {Component} from 'react';
import {Form, Input, Button, Select, message, Table} from 'antd';
import {Token} from "../../../../utils";
import Api from '../../../../api';

const token = Token();
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class UserNumCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: [],//用户角色
    };
    this.columns = [
      {
        title: '用户名称',
        dataIndex: 'CourseName',

      }, {
        title: '用户角色',
        dataIndex: 'CourseName',

      }, {
        title: '所属区域',
        dataIndex: 'CourseName',

      }, {
        title: '机构名称',
        dataIndex: 'CourseName',

      }, {
        title: '手机号码',
        dataIndex: 'CourseName',
      },
      {
        title: '用户状态',
        dataIndex: 'CourseName',
      },
    ]
  }

  componentDidMount() {
    //获取角色
    Api.CourseManagement.GetSchMemberRoles({token}).then(res=>{
      if(res.Ret===0){
        this.setState({
          role:res.Data
        })
      }else {
        message.warning(res.Msg)
      }
    })
  }


  //查询
  handleSearch = (e) => {
    this.setState({loading: true});
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          courseType: values.CourseType || 0,
          courseName: values.courseName || "",
          teachWay: values.TeachWay || 0,
        }),
        pagination: Object.assign({}, this.state.pagination, {
          current: 1,
        })
      }, () => this.getPageData(this.state.queryFields))
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {role} = this.state;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    return (
      <div className="userNum-count">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label={'用户角色'}>
            {getFieldDecorator(`TeachWay`, {initialValue: "0"})(
              <Select
                style={{width: 150}}
                placeholder="授课方式"
                optionFilterProp="children"
                onChange={() => {
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="0">全部</Option>
                {
                  role.map((item, key) => {
                    return (
                      <Option value={item.Value} key={key}>{item.Text}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem style={{marginLeft: "2.2rem"}} label="关键字查询">
            {getFieldDecorator(`keyword`)(
              <Input placeholder="请输入关键字查询"/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
          </FormItem>

          <Table rowKey="PlanID" bordered columns={this.columns}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 pagination={this.state.pagination}
            //dataSource={this.state.dataSource.ViewModelList}
                 onChange={(pagination, filters, sorter) => {
                   this.onChangePage(pagination, filters, sorter)
                 }}
          />
        </Form>
      </div>
    )
  }
}

export default Form.create()(UserNumCount);
