import React from 'react'
import PropTypes from 'prop-types'
import {Table, Pagination, message, Button, Spin} from 'antd'
import ConditionSearch from './ConditionSearch'
import {Link} from 'react-router-dom'
import api from '../../../api'
import './style.scss'

export default class CourseManagement extends React.Component {
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

  //搜索条件改变
  handleSearchChange = (value) => {
    this.searchValue = {...this.searchValue, ...value}
    this.getTableList()
  }

  //查询
  handleConditionSearch = () => {
    this.getTableList()
  }

  //获取table列表
  getTableList() {
    this.setState({loading: true})
    const {PageSize, PageIndex} = this.state
    const {gardenLevel, name, gardenName} = this.searchValue
    const data = {
      pIndex: PageIndex,
      pSize: PageSize,
      gardenLevel,
      name,
      gardenName,
    }
    for (let key in data) {
      if (!data[key] && data[key] != '0')
        data[key] = ''
    }
    api.OperationsManagement.getPageByCondition(data).then(res => {
      this.setState({loading: false})
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        let {PageIndex, PageSize, Pages, TotalRecords, ViewModelList} = res.Data
        ViewModelList = this.tableFormat(ViewModelList)
        this.setState({TotalRecords, ViewModelList})
      } else {
        message.info(res.Msg)
      }
    })
  }

  //转换为table格式
  tableFormat(data) {
    const dataSource = []
    if (!(data && data.length)) return dataSource
    data.forEach((item, index) => {
      dataSource.push({...item, key: item.ID, order: index + 1})
    })
    return dataSource
  }

  //切换页面
  handlePageSizeChange = (PageIndex) => {
    this.state.PageIndex = PageIndex
    this.getTableList()
  }

  //标记
  handleClickSign = (gardenID) => {
    api.OperationsManagement.setDemonstration({gardenID}).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        message.success('设置成功')
        this.getTableList()
      } else {
        message.info(res.Msg)
      }
    })
  }

  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'order',
      }, {
        title: '园所名称',
        dataIndex: 'Name',
        with: '400px',
        render: (text, {ImgUrl, Name, History}, index) => {
          return (
            <div className='park-info'>
              <img src={ImgUrl} className="clearfix"/>
              <div>
                <div className='title'>{Name}</div>
              </div>
            </div>
          )
        }
      },
      {
        title: '园所介绍',
        dataIndex: 'History',
        key: 'History',
        width:700,
      },
      {
        title: '园长',
        dataIndex: 'GardenName',
        key: 'GardenName',
      },
      {
        title: '园所等级',
        dataIndex: 'GardenLevelDesc',
      },
      {
        title: '操作',
        dataIndex: 'Operation',
        render: (text, record, index) => {
          return <div>
            <Link to={'park-info/' + record.ID}> <Button style={{marginRight: 5}}>查看</Button></Link>
            <Button style={{marginRight: 5}}
                    onClick={() => this.handleClickSign(record.key)}>{record.GardenLevel !== 2 ? '标为示范园' : '取消示范园'}</Button>
          </div>
        }
      }
    ]

    return (
      <Spin spinning={this.state.loading}>
        <ConditionSearch
          onChange={this.handleSearchChange}
          style={{marginBottom: 30}}
          onSearch={this.handleConditionSearch}
        />
        <Table dataSource={this.state.ViewModelList} columns={columns} pagination={false}/>
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
