import React from 'react'
import PropTypes from 'prop-types'
import {Table, Pagination, message, Button, Spin} from 'antd'
import Search from './Search'
import api from '../../../api'
import DetailsModal from './DetailsModal'

const timeFormat = 'YYYY-MM-DD'

const TeachWayType = [, '录播', '直播', '线下面授']
const AuditSTType = [, '待审核', '审核驳回', '审核通过', '免审']
export default class CourseManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      PageSize: 10,
      TotalRecords: 0,
      PageIndex: 1,
      dataSource: [],
    }
    this.searchValue = {}
  }

  handleSearchChange = (value) => {
    this.searchValue = {...this.searchValue, ...value}
    const field = []
    for (let key in value) {
      field.push(key)
    }
    if (field.length === 1 && field[0] === 'name') return
    this.getTableList()
  }

  handleSearch = () => {
    this.getTableList()
  }

  //获取table列表
  getTableList() {
    this.setState({loading: true})
    const {PageSize, PageIndex} = this.state
    const {CourseType, teachWay, auditSTID, name, times} = this.searchValue
    const st = times && times.length !== 0 ? times[0].format(timeFormat) : undefined
    const et = times && times.length !== 0 ? times[1].format(timeFormat) : undefined
    const data = {
      pIndex: PageIndex,
      pSize: PageSize,
      CourseType,
      teachWay,
      auditSTID,
      name,
      st,
      et,
    }
    for (let key in data) {
      if (!data[key] && data[key] != '0')
        data[key] = ''
    }
    api.CourseManagement.GetPageByCondition(data).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const {ViewModelList, PageSize, TotalRecords, PageIndex} = res.Data
        const dataSource = this.tableFormat(ViewModelList)
        this.setState({dataSource, PageSize, TotalRecords, PageIndex})
      } else {
        message.info(res.Msg)
      }
      this.setState({loading: false})
    })
  }

  //转换为table格式
  tableFormat(data) {
    const dataSource = []
    if (!data.length) return dataSource
    data.forEach((item, index) => {
      dataSource.push({key: item.ID, order: index + 1, ...item,})
    })
    return dataSource
  }

  handlePageSizeChange = (PageIndex) => {
    this.state.PageIndex = PageIndex
    this.getTableList()
  }

  handleSoldOut = (courseID, CourseST) => {
    const status = CourseST !== 1 ? '上线' : '下架'
    api.CourseManagement.DownCourse({courseID}).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        message.success(status + '成功')
      } else {
        message.info(res.Msg)
      }
      this.getTableList()
    })
  }
  handleCallback = () => {
    this.getTableList()
  }

  render() {
    const columns = [
      {
        title: '参培学员名称',
        dataIndex: 'order',
      }, {
        title: '名称',
        dataIndex: 'Name',
      }, {
        title: '授课方式',
        dataIndex: 'TeachWay',
        render: (text) => TeachWayType[text]
      }, {
        title: '培训计划名称',
        dataIndex: 'TrainPlanName',
      }, {
        title: '授课老师名称',
        dataIndex: 'LecturerName',
      }, {
        title: '学分',
        dataIndex: 'Credit',
      }, {
        title: '创建时间',
        dataIndex: 'CDate',
      }, {
        title: '状态',
        dataIndex: 'AuditSTDesc',
      }, {
        title: '上线状态',
        dataIndex: 'CourseST',
        render: (text) => text === 1 ? '已上线' : '已下架'
      },
      {
        title: '操作',
        dataIndex: 'Operation',
        render: (text, record, index) => {
          return <div>
            <DetailsModal title='查看详情' courseID={record.key} checkStatus={record.AuditST == '30'}
                          callback={this.handleCallback}>
              <Button style={{marginRight: 5}}>查看详情</Button>
            </DetailsModal>
            {
              record.AuditST == '30' &&
              <DetailsModal title='审核' courseID={record.key} checkStatus={true} callback={this.handleCallback} check>
                <Button style={{marginRight: 5}}>审核</Button>
              </DetailsModal>
            }
            <Button style={{marginRight: 5}}
                    onClick={() => this.handleSoldOut(record.key, record.CourseST)}>{record.CourseST !== 1 ? '上线' : '下架'}</Button>
          </div>
        }
      }
    ];

    return (
      <Spin spinning={this.state.loading}>
        <Search onChange={this.handleSearchChange} onSearch={this.handleSearch} style={{marginBottom: 30}}/>
        <Table dataSource={this.state.dataSource} columns={columns} pagination={false}/>
        <div style={{paddingTop: 20, textAlign: 'right'}}>
          <Pagination
            showTotal={total => `共 ${total} 条`}
            total={this.state.TotalRecords}
            current={this.state.PageIndex}
            pageSize={this.state.PageSize}
            onChange={this.handlePageSizeChange}
            showQuickJumper={this.state.TotalRecords > 10}
          />
        </div>
      </Spin>
    )
  }
}

//限定控件传入的属性类型
CourseManagement.propTypes = {}

//设置默认属性
CourseManagement.defaultProps = {}
