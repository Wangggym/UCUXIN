/**
 * Created by QiHan Wang on 2017/7/12.
 */
import React, {Component} from 'react';
import moment from 'moment';
import ServiceAsync from '../../../common/service';
import oss from '../../../common/utils/oss';
import {Token} from "../../../common/utils/token";


import './main.scss';

// -- Custom Component
import Hierarchy from '../../../common/components/Hierarchy';
import PropertyAssemblage from '../../../common/components/PropertyAssemblage';
import Plyr from './Plyr'

// -- AntDesign Components
import {Form, Input, Button, DatePicker, Table, Radio, Checkbox, Modal, message} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


const dateFormat = 'YYYY-MM-DD';
const token = Token();


class ResourceList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      queryFields: {
        name: '',
        tagIDs: [],
        categroyID: '',
        startDate: '',
        endDate: '',
        domain: '1',
        crowd: '',
        property: []
      },
      pagination: {pageSize: 10, current: 1},
      dataSource: [],

      domain: [],       // 领域
      tags: [],         // 标签
      category: [],     // 分类,
      crowd: [],        // 人群

      // Table Config
      loading: false,

      videoPreviewUrl: undefined,
      videoPreviewVisible: false,
      questionPreviewVisible: false,
      questionDetail: []
    };

    this.columns = [
      {
        title: '图标',
        dataIndex: 'Img',
        width: 96,
        render: (text, record, index) => <img src={text} alt={record.Name}
                                              style={{width: '80px', height: '80px', verticalAlign: 'middle'}}/>,
      },
      {
        title: '描述信息',
        dataIndex: 'Name',
        render: (text, record, index) => {
          return (
            <div className="resource-basic">
              <h4>名称：{record.Name}</h4>
              <p>
                分类：{record.Categroys.length ? record.Categroys.map(item => item.Name).join(', ') : '无'}
                <span className="ant-divider"/>
                标签：{record.ResourceTags.length ? record.ResourceTags.map(item => item.Name).join(', ') : '无'}
              </p>
              <p>
                属性：{record.Properties.length ? record.Properties.filter(item => +item.Enum > 0).map(item => item.Name).join(', ') : '无'}
              </p>
              <p>
                格式：{record.FormatName}
                <span className="ant-divider"/>
                来源：{record.Orgin}
                <span className="ant-divider"/>
                上传者：{record.CName}
                <span className="ant-divider"/>
                上传时间：{record.CDate}
              </p>
            </div>
          )
        }
      }, {
        title: '操作',
        render: (text, record) => {
          return (
            <div style={{textAlign: 'right'}}>
              {
                record.Format === 2 || record.Format === 4 || record.Format === 3 ?
                  <Button icon="eye-o" onClick={() => this.previewSource(record)}>预览</Button> : null
              }
              {
                record.Format !== 4 && record.Format !== 3 ?
                  <Button icon="download" style={{marginLeft: 8}}
                          onClick={() => this.downloadFile(record)}>下载</Button> : null
              }

            </div>
          )
        },
      }
    ];
  }


  componentDidMount() {
    this.getPageByCondition(1);
    this.getDomain();
    this.getCrowd();
    this.getCategory(this.state.queryFields.domain);
    this.getTags(this.state.queryFields.domain);

    //this.instances = plyr.setup(ReactDOM.findDOMNode(this));
  }

  // 根据查询字段筛选获取资源列表数据
  getPageByCondition(pIndex) {

    const {domain, name, tagIDs, categroyID, startDate, endDate, crowd, property} = this.state.queryFields;
    const {pageSize, current} = this.state.pagination;
    this.setState({loading: true})
    ServiceAsync('POST', 'Resource/v3/Resource/GetPageByCondition', {
      token,
      body: {
        Domain: domain,
        Name: name,
        People: crowd,
        TagIDs: tagIDs,
        CategroyID: categroyID[categroyID.length - 1],
        StartDate: startDate,
        EndDate: endDate,
        Propertys: property.filter(item => {
          Reflect.deleteProperty(item, 'label');
          Reflect.deleteProperty(item, 'value');

          return (+item.ID > 0)
        }),
        PSize: pageSize,
        PIndex: pIndex || current
      }

    }).then(res => {
      if (res.Ret === 0) {
        let dataSource = [];
        const pagination = {...this.state.pagination};
        if (res.Data) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;

          if (res.Data.TotalRecords) {
            let data = res.Data.ViewModelList;
            data.map(item => {
              dataSource.push({
                ID: item.ID,
                Img: item.Img,
                Name: item.Name,
                Format: item.Format,
                FormatName: item.FormatName,
                Categroys: item.Categroys,
                Properties: [
                  {
                    Enum: item.Phase,
                    Name: item.PhaseName
                  },
                  {
                    Enum: item.Grade,
                    Name: item.GradeName
                  },
                  {
                    Enum: item.TextBook,
                    Name: item.TextBookName
                  },
                  {
                    Enum: item.Subject,
                    Name: item.SubjectName
                  },
                  {
                    Enum: item.Chapter,
                    Name: item.ChapterName
                  },
                  {
                    Enum: item.Knowledge,
                    Name: item.KnowledgeName
                  },
                  {
                    Enum: item.Area,
                    Name: item.AreaName
                  },
                  {
                    Enum: item.PartYear,
                    Name: item.PartYearName
                  },
                  {
                    Enum: item.Publisher,
                    Name: item.PublisherName
                  }
                ],
                ResourceTags: item.ResourceTags,
                ResourceID: item.ResourceID,
                Orgin: item.Orgin,
                CName: item.CName,
                CDate: item.CDate
              })
            })
          }
        }
        this.setState({dataSource, pagination, loading: false})
      } else {
        message.error(res.Msg)
      }
    })
  }

  // 获取领域分类
  getDomain() {
    ServiceAsync('GET', 'Resource/v3/Category/GetDomianList', {token}).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({
            domain: res.Data
          })
        }
      }
    })
  }

  // 获取适用对象
  getCrowd() {
    ServiceAsync('GET', 'Resource/v3/Category/GetPeopleList', {token}).then(res => {
      if (res.Ret === 0) {
        const crowd = [];
        if (res.Data && res.Data.length) {
          res.Data.unshift({Text: "不限", Value: "0", isChecked: false})
          res.Data.map(item => crowd.push(Object.assign(item, {label: item.Text, value: item.Value})));
        }
        this.setState({crowd})
      }
    })
  }

  // 根据领域获取分类列表
  getCategory(doMain, property = 0, parentID = 0) {
    ServiceAsync('GET', 'Resource/v3/Category/GetCategoryListByParentID', {
      token,
      doMain,
      property,
      parentID
    }).then(res => {
      if (res.Ret === 0) {
        const category = [];
        if (res.Data && res.Data.length) {
          res.Data.map(item => category.push(Object.assign(item, {
            label: item.Name,
            value: item.ID,
            isLeaf: item.HasChild
          })))
        }
        this.setState({category})
      }
    })
  }

  // 动态分类子类
  loadCategoryData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const domain = this.props.form.getFieldValue('domain');

    ServiceAsync('GET', 'Resource/v3/Category/GetCategoryListByParentID', {
      token,
      domain,
      property: 0,
      parentID: targetOption.ID
    }).then(res => {
      targetOption.loading = false;
      targetOption.children = [];
      if (res.Ret === 0) {
        for (let item of res.Data) {
          targetOption.children.push(Object.assign(item, {label: item.Name, value: item.ID, isLeaf: item.HasChild}))
        }
      }
      this.setState({category: [...this.state.category]});
    })
  };

  // 根据领域获取标签
  getTags(domain) {
    ServiceAsync('GET', 'Resource/v3/Resource/TagList', {token, domain}).then(res => {
      if (res.Ret === 0) {
        let tags = [];
        if (res.Data && res.Data.length) {
          res.Data.map(item => tags.push(Object.assign(item, {label: item.Name, value: item.ID})));
        }
        this.setState({tags})
      }
    })
  }

  // 获取下载地址
  downloadFile = (record) => {

    switch (record.Format) {
      case 1:
        ServiceAsync('GET', 'Resource/v3/File/GetFileUrl', {token, resourceID: record.ResourceID}).then(res => {
          if (res.Ret === 0) {
            oss.ali.download(res.Data.Url, record.Name);
          } else {
            message.error(res.Msg);
          }
        });
        break;
      case 2:
        ServiceAsync('GET', 'Resource/v3/Video/GetVideoRes', {token, resourceID: record.ID}).then(res => {
          if (res.Ret === 0) {
            window.location.href = res.Data.DownUrl;
          } else {
            message.error(res.Msg);
          }
        });
        break;
      default:
        break;
    }
  };

  // 预览资源文件 视频
  previewSource = (record) => {
    switch (record.Format) {
      case 2: // 视频预览
        ServiceAsync('GET', 'Resource/v3/Video/GetVideoRes', {token, resourceID: record.ID}).then(res => {
          if (res.Ret === 0) {
            this.setState({videoPreviewUrl: res.Data.PlayUrl, videoPreviewVisible: true});
          } else {
            message.error(res.Msg);
          }
        });
        break;
      case 3: // 试题预览
        this.setState({questionPreviewVisible: true});
        ServiceAsync('POST', 'Resource/v3/QuePap/GetQuestionDetailByIDNew', {
          token,
          body: {QuestioinIDs: [record.ResourceID]}
        }).then(res => {
          if (res.Ret === 0) {
            this.setState({questionDetail: res.Data});
          } else {
            message.error(res.Msg);
          }
        });
        break;
      case 4:
        // 试卷预览
        this.props.history.push({pathname: '/test-paper/paper-detail', search: `?TestPaperID=${record.ResourceID}`});
        break;
      default:
        return null;
    }
  };


  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          name: values.name || '',
          tagIDs: values.tags || [],
          categroyID: values.category || 0,
          startDate: values.sDate ? moment(values.sDate).format(dateFormat) : '',
          endDate: values.eDate ? moment(values.eDate).format(dateFormat) : '',
          domain: values.domain || 0,
          crowd: values.crowd || '',
          property: values.property || []
        }),
        pagination: Object.assign({}, this.state.pagination, {current: 1})
      }, () => this.getPageByCondition());
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});
    this.getPageByCondition(pagination.current)
  };

  // 重置提交数据
  handleReset = () => {
    this.props.form.resetFields();

    Reflect.deleteProperty(this.state, 'selectedCategory');
    this.setState(Object.assign({}, this.state, {
      queryFields: {
        name: '',
        tagIDs: [],
        categroyID: '',
        startDate: '',
        endDate: '',
        domain: '1',
        crowd: '',
        property: []
      },
      tags: [],        // 标签
      category: [],    // 分类,
    }), () => {
      this.getCategory(this.state.queryFields.domain);
      this.getTags(this.state.queryFields.domain);
    })
  };

  handleChangeDomain = (e) => {
    //  初始化数据
    this.setState({
      queryFields: Object.assign({}, this.state.queryFields, {
        categroyID: '',
        tagIDs: []
      }),
    });
    this.props.form.resetFields(['category', 'tags']);
    this.getCategory(e.target.value);
    this.getTags(e.target.value);
  };

  handleChangeCategory = (values, selectedOptions) => {
    const selectedOption = selectedOptions[selectedOptions.length - 1];
    // 设置属性区段
    this.setState({selectedCategory: selectedOption});
  };


  render() {
    const {getFieldDecorator} = this.props.form;
    const {domain, crowd, tags, category, selectedCategory, dataSource, queryFields, videoPreviewVisible, questionPreviewVisible, questionDetail} = this.state;
    const difficultyFilter = (type) => {
      switch (type) {
        case 2:
          return "较易";
        case 3:
          return "中等";
        case 4:
          return "较难";
        case 5:
          return "很难";
        case 1:
        default:
          return "容易";
      }
    };
    return (
      <div className="resource-list">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch} style={{marginBottom: '15px'}}>
          <FormItem label={'所属领域'} className="line-block">
            {getFieldDecorator(`domain`, {initialValue: queryFields.domain})(
              <RadioGroup onChange={this.handleChangeDomain}>
                {
                  domain.map((item => <Radio value={item.Value} key={item.Value}>{item.Text}</Radio>))
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label={'适用对象'} className="line-block">
            {getFieldDecorator(`crowd`)(<RadioGroup options={crowd}/>)}
          </FormItem>
          <FormItem label={'所属分类'} className="line-block">
            {getFieldDecorator(`category`)(
              <Hierarchy
                options={category}
                onChange={this.handleChangeCategory}
                loadData={this.loadCategoryData}
              />
            )}
          </FormItem>
          {/* 属性展示 */}
          <FormItem label={'所属'} className="line-block">
            {getFieldDecorator(`property`)(
              <PropertyAssemblage options={selectedCategory} className="ant-form"/>
            )}
          </FormItem>
          <FormItem label={'标签'} className="line-block">
            {getFieldDecorator(`tags`)(<CheckboxGroup options={tags}/>)}

          </FormItem>
          <div className="line-block" style={{margin: '5px 0', paddingBottom: '5px'}}>
            <FormItem label={'名称'}>{getFieldDecorator(`name`)(<Input placeholder="请填写名称"/>)}</FormItem>
            <FormItem label="开始日期">{getFieldDecorator(`sDate`)(<DatePicker format={dateFormat}/>)}</FormItem>
            <FormItem label="结束日期">{getFieldDecorator(`eDate`)(<DatePicker format={dateFormat}/>)}</FormItem>
            <FormItem style={{flex: 1, marginRight: 0, textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            </FormItem>
          </div>
        </Form>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          pagination={this.state.pagination}
          rowKey="ID"
          bordered
          showHeader={false}
          rowClassName={() => 'no-bordered'}
          onChange={this.handleTableChange}
          loading={this.state.loading}
        />

        {/* 视频预览 */}
        <Modal
          visible={videoPreviewVisible}
          onCancel={() => this.setState({videoPreviewVisible: false})}
          footer={null}
        >
          <Plyr
            url={this.state.videoPreviewUrl}
            isClose={videoPreviewVisible}
          />
        </Modal>

        {/* 试题预览 */}
        <Modal
          title="查看详情"
          wrapClassName="resource-subject-list"
          visible={questionPreviewVisible}
          onCancel={() => this.setState({questionPreviewVisible: false})}
          footer={null}
          width="80%"
        >
          {
            questionDetail && questionDetail.map(item => {
              return (
                <div className="subject" key={item.ID}>
                  <div className="subject-title">
                    <p>题型 : <span>{item.Type === 1 ? "单选题" : (item.Type === 2 ? "多选题" : "判断题")}</span></p>
                    <p>难易度 : <span>{difficultyFilter(item.Difficulty)}</span></p>
                    <p>组卷次数 : <span>{item.QtyQuote}</span></p>
                  </div>
                  <div className="subject-content">
                    <span className="subject-stem">{`题干：${item.Stem}`}</span>
                    <div className="subject-option">
                      {
                        item.QusetionJson && JSON.parse(item.QusetionJson).map((e, index) => {
                          return (
                            <span key={index}>{e.Section}、{e.Name}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className="subject-analysis">
                    <p><b>【解题思路】</b>{item.SolveThink}</p>
                    <p><b>【答案解析】</b>{item.Analysis}</p>
                    <p>
                      <b>【正确答案】</b>
                      {
                        item.QusetionJson && JSON.parse(item.QusetionJson).map((e, index) => {
                          return (
                            e.IsAnswer && e.Section
                          )
                        })
                      }
                    </p>
                  </div>
                </div>
              )
            })
          }
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ResourceList);
