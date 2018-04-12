/**
 * Created by Yu Tian Xiong on 2017/12/28.
 * file: list
 */
import React, {PureComponent} from 'react';
import {message,Upload,Input,Icon} from 'antd';
import oss from '../../../basics/oss';
const {TextArea} = Input;
export default class ListItem extends PureComponent {
    state = {
        cover: '',
        uploadPicLoading:false,
        data: this.props.data || {}
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.data && nextProps.data !== this.props.data){
            this.setState({data: nextProps.data});
        }
    }
    // 上传图片
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
    // 自定义图片上传
    handleCustomRequest = (options) => {
        this.setState({uploadPicLoading: true});
        let key = options.file.name.slice(options.file.name.lastIndexOf('.') + 1);
        oss.ucuxin.uploader({
            options,
            attachmentStr: `{"Path": "zx","AttachType": 1, "ExtName": '.${key}',"ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`,
            cropRate:""
        }, (res) => {
            if (res.Ret === 0) {
                this.handleBase64(options.file, imageUrl => this.setState({cover: imageUrl}));
                const {onChange} = this.props;
                this.setState({data: {...this.state.data, Img: res.Data.Url}}, ()=> onChange && onChange(this.state.data));
            } else {
                message.error('上传失败！');
                this.props.form.setFieldsValue({cover: undefined});
            }
            this.setState({uploadPicLoading: false});
        })
    };
    // 将图像转为base64
    handleBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    //删除对应数据
    handleDel = () => this.props.onRemove(this.state.data);

    handleChangeTextArea = (e)=> {
        const {onChange} = this.props;
        this.setState({data: {...this.state.data, Desc: e.target.value}}, ()=> onChange && onChange(this.state.data));
    };
    render(){
        const {data, cover,uploadPicLoading} = this.state;
        return(
            <div className="list-card" style={{margin:10,padding:10}}>
                <div>
                    <Upload
                        className="avatar-uploader"
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        customRequest={this.handleCustomRequest}
                        accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
                    >
                        {
                            (cover || data.Img) ?
                                <img src={cover || data.Img} alt="" className="avatar"/> :
                                <div className="avatar-uploader-trigger"><Icon
                                    type={uploadPicLoading ? 'loading' : 'plus'}/><br/>{uploadPicLoading ? '正在上传...' : '添加图片'}
                                </div>
                        }
                    </Upload>
                </div>
                <div className="text-area">
                    <TextArea defaultValue={data.Desc} placeholder="" autosize={{minRows: 4, maxRows: 8}} onChange={this.handleChangeTextArea}/>
                </div>
                <Icon type="close" style={{ fontSize: 14,marginLeft:10,cursor:'pointer' }} onClick={this.handleDel} />
            </div>
        )
    }
}