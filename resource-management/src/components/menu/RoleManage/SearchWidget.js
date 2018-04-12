import React from 'react'
import { Form, Button, Input, message } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item

class SearchWidget extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    //条件搜索
    handleSearch = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return message.info(err)
            const { onSearch } = this.props
            onSearch && onSearch(values)
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form layout="inline">
                <FormItem label={'角色名称'} >
                    {getFieldDecorator('name')(
                        <Input />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(SearchWidget)
