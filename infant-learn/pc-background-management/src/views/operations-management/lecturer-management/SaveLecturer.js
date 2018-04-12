/**
 * Created by QiHan Wang on 2017/8/28.
 * SaveLecturer
 */


import React, {Component} from 'react';
//import moment from 'moment';
import {Token, AppToken} from "../../../utils/token";
import {StorageService} from '../../../utils';
import Config from '../../../config';
import Api from '../../../api';
//import oss from '../../../utils/oss';
import './lecturer.scss';

// -- AntDesign Components
import {
  Form,
  Input,
  Button,
  Icon,
  Radio,
  Cascader,
  Select,
  Upload,
  Modal,
  message
} from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const Option = Select.Option;


//const dateFormat = 'YYYY-MM-DD';
const token = Token();
//const appToken = AppToken();


class Lecturer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      idPic: [],
      uploadIDPic: false,
      uploadPic: false,
      loading: false
    };
  }

  componentDidMount() {
    this.getBaseData();
    this.getAreaList();
    const {match, location} = this.props;
    if (match.params.id === 'update') {
      Api.OperationsManagement.getLecturer({token, lecturerID: location.state.id}).then(res => {
        if (res.Ret === 0) {
          const {Name, TelPhone, ProvinceID, CityID, AreaID, IDType, CardNo, CardImg, HeadPic, LecturerLevel, Achieve, Remark, Instro} = res.Data;
          const idPic = CardImg.split(',');
          this.props.form.setFieldsValue({
            name: Name,
            tel: TelPhone,
            address: [ProvinceID, CityID, AreaID].filter(item => !!item),
            idType: IDType.toString(),
            idNumber: CardNo.toString(),
            idPic,
            headPic: HeadPic,
            level: LecturerLevel.toString(),
            achieve: Achieve,
            remark: Remark,
            intro: Instro
          });

          this.setState({
            headPic: HeadPic,
            idPic: idPic.map((item, i) => {
              return {
                uid: i,
                name: item,
                status: 'done',
                url: item,
                realUrl: item
              }
            })
          })
        } else {
          message.error(res.Msg)
        }
      })
    }
  }

  // 动态加载区域数据
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // load options lazily
    this.getAreaList(targetOption);
  };
  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    }, () => console.log(this.state.inputValue));
  };

  // 按父ID获取省市区
  getAreaList = (targetOption) => {
    Api.OperationsManagement.getAreaList({token, rid: targetOption ? targetOption.value : 0}).then(res => {
      if (targetOption) targetOption.loading = false;
      if (res.Ret === 0) {
        let areas = res.Data.map(item => {
          return {
            value: item.Code,
            label: item.Name,
            isLeaf: item.Type === 3,
          }
        });
        if (targetOption) targetOption.children = areas;
        this.setState({areas: targetOption ? [...this.state.areas] : areas});
      } else {
        message.error(res.Msg);
      }
    })
  };

  // 获取表单基础数据
  getBaseData = async () => {
    let [IdTypes, lecturerLevels] = await Promise.all([
      Api.OperationsManagement.getIDType({token}),
      Api.OperationsManagement.getLecturerLevel({token})
    ]);

    this.setState({
      idTypeList: (IdTypes.Ret === 0 && Array.isArray(IdTypes.Data)) ? IdTypes.Data : [],
      lecturerLevelList: (lecturerLevels.Ret === 0 && Array.isArray(lecturerLevels.Data)) ? lecturerLevels.Data : []
    })
  };
  // ===================================================================================================================
  // 身体类型图片
  // 关闭图片预览
  handleClosePreview = () => this.setState({previewVisible: false})

  // 打开图片预览
  handleOpenPreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // 删除证件图片
  handleIDPicRemove = (file) => {
    this.setState({idPic: this.state.idPic.filter(item => item.uid !== file.uid)})
  };

  // 上传身份图片
  handleUploadIDPic = (options, token) => {
    /*const file = options.file;
    const attachmentStr = `{"Path": "youls","AttachType": 1, "ExtName": ".${file.name.slice(file.name.lastIndexOf('.') + 1)}","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`;

    const search = `?token=${token}&attachmentStr=${encodeURIComponent(attachmentStr)}`;
    oss.ucuxin.uploader(options, search)*/

    //oss.ucuxin.uploader()
    const file = options.file;
    const fd = new FormData();
    fd.append('filename', file);
    const attachmentStr = `{"Path": "youls","AttachType": 1, "ExtName": ".${file.name.slice(file.name.lastIndexOf('.') + 1)}","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`;
    this.setState({uploadIDPic: true});
    Api.Base.upload({
      token,
      attachmentStr,
      body: fd
    }).then(res => {
      if (res.Ret === 0) {
        this.handleBase64(file, imageUrl => {
          const idPic = this.state.idPic;
          this.setState({
            idPic: [
              ...idPic,
              {
                uid: idPic.length ? idPic[idPic.length - 1].uid + 1 : 0,
                name: file.name,
                status: 'done',
                url: imageUrl,
                realUrl: res.Data.Url
              }
            ]
          }, () => {
            const {setFieldsValue} = this.props.form;
            const {idPic} = this.state;
            setFieldsValue({idPic: [...idPic.map(item => item.realUrl)]});
          });
        });


      } else {
        message.error('上传失败！');
      }
      this.setState({uploadIDPic: false});
    })
  };

  // ===================================================================================================================
  // 头像上传部分
  // 图片上传前验证
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('您只能上传图片类型为jpg的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于2M！');
    }
    return isJPG && isLt2M;
  };

  // 自定义头像上传
  handleCustomRequest = (options, callback) => {
    // 获取应用Token
    AppToken().then(res => {
      if (typeof res === 'string') {
        callback(options, res);
      } else {
        let token = res.Data.Token;
        StorageService('session').set('AppToken', token);
        Config.setToken({name: 'appToken', value: token});
        callback(options, token);
      }
    })
  };

  // 上传头像
  handleUploadHeadPic = (options, token) => {
    const file = options.file;
    const fd = new FormData();
    fd.append('filename', file);
    const attachmentStr = `{"Path": "youls","AttachType": 1, "ExtName": ".${file.name.slice(file.name.lastIndexOf('.') + 1)}","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`;

    this.setState({uploadPic: true, headPic: undefined});
    this.props.form.setFieldsValue({headPic: undefined});
    Api.Base.upload({token, attachmentStr, body: fd}).then(res => {
      if (res.Ret === 0) {
        this.handleBase64(file, imageUrl => this.setState({headPic: imageUrl}));
        this.props.form.setFieldsValue({headPic: res.Data.Url});
      } else {
        message.error('上传失败！');
        this.props.form.setFieldsValue({headPic: undefined});
      }
      this.setState({uploadPic: false});
    })
  };
  // 将图像转为base64
  handleBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // ===================================================================================================================
  //  提交讲师信息
  handleSubmit = () => {
    const {location, form} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true});
        Api.OperationsManagement.addLecturer({
          token, body: {
            ID: location.state ? (location.state.id || 0) : 0,
            Name: values.name,
            TelPhone: values.tel,
            ProvinceID: values.address[0],
            CityID: values.address[1],
            AreaID: values.address[2],
            IDType: values.idType,
            CardNo: values.idNumber,
            CardImg: values.idPic.join(','),
            HeadPic: values.headPic,
            LecturerLevel: values.level,
            Achieve: values.achieve,
            Remark: values.remark,
            Instro: values.intro
          }
        }).then(res => {
          if (res.Ret === 0) {
            Modal.confirm({
              title: '新增成功',
              content: '是否继续添加？',
              onOk: () => {
                form.resetFields();
                this.setState({
                  idPic: [],
                  headPic: undefined
                })
              },
              onCancel: this.handleCancel,
            });
          } else {
            message.error(res.Msg);
          }
          this.setState({loading: false});
        });
      } else {
        message.error('请将表单填写完整！');
      }
    })
  };

  // 取消新增
  handleCancel = () => {
    this.props.history.push('/lecturer-management')
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {loading, areas, idTypeList, lecturerLevelList, headPic, idPic, previewVisible, previewImage, uploadIDPic, uploadPic} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
    };

    const validateRuleIDType = ()=> {
      switch (+this.props.form.getFieldValue('idType')){
        case 1:
         return [
            {required: true, message: '请填写证件号码'},
            {pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message:'请输入正确的身份正号码'}
          ];
        case 2:
          return [
            {required: true, message: '请填写证件号码'},
            {pattern:/(^\d{15}$)|(^\d{17}$)/, message:'请输入正确的教师资格证编号'}
          ];
        case 3:
          return [
            {required: true, message: '请填写证件号码'},
            {pattern:/(^\d{17}$)|(^\d{18}$)/, message:'请输入正确的学历证编号'}
          ];
        default:
          return [{required: true, message: '请填写证件号码'}];
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 6,
        },
      },
    };
    return (
      <div className="lecturer">
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label={'姓名'}>
            {getFieldDecorator(`name`, {rules: [{required: true, message: '请填写讲师姓名'}]})(<Input placeholder="请填写讲师姓名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label={'手机号码'}>
            {getFieldDecorator(`tel`, {rules: [
              {required: true, message: '请填写手机号码'},
              {pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/, message:'请输入正确的11位手机号码！'}
              ]})(<Input placeholder="请填写手机号码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label={'所属区域'}>
            {getFieldDecorator(`address`, {rules: [{required: true, message: '请选择所在地区'}]})(
              <Cascader
                placeholder="选择区域"
                style={{width: 300}}
                options={areas}
                loadData={this.loadData}
                onChange={this.onChange}
              />
            )}</FormItem>
          <FormItem {...formItemLayout} label="证件类型">{
            getFieldDecorator(`idNumber`, {rules: validateRuleIDType()})(
              <Input addonBefore={getFieldDecorator('idType', {initialValue: '1'})(
                <Select placeholder="请选择类型" style={{minWidth: 100}}>
                  {
                    idTypeList && idTypeList.map(item => <Option value={item.Value}
                                                                 key={item.Value}>{item.Text}</Option>)
                  }
                </Select>
              )} style={{width: '100%'}}/>
            )}</FormItem>
          <FormItem
            {...formItemLayout}
            label="证件图片"
            extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰"
          >{getFieldDecorator(`idPic`, {rules: [{required: true, message: '请上传证件图片'}]})(
            <Upload
              listType="picture-card"
              fileList={idPic}
              onPreview={this.handleOpenPreview}
              onRemove={this.handleIDPicRemove}
              customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadIDPic(file, token))}
              disabled={uploadIDPic}
            >
              {idPic.length >= 4 ? null :
                <div>
                  <Icon type={uploadIDPic ? 'loading' : 'plus'}/>
                  <div className="ant-upload-text">{uploadIDPic ? '正在上传...' : '上传图片'}</div>
                </div>}
            </Upload>
          )}
            <Modal visible={previewVisible} footer={null} onCancel={this.handleClosePreview}>
              <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="头像"
            extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰"
          >{getFieldDecorator(`headPic`, {rules: [{required: true, message: '请上传头像'}]})(
            <Upload
              className="avatar-uploader"
              name="avatar"
              showUploadList={false}
              beforeUpload={this.beforeUpload}
              customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadHeadPic(file, token))}
              disabled={uploadPic}
            >
              {
                (headPic && !uploadPic) ?
                  <img src={headPic} alt="" className="avatar"/> :
                  <div className="avatar-uploader-trigger"><Icon type={uploadPic ? 'loading' : 'plus'}/><br/>{uploadPic ? '正在上传...' : '上传头像'}</div>
              }
            </Upload>
          )}
            {
              headPic?<Button onClick={()=>{this.setState({headPic:undefined})}} className="delet-img" size="small">删除<Icon type="delete" /></Button>:""
            }
          </FormItem>
          <FormItem {...formItemLayout} label="讲师身份">{getFieldDecorator(`level`, {
            rules: [{
              required: true,
              message: '请选择讲师身份'
            }]
          })(
            <RadioGroup>
              {
                lecturerLevelList && lecturerLevelList.map(item => <Radio value={item.Value}
                                                                          key={item.Value}>{item.Text}</Radio>)
              }
            </RadioGroup>
          )}</FormItem>
          <FormItem {...formItemLayout} label="成就">{getFieldDecorator(`achieve`)(<TextArea
            autosize={{minRows: 2, maxRows: 6}}/>)}</FormItem>
          <FormItem {...formItemLayout} label="简介">{getFieldDecorator(`intro`)(<TextArea
            autosize={{minRows: 2, maxRows: 6}}/>)}</FormItem>
          <FormItem {...formItemLayout} label="备注">{getFieldDecorator(`remark`)(<TextArea
            autosize={{minRows: 2, maxRows: 6}}/>)}</FormItem>
          <FormItem {...tailFormItemLayout} style={{flex: 1, marginRight: 0, textAlign: 'center'}}>
            <Button type="primary" loading={loading} onClick={this.handleSubmit}>确定</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Lecturer)
