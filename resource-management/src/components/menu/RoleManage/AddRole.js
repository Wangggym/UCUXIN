import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Spin, Input, message, Select } from 'antd'
import { modeWrapper } from '../../../common'
import urls from './urls'
import ServiceAsync from '../../../common/service';
import api from '../../../api'
const FormItem = Form.Item
const Option = Select.Option
class AddRole extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeNodes: [],
            typeInitialValue: '',
        }

    }

    componentWillMount() {
        api.Menu.Authority_GetAuthorityRoleTypeList().then(result => {
            if (result.Msg) return message.error(result.Msg)
            this.getTypeNodes(result.Data)
        })
    }

    getTypeNodes(data) {
        const typeNodes = []
        let typeInitialValue = ''
        data.forEach(({ Text, Value, IsChecked }, index) => {
            if (index === 0) typeInitialValue = Value
            typeNodes.push(<Option value={Value} key={Value}>{Text}</Option>)
        })
        this.setState({ typeNodes, typeInitialValue })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const { onOk, onCancel, visible, loading } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Modal onOk={onOk} onCancel={onCancel} visible={visible} title='添加角色' width='600px'>
                <Spin spinning={loading}>
                    <Form>
                        <FormItem label='名称' {...formItemLayout} required>
                            {getFieldDecorator('Name')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label='类型' {...formItemLayout} required>
                            {getFieldDecorator('Type', { initialValue: this.state.typeInitialValue })(
                                <Select>
                                    {this.state.typeNodes}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}
const postUrls = api.Menu.Authority_AddOrEditRole
export default modeWrapper(null, postUrls)(AddRole)