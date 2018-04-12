import React from 'react'
import {Table, Pagination, message, Button, Spin} from 'antd'
import api from '../../api'
// import SearchDetail from './SearchDetail'
import {Link} from 'react-router-dom'
const SearchDetail=()=><div>SearchDetail</div>
const timeFormat = 'YYYY-MM-DD'
export default class TrainLearnManagement extends React.Component {
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
    const {sDate, eDate} = this.searchValue
    const formatsDate = sDate.format(timeFormat)
    const formateDate = eDate.format(timeFormat)
    const data = {PageSize, PageIndex, sDate: formatsDate, eDate: formateDate, UID: this.props.match.params.uid}
    for (let key in data) {
      if (!data[key] && data[key] != '0')
        data[key] = ''
    }
    api.ParkInfo.GetGardenCourseLearn(data).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const ViewModelList = this.tableFormat(res.Data)
        this.setState({ ViewModelList})
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
        title: '课程名称',
        dataIndex: 'CourseName',
      }, {
        title: '课程类型',
        dataIndex: 'CourseTypeName',
      }, {
        title: '购买金额',
        dataIndex: 'Price',
      }, {
        title: '购买时间',
        dataIndex: 'PurchaseDate',
      },
    ]
    return (
      <Spin spinning={this.state.loading}>
        <SearchDetail
          onChange={this.handleSearchChange}
          onSearch={this.handleSearch}
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

