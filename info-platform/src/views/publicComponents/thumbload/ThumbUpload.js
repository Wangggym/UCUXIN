/**
 * Created by Yu Tian Xiong on 2017/12/28.
 * file:封面上传
 */
import React, {Component} from 'react';
import {Upload,Icon,message} from 'antd';
import oss from '../../../basics/oss/index';
import './thumbUpload.less'
export default class ThumbUpload extends Component{
    state = {
        cover:'',
        uploadPicLoading:false,
    };
    componentWillReceiveProps(nextProps) {
        if(nextProps.cover!==this.props.cover){
            this.setState({cover:nextProps.cover});
        }
    }
    // 封面上传部分
    beforeUpload = (file) => {
        const mimeType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
        const isJPG = mimeType.includes(file.type);
        if (!isJPG) {
            message.error('您只能上传图片类型为jpg、png、bmp、webp、gif的图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小必须小于2M！');
        }
        return isJPG && isLt2M;
    };

    //自定义封面上传
    handleCustomRequest = (options) => {
        this.setState({ uploadPicLoading: true });
        let key = options.file.name.slice(options.file.name.lastIndexOf('.') + 1);
        oss.ucuxin.uploader({
            options,
            attachmentStr: `{"Path": "zx","AttachType": 1, "ExtName": '.${key}',"ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`,
            cropRate:this.props.cropRate
        }, (res) => {
            if (res.Ret === 0) {
                if(this.props.size){
                  this.setState({cover:res.Data.ThumbUrl});
                  this.props.upload(res.Data.ThumbUrl);
                }else{
                  this.setState({cover:res.Data.Url});
                  this.props.upload(res.Data.Url);
                }
            } else {
                message.error('上传失败！');
                this.props.form.setFieldsValue({ cover: undefined });
            }
            this.setState({ uploadPicLoading: false });
        })
    };
    // 验证发布设置
    checkPublishSet = (rule, value, callback) => {
        if (value && value.type === 0) {
            if (value.date) {
                callback();
                return;
            } else {
                callback('请选择定时时间！');
                return;
            }
        }
        if (value && value.type === 1) {
            callback();
            return;
        }
        callback('请选择发布设定！');
    };
    render() {
        let {cover,uploadPicLoading} = this.state;
        return (
                <Upload
                    className="avatar-uploader"
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    customRequest={this.handleCustomRequest}
                    accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
                >
                    {
                        cover ?
                            <img src={cover} alt="" className="avatar" /> :
                            <div className="avatar-uploader-trigger"><Icon
                                type={uploadPicLoading ? 'loading' : 'plus'} /><br />{uploadPicLoading ? '正在上传...' : this.props.type ? '上传头像' : this.props.cropRate ? '添加图片' :'上传封面'}</div>
                    }
                </Upload>
        )
    }
}
