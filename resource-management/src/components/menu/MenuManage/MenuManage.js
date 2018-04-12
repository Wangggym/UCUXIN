/**
 * Created by YiMin Wang on 2017/8/10.
 */
import React from 'react'
// import PropTypes from 'prop-types'

import ServiceAsync from '../../../common/service';
import urls from './urls'
// -- AntDesign Components
import {Form, Button, Select, Table, Popconfirm, Input, InputNumber, Spin, message} from 'antd';
// -- style
import './style.scss'
import api from '../../../api'
//-- component
import {FormItem as FormTableItem} from '../../../common';

const FormItem = Form.Item
const Option = Select.Option
const cssRoot = 'MenuManage'
const menuType = [,'菜单', '按钮']
//const menuType = ['菜单']

const getType = (type) => {
  const array = []
  type.forEach((item, index) => {
    array.push(<Option value={index} key={index}>{item}</Option>)
  })
  return array
}

//根据中文获取typeID
const getThisType = (typeName, menuType) => {
  let type = null
  menuType.forEach((item, index) => {
    if (typeName === item) type = index
  })
  return type
}

//初始化添加表
const initialEditorDate = (type) => {
  return {Name: null, Type: type[0], Url: null, AppID: null}
}

const statusType = {
  ADDTOPMENU: '新增顶级菜单',
  MODIFY: '编辑',
  ADDSUBLEVEL: '新增子级',
}

class MenuManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,                             //数据请求状态
      searchValue: {appID: '', name: '',},        //搜索关键字
      editorDate: initialEditorDate(menuType),    //编辑字段
      dataSource: [],                             //table所用数据
      status: null,                               //当前状态
      expandedRowKeys: [],                        //展开的行
    }
    this.prototypeDataSource = []                 //备份原始数据
  }

  componentDidMount() {
    this.getTableList()
  }

  //获取table列表
  getTableList(searchValue = this.state.searchValue) {
    this.setState({loading: true})
    const {appID = '', name = ''} = searchValue
    api.Menu.Authority_GetAuthorList({appID, name}).then(res => {
      if (!res) {
        this.setState({loading: false})
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const dataSource = this.tableFormat(res.Data)
        this.prototypeDataSource = res.Data
        this.setState({dataSource, loading: false})
      } else {
        message.info(res.Msg)
      }
    })
  }

  //检查状态
  checkStatus() {
    const {status} = this.state
    if (this.state.status) return `请先完成${statusType[status]}`
  }

  //获取搜索字段
  getUrlFields(searchValue) {
    const {appID, name} = searchValue
    return searchValue
  }

  //转为话table格式
  tableFormat(data) {
    const dataSource = []
    if (!(data && data.length)) return dataSource
    data.forEach(({ID, PID, Instro, Level, ChildList, Name, Type, Url, AppID}, index, array) => {
      dataSource.push({
        key: ID,
        Name, Type: menuType[Type], Url, AppID,
        children: (ChildList && ChildList.length) ? this.tableFormat(ChildList) : '',
        prototypeData: array[index],
      })
    })
    return dataSource
  }

  //条件搜索
  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({searchValue: values, status: null})
        this.getTableList(values)
      }
    });
  }

  //新增顶级菜单
  handleAddTopMenu = () => {
    const toDo = this.checkStatus()
    if (toDo) return message.info(toDo)
    const newDataSource = [...this.state.dataSource]
    newDataSource.unshift(this.tableEditor())
    this.setState({dataSource: newDataSource, status: 'ADDTOPMENU'})
  }

  //新增子级
  handleAddSublevel = (record) => {
    const toDo = this.checkStatus()
    if (toDo) return message.info(toDo)
    const parentData = {PID: record.prototypeData.ID, Level: record.prototypeData.Level + 1}
    if (record.children && record.children.length) {
      record.children.unshift(this.tableEditor(null, parentData));
    } else {
      record.children = [this.tableEditor(null, parentData)]
    }
    const {expandedRowKeys} = this.state
    const NewExpandedRowKeys = [...expandedRowKeys, record.key]
    this.setState({dataSource: this.state.dataSource, status: 'ADDSUBLEVEL', expandedRowKeys: NewExpandedRowKeys})
  }

  //编辑
  handleModify = (record) => {
    const toDo = this.checkStatus()
    if (toDo) return message.info(toDo)
    const {Name, Type, Url, AppID, Operation} = this.tableEditor(record, {...record.prototypeData})
    record.Name = Name
    record.Type = Type
    record.Url = Url
    record.AppID = AppID
    record.Operation = Operation
    this.setState({dataSource: this.state.dataSource, status: 'MODIFY'})
  }

  //保存
  handleSave = (parentData) => {
    const {editorDate, status} = this.state
    let defaultValue = {ID: 0, PID: 0, Instro: '', Level: 0, ChildList: '',}
    if (parentData) defaultValue = {...defaultValue, ...parentData}
    const body = {...defaultValue, ...editorDate}
    api.Menu.Authority_AddOrEditAuthor({body}).then(res => {
      if (res.Ret === 0) {
        this.getTableList()
        message.success(`${statusType[status]}成功`)
        this.setState({editorDate: initialEditorDate(menuType), status: null})
      } else {
        message.info(res.Msg)
      }
    })
    console.log(body)

  }

  //取消
  handleCancel() {
    const dataSource = this.tableFormat(this.prototypeDataSource)
    this.setState({dataSource, status: null})
  }

  //编辑中的值改变
  handleValueChange = (field, value) => {
    const editorDate = this.state.editorDate
    this.setState({editorDate: {...editorDate, [field]: value}})
  }

  //编辑项
  tableEditor = (editorDate, parentData) => {
    if (editorDate) {
      const {Name, Type, Url, AppID} = editorDate
      this.setState({editorDate: {Name, Type:getThisType(editorDate.Type, menuType), Url, AppID}})
    } else {
      editorDate = initialEditorDate(menuType)
    }
    return {
      key: '-1',
      Name: <FormTableItem label="名称：">
        <Input
          style={{width: 120}}
          onChange={(e) => {
            this.handleValueChange('Name', e.target.value)
          }}
          defaultValue={editorDate.Name}
        />
      </FormTableItem>,
      Type: <FormTableItem label="类型：">
        <Select
          style={{width: 120}}
          onChange={(value) => {
            this.handleValueChange('Type', value)
          }}
          defaultValue={getThisType(editorDate.Type, menuType)}
        >
          {getType(menuType)}
        </Select>
      </FormTableItem>,
      Url: <FormTableItem label="地址（URL）：">
        <Input
          style={{width: 120}}
          onChange={(e) => {
            this.handleValueChange('Url', e.target.value)
          }}
          defaultValue={editorDate.Url}
        />
      </FormTableItem>,
      AppID: <FormTableItem label="APPID：">
        <InputNumber
          style={{width: 120}}
          onChange={(value) => {
            this.handleValueChange('AppID', value)
          }}
          defaultValue={editorDate.AppID}
        />
      </FormTableItem>,
      Operation: <div>
        <Button type="primary" onClick={() => this.handleSave(parentData)}>保存</Button>
        <Button type="primary" onClick={this.handleCancel.bind(this)} style={{marginLeft: 5}}>取消</Button>
      </div>,
    }
  }

  //点击展开
  handleExpandedRowsChange = (expandedRowKeys) => {
    this.setState({expandedRowKeys})
  }

  //删除确认
  handleConfirm = (record) => {
    console.log(record)
    message.info('暂无API')
  }

  render() {
    const {dataSource} = this.state
    const {getFieldDecorator} = this.props.form;
    const columns = [
      {title: '名称', dataIndex: 'Name', width: '20%',},
      {title: '类型', dataIndex: 'Type', width: '20%',},
      {title: '地址（URL）', dataIndex: 'Url', width: '20%',},
      {title: 'APPID', dataIndex: 'AppID', width: '20%',},
      {
        title: '操作', dataIndex: 'Operation', width: '20%', render: (text, record, index) => {
        if (!text) {
          return <div>
            <Button type="primary" onClick={() => {
              this.handleModify(record)
            }}>编辑</Button>
            {/* <Popconfirm title={`确定要删除‘${record.Name}’吗？`} onConfirm={() => this.handleConfirm(record)}>
                <Button type="primary" style={{ marginLeft: 5 }}>删除</Button>
              </Popconfirm> */}
            <Button type="primary" onClick={() => {
              this.handleAddSublevel(record)
            }} style={{marginLeft: 5}}>新增子级</Button>
          </div>
        }
        return text
      }
      },
    ]

    return (
      <Spin spinning={this.state.loading}>
        <Form layout="inline" className={`${cssRoot}-form`}>
          <FormItem label={'菜单名称'}>
            {getFieldDecorator('name')(
              <Input/>
            )}
          </FormItem>
          <FormItem label={'应用APPID'}>
            {getFieldDecorator('appID')(
              <Input/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button style={{marginLeft: 8}} type="primary"
                    onClick={this.handleAddTopMenu}>新增顶级菜单</Button>
          </FormItem>
        </Form>
        <Table
          dataSource={dataSource}
          columns={columns}
          className={`${cssRoot}-table`}
          onExpandedRowsChange={this.handleExpandedRowsChange}
          expandedRowKeys={this.state.expandedRowKeys}/>
      </Spin>
    )
  }
}

//限定控件传入的属性类型
// MenuManage.propTypes = {

// }

//设置默认属性
// MenuManage.defaultProps = {

// }
export default Form.create()(MenuManage)
