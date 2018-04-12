/**
 * Created by QiHan Wang on 2017/8/14.
 * QeustionIntro
 */
import React, {Component} from 'react';
import Api from '../../../../api';
import Config from '../../../../common/config';

import './create-question.scss';
// --
import PropertyAssemblage from '../../../../common/components/PropertyAssemblage';
import Hierarchy from '../../../../common/components/Hierarchy';
import CreateOption from './CreateOption';

// -- Ant Design Component
import {Form, Radio, Input, Button, Modal, Checkbox} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

class QuestionIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.getBasicData().then(res => this.setState({...res}));
  }

  getBasicData = async () => {
    const {getFieldsValue} = this.props.form;
    const {domainSelected} = getFieldsValue();
    const [questionType, difficulty, crowds, domain, categories, tags] = await Promise.all([
      Api.TopicVolume.getQuestionType(),
      Api.TopicVolume.getDifficulty(),
      Api.TopicVolume.getCrowds(),
      Api.TopicVolume.getDomain(),
      Api.TopicVolume.getCategory(domainSelected),
      Api.TopicVolume.getTags(domainSelected)
    ]);

    let result = {};
    // 问题类型数据处理
    if (questionType.Ret === 0) {
      if (questionType.Data && questionType.Data.length) {
        result.questionType = questionType.Data;
      }
    }

    // 问题难度数据处理
    if (difficulty.Ret === 0) {
      if (difficulty.Data && difficulty.Data.length) {
        result.difficulty = difficulty.Data;
      }
    }

    // 人群数据处理
    if (crowds.Ret === 0) {
      if (crowds.Data && crowds.Data.length) {
        result.crowds = crowds.Data;
      }
    }

    // 人群数据处理
    if (domain.Ret === 0) {
      if (domain.Data && domain.Data.length) {
        result.domain = domain.Data;
      }
    }
    // 分类数据处理
    if (categories.Ret === 0) {
      if (categories.Data && categories.Data.length) {
        result.categories = categories.Data.map(item => {
          Object.assign(item, {
            label: item.Name,
            value: item.ID,
            isLeaf: item.HasChild
          });
          return item;
        });
      }
    }

    // 分类数据处理
    if (tags.Ret === 0) {
      if (tags.Data && tags.Data.length) {
        result.tags = tags.Data;
      }
    }
    return result;
  }

  // 获取分类
  getCategory = (domainSelected) => {
    Api.TopicVolume.getCategory(domainSelected).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({
            categories: res.Data.map(item => {
              Object.assign(item, {
                label: item.Name,
                value: item.ID,
                isLeaf: item.HasChild
              });
              return item;
            })
          })
        }
      }
    })
  }
  // 获取标签
  getTags = (domainSelected) => {
    Api.TopicVolume.getTags(domainSelected).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({tags: res.Data})
        }
      }
    })
  }

  handleChangeDomain = (e) => {
    this.setState({categories: [], tags: [], categorySelectedObj: undefined});
    this.props.form.resetFields(['categorySelected', 'tagSelected']);
    this.getCategory(e.target.value)
    this.getTags(e.target.value)
  }

  handleChangeCategory = (values, selectedOptions) => {
    const selectedOption = selectedOptions[selectedOptions.length - 1];
    // 设置属性区段
    this.setState({categorySelectedObj: selectedOption});
  }

  // 动态分类子类
  loadCategoryData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const domain = this.props.form.getFieldValue('domainSelected');

    Api.TopicVolume.getCategory(domain, 0, targetOption.ID).then(res => {
      targetOption.loading = false;
      targetOption.children = [];
      if (res.Ret === 0) {
        for (let item of res.Data) {
          targetOption.children.push(Object.assign(item, {label: item.Name, value: item.ID, isLeaf: item.HasChild}))
        }
      }
      this.setState({categories: [...this.state.categories]});
    })
  }

  // 提交试题
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {

      const {tags} = this.state;
      if (err) {
        Modal.error({title: '错误提示！', content: '试题填写不完整！',});
      } else {
        // 构建选项数组
        const questionJson = values.answerOptions.map((item, i) => {
          return {
            ID: item.id,
            Section: alphabet[i],
            Name: item.value,
            Sort: i,
            IsAnswer: item.checked
          };
        });
        const questionData = {
          AppID: Config.appId,
          Stem: values.questionDesc,
          Difficulty: values.difficulty,
          SolveThink: values.guide,
          Analysis: values.analysis,
          QuestionJson:JSON.stringify(questionJson),
          Orgin: "资源中心",
          QuestionType: values.questionTypeSelected,
          ST: true,
          Weight: 0,
          Desc: values.questionDesc,
          Amount: 0,
          People: values.crowdSelected,
          PropertyList: values.property.map(item => {
            Reflect.deleteProperty(item, 'label');
            Reflect.deleteProperty(item, 'value');
            return item;
          }),
          CategroyIDs: values.categorySelected,
          ResourceTags: values.tagSelected ? values.tagSelected.map(value => tags.filter(tag => value === tag.ID)) : []
        };


        Api.TopicVolume.addQuestion({body: questionData}).then(res => {
          if (res.Ret === 0) {
            this.showConfirmSuccess();
          } else {
            this.showError(res.Msg);
          }
        });

        /*switch (+values.questionTypeSelected) {
          case 1:
          case 2:
            const choiceData = {
              AppID: Config.appId,
              Stem: values.questionDesc,
              Difficulty: values.difficulty,
              SolveThink: values.guide,
              Analysis: values.analysis,
              Options: values.answerOptions.map((item, i) => {
                return {
                  ID: item.id,
                  Section: alphabet[i],
                  Name: item.value,
                  Sort: i,
                  IsAnswer: item.checked
                };
              }),
              Orgin: "资源中心",
              QuestionType: values.questionTypeSelected,
              ST: true,
              Weight: 0,
              Desc: values.questionDesc,
              Amount: 0,
              People: values.crowdSelected,
              PropertyList: values.property.map(item => {
                Reflect.deleteProperty(item, 'label');
                Reflect.deleteProperty(item, 'value');
                return item;
              }),
              CategroyIDs: values.categorySelected,
              ResourceTags: values.tagSelected ? values.tagSelected.map(value => tags.filter(tag => value === tag.ID)) : []
            };
            Api.TopicVolume.addChoiceQuestion({body: choiceData}).then(res => {
              if (res.Ret === 0) {
                this.showConfirmSuccess();
              } else {
                this.showError(res.Msg);
              }
            });
            break;
          case 3:
            const judgeData = {
              AppID: Config.appId,
              Stem: values.questionDesc,
              Difficulty: values.difficulty,
              SolveThink: values.guide,
              Analysis: values.analysis,
              Options: values.answerOptions.map((item, i) => {
                return {
                  ID: item.id,
                  Section: alphabet[i],
                  Name: item.value,
                  Sort: 4,
                  IsAnswer: item.checked
                };
              }),
              Orgin: "资源中心",
              QuestionType: values.questionTypeSelected,
              ST: true,
              Weight: 0,
              Desc: values.questionDesc,
              Amount: 0,
              People: values.crowdSelected,
              PropertyList: values.property.map(item => {
                Reflect.deleteProperty(item, 'label');
                Reflect.deleteProperty(item, 'value');
                return item;
              }),
              CategroyIDs: values.categorySelected,
              ResourceTags: values.tagSelected.map(value => tags.filter(tag => value === tag.ID))
            };
            Api.TopicVolume.addJudgeQuestion({body: judgeData}).then(res => {
              if (res.Ret === 0) {
                this.showConfirmSuccess();
              } else {
                this.showError(res.Msg);
              }
            })
            break;
          default:
        }*/
      }
    })
  };

  showConfirmSuccess = () => {
    /*Modal.confirm({
      title: '试题添加成功！',
      content: '是否继续添加？',
      onOk: () => {
        this.props.form.resetFields(['questionDesc', 'answerOptions', 'guide', 'analysis']);
      },
      onCancel: () => {
        this.handleGoBack();
      },
    });*/

    Modal.success({
      title: '试题添加成功',
      okText:'确定',
      onOk: () => {
        this.handleGoBack();
      },
    });
  }

  showError = (content) => {
    Modal.error({title: '试题添加错误！', content});
  }

  // 返回到试题列表
  handleGoBack = () => {
    this.props.history.push('/item-bank');
  }

  render() {
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const {questionType, difficulty, domain, crowds, categories, tags, categorySelectedObj} = this.state;
    const {questionTypeSelected} = getFieldsValue();
    const extraAnswer = () => {
      switch (+questionTypeSelected) {
        case 1:
          return '单选题的选项个数范围 2 到 26 ，正确选项个数为 1';
        case 2:
          return '多选题的选项个数范围 3 到 26 ，正确选项个数不少于 2';
        case 3:
          return '判断题的选项个数固定为 2 个 ，正确选项个数为 1';
        default:
          return ''

      }
    }
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 14, offset: 4
      },
    };

    return (
      <div>
        <Form layout="inline" className="form-search-group">
          <FormItem label={'所属领域'} className="line-block">
            {getFieldDecorator(`domainSelected`, {initialValue: '1', rules: [{required: true}]})(
              <RadioGroup onChange={this.handleChangeDomain}>
                {
                  Array.isArray(domain) && domain.map((item => <Radio value={item.Value}
                                                                      key={item.Value}>{item.Text}</Radio>))
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label={'适用对象'} className="line-block">
            {getFieldDecorator(`crowdSelected`, {
              rules: [{required: true, message: '请选择适用对象'}]
            })(
              <RadioGroup>
                {
                  Array.isArray(crowds) && crowds.map((item => <Radio value={item.Value}
                                                                      key={item.Value}>{item.Text}</Radio>))
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label={'所属分类'} className="line-block">
            {getFieldDecorator(`categorySelected`, {rules: [{required: true, message: '请选择所属分类'}]})(
              <Hierarchy
                options={categories}
                onChange={this.handleChangeCategory}
                loadData={this.loadCategoryData}
              />
            )}
          </FormItem>
          {/*属性展示*/}
          <FormItem label={'属性'} className="line-block">
            {
              getFieldDecorator(`property`, {
                rules: [{
                  required: true,
                  validateTrigger: ['onChange', 'onBlur'],
                  message: '请选择属性',
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('属性未选择');
                      return;
                    }
                    callback();
                  }
                }]
              })(
                <PropertyAssemblage options={categorySelectedObj} className="ant-form"/>
              )
            }
          </FormItem>

          <FormItem label={'标签'} className="line-block">
            {getFieldDecorator(`tagSelected`)(
              <CheckboxGroup>{
                Array.isArray(tags) && tags.map((item => <Checkbox value={item.ID}
                                                                   key={item.ID}>{item.Name}</Checkbox>))
              }
              </CheckboxGroup>
            )}

          </FormItem>
          <FormItem label="题型" className=" line-block">
            {getFieldDecorator(`questionTypeSelected`, {
              initialValue: '1',
              rules: [{required: true}]
            })(
              <RadioGroup>
                {
                  questionType && questionType.map(item => <Radio value={item.Value}
                                                                  key={item.Value}>{item.Text}</Radio>)
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="难度" className=" line-block">
            {getFieldDecorator(`difficulty`, {
              initialValue: '3',
              rules: [{required: true}]
            })(
              <RadioGroup>
                {
                  difficulty && difficulty.map(item => <Radio value={item.Value} key={item.Value}>{item.Text}</Radio>)
                }
              </RadioGroup>
            )}
          </FormItem>
        </Form>
        <Form layout="horizontal" className="create-question">
          <FormItem  {...formItemLayout} label="题干">
            {
              getFieldDecorator(`questionDesc`, {
                rules: [{
                  required: true,
                  message: '请填写题干信息'
                }]
              })(
                <TextArea rows="3" placeholder="请输入试题题干信息"/>
              )
            }
          </FormItem>
          <FormItem  {...formItemLayout} label="选项" extra={extraAnswer()}>
            {
              getFieldDecorator(`answerOptions`, {
                rules: [
                  {
                    required: true,
                    validateTrigger: ['onBlur', 'onChange'],
                    message: '请将选项填写完整',
                    validator: (rule, value, callback) => {

                      if (!value) {
                        callback(`选项未设置`);
                        return;
                      }

                      let num = 0;
                      for (let [index, answer] of value.entries()) {
                        if (!answer.value) {
                          callback(`第${index + 1}条选项，填写不完整！`);
                          return;
                        } else {
                          if (answer.checked) {
                            num++;
                          }
                        }
                      }

                      // 验证答案正确个数是否满足
                      switch (+questionTypeSelected) {
                        case 1:
                          if (num < 1) {
                            rule.message = `当前题型正确答案至少一个！`;
                            callback('正确答案至少一个');
                          }
                          break;
                        case 2:
                          if (num < 2) {
                            rule.message = `当前题型正确答案至少二个！`;
                            callback('正确答案至少二个');
                          }
                          break;
                        case 3:
                          if (num < 1) {
                            rule.message = `当前题型正确答案至少一个！`;
                            callback('正确答案至少一个');
                          }
                          break;
                        default:
                          callback();
                      }
                      callback();
                    }
                  }
                ]
              })(<CreateOption type={questionTypeSelected}/>)
            }
          </FormItem>
          <FormItem  {...formItemLayout} label="解题思路">
            {
              getFieldDecorator(`guide`)(
                <TextArea rows="3" placeholder="考生/学员做题时可查看该信息，达到提醒点拨的作用"/>
              )
            }
          </FormItem>
          <FormItem  {...formItemLayout} label="试题解析">
            {
              getFieldDecorator(`analysis`, {
                initialValue: ''
              })(
                <TextArea rows="3" placeholder="考生/学员提交作业后可查看该信息，达到巩固学习的目的"/>
              )
            }
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" onClick={this.handleSubmit}>确认</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleGoBack}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(QuestionIntro);
