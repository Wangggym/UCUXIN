/**
 * Created by QiHan Wang on 2017/8/15.
 * CreateAnswer
 */

import React, {Component} from 'react';
import {Form, Input, Icon, Button, Checkbox, Radio} from 'antd';
import {trim} from 'lodash';
import './create-option.scss';

const FormItem = Form.Item;

// 答案选项
class OptionBox extends Component {
  handleChange = (type, e) => {
    const {value, onChange} = this.props;
    value[type] = e.target.value;
    onChange(value)
  }

  // 根据不同类型生成不同选项配置
  renderOptionType = () => {
    const {value, type} = this.props;
    switch (+type) {
      case 2:
        return <Checkbox checked={value.checked} value={!value.checked}
                         onChange={(e) => this.handleChange('checked', e)}/>;
      case 1:
      case 3:
      default:
        return <Radio checked={value.checked} value={!value.checked}
                      onChange={(e) => this.handleChange('checked', e)}/>;
    }
  }

  render() {
    const {value, id} = this.props;
    return (
      <div className="answers-option" id={id}>
        {
          this.renderOptionType()
        }
        <Input placeholder={`请填写选项`} size="large" onChange={(e) => this.handleChange('value', e)}/>
      </div>
    )
  }
}

//

const anserOption = {
  id: 0,
  value: '',
  checked: false
}

class CreateOption extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type && nextProps.type !== this.props.type) {
      const {form} = this.props;
      let answers = form.getFieldValue('answers');
      answers.map(item=> item.checked = false);
      const nextAnswers = [];
      switch (+nextProps.type) {
        case 1:
          nextAnswers.push(...this.generateOptions(answers, 2, 1));
          break;
        case 2: {
          nextAnswers.push(...this.generateOptions(answers, 3, 2));
          break;
        }
        case 3: {
          nextAnswers.push(...this.generateOptions(answers, 2, 3));
          break;
        }
        default:
          nextAnswers.push(...answers)
      }
      form.setFieldsValue({
        answers: [...nextAnswers],
      });
    }
  }

  // 生成选项
  generateOptions = (options, minLength, type) => {
    const nextAnswers = [];
    const len = options && options.length;
    if (!(options && len)) {
      // 当选项为空时，添加最少选项
      for (let i = 0; i < minLength; i++) {
        nextAnswers.push({...anserOption, id: i})
      }
    } else {
      if (len < minLength) {
        // 当选项存在时，且少于最小选项，补全选项
        nextAnswers.push(...options);
        for (let i = 0; i < minLength - len; i++) {
          nextAnswers.push({...anserOption, id: options[len - 1].id + (i + 1)})
        }
      } else {
        if (type === 3) {
          // 当试题类型为判断题时且选项多于2条时，截取选项
          if (len > minLength) {
            nextAnswers.push(...options.slice(0, minLength))
          }else{
            nextAnswers.push(...options);
          }
        } else {
          nextAnswers.push(...options);
        }
      }
    }
    return [...nextAnswers];
  }

  remove = (k) => {
    const {form, onChange} = this.props;
    // can use data-binding to get
    const answers = form.getFieldValue('answers');
    // We need at least one passenger
    if (answers.length === 1) {
      return;
    }

    // can use data-binding to set
    const nextAnswers = answers.filter(answer => answer.id !== k)
    form.setFieldsValue({
      answers: nextAnswers,
    });

    onChange(nextAnswers)
  }

  add = () => {
    const {form, onChange} = this.props;
    // can use data-binding to get
    const answers = form.getFieldValue('answers');
    const index = answers.length ? answers[answers.length - 1].id + 1 : 0;
    const nextAnswers = answers.concat({
      id: index,
      value: '',
      checked: false
    });
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      answers: nextAnswers,
    });
    onChange(nextAnswers);
  }

  handlerChange = (value) => {
    const {form, onChange, type} = this.props;
    const answers = this.props.form.getFieldsValue();
    let nextAnswers = [];
    Object.keys(answers).filter(key => {
      if (key !== 'answers') {
        // 当题型不为多选时，在更改值时重置选项选中状态
        if (+type !== 2 && value.id !== answers[key].id) {
          answers[key].checked = false;
        }
        nextAnswers.push(answers[key]);
      }
    });
    form.setFieldsValue({answers: nextAnswers,});
    onChange(nextAnswers);
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    getFieldDecorator('answers', {initialValue: []});
    const {type} = this.props;
    const answers = getFieldValue('answers');
    const showDelBtn = (target) => {
      switch (+type) {
        case 1:
          return answers.length > 2 ? <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={answers.length === 2}
            onClick={() => this.remove(target)}
          /> : null
        case 2:
          return answers.length > 3 ? <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={answers.length === 3}
            onClick={() => this.remove(target)}
          /> : null
        case 3:
        default:
          return null

      }
    }
    const formItems = answers.map((answer, index) => {
      return (
        <FormItem required={false} key={answer.id}>
          <div className="answer-content">
            {getFieldDecorator(`option-${index}`, {
              initialValue: answer,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "请填写答案内容",
                validator: (rule, value, callback) => {
                  if (!(value.value && trim(value.value))) {
                    callback(`value is empty!`);
                  }
                  callback();
                }
              }],
            })(<OptionBox onChange={this.handlerChange} type={type}/>)}

            {showDelBtn(answer.id)}
          </div>
        </FormItem>
      )
    });
    return (
      <div className="ant-form ant-form-horizontal create-option">
        {formItems}
        <FormItem>
          <Button type="dashed" onClick={this.add} style={{width: '100%'}} disabled={+type === 3}><Icon type="plus"/>
            新增答案</Button>
        </FormItem>
      </div>
    )
  }
}


export default Form.create()(CreateOption);
