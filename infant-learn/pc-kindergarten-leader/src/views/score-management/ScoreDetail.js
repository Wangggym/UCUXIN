import React from 'react'
import {Table, Pagination, message, Button, Spin} from 'antd'
import api from '../../api'
import SearchDetail from './SearchDetail'
import {Link} from 'react-router-dom'

const timeFormat = 'YYYY-MM-DD'
export default class BuyCourseStatisticsDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      PageSize: 10,
      TotalRecords: 0,
      PageIndex: 1,
      ViewModelList: [],
    }
    this.searchValue = {}
  }

  handleSearchChange = (value) => {
    this.searchValue = {...this.searchValue, ...value}
    this.getTableList()
  }

  handleSearch = () => {
    this.getTableList()
  }

  //获取table列表
  getTableList() {
    this.setState({loading: true})
    const {PageSize, PageIndex} = this.state
    const {year, uid} = this.searchValue
    const data = {PageSize, PageIndex, uid, year}
    for (let key in data) {
      if (!data[key] && data[key] != '0')
        data[key] = ''
    }
    api.ParkInfo.GetPersonalCreditDetail(data).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const ViewModelList = this.tableFormat(res.Data)
        this.setState({ViewModelList})
      } else {
        message.info(res.Msg)
      }
      this.setState({loading: false})
    })
  }

  //转换为table格式
  tableFormat(data) {
    const dataSource = []
    if (!(data && data.length)) return dataSource
    data.forEach((item, index) => {
      dataSource.push({key: index, ...item})
    })
    return dataSource
  }

  handlePageSizeChange = (PageIndex) => {
    this.setState({PageIndex}, () => this.getTableList())
  }

  render() {
    const columns = [
      {
        title: '培训课程',
        dataIndex: 'CourseName',
      },
      {
        title: '所属项目',
        dataIndex: 'TrainPlanName',
      },
      {
        title: '课程学分',
        dataIndex: 'CourseCredit',
      },
      {
        title: '学习时长（分钟）',
        dataIndex: 'LearnDuration',
      },
      {
        title: '考试成绩',
        dataIndex: 'ExamScore',
      },
      {
        title: '补考次数',
        dataIndex: 'MakeUpCount',
      },
      {
        title: '获得学分',
        dataIndex: 'IsGetCredit',
        render: (text) => text === true ? '是' : '否'
      },
      {
        title: '获得学分时间',
        dataIndex: 'GetCreditDate',
      },
    ]
    return (
      <Spin spinning={this.state.loading}>
        <SearchDetail
          onChange={this.handleSearchChange}
          onSearch={this.handleSearch}
          style={{marginBottom: 30}}
          uid={this.props.match.params.uid}
        />
        <Table
          dataSource={this.state.ViewModelList}
          columns={columns}
          pagination={false}
        />
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

