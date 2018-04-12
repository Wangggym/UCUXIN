import React from 'react'
import PropTypes from 'prop-types'

import ServiceAsync from '../../../common/service';
import urls from './urls'
// -- AntDesign Components
import {Button, Select, Spin, message, Row, Col, Modal, Card, Tag} from 'antd';
// -- style
import './style.scss'
import {FormItem as FormTableItem} from '../../../common';
import SelectCard from './SelectCard'
import api from '../../../api'
import ConditionSearch from './ConditionSearch'

const menuType = ['菜单', '按钮']
const cssRoot = 'UserSet'
const Option = Select.Option

class UserSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,                             //数据请求状态
      visible: false,                             //弹窗状态
      orgUser: [],                                //当前组织机构用户列表
      checkedUser: [],                            //当前选中的用户
    }
  }

  //查询时
  handleSearch = (values) => {
    api.Menu.GetPageMembers({...values, isOnlyUser: true}).then(result => {
      if (!result) return message.info('res为空')
      if (result.Msg) return message.error(result.Msg)
      this.setState({orgUser: result.Data.ViewModelList})
    })
  }

  //弹出modal请求orgNodess
  showModal = () => {
    // api.Menu.Org_GetOrgList({type: 0}).then(result => {
    //   if (!result) return message.info('res为空')
    //   if (result.Msg) return message.error(result.Msg)
    //   this.getOrgNodes(result.Data)
    // })
    this.setState({visible: true})
    this.getRoleUser()
  }

  // //格式化orgNodes
  // getOrgNodes = (data) => {
  //   const orgNodes = []
  //   let orgValue = ''
  //   data.forEach(({Name, OrgID}, index) => {
  //     if (index === 0) orgValue = OrgID
  //     orgNodes.push(<Option value={OrgID} key={OrgID}>{Name}</Option>)
  //   })
  //   this.setState({orgNodes, orgValue})
  //   this.getOrgUser(orgValue)
  // }

  // // 选择org改变时
  // handleOrgChange = (orgValue) => {
  //   this.setState({orgValue})
  //   this.getOrgUser(orgValue)
  //   // this.setState({ checkedUser: this.state.roleUser })
  // }

  // //获取组织下的所有用户
  // getOrgUser(orgValue) {
  //   this.setState({loading: true})
  //   api.Menu.Org_GetSimpleOrgUsers({orgid: orgValue}).then(result => {
  //     if (!result) return message.info('res为空')
  //     if (result.Msg) return message.error(result.Msg)
  //     this.setState({orgUser: result.Data, loading: false})
  //   })
  // }

  // GET_根据角色获取人员
  getRoleUser() {
    this.setState({loading: true})
    api.Menu.Authority_GetUserRoleListByID({roleID: this.props.ID}).then(result => {
      if (!result) return message.info('res为空')
      if (result.Msg) return message.error(result.Msg)
      this.setState({loading: false, checkedUser: this.changeMethod(result.Data)})
    })
  }

  //=。=！UName转MName
  changeMethod(data) {
    const newData = []
    data && data.length && data.map(item => {
      newData.push({...item, MName: item.UName})
    })
    return newData
  }


  //确定时
  handleOnOk = () => {
    const {checkedUser} = this.state
    const {ID} = this.props
    const UserRoleList = []
    checkedUser.forEach(item => {
      item.ID = '0'
      item.RoleID = ID
      const newItem = {...item, ID: '0', RoleID: ID}
      UserRoleList.push(newItem)
    })
    const body = {
      "RoleID": ID,
      UserRoleList
    }
    this.setState({loading: true})
    api.Menu.Authority_AddUserRole({body}).then(res => {
      this.setState({loading: false, visible: false, orgUser: []})
      if (res.Ret === 0) {
        message.success('修改成功')
      } else {
        message.info(res.Msg)
      }
    })

  }

  // 取消关闭时
  handleCancel = () => {
    this.setState({visible: false, orgUser: []})

  }

  //重置
  handleReset = () => {
    this.setState({checkedUser: []})
    // message.success('成功')
  }

  // 点击tag,user标签时
  handleSelectCardChange = (fields, user) => {
    const {checkedUser} = this.state
    let newCheckedUser = null
    switch (fields) {
      case 'add':
        newCheckedUser = [...checkedUser, user]
        break
      case 'remove':
        newCheckedUser = checkedUser.filter(({UID}) => (UID !== user.UID))
        break
    }
    this.setState({checkedUser: newCheckedUser})
  }

  //未被选中的人员
  uncheckedUser() {
    const {checkedUser, orgUser} = this.state
    const array = orgUser.filter(({UID}) => {
      let ischecked = false
      for (let i = 0; i < checkedUser.length; i++) {
        if (checkedUser[i].UID === UID) {
          ischecked = true
          break
        }
      }
      return !ischecked
    })
    return array
  }

  render() {
    const {checkedUser, orgUser} = this.state
    const checkedTitle = (
      <div className='checkedTitle'>
        <span>已选者人员</span>
        <Button onClick={this.handleReset}>清空</Button>
      </div>
    )
    return (
      <span onClick={this.showModal}>
                {this.props.children}
        <Modal
          width='1000px'
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
          title='用户设置'
          visible={this.state.visible}>
                    <Spin spinning={this.state.loading}>
                        <Card bordered={false} noHovering>
                            <Row>
                              {this.state.visible && <ConditionSearch onSearch={this.handleSearch}/>}
                            </Row>
                            <Row>
                                <Col span={11}>
                                    <SelectCard onClick={(user) => this.handleSelectCardChange('add', user)}
                                                tagData={this.uncheckedUser()} title='未选者人员'/>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={11}>
                                    <SelectCard onClick={(user) => this.handleSelectCardChange('remove', user)}
                                                tagData={this.state.checkedUser} title={checkedTitle}/>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
                </Modal>
            </span>

    )
  }
}

//限定控件传入的属性类型
UserSet.propTypes = {}

//设置默认属性
UserSet.defaultProps = {}
export default UserSet
