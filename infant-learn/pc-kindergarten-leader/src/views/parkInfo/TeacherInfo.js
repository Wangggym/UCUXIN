import React from 'react'
import { Card, Form } from 'antd'
const FormItem = Form.Item
const teacherFormItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } }
const TeacherInfo = ({ Name, HeadImg, Instro }) => {
    return (
        <Card className='teacher-card'>
            <FormItem {...teacherFormItemLayout} label='姓名'>
                <div className='park-content'>
                    {Name}
                </div>
            </FormItem>
            <FormItem {...teacherFormItemLayout} label='头像'>
                <div className='park-content'>
                    <img src={HeadImg} />
                </div>
            </FormItem>
            <FormItem {...teacherFormItemLayout} label='简介'>
                <div className='park-content'>
                    {Instro}
                </div>
            </FormItem>
        </Card>
    )
}
export default TeacherInfo