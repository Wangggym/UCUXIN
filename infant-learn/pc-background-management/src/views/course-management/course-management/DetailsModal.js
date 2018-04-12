import React from 'react'
import {Modal, Form, Spin, Input, Select, Row, Col, Icon, Button, message, Radio} from 'antd'
import api from '../../../api'
import './style.scss'
import DetialsContent from './DetialsContent'

const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input
const RadioGroup = Radio.Group
const initState = (props) => {
  if (props.check) {
    return {
      checkVisible: true,
      buttonVisible: false,
      checkStatus: false,
    }
  }
  return {
    checkVisible: false,
    buttonVisible: true,
    checkStatus: props.checkStatus,
  }
}

class DetailsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      ...initState(props),
      course: {}
    }
  }

  componentDidMount() {

  }

  showModal = () => {
    this.setState(initState(this.props))
    const courseID = this.props.courseID
    this.setState({loading: true})

    api.CourseManagement.GetLecturerByID({courseID}).then(res => {
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        this.setState({course: res.Data, loading: false})
      } else {
        message.info(res.Msg)
      }

    })
    this.setState({visible: true});
  }


  handleOk = () => {

  }

  handleCancel = () => {
    this.setState({visible: false})
  }

  handleCheckStatus() {
    this.setState({checkVisible: true, buttonVisible: false})
  }

  handleCheckClick = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return message.info('请填写审核意见')
      api.CourseManagement.ApproveCourse({courseID: this.props.courseID, ...fieldsValue}).then(res => {
        if (!res) {
          return message.error('res为空')
        }
        if (res.Ret === 0) {
          message.success('审核申请提交成功')
          this.props.callback()
          this.setState({visible: false,})
        } else {
          message.info(res.Msg)
        }
      })
    })
  }

  render() {
    const {title} = this.props
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 14},}
    const {getFieldDecorator} = this.props.form
    return (
      <a href='javascript:void(0)' onClick={this.showModal}>
        <Modal onOk={this.handleOk} onCancel={this.handleCancel} visible={this.state.visible} title={title} width={1000}
               footer={null}>
          <Spin spinning={this.state.loading}>
            <Row>
              <Col span={this.state.checkVisible ? 13 : 24} className='absolute-center'>
                <DetialsContent {...this.state.course} checkVisible={this.state.checkVisible}/>
                {
                  this.state.checkStatus && this.state.buttonVisible && <div className='checkButton'>
                    <Button type='primary' onClick={this.handleCheckStatus.bind(this)}>审核</Button>
                  </div>
                }
              </Col>
              {
                this.state.checkVisible && <Col span={10} className='detailsForm'>
                  <Form>
                    <div style={{textAlign: 'center', marginBottom: 20}}>
                      <span>审核</span>
                    </div>
                    <FormItem
                      {...formItemLayout}
                      label="审核意见"
                    >
                      {getFieldDecorator('st', {initialValue: '50'})(
                        <RadioGroup>
                          <Radio value="50">通过</Radio>
                          <Radio value="40">不通过</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem required>
                      {getFieldDecorator('remark', {
                        rules: [
                          {required: true, message: '请填写审核意见'},
                        ],
                      })(
                        <TextArea rows={8} placeholder='请填写审核意见'/>
                      )}
                    </FormItem>
                    <div className='checkButton'>
                      <Button type='primary' onClick={this.handleCheckClick}>审核</Button>
                    </div>
                  </Form>
                </Col>
              }
            </Row>
          </Spin>
        </Modal>
        {this.props.children}
      </a>
    );
  }
}


//限定控件传入的属性类型
DetailsModal.propTypes = {}

//设置默认属性
DetailsModal.defaultProps = {}
export default Form.create()(DetailsModal)
