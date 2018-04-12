import React from 'react'
import {Row, Col, message, Button, Table, Spin, Popconfirm} from 'antd'
import api from '../../../api'
import Tree from './Tree'
import AdminEditor from './AdminEditor'
import {connect} from 'react-redux'

const ManageLevelType = [, '运营者', '省管理员', '市管理员', '区县管理员']

class NewPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      AreaID: '',
      loading: false,
      dataSource: [],
    }
  }

  componentWillMount() {

  }

  //获取table列表
  getTableList(AreaID = this.state.AreaID) {
    this.setState({loading: true})
    api.AuthorityManagement.GetMangeListByAreaID({AreaID}).then(res => {
      if (!res) {
        this.setState({loading: false})
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const dataSource = this.tableFormat(res.Data)
        this.setState({dataSource, loading: false})
      } else {
        message.info(res.Msg)
      }
    })
  }

  tableFormat(data) {
    const dataSource = []
    if (!data || data.length === 0) return dataSource
    data.forEach((item) => {
      dataSource.push({key: item.ID, ...item})
    })
    return dataSource
  }

  handleAreaChange = (AreaID) => {
    if (AreaID && AreaID !== this.state.AreaID) {
      console.log(AreaID)
      this.setState({AreaID})
      this.getTableList(AreaID)
    }
  }

  handleCallback = () => {
    this.getTableList()
  }

  //删除
  handleDeleteClick(ManageID) {
    this.setState({loading: true})
    api.AuthorityManagement.DelMangeByID({ManageID}).then(res => {
      if (!res) {
        this.setState({loading: false})
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        this.getTableList()
      } else {
        message.info(res.Msg)
      }
    })
  }

  render() {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'Name',
      }, {
        title: '手机号码',
        dataIndex: 'Tel',
      },
      {
        title: '所在地区',
        dataIndex: 'AreaName',
      },
      {
        title: '管理级别',
        dataIndex: 'ManageLevel',
        render: (text, record, index) => ManageLevelType[record.ManageLevel]
      }, {
        title: '操作',
        dataIndex: 'Operation',
        render: (text, record, index) => (
          <Popconfirm title={`确定要删除‘${record.Name}’吗？`} onConfirm={() => this.handleDeleteClick(record.key)}>
            <Button type='primary'>删除</Button>
          </Popconfirm>
        )
      }
    ];

    return (
      <Row>
        <Col span={3} style={{height: '600px', overflow: 'auto', border: '2px #ccc solid'}}>
          <Tree onChange={this.handleAreaChange}/>
        </Col>
        <Col span={1}>
        </Col>
        <Col span={20}>
          <Spin spinning={this.state.loading}>
            <div style={{marginBottom: '20px'}}>
              <AdminEditor callback={this.handleCallback} AreaID={this.state.AreaID}>
                <Button type='primary'>添加区域培训管理员</Button>
              </AdminEditor>
            </div>
            <Table dataSource={this.state.dataSource} columns={columns}/>
          </Spin>
        </Col>
      </Row>
    )
  }
}

//限定控件传入的属性类型
NewPage.propTypes = {}

//设置默认属性
NewPage.defaultProps = {}

function mapStateToProps(state) {
  return {
    counter: state.isEdit
  }
}

export default connect(mapStateToProps)(NewPage)
