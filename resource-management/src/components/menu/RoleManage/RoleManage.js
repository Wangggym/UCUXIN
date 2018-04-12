/**
 * Created by YiMin Wang on 2017/8/14.
 */
import React from 'react'
import PropTypes from 'prop-types'

import ServiceAsync from '../../../common/service';
import urls from './urls'
// -- AntDesign Components
import { Form, Button, Select, Table, Popconfirm, Input, InputNumber, Spin, message, Row, Col } from 'antd';
// -- style
import './style.scss'
import AddRole from './AddRole'
import SearchWidget from './SearchWidget'
import MenuSet from './MenuSet'
import UserSet from './UserSet'
import api from '../../../api'
const roleType = ['超级管理员', '管理员', '用户']
const getRoleType = (roleType) => {
  const array = []
  roleType.forEach((item, index) => {
    array.push(<Option value={index} key={index}>{item}</Option>)
  })
  return array
}

const cssRoot = 'RoleManage'
const Option = Select.Option
const FormItem = Form.Item
class RoleManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,                             //数据请求状态
      searchValue: { name: '', },               //搜索关键字
      dataSource: [],                             //table所用数据
    }
  }

  componentDidMount() {
    this.getTableList()
  }

  //获取table列表
  getTableList(searchValue = this.state.searchValue) {
    this.setState({ loading: true })
    const { name = '' } = searchValue
    api.Menu.Authority_GetRolePage({ name }).then(res => {
      if (!res) {
        this.setState({ loading: false })
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const dataSource = this.tableFormat(res.Data)
        this.setState({ dataSource, loading: false })
      } else {
        message.info(res.Msg)
      }
    })
  }

  //转为为table格式
  tableFormat(data) {
    const dataSource = []
    if (!(data && data.length)) return dataSource
    data.forEach(({ ID, Name, Type, Memo }, index, array) => {
      dataSource.push({
        key: ID, Name, Type: roleType[Type], prototypeData: array[index],
      })
    })
    return dataSource
  }

  //获取搜索字段
  getUrlFields(searchValue) {
    const { name } = searchValue
    return searchValue
  }

  //条件搜索
  handleSearch = (searchValue) => {
    this.setState({ searchValue })
    this.getTableList(searchValue)
  }

  //新增角色
  handleAddRole = () => {

  }

  //callback 
  handleCallback = (result) => {
    message.success(`${result.operationType}成功`)
    this.getTableList()
  }

  //设置菜单
  handleSetMenu(ID) {

  }
  render() {
    const columns = [
      { title: '角色名称', dataIndex: 'Name', width: '25%', },
      { title: '类型', dataIndex: 'Type', width: '25%', },
      {
        title: '菜单设置', dataIndex: 'menuSet', width: '25%', render: (text, record, index) =>
          <MenuSet ID={record.key}>
            <Button type="primary">设置</Button>
          </MenuSet>
      },
      {
        title: '用户设置', dataIndex: 'userSet', width: '25%', render: (text, record, index) =>
          <UserSet ID={record.key}>
            <Button type="primary">设置</Button>
          </UserSet>
      },
    ]
    return (
      <Spin spinning={this.state.loading}>
        <Row>

          <Col span={22}><SearchWidget onSearch={this.handleSearch} /></Col>
          <Col span={2} style={{ textAlign: 'right' }}>
            <AddRole
              callback={this.handleCallback}>
              <Button style={{ marginLeft: 8 }} type="primary" size='large'>新增</Button>
            </AddRole>
          </Col>
        </Row>
        <Table
          className={`${cssRoot}-table`}
          dataSource={this.state.dataSource}
          columns={columns}
        />
      </Spin>
    )
  }
}

//限定控件传入的属性类型
RoleManage.propTypes = {

}

//设置默认属性
RoleManage.defaultProps = {

}
export default RoleManage