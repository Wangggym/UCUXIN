/**
 * Created by QiHan Wang on 2017/9/27.
 * AddDimension
 */
import React, {Component} from 'react';

import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';
// -- AntDesign Components
import {Form, Select, Spin, Cascader, Modal, message} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const token = Token();

class AddDimension extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase:[],
      grade:[],
      subject:[],
      publisher: []
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      phase:nextProps.phase,
      subject:nextProps.subject,
      publisher: nextProps.publisher
    });
  }
  handleOk = () => {
    this.props.form.validateFields((err, values)=> {
      if(err){
        message.error('请将表单填写完整！')
        return;
      }
      this.props.handleSubmit(values, this.props.form.resetFields);
    });
  };
  handleCancel = () => {
    this.props.handleCancel();
  };

  handlePhaseChange =(value)=> {
    ServiceAsync('GET', 'Resource/v3/Property/GetGradeList', {token,phaseID:value}).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({grade: res.Data});
        }
      }
    });
    this.props.form.resetFields(['addGrade']);
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {visible, confirmLoading} = this.props;
    const {phase, grade, subject, publisher} = this.state;
    return (
      <Modal title="新增维度管理"
             visible={visible}
             onOk={this.handleOk}
             confirmLoading={confirmLoading}
             onCancel={this.handleCancel}
             width="600px"
             maskClosable={false}
      >
        <Form onSubmit={this.handleAddSubmit}>
          <FormItem label={'学段'}>
            {getFieldDecorator(`addPhase`)(
              <Select
                showSearch
                placeholder="请选择学段"
                optionFilterProp="children"
                onChange={this.handlePhaseChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                  phase.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'年级'}>
            {getFieldDecorator(`addGrade`)(
              <Select
                showSearch
                placeholder="请选择年级"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  grade.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'科目'}>
            {getFieldDecorator(`addSubject`)(
              <Select
                showSearch
                placeholder="请选择科目"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  subject.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'出版社'}>
            {getFieldDecorator(`addPublish`)(
              <Select
                showSearch
                placeholder="请选择出版社"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  publisher.map((item) => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddDimension);
