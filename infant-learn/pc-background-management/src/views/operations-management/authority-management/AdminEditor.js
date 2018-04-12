import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Spin, Input, Select, Row, Col, Icon, Button, message } from 'antd'
import api from '../../../api'
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search
const ManageLevelType = [,'运营者', '省管理员', '市管理员', '区县管理员']
const AppToken = api.Base.getAppToken
const getManageLevel = (string) => {
    if (!-string.charAt(3)) return 2
    if (!-string.charAt(5)) return 3
    return 4
}
class AdminEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loading: false,
            token: '',
            user: null,
        }
    }

    componentDidMount() {
        //获得APPtoken
        AppToken().then(res => {
            if (!res) {
                return message.error('res为空')
            }
            if (res.Ret === 0) {
                this.setState({ token: res.Data.Token })
            } else {
                message.info(res.Msg)
            }
        })
    }

    showModal = () => {
        if (!this.props.AreaID) return message.info('请选择区域')
        this.props.form.resetFields()
        this.setState({ visible: true });
    }


    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            this.setState({ loading: true })
            const body = { ...values, ID: '0', UID: this.state.user.UID, AreaID: this.props.AreaID }
            api.AuthorityManagement.EditorMange({ body }).then(res => {
                if (!res) {
                    return message.error('res为空')
                }
                if (res.Ret === 0) {
                    this.props.callback('新增成功！')
                    this.setState({ visible: false, })
                } else {
                    message.info(res.Msg)
                }
                this.setState({ loading: false })
            })
            console.log(body)
        });
    }

    handleCancel = () => {
        this.props.form.resetFields()
        this.setState({
            visible: false,
        });
    }

    handleSearchClick = () => {
        this.props.form.validateFields(['Tel'], (err, values) => {
            if (err) return
            this.setState({ loading: true })
            api.AuthorityManagement.GetUserByTel({ tel: values.Tel, token: this.state.token }).then(res => {
                if (!res) {
                    return message.error('res为空')
                }
                if (res.Ret === 0) {
                    if (!res.Data) {
                        message.info('没有该成员')
                        this.props.form.resetFields(['Name'])
                        return this.setState({ loading: false })
                    }
                    this.setState({ user: res.Data })
                    this.props.form.setFieldsValue({ Name: res.Data.Name })
                } else {
                    message.info(res.Msg)
                }
                this.setState({ loading: false })
            })
        });
    }

    handleKeyDown(e) {
        if (e.which === 13) {
            this.handleSearchClick()
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { getFieldDecorator } = this.props.form
        const manageLevelOption = (ManageLevelType) => {
            const array = []
            ManageLevelType.forEach((item, index) => {
                array.push(<Option value={index} key={index}>{item}</Option>)
            })
            return array
        }
        return (
            <a href='javascript:void(0)' onClick={this.showModal}>
                <Modal onOk={this.handleOk} onCancel={this.handleCancel} visible={this.state.visible} title='新增管理员' width='600px'>
                    <Spin spinning={this.state.loading}>
                        <Form>
                            <Row>
                                <Col span={18}>
                                    <FormItem label='手机号码' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} required>
                                        {getFieldDecorator('Tel', {
                                            rules: [
                                                { required: true, pattern: /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确电话号码' },
                                            ],
                                        })(
                                            <Input onKeyDown={this.handleKeyDown.bind(this)} />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={2} style={{ textAlign: 'right' }}>
                                    <Button icon='search' style={{ border: 'none' }} shape="circle" onClick={this.handleSearchClick}></Button>
                                </Col>
                            </Row>
                            <FormItem label='用户名称' {...formItemLayout} required>
                                {getFieldDecorator('Name', {
                                    rules: [
                                        { required: true, message: '请搜索名称' },
                                    ],
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem label='管理员级别' {...formItemLayout}  >
                                {getFieldDecorator('ManageLevel', { initialValue: getManageLevel(this.props.AreaID) })(
                                    <Select disabled>
                                        {manageLevelOption(ManageLevelType)}
                                    </Select>
                                )}
                            </FormItem>
                        </Form>
                    </Spin>
                </Modal>
                {this.props.children}
            </a>
        );
    }
}

//限定控件传入的属性类型
AdminEditor.propTypes = {

}

//设置默认属性
AdminEditor.defaultProps = {

}

export default Form.create()(AdminEditor)

