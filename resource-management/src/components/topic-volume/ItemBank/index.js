/**
 * Created by xj on 2017/8/12.
 */
import React, {Component} from 'react';
import {Form, Button, Radio, Pagination, Spin,message} from 'antd';
import {Link} from 'react-router-dom';
import PropertyAssemblage from "../../../common/components/ItemBankProperty";
import SubjectList from './SubjectList';
import SelectSubjectList from './SelectSubjectList';
import "./ItemBank.scss";
import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const token = Token();
// const CheckboxGroup = Checkbox.Group;
// const Option = Select.Option;

class ItemBank extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      value: undefined,
      questionType: [],
      difficultyType: [],
      haveChangeState: false,
      Type: 1,//修改后的题型
      Difficulty: 0,//修改后的难度
      configIDs: {},//存储选择修改后的id
      loading: false,
      defaultConfig: {
        Type: 1,//题型
        Difficulty: 0,//难度
        Phase: "0",  //学段
        Grade: "0",   //年级
        Subject: "0", //科目
        Publisher: "0",//出版社
        TextBook: "0",//教材
        Chapter: "0",//章节
        Knowledge: "0 ",//知识点
      },
      PageIndex: 1,
      PSize: 10,
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
          },
          {
            Text: "按章节目录",
            Value: "128",
            isChecked: false
          },
          {
            Text: "按知识点",
            Value: "256",
            isChecked: false
          }
        ],
        isLeaf: false,
        label: "",
        value: ""
      }
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    //获取题型
    ServiceAsync('GET', 'QuePap/v3/Question/GetQuestionType',{token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          questionType: res.Data
        })
      }
    });
    //获取难度
    ServiceAsync('GET', 'QuePap/v3/Question/GetDifficulty',{token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          difficultyType: res.Data
        })
      }
    });
    //默认获取题目列表
    ServiceAsync('POST', 'Resource/v3/QuePap/GetQuestionsByQueryNew', {
      token,
      body: {
        ...this.state.defaultConfig,
        PIndex: this.state.PageIndex,
        PSize: this.state.PSize
      }
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({
          data: res.Data,
          loading: false
        })
      }else {
        message.warn(res.Msg);
        this.setState({loading:false})
      }
    });
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
          case 128:
            IDs.Chapter = item.ID === "-1" ? "0" : item.ID;
            break;
          case 256:
            IDs.Knowledge = item.ID === "-1" ? "0" : item.ID;
            break;
        }
      });
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.setState({loading: true});
    this.state.PageIndex=1;
    let IDs = {
      Phase:0,
      Grade:0,
      Subject:0,
      Publisher:0,
      TextBook:0,
      Chapter:0,
      Knowledge:0,
    }
    this.props.form.validateFields((err, values) => {
      const {PageIndex, PSize} = this.state;
      this.handleIDs(values, IDs);
      this.setState({
        configIDs: IDs,
      })
      ServiceAsync('POST', 'Resource/v3/QuePap/GetQuestionsByQueryNew', {
        token,
        body: {
          Type: values.questionType || 1,//题型
          Difficulty: values.difficultyType || 0,//难度
          Phase: IDs.Phase||0,  //学段
          Grade: IDs.Grade||0,   //年级
          Subject: IDs.Subject||0, //科目
          Publisher: IDs.Publisher||0,//出版社
          TextBook: IDs.TextBook||0,//教材
          Chapter: IDs.Chapter||0,//章节
          Knowledge: IDs.Knowledge||0,//知识点
          PIndex: PageIndex,
          PSize: PSize
        }
      }).then(res => {
        if (res.Ret === 0) {
          this.setState({
            data: res.Data,
            //configIDs: IDs,
            haveChangeState: true,
            loading: false
          })
        }
      });
    });
  }

  selectType(e) {
    const selectedValue = e.target.value;
    const {PropertyList} = this.state.selectedOptions;
    const knowledgeIndex = PropertyList.findIndex(item => '128' === item.Value);
    const capterIndex = PropertyList.findIndex(item => '256' === item.Value);
    for (let mark of [knowledgeIndex, capterIndex]) {
      PropertyList[mark].isChecked = selectedValue === PropertyList[mark].Value
    }

    this.setState({
      selectedOptions: Object.assign({}, this.state.selectedOptions, {PropertyList})
    })
  }

  // //改变选项
  PropertyAssemblage(value) {
    console.log("property", value)
  }

//改变页码
  onChangePage(pages) {
    this.setState({loading: true,PageIndex:pages})
    //为configIDs添加按章节或者按知识点id
    if (this.state.configIDs.Chapter === null) {
      this.state.configIDs.Knowledge === 0
    } else {
      this.state.configIDs.Chapter === 0
    }
    if (this.state.haveChangeState) {
      ServiceAsync('POST', 'Resource/v3/QuePap/GetQuestionsByQueryNew', {
        token,
        body: {
          ...this.state.configIDs,
          Type:this.state.Type||0,
          Difficulty:this.state.Difficulty||0,
          PIndex: pages,
          PSize: this.state.PSize
        }
      }).then(res => {
        if (res.Ret === 0) {
          this.setState({
            data: res.Data,
            loading: false
          })
        }
      });
      return;
    }
    ServiceAsync('POST', 'Resource/v3/QuePap/GetQuestionsByQueryNew', {
      token,
      body: {
        ...this.state.defaultConfig,
        PIndex: pages,
        PSize: this.state.PSize
      }
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({
          data: res.Data,
          loading: false
        })
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <Spin spinning={this.state.loading}>
        <div className="item-bank">
          <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
            <FormItem label="类型" className=" line-block">
              {getFieldDecorator(`selectType`,{initialValue:"128"})(
                <RadioGroup onChange={(e) => this.selectType(e)}>
                  <Radio value='128'>按章节查询</Radio>
                  <Radio value='256'>按知识点查询</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {getFieldDecorator(`property`)(
              <PropertyAssemblage options={this.state.selectedOptions}
                                  onChange={(value) => {
                                    this.PropertyAssemblage(value)
                                  }}/>
            )}
            <FormItem label="题型" className=" line-block">
              {getFieldDecorator(`questionType`)(
                <RadioGroup onChange={(e) => this.setState({Type: e.target.value})}>
                  {
                    this.state.questionType && this.state.questionType.map((item, index) => {
                      return (
                        <Radio value={item.Value} key={index}>{item.Text}</Radio>
                      )
                    })
                  }
                </RadioGroup>
              )}
            </FormItem>

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
                <Button type="primary" style={{marginLeft: 8}} onClick={()=> this.props.history.push('/item-bank/create-question')}>新增</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
              </FormItem>
            </div>
          </Form>

          {
            this.props.location.state ? <SelectSubjectList data={this.state.data}/> :
              <SubjectList data={this.state.data}/>
          }
          <Pagination
            showTotal={total => `共 ${total} 条`}
            total={this.state.data.TotalRecords}
            current={this.state.PageIndex}
            pageSize={this.state.PSize}
            onChange={(pages) => this.onChangePage(pages)}
            showQuickJumper={this.state.data.Pages > 10}
          />
          {/*<Pagination defaultCurrent={1} PageSize={this.state.PageIndex} total={this.state.data.Pages}*/}
                      {/*onChange={(pages) => this.onChangePage(pages)} style={{marginTop: "0.5rem"}}/>*/}
        </div>
      </Spin>
    )
  }
}

export default Form.create()(ItemBank);
