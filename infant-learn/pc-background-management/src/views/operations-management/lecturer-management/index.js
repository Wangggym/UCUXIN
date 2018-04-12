/**
 * Created by QiHan Wang on 2017/8/25.
 * 讲师管理-管理查询页面
 */

import React, {Component} from 'react';
import moment from 'moment';
import {Token} from "../../../utils/token";
import Api from '../../../api';
import './lecturer.scss';

// -- AntDesign Components
import {Form, Input, Button, DatePicker, Table, Icon, Radio, Checkbox, Cascader, Modal, message} from 'antd';

const FormItem = Form.Item;


const dateFormat = 'YYYY-MM-DD';
const token = Token();


class Lecturer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 20
      },
      loading: false,
      visibleModal: false,
    };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'Name'
      },
      {
        title: '手机号码',
        dataIndex: 'TelPhone',
      },
      {
        title: '区域',
        dataIndex: 'Area',
      },
      {
        title: '状态',
        dataIndex: 'AuditSTDesc',
      },
      {
        title: '开课总数（份）',
        dataIndex: 'CourseTotal',
      },
      {
        title: '审核通过率',
        dataIndex: 'PassRate',
      },
      {
        title: '创建时间',
        dataIndex: 'CDate',
      },
      {
        title: '操作',
        width: 180,
        render: (text, record) => (
          <div>

            <a onClick={this.handleShowDetail.bind(this, record)}>详情</a>
            {
              record.IsCreate&&<span className="ant-divider"/>
            }
            {
              record.IsCreate&&<a onClick={this.handleSave.bind(this, 'update', record.ID)}>编辑</a>
            }
            {
              record.IsCreate&&<span className="ant-divider"/>
            }
            {
              record.IsCreate&&<a onClick={this.handleRemove.bind(this, record.ID)}>取消开课</a>
            }

            {/* 暂未开放 */}
            {/*<span className="ant-divider"/>
            <a href="#">课程统计</a>*/}
          </div>
        ),
      }];
  }

  componentDidMount() {
    this.getAreaList();
    this.getLecturerList();
  }


