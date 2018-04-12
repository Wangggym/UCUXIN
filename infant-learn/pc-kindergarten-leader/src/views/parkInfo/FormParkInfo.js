import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Icon, Upload, message } from 'antd'
import { AppToken } from "../../utils/token";
import { StorageService } from '../../utils';
import Config from '../../config';
import Api from '../../api';
import './style.scss'
import ButtonGroup from './ButtonGroup'
const FormItem = Form.Item
const TextArea = Input.TextArea
class FormParkInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    // 自定义头像上传
    handleCustomRequest = (options, callback) => {
        // 获取应用Token
        Api.Base.getAppToken().then(res => {
            if (typeof res === 'string') {
                callback(options.file, res);
            } else {
                let token = res.Data.Token;
                StorageService('session').set('AppToken', token);
                Config.setToken({ name: 'appToken', value: token });
                callback(options.file, token);
            }
        })
    };

    // 上传头像
    handleUploadHeadPic = (file, token) => {
        console.log(file)
        const fd = new FormData();
        fd.append('filename', file);
        const attachmentStr = '{"Path": "youls","AttachType": 1, "ExtName": ".jpg","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }';
        Api.Base.upload({
            token,
            attachmentStr,
            body: fd
        }).then(res => {
            if (res.Ret === 0) {
                this.handleBase64(file, imageUrl => this.setState({ ImgUrl: imageUrl }));
                this.props.form.setFieldsValue({ ImgUrl: res.Data.Url });
            } else {
                message.error('上传失败！');
                this.props.form.setFieldsValue({ ImgUrl: undefined });
            }
        })
    };

    // 将图像转为base64
    handleBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleConfirm = (field) => {
        console.log(field)
    }

    render() {
        const { current } = this.props
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem {...formItemLayout} label="园所名称" >
                    {getFieldDecorator('Name', {
                        rules: [{ required: true, message: ' 园所名称必填', }],
                    })(
                        <Input />
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="机构图片" extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰">
                    {getFieldDecorator(`ImgUrl`, { rules: [{ required: true, message: '机构图片必填' }] })(
                        <Upload
                            className="avatar-uploader"
                            name="avatar"
                            showUploadList={false}
                            beforeUpload={this.beforeUpload}
                            customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadHeadPic(file, token))}
                        >
                            {
                                this.state.ImgUrl ?
                                    <img src={this.state.ImgUrl} alt="" className="avatar" /> :
                                    <Icon type="plus" className="avatar-uploader-trigger" />
                            }
                        </Upload>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="园所历史" >
                    {getFieldDecorator('History')(<TextArea rows={3} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="办学理念" >
                    {getFieldDecorator('Theory')(<TextArea rows={3} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="园所特色" >
                    {getFieldDecorator('Feature')(<TextArea rows={3} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="硬件环境介绍" >
                    {getFieldDecorator('Hardware')(<TextArea rows={3} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系电话" >
                    {getFieldDecorator('Tel')(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="咨询老师" >
                    {getFieldDecorator('email')(<Input />)}
                </FormItem>
            </Form>
        )
    }
}

//限定控件传入的属性类型
FormParkInfo.propTypes = {

}

//设置默认属性
FormParkInfo.defaultProps = {

}
export default Form.create()(FormParkInfo)
