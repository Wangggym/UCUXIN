import React, {Component} from 'react';
import {Form, Button, Radio, Pagination, Spin, message} from 'antd';
import {Link} from 'react-router-dom';

import TestPaperList from './TestPaperList';

import ServiceAsync from '../../../common/service';
import PropertyAssemblage from "../../../common/components/ItemBankProperty";
import '../ItemBank/ItemBank.scss';
import {Token} from '../../../common/utils';

const token = Token();

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class TsetPaper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      peopleList: [],//适用人群列表
      loading: false,
      testPaperList: [],//试卷列表
      difficultyType: [],//难度列表
      PIndex: 1,//第几页
      PSize: 10,//返回多少条数
      Difficulty: 0,//默认难度
      pepole: 0,//默认适用人群
      defaultConfig: {//默认获取试卷列表配置
        Phase: 0,//教育阶段
        Grade: 0,//年级
        Subject: 0,//科目
        Publisher: 0,//出版社
        TextBook: 0,//教材编号
      },
      selectedOptions: {
        Domian: 1,
        HasChild: false,
        ID: "",
        Name: "",
        ParentID: "",
        Property: 1 | 2 | 4 | 8 | 16 | 128 | 256,
        PropertyList: [
          {
            Text: "学段",
            Value: "1",
            isChecked: true
          },
          {
            Text: "年级",
            Value: "2",
            isChecked: true
          },
          {
            Text: "科目",
            Value: "4",
            isChecked: true
          },
          {
            Text: "出版社",
            Value: "8",
            isChecked: true
          },
          {
            Text: "教材",
            Value: "16",
            isChecked: true
          }
        ],
        isLeaf: false,
        label: "",
        value: ""
      }
    }
  }


  //改变id时存储并处理id
  handleIDs(values, IDs) {
    if (values.property) {
      values.property.forEach((item, index) => {
        switch (item.PropertyType) {
          case 1:
            IDs.Phase = item.ID === "-1" ? "0" : item.ID;
            break;
          case 2:
            IDs.Grade = item.ID === "-1" ? "0" : item.ID;
            break;
          case 4:
            IDs.Subject = item.ID === "-1" ? "0" : item.ID;
            break;
          case 8:
            IDs.Publisher = item.ID === "-1" ? "0" : item.ID;
            break;
          case 16:
            IDs.TextBook = item.ID === "-1" ? "0" : item.ID;
            break;
        }
      });
    }
  }

//获取试卷列表
  getTestPaperList(Pindex, ...IDs) {
    ServiceAsync('POST', 'QuePap/v3/Paper/GetPapersByQuery', {
      token,
      body: {
        IDs,
        PIndex: Pindex,
        PSize: this.state.PSize,
        Difficulty: this.state.Difficulty,
        People: this.state.pepole
      }
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({
          testPaperList: res.Data,
          loading: false
        })
      } else {
        message.warn(res.Msg)
      }
    });
  }

  componentDidMount() {
    this.setState({loading: true})
    //获取适用对象
    ServiceAsync('GET', 'Resource/v3/Category/GetPeopleList', {token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          peopleList: res.Data
        })
      }
    });
    //获取难度
    ServiceAsync('GET', 'QuePap/v3/Question/GetDifficulty', {token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          difficultyType: res.Data
        })
      }
    });
    //默认获取题目列表
    this.getTestPaperList(this.state.PIndex, this.state.defaultConfig)
  }

  //查询
  handleSearch = (e) => {
    e.preventDefault();
    this.setState({loading: true});
    this.state.PIndex = 1;
    let IDs = {};
    this.props.form.validateFields((err, values) => {
      this.handleIDs(values, IDs);
      this.getTestPaperList(this.state.PIndex, IDs)
    });

  }

//改变页码，获取试卷列表
  changePage(page) {
    this.setState({loading:true,PIndex: page})
    //默认获取题目列表
    this.getTestPaperList(page, this.state.defaultConfig)
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {peopleList, testPaperList} = this.state;
    const {ViewModelList} = this.state.testPaperList
    return (
      <Spin spinning={this.state.loading}>
        <div className="test-paper">
          <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
            <FormItem label="适用对象" className=" line-block">
              {getFieldDecorator(`pepole`)(
                <RadioGroup onChange={(e) => this.setState({pepole: e.target.value})}>
                  {
                    peopleList && peopleList.map((item, index) => {
                      return (
                        <Radio value={item.Value} key={index}>{item.Text}</Radio>
                      )
                    })
                  }
                </RadioGroup>
              )}
            </FormItem>

            {getFieldDecorator(`property`)(
              <PropertyAssemblage options={this.state.selectedOptions}
                                  onChange={(value) => {
                                    console.log(value)
                                  }}/>
            )}

            <FormItem label="难度" className=" line-block">
              {getFieldDecorator(`difficultyType`)(
                <RadioGroup onChange={(e) => this.setState({Difficulty: e.target.value})}>
                  {
                    this.state.difficultyType && this.state.difficultyType.map((item, index) => {
                      return (
                        <Radio value={item.Value} key={index}>{item.Text}</Radio>
                      )
                    })
                  }
                </RadioGroup>
              )}
            </FormItem>

            <div style={{marginTop: '10px'}}>
              <FormItem>
                <Button type="primary" style={{marginLeft: 8}} onClick={()=> this.props.history.push('/test-paper/add-testPaper')}>新增试卷</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
              </FormItem>
            </div>
            <div className="line-cute">
              {
                ViewModelList && ViewModelList.length ? ViewModelList.map((item, index) => {
                  return (
                    <TestPaperList key={index} item={item}/>
                  )
                }) : <NoData/>
              }

            </div>
            <Pagination
              showTotal={total => `共 ${total} 条`}
              total={testPaperList.TotalRecords}
              current={this.state.PIndex}
              pageSize={this.state.PSize}
              onChange={(pages) => this.changePage(pages)}
              showQuickJumper={testPaperList.Pages > 10}
            />
            {/*<Pagination defaultCurrent={1} defaultPageSize={this.state.PSize} total={testPaperList.Pages}*/}
            {/*onChange={(pages) => this.changePage(pages)} style={{marginTop: "0.5rem"}}/>*/}
          </Form>
        </div>
      </Spin>
    )
  }
}

//无数据
class NoData extends Component {
  render() {
    return (
      <div className="no-data">
        暂无数据
      </div>
    )
  }
}

export default Form.create()(TsetPaper);