// 动态加载区域数据
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // load options lazily
    this.getAreaList(targetOption);
  }
  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    }, () => console.log(this.state.inputValue));
  }

  // 获取讲师列表
  getLecturerList = (page) => {
    const {current, pageSize} = this.state.pagination;
    const {area, name, eDate, sDate} = this.props.form.getFieldsValue();

    Api.OperationsManagement.getLecturerList({
      token,
      pIndex: page || current,
      pSize: pageSize,
      provinceID: area ? (area[0] || 0) : 0,
      cityID: area ? (area[1] || 0) : 0,
      areaID: area ? (area[2] || 0) : 0,
      name: name || '',
      st: sDate ? moment(sDate).format('YYYY-MM-DD') : '',
      et: eDate ? moment(eDate).format('YYYY-MM-DD') : '',
    }).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {

          const {TotalRecords, ViewModelList, PageIndex} = res.Data;
          const pagination = {...this.state.pagination};
          pagination.total = TotalRecords;
          pagination.current = PageIndex;

          this.setState({
            loading: false,
            data: ViewModelList && ViewModelList.length ? ViewModelList : [],
            pagination
          })
        }
      } else {
        message.error(res.Msg);
      }
    })
  }

  // 按父ID获取省市区
  getAreaList = (targetOption) => {
    Api.OperationsManagement.getAreaList({token, rid: targetOption ? targetOption.value : 0}).then(res => {
      if (targetOption) targetOption.loading = false;
      if (res.Ret === 0) {
        let areas = res.Data.map(item => {
          return {
            value: item.Code,
            label: item.Name,
            isLeaf: item.Type === 3,
          }
        });
        if (targetOption) targetOption.children = areas;
        this.setState({areas: targetOption ? [...this.state.areas] : areas});
      } else {
        message.error(res.Msg);
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});

    this.getLecturerList(pagination.current);
  }

  // 查询讲师
  handleSearch = () => this.getLecturerList(1);
  // 新增修改讲师
  handleSave = (type, id) => {
    console.log(id)
    const {match, history} = this.props;
    const path = {pathname: `${match.url}/${type}-lecturer`}
    if (typeof id === 'string') path.state = {id};
    history.push(path);
  }

  // 重置查询表单
  handleReset = () => this.props.form.resetFields();

  // 删除讲师
  handleRemove = (lecturerID) => Api.OperationsManagement.delLecturer({token, lecturerID}).then(res => {
    if (res.Ret === 0) {
      message.error('删除成功！');
    } else {
      message.error(res.Msg);
    }
  })

  // 查看详细
  handleShowDetail = (record) => Api.OperationsManagement.getLecturer({token, lecturerID: record.ID}).then(res => {
    if(res.Ret === 0){
      this.setState({lecturer: {...res.Data, Area: record.Area}, visibleModal: true})
    }else{
      message.error(res.Msg)
    }
  })

  handleModalOk = () => {
    this.handleSave('update', this.state.lecturer.ID)
  }
  handleModalCancel = () => this.setState({visibleModal: false})

  renderModalDetail = ()=> {
    const {lecturer} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };
    if(this.state.lecturer){
      return <Modal
        title="详细信息"
        visible={this.state.visibleModal}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
        cancelText="关闭"
        okText="编辑"
      >
        <Form layout="horizontal" className="lecturer-detail">
          <FormItem {...formItemLayout} label={'姓名'}>{lecturer.Name}</FormItem>
          <FormItem {...formItemLayout} label={'手机号码'}>{lecturer.TelPhone}</FormItem>
          <FormItem {...formItemLayout} label={'所属区域'}>{lecturer.Area}</FormItem>
          <FormItem {...formItemLayout} label="证件类型">{lecturer.IDTypeDesc}</FormItem>
          <FormItem {...formItemLayout} label="证件号码">{lecturer.CardNo}</FormItem>
          <FormItem{...formItemLayout} label="证件图片">

          {
            lecturer.CardImg.split(',').map(item=> <span className="card-pics" key={item}><img src={item} alt=""/></span>)
          }

            {/*<Modal visible={previewVisible} footer={null} onCancel={this.handleClosePreview}>
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
              </Modal>*/}
          </FormItem>
          <FormItem{...formItemLayout} label="头像"><img src={lecturer.HeadPic} alt="" className="avatar"/></FormItem>
          <FormItem {...formItemLayout} label="讲师身份">{lecturer.LecturerLevelDesc}</FormItem>
          <FormItem {...formItemLayout} label="成就">{lecturer.Achieve || '无'}</FormItem>
          <FormItem {...formItemLayout} label="简介">{lecturer.Instro || '无'}</FormItem>
          <FormItem {...formItemLayout} label="备注">{lecturer.Remark || '无'}</FormItem>
        </Form>
      </Modal>
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {areas, data} = this.state;
    return (
      <div className="lecturer">
        <Form layout="inline" style={{marginBottom: '15px'}}>
          <FormItem label={'姓名'}>{getFieldDecorator(`name`)(<Input placeholder="请填写姓名"/>)}</FormItem>
          <FormItem label={'区域'}>{getFieldDecorator(`area`)(
            <Cascader
              placeholder="选择区域"
              options={areas}
              loadData={this.loadData}
              onChange={this.onChange}
              changeOnSelect
            />
          )}</FormItem>
          <FormItem label="开始日期">{getFieldDecorator(`sDate`)(<DatePicker format={dateFormat}/>)}</FormItem>
          <FormItem label="结束日期">{getFieldDecorator(`eDate`)(<DatePicker format={dateFormat}/>)}</FormItem>
          <FormItem style={{flex: 1, marginRight: 0, textAlign: 'right'}}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.handleSave.bind(this, 'add')}><Icon
              type="plus"/>新增</Button>
          </FormItem>
        </Form>
        <Table
          rowKey="ID"
          bordered
          columns={this.columns}
          dataSource={data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        {this.renderModalDetail()}
      </div>
    )
  }
}

export default Form.create()(Lecturer)
