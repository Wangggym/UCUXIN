/**
 * Created by QiHan Wang on 2017/8/16.
 * CreateAnswer
 */
import React, {Component} from 'react';
import './create-answer.scss';
import {Form, Radio, Checkbox, Icon} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class CreateAnswer extends Component {

  handleChange = (checkedValues) => {

    if(Array.isArray(checkedValues)){
      this.props.onChange(checkedValues)
    }else{
      this.props.onChange(checkedValues.target.value)
    }


    console.log(checkedValues)
  }

  renderAnswer = (type, data) => {
    switch (+type) {
      case 1:
        return <RadioGroup onChange={this.handleChange}>
          {
            data.map(item => <Radio value={item.label}
                                    key={item.id}>{`${item.label}：${item.value}`}</Radio>)
          }
        </RadioGroup>
      case 2:
        return <CheckboxGroup onChange={this.handleChange}>
          {
            data.map(item => <Checkbox key={item.id}
                                       value={item.label}>{`${item.label}：${item.value}`}</Checkbox>)
          }
        </CheckboxGroup>
      case 3:
        return <div className="ant-form ant-form-inline judgment-answer">
          {
            data.map(opt=>
              <FormItem label={`选项${opt.label}`} key={opt.id}>
                <RadioGroup onChange={this.handleChange}>
                  <Radio value={true}><Icon type="check" /></Radio>
                  <Radio value={false}><Icon type="close" /></Radio>
                </RadioGroup>
              </FormItem>
            )
          }

        </div>
      default:
        return null;
    }
  }

  render() {
    const {type, options} = this.props;
    return this.renderAnswer(type, options)
  }
}

export default Form.create()(CreateAnswer);
