import React from 'react'
import {
    Card, Tabs, Button, Table, Pagination,
    Icon, Popconfirm, Form, Modal, Input, Select
} from 'antd'

const FormItem = Form.Item
const {Option} = Select;
const getOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Option value={ID} key={ID}>{Name}</Option>)
    })
    return array
}

const getOtherOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, OtherName}) => {
        array.push(<Option value={ID} key={ID}>{OtherName}</Option>)
    })
    return array
}

class CreateForm extends React.Component {
    state = {visible: false}
    showModal = () => {
        const {PublisherID, FasciculeID, ModulID} = this.props;
        this.props.form.setFieldsValue({PublisherID, FasciculeID, ModulID})
        this.setState({visible: true})
    }
    handleOk = (e) => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.modify(fieldsValue)
        });
        this.setState({visible: false})
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const {form, Publisher, Fascicule, Modul, PublisherID, FasciculeID, ModulID} = this.props;
        const {getFieldDecorator} = form
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        return (
            <span>
                <span onClick={this.showModal}>
                    {this.props.children}
                </span>
                <Modal
                    title="修改"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem label="教材版本"   {...formItemLayout}
                        >
                            {getFieldDecorator('PublisherID', {
                                rules: [
                                    {required: true, message: '教材版本必填'},
                                ],
                            })(
                                <Select>
                                    {getOtherOption(Publisher)}
                                </Select>
                            )}
                        </FormItem>

                        {FasciculeID != '0' && <FormItem label="册别"   {...formItemLayout}
                        >
                            {getFieldDecorator('FasciculeID', {
                                rules: [
                                    {required: true, message: '册别必填'},
                                ],
                            })(
                                <Select>
                                    {getOption(Fascicule)}
                                </Select>
                            )}
                        </FormItem>}
                        {ModulID != '0' && <FormItem label="模块"   {...formItemLayout}
                        >
                            {getFieldDecorator('ModulID', {
                                rules: [
                                    {required: true, message: '模块必填'},
                                ],
                            })(
                                <Select>
                                    {getOption(Modul)}
                                </Select>
                            )}
                        </FormItem>}
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(CreateForm);

