import React from 'react'
import {Table, Pagination, message, Button, Spin} from 'antd'
import api from '../../api'
import Search from './Search'
import {Link} from 'react-router-dom'

const timeFormat = 'YYYY-MM-DD'
export default class BuyCourseStatistics extends React.Component {
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
    const {courseType, roleID, sDate, eDate} = this.searchValue
    const formatsDate = sDate.format(timeFormat)
    const formateDate = eDate.format(timeFormat)
    const data = {PageSize, PageIndex, courseType, roleID, sDate: formatsDate, eDate: formateDate}
    for (let key in data) {
      if (!data[key] && data[key] != '0')
        data[key] = ''
    }
    api.ParkInfo.GetGardenCoursePurchase(data).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        const ViewModelList = this.tableFormat(res.Data.ViewModelList)
        this.setState({...res.Data, ViewModelList})
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
    const columnsMonth = {}
    data.forEach((item, index) => {
      const PurchaseJson = JSON.parse(item.PurchaseJson)
      const PurchaseJsonData = {}
      if (PurchaseJson && PurchaseJson.length) {
        PurchaseJson.forEach(({Month, Amount}) => {
            PurchaseJsonData['Month_' + Month] = Amount
            columnsMonth['Month_' + Month] = Amount
          }
        )
      }
      dataSource.push({key: index, ...item, ...PurchaseJsonData})
    })
    this.setState({columnsMonth})
    return dataSource
  }

  handlePageSizeChange = (PageIndex) => {
    this.setState({PageIndex}, () => this.getTableList())
  }

  getColumns = (columnsMonth) => {
    const newcolumnsMonth = []
    for (let key in columnsMonth) {
      newcolumnsMonth.push({title: key.slice(6) + '月', dataIndex: key, render: (text) => text ? text.toFixed(2) : null})
    }
    const columns = [
      {
        title: '参培学员名称',
        dataIndex: 'UName',
      }, {
        title: '职务',
        dataIndex: 'RoleName',
      }, {
        title: '累计总学分',
        dataIndex: 'QtyCourse',
      }, {
        title: '累计购买金额',
        dataIndex: 'QtyAmount',
        render: (text) => text ? text.toFixed(2) : null
      },
      ...newcolumnsMonth,
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => <Link to={`/BuyCourseStatisticsDetail/${record.UID}`}>查看详情</Link>
      }
      ]
    return columns
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
        <Search onChange={this.handleSearchChange} onSearch={this.handleSearch} style={{marginBottom: 30}}/>
        <Table dataSource={this.state.ViewModelList} columns={this.getColumns(this.state.columnsMonth)}
               pagination={false}/>
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

