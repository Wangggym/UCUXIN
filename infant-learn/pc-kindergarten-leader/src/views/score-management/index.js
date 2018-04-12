import React from 'react'
import {Table, Pagination, message, Button, Spin} from 'antd'
import api from '../../api'
import {Link} from 'react-router-dom'

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
  }

  componentDidMount() {
    this.getTableList()
  }

  //获取table列表
  getTableList() {
    this.setState({loading: true})
    const {PageSize, PageIndex} = this.state
    // const {courseType, roleID, sDate, eDate} = this.searchValue
    // const formatsDate = sDate.format(timeFormat)
    // const formateDate = eDate.format(timeFormat)
    const data = {PageSize, PageIndex}
    // for (let key in data) {
    //   if (!data[key] && data[key] != '0')
    //     data[key] = ''
    // }
    api.ParkInfo.GetPersonalCreditByGarden(data).then(res => {
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
    const columnsYear = {}
    data.forEach((item, index) => {
      const CreditJson = JSON.parse(item.CreditJson)
      const CreditJsonData = {}
      if (CreditJson && CreditJson.length) {
        CreditJson.forEach(({Year, Total}) => {
            CreditJsonData['Year_' + Year] = Total
            columnsYear['Year_' + Year] = Total
          }
        )
      }
      dataSource.push({key: index, ...item, ...CreditJsonData})
    })
    this.setState({columnsYear})
    return dataSource
  }



  handlePageSizeChange = (PageIndex) => {
    this.setState({PageIndex}, () => this.getTableList())
  }

  getColumns = (columnsYear) => {
    const newColumnsYear = []
    for (let key in columnsYear) {
      newColumnsYear.push({title: key.slice(5) + '年学分', dataIndex: key, render: (text) => text ? text.toFixed(2) : null})
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
        dataIndex: 'TotalCredit',
      },
      ...newColumnsYear,
     {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => <Link to={`/ScoreDetail/${record.UID}`}>查看详情</Link>
      }
    ]
    return columns
  }

  render() {

    return (
      <Spin spinning={this.state.loading}>
        <Table dataSource={this.state.ViewModelList} columns={this.getColumns(this.state.columnsYear)}
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

