/**
 * Created by xj on 2017/7/13.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';

// -- Custom Components
import SelectTableCell from '../../../common/components/SelectTableCell';
import AddDimension from './AddDimension';

// -- AntDesign Components
import {Form, Button, Select, Table, Popconfirm,message} from 'antd';

const FormItem = Form.Item;

const Option = Select.Option;

// -- Token Configuration
const token = Token();


class DimensionManagement extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getPageByCondition = this.getPageByCondition.bind(this);

    this.columns = [
      {
        title: '学段',
        dataIndex: 'stage',
        key: 'stage',
        width: '20%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'stage', text, this.state.phase, this.getTGradeList),
      },
      {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
        width: '20%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'grade', text, this.state.grade),
      },
      {
        title: '科目',
        dataIndex: 'subject',
        key: 'subject',
        width: '20%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'subject', text, this.state.subject),
      },
      {
        title: '出版社',
        dataIndex: 'publish',
        key: 'publish',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'publish', text, this.state.publisher),
      },
      {
        title: '操作',
        key: 'operation',
        width: '160px',
        render: (text, record, index) => {
          const {editable} = this.state.data[index].stage;
          return (
            <div className="editable-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.editDone(index, 'save')}>保存</a>
                  <Popconfirm title="确定取消？" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                  :
                  <span>
                  <a onClick={() => this.edit(index)}>编辑</a>
                  </span>
              }
              <span><a onClick={() => this.handlerRowClick(record)}>详细</a></span>
            </div>
          );
        },
      },
    ];
    this.state = {
      data: [],
      phase: [],
      grade: [],
      sGrade:[],
      subject: [],
      publisher: [],
      searchParams: {
        phaseID: 0,
        gradeID: 0,
        subjectID: 0,
        publisherID: 0
      },
      pagination: {pageSize: 10, current: 1},
      loading: false,

      visible: false,
    }
  }

  componentDidMount() {
    // 获取基础数据
    (async () => {
      let [phase, subject, publisher] = await Promise.all([
        ServiceAsync('GET', 'Resource/v3/Property/GetPhaseList', {token}),
        ServiceAsync('GET', 'Resource/v3/Property/GetSubjectList',{token}),
        ServiceAsync('GET', 'Resource/v3/Property/GetPublisherList',{token})
      ]);

      this.setState({
        phase: phase.Ret === 0 ? phase.Data : [],
        subject: subject.Ret === 0 ? subject.Data : [],
        publisher: publisher.Ret === 0 ? publisher.Data : []
      })
    })();

    // 获取基础维度数据列表
    const {pageSize, current} = this.state.pagination;
    this.getPageByCondition(current, pageSize);
  }

  handlePhaseChange = (value) => {
    if (!this.state.visible) {
      this.setState({searchParams: Object.assign({}, this.state.searchParams, {phaseID: value})})
    }
    this.props.form.resetFields(['grade']);
    this.getGrade(value).then(res=> {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({sGrade: res.Data});
        }
      }else{
        message.error(res.Msg)
      }
    });
  };

  // 获取年级  Table
  getTGradeList = (phaseID) => {
    this.getGrade(phaseID).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({grade: res.Data});
        }
      }else{
        message.error(res.Msg)
      }
    });
  };

  //
  getGrade = (phaseID)=>  ServiceAsync('GET', 'Resource/v3/Property/GetGradeList', {token,phaseID});


  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});

    this.getPageByCondition(pagination.current, pagination.pageSize)
  };

  // 查询纬度
  getPageByCondition(pIndex, pSize) {
    this.setState({loading: true});
    const {phaseID, gradeID, subjectID, publisherID} = this.state.searchParams;

    ServiceAsync('GET', 'Resource/v3/BasePropertyRelation/GetPageByCondition', {
      token,
      phaseID,
      gradeID,
      subjectID,
      publisherID,
      pIndex,
      pSize
    }).then(res => {
      if (res.Ret === 0) {
        let data = [];
        for (let item of res.Data.ViewModelList.entries()) {
          data.push({
            key: item[1].ID + item[0],
            id: item[1].ID,
            stage: {
              editable: false,
              value: item[1].PhaseName,
              id: item[1].PhaseID
            },
            grade: {
              editable: false,
              value: item[1].GradeName,
              id: item[1].GradeID
            },
            subject: {
              editable: false,
              value: item[1].SubjectName,
              id: item[1].SubjectID
            },
            publish: {
              editable: false,
              value: item[1].PublisherName,
              id: item[1].PublisherID
            },
          })
        }

        const pagination = {...this.state.pagination};
        pagination.total = res.Data.TotalRecords;
        pagination.current = res.Data.PageIndex;
        this.setState({
          loading: false,
          data,
          pagination,
        });
      }else {
        message.error(res.Msg)
      }
    });
  }

  // 保存新加条目
  saveDimRelation(data) {
    ServiceAsync('POST', 'Resource/v3/BasePropertyRelation/AddOrEdit', {token, body: data}).then(res => {
      if (res.Ret === 0) {

      }
    })
  }

  handleSearch(e) {
    e.preventDefault();
    const {pageSize} = this.state.pagination;
    this.getPageByCondition(1, pageSize)
  }

  // 重置查询条件
  handleReset() {
    this.props.form.resetFields();
    this.setState({
      searchParams: {
        phaseID:0,
        gradeID:0,
        subjectID:0,
        publisherID:0
      }
    })
  }


  handleChange(key, index, value) {
    const {data} = this.state;
    data[index][key].value = value ? value.Name : undefined;
    data[index][key].id = value ? value.ID : 0;
    this.setState({data});
  }

  editDone(index, type) {
    const {data} = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false;
        data[index][item].status = type;
      }
    });
    this.setState({data}, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
        }
      });

      this.saveDimRelation({
        ID: data[index].id,
        SubjectID: data[index].subject.id,
        SubjectName: data[index].subject.value,
        PhaseID: data[index].stage.id,
        PhaseName: '',
        GradeID: data[index].grade.id,
        GradeName: data[index].grade.value,
        PublisherID: data[index].publish.id,
        PublisherName: data[index].publish.value
      })
    });
  }

  edit(index) {
    const {data} = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({data});
  }

  renderColumns(data, index, key, text, source, callback) {
    const {editable, status, id} = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<SelectTableCell
      editable={editable}
      selected={{ID: id, Name: text || undefined}}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
      data={source}
      callback={callback}
    />);
  }

  handlerRowClick(record) {
    this.props.history.push({pathname: `${this.props.match.url}/additional`, search: `propertyID=${record.id}`});
  }

  // ===================================================================================================================
  showModal = () => {
    this.setState({visible: true,});
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {data, phase, grade, subject, publisher, sGrade} = this.state;
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = typeof item[key] !== 'object' ? item[key] : item[key].value;
      });
      return obj;
    });
    const columns = this.columns;

    const {visible, confirmLoading} = this.state;
    return (
      <div className="dimension-management">
        <Form layout="inline" onSubmit={this.handleSearch} style={{marginBottom: 15}}>
          <FormItem label={'学段'}>
            {getFieldDecorator(`phase`)(
              <Select
                showSearch
                style={{width: 200}}
                placeholder="请选择学段"
                optionFilterProp="children"
                onChange={this.handlePhaseChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  phase.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'年级'}>
            {getFieldDecorator(`grade`)(
              <Select
                showSearch
                style={{width: 200}}
                placeholder="请选择年级"
                optionFilterProp="children"
                onChange={(value) => this.setState({searchParams: Object.assign({}, this.state.searchParams, {gradeID: value})})}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  sGrade.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'科目'}>
            {getFieldDecorator(`subject`)(
              <Select
                showSearch
                style={{width: 200}}
                placeholder="请选择科目"
                optionFilterProp="children"
                onChange={(value) => this.setState({searchParams: Object.assign({}, this.state.searchParams, {subjectID: value})})}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  subject.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <Button style={{marginLeft: 8}} type="primary" onClick={this.showModal}>新增</Button>
          </FormItem>
        </Form>
        <Table
          bordered
          rowKey={record => record.key}
          columns={columns}
          dataSource={dataSource}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />

        {/* 新增 */}
        <AddDimension
          phase={phase}
          subject={subject}
          publisher={publisher}
          visible={visible}
          confirmLoading={confirmLoading}
          handleCancel={() => this.setState({visible: false})}
          handleSubmit={(values, callback) => {
            this.setState({confirmLoading: true,});
            ServiceAsync('POST', 'Resource/v3/BasePropertyRelation/AddOrEdit', {
              token, body: {
                ID: 0,
                SubjectID: values.addSubject,
                PhaseID: values.addPhase,
                GradeID: values.addGrade,
                PublisherID: values.addPublish,
              }
            }).then(res => {
              if (res.Ret === 0) {
                this.setState({
                  visible: false,
                  confirmLoading: false,
                });
                const {pageSize, current} = this.state.pagination;
                this.getPageByCondition(current, pageSize);

                callback();
              }else{
                message.error(res.Msg)
              }
              this.setState({confirmLoading: false});
            });
          }}
        />
      </div>
    )
  }
}

export default connect()(withRouter(Form.create()(DimensionManagement)))

