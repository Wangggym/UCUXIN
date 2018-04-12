/**
 * Created by xj on 2017/8/23
 */
import React, {Component} from "react";
import {
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  Spin,
  Radio,
  Row,
  Select,
  Upload
} from 'antd';
import {withRouter} from 'react-router-dom';
import {AppToken, Token} from "../../../utils/token";
import {StorageService} from '../../../utils';
import Config from '../../../config';

import Api from '../../../api';
import moment from 'moment';
import './training-plan.scss'

const token = Token();
const appToken = AppToken();
const Search = Input.Search;
const {TextArea} = Input;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const Option = Select.Option;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class AddTrainingPlan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      TrainType: [],//存储培训类型
      TrainObj: [], //存储培训对象
      TeachWay: [],//存储授课方式
      TeachWayplainOptions: [],//存储授课方式文本
      IsCharge: false,//是否可收费
      visible: false,//是否显示模态框
      visbleScope: false,//展示显示区域
      organizationModal: false,//是否显示机构模态框
      addShool: false,//是否显示添加学校模态框
      visibleBtn: true,//查询可见范围按钮
      TeacherInfo: [], //所有讲师列表
      HaveSelectTeacher: [],//被选中的的讲师
      rid: "",//存储区域id
      schoolName: "",//学校名称
      organization: [],//机构信息
      RangList: [],  //已填写的机构信息
      ProCityRangList: [],//已填写的省市区人数
      uploadIDPic: false,//上传附件状态
      loading: false
    }
  }


  componentDidMount() {
    //初始化编辑时带参数给新增页面
    if (this.props.location.state) {
      const {NowData} = this.props.location.state;
      console.log(NowData)
      //存储AreaID和附件名称
      this.setState({
        AreaID: NowData.AreaIDs[0],
        AttachName:NowData.AttachName
      })
      //处理培训对象
      let deaultDestPeople = []
      NowData.DestPeople.map(item => {
        if (item.IsCheck) {
          deaultDestPeople.push(item.ID)
        }
      })
      //处理可见范围
      let SchoolNameList = [];
      NowData.RangeIndcatorList && NowData.RangeIndcatorList.length && NowData.RangeIndcatorList.forEach(item => {
        SchoolNameList.push(item.AreaName + "(" + item.Cnt + ")人")
      })
      this.setState({
        RangList: NowData.RangList,
        ProCityRangList: NowData.RangeIndcatorList
      });

      // 处理授课讲师
      this.setState({
        HaveSelectTeacher: NowData.LecturerList
      })
      //显示默认的附件
      this.setState({
        fileList: [{
          uid: NowData.ID,
          name: NowData.AttachName,
          status: 'done',
          url: NowData.AttachUrl,
        }]
      })
      let NameList = [];
      NowData.LecturerList.forEach(item => {
        NameList.push(item.Name)
      })
      //默认选择的区域
      let areaID = NowData.AreaIDs;
      //设置默认限制人数（对用户再进行修改人数时进行判断）
      this.setState({
        limitNum:NowData.QtyLimit,
      });

      this.props.form.setFieldsValue({
        "TrainingName": NowData.Name,
        "TrainingType": NowData.TrainType.toString(),
        "TrainingObj": deaultDestPeople,
        "QtyLimit": NowData.QtyLimit,
        "SchoolScopeName": SchoolNameList,
        "TrainingContent": NowData.Cnt,
        "TrainingTotalScore": NowData.SumCredit,
        "TeachWay": NowData.TeachWay.toString(),
        "Teacher": NameList,//授课讲师
        "AccordingScore": NowData.Price,//按学分收费
        "AccordingTrain": NowData.TotalFee,//总收费
        "headPic": NowData.AttachUrl,//附件地址
        "Accessory": NowData.AttachCnt,//附件内容
      })
    }

    //获取培训类型
    Api.CourseManagement.GetTrainTypeList({token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          TrainType: res.Data
        })
      }
    });
    //获取培训对象
    let getConfigData = {
      token,
      mTypeID: 11,
      phase: 30010,
      isGetManager: false
    }
    Api.CourseManagement.GetBusinessMemberRoles(getConfigData).then(res => {
      if (res.Ret === 0) {
        this.setState({
          TrainObj: res.Data
        })
      }
    })
    //获取授课方式
    Api.CourseManagement.GetTeachWayList({token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          TeachWay: res.Data
        }, () => this.handleTeachWay())
      }
    })
    //获取当前用户所在区域
    this.getMangeUser()
  }

  //获取当前用户所在区域
  getMangeUser() {
    Api.CourseManagement.GetMangeUser(token).then(res => {
      if (res.Ret === 0) {
        this.setState({AreaName: res.Data.AreaName, rid: res.Data.AreaID})
        //根据区域id获取省市县
        this.getProCity(res.Data.AreaID)
      }
    })
  }

//获取省市县
  getProCity(AreaID) {
    Api.OperationsManagement.getAreaList({token, rid: AreaID}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          ProvinceData: res.Data
        }, () => this.setProCityDefaultValue())
      }
    })
  }

//设置省市默认值
  setProCityDefaultValue() {
    const {NowData} = this.props.location.state;
    const {ProvinceData} = this.state;
    NowData.RangeIndcatorList.map(item => {
      ProvinceData.map(e => {
        if (item.AreaID === e.Code) {
          e.Cnt = item.Cnt
        }
      })
    })
    this.setState({ProvinceData})
  }

//处理授课方式
  handleTeachWay() {
    let TeachWayplainOptions = [];
    const {TeachWay} = this.state;
    TeachWay.forEach((item, key) => {
      TeachWayplainOptions.push(item.Text)
    })
    this.setState({TeachWayplainOptions})
  }

  //保存
  handleSearch = (e) => {
    e.preventDefault();
    const {TrainningObjValue, HaveSelectTeacher, RangList, AreaID, TrainObj, ProCityRangList,AttachName} = this.state;
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (err) {
        message.error('表单人填写不完整！')
        return;
      }
      // 处理选中适用对象
      TrainObj.map(item => {
        item.IsCheck = false;
        values.TrainingObj.map(tr => {
          if (tr === item.ID) item.IsCheck = true;
        })
      });
      let SaveData = {};
      SaveData.ID = this.props.location.state.NowData.ID
      SaveData.Name = values.TrainingName;//培训名称0
      SaveData.TrainType = values.TrainingType;//培训类型
      SaveData.AreaID = AreaID//区域id
      SaveData.QtyLimit = values.QtyLimit;//限制人数
      SaveData.DestPeople = TrainObj;//培训对象
      SaveData.RangList = RangList || [];  //可见范围
      SaveData.RangeIndcatorList = ProCityRangList || [];  //可见范围(省市)
      SaveData.Cnt = values.TrainingContent;  //培训内容
      SaveData.TeachWay = values.TeachWay;    //授课方式
      SaveData.SumCredit = values.TrainingTotalScore; //培训总学分
      //SaveData.StandardCnt = values.GetScoreStandard; //学分获得标准
      //SaveData.IsAllLecturer = values.IsAllLecturer; //是否为全部讲师 true- 全部讲师 false-部分
      SaveData.Price = values.AccordingScore || 0;//单价 每个学分单价
      SaveData.TotalFee = values.AccordingTrain || 0;//总费用 项目费用
      SaveData.LecturerList = HaveSelectTeacher;//授课讲师
      SaveData.EndDate = values.CourseEDate ? moment(values.CourseEDate).format(dateFormat) : '';//截止时间 课程提交截止时间
      SaveData.TrainSDate = values.TrainSEDate ? moment(values.TrainSEDate[0]).format(dateFormat) : '';//培训开始时间
      SaveData.TrainEDate = values.TrainSEDate ? moment(values.TrainSEDate[1]).format(dateFormat) : '';// 培训结束时间
      SaveData.AttachUrl = values.headPic || "";//附件地址
      SaveData.AttachName = AttachName;//附件名称
      SaveData.AttachCnt = values.Accessory || "";//附件内容
      //新增编辑计划
      Api.CourseManagement.AddOrEditTrainPlan(SaveData, token).then(res => {
        if (res.Ret !== 0) {
          message.warn(res.Msg)
        } else {
          message.info("保存成功")
          setTimeout(() => {
            this.props.history.push({pathname: `/training-plan`})
          }, 2000)
        }
      })
    });
  }

  //查询可见范围列表
  searchScope(AreaID) {
    let data = {
      name: this.state.schoolName,
      rid: this.state.rid || AreaID,
      token
    }
    Api.CourseManagement.GetGroupsByRid(data).then(res => {
      if (res.Ret === 0) {
        this.setState({
          organization: res.Data,
          organizationModal: true,
          visbleScope: false
        })
      }
    })
  }

  //学校名称
  schoolName(e) {
    this.setState({
      schoolName: e
    })
  }

//是否收费
  changeIsCharge(e) {
    if (!e.target.value) {
      this.props.form.setFieldsValue({
        "AccordingScore": 0,
        "AccordingTrain": 0,
      })
    }
    this.setState({
      IsCharge: e.target.value
    })
  }

//选择讲师模态框取消
  handleCancel() {
    this.setState({visible: false})
  }

// //选择机构模态框取消
//   CancelOrganization() {
//     this.setState({
//       organizationModal: false
//     })
//   }

  //选择授课讲师
  selectTeacher() {
    const {TeacherInfo, HaveSelectTeacher} = this.state
    //初始化获取讲师
    Api.CourseManagement.GetLecturerSelectList().then(res => {
      if (res.Ret === 0) {
        this.setState({
          TeacherInfo: res.Data
        }, () => {
          //初始化获取讲师时，删除全部列表下已经存在于已选择列表下的讲师
          this.setState({TeacherInfo: this.uncheckedUser(this.state.TeacherInfo, HaveSelectTeacher)})
        })
      } else {
        message.warn(res.Msg)
      }
    })
    this.setState({visible: true})
  }

  //选择可选范围
  selectScope() {
    this.setState({
      organizationModal: true
    })
  }

  changPeopleNum(value, id, name, index) {
    console.log(value, id, name, index)
    const {RangList} = this.state;
    let data = {
      Count: value,
      GID: id,
      GName: name,
      AreaID: this.state.rid,
      // CUID:不用传
    }
    //判断当前机构是否已经存在RangList（存在-修改人数，不存在-添加当前机构信息，人数为空-删除已经存在的机构信息/不添加机构信息）
    if (RangList.length !== 0) {
      const index = RangList.findIndex(item => item.GID === id);
      if (index >= 0) {
        RangList[index].Count = value;
      } else {
        RangList.push(data)
      }
    } else {
      RangList.push(data)
    }
    this.setState({
      RangList,
    })

  }

  handleUpdatePeopleNum (value, index){
    const {organization} = this.state;
    organization[index].Count = value;
    this.setState({
      organization
    })
  };
//改变省市区的人数
  changProCityNum(value, id, name) {
    const {ProCityRangList} = this.state;
    let data = {
      ID: 0,
      AreaID: id,
      AreaName: name,
      TrainPlanID: 0,
      Cnt: value,
      TrainST: 1
    }
    //判断当前机构是否已经存在RangList（存在-修改人数，不存在-添加当前机构信息，人数为空-删除已经存在的机构信息/不添加机构信息）
    if (ProCityRangList.length !== 0) {
      const index = ProCityRangList.findIndex(item => item.GID === id);
      if (index >= 0) {
        ProCityRangList[index].Count = value;
      } else {
        ProCityRangList.push(data)
      }
    } else {
      ProCityRangList.push(data)
    }
    this.setState({
      ProCityRangList
    }, () => console.log(this.state.ProCityRangList))
  }

  //根据关键字获取讲师
  searchTeacher(e) {
    const {HaveSelectTeacher} = this.state;
    //点击搜索按钮直接传入的是值
    Api.CourseManagement.GetLecturerSelectList(e).then(res => {
      if (res.Ret === 0) {
        //当再次点击获取全部讲师的时候，判断否已经存在在已选讲师列表。若存在，将该信息删除
        let allTeacher = res.Data;
        this.setState({TeacherInfo: this.uncheckedUser(allTeacher, HaveSelectTeacher)})
      } else {
        message.warn(res.Msg)
      }
    })
  }

  //处理全部人员
  uncheckedUser(all, checked) {
    const array = all.filter(({ID}) => {
      let ischecked = false
      for (let i = 0; i < checked.length; i++) {
        if (checked[i].ID === ID) {
          ischecked = true
          break
        }
      }
      return !ischecked
    })
    return array
  }

//点击添加讲师
  addTeacher(item) {
    const {HaveSelectTeacher, TeacherInfo} = this.state;
    //点击添加到已选讲师列表后，将当前添加的对象从所有讲师列表中删除
    TeacherInfo.forEach((e, i) => {
      if (e.ID === item.ID) {
        this.setState({
          TeacherInfo: [
            ...TeacherInfo.slice(0, i),
            ...TeacherInfo.slice(i + 1)
          ]
        })
      }
    })
    HaveSelectTeacher.push(item)
    this.setState({HaveSelectTeacher})
  }

//点击从已选列表中删除，添加到所有讲师列表
  delHaveSelect(item) {
    const {HaveSelectTeacher, TeacherInfo} = this.state;
    //点击添加到已选讲师列表后，将当前添加的对象从所有讲师列表中删除
    HaveSelectTeacher.forEach((e, i) => {
      if (e.ID === item.ID) {
        this.setState({
          HaveSelectTeacher: [
            ...HaveSelectTeacher.slice(0, i),
            ...HaveSelectTeacher.slice(i + 1)
          ]
        })
      }
    })
    TeacherInfo.push(item)
    this.setState({TeacherInfo})
  }

  //确定讲师模态框
  sureSelect(HaveSelectTeacher) {
    const Teacher = [];
    this.setState({
      visible: false
    })
    HaveSelectTeacher.forEach(item => {
      Teacher.push(item.Name)
    })
    let TeacherList = Teacher.join(",")
    this.props.form.setFieldsValue({"Teacher": TeacherList})
  }

  //添加学校
  addSchool() {
    const {AreaID} = this.state;
    //获取当前区域下的学校
    this.setState({
      addShool: true
    })
  }

  //搜索
  searchShool() {
    this.setState({loading: true})
    let data = {
      name: this.state.schoolName,
      rid: this.state.rid,
      token
    }
    Api.CourseManagement.GetGroupsByRid(data).then(res => {
      if (res.Ret === 0) {
        this.setState({
          organization: res.Data,
          loading: false,
        }, () => this.setSchoolDefaultValue())
      } else {
        message.warn(res.Msg)
        this.setState({loading: false})

      }
    })
  }

//设置学校默认值
  setSchoolDefaultValue() {
    const {NowData} = this.props.location.state;
    const {organization} = this.state;
    //给没有设置学校人数的默认设置0
    organization.map(item=>{
      item.Count=0
    });

    NowData.RangList.map(item => {
      organization.map(e => {
        if (item.GID === e.ID) {
          e.Count = item.Count
        }
      })
    });
    this.setState({organization})
  }

//确定省市区范围模态框
  sureOrganization(ProCityRangList) {
    const School = [];
    const {RangList}=this.state;
    //当有学校人数的时候，将学校人数和市人数相加 不能大于限制人数
    //限制学校人数 Count
    let schoolNum = 0;
    RangList.map(item=>{
      schoolNum+=+item.Count
    });
    //限制市人数
    let setNum = 0;
    ProCityRangList.map(item=>{
      setNum+=+item.Cnt
    });

    if(this.state.limitNum<((setNum?setNum:0)+(schoolNum?schoolNum:0))){
      message.warn("总人数不能超过限制人数！");
      return;
    }
    this.setState({
      ProCityRangList: this.delNullNum(ProCityRangList),
      organizationModal: false
    }, () => {
      this.state.ProCityRangList.forEach(item => {
        School.push(item.AreaName + "(" + item.Cnt + ")人")
      })
      let SchoolList = School.join(",")
      this.props.form.setFieldsValue({"SchoolScopeName": SchoolList})
    })

  }

  //取消省市区范围模态框
  CancelOrganization() {
    const {ProCityRangList} = this.state;
    this.setState({
      ProCityRangList: this.delNullNum(ProCityRangList),
      organizationModal: false
    })
  }

//确定添加学校模态框
  sureAddShool() {
    const {RangList,ProCityRangList} = this.state;
    //限制人数
    let setNum = 0;
    ProCityRangList.map(item=>{
      setNum+=+item.Cnt
    });
    //限制学校人数 Count
    let schoolNum = 0;
    RangList.map(item=>{
      schoolNum+=+item.Count
    });

    if(this.state.limitNum<((setNum?setNum:0)+schoolNum)){
      message.warn("总人数不能超过限制人数！");
      return;
    }
    this.setState({
      RangList: this.delSchoolNullNum(RangList),
      addShool: false
    })
  }

  //取消显示添加学校的模态框
  cancelAddschool() {
    const {RangList} = this.state;
    this.setState({
      RangList: this.delSchoolNullNum(RangList),
      addShool: false
    })
  }

  //过滤掉人数为空的机构或者学校
  delNullNum(List) {
    let newArr = List.filter(item => item.Cnt !== ""&&item.Cnt !== "0");
    return newArr;
  }

//过滤调人数为空的学校
  delSchoolNullNum(List) {
    let newArr = List.filter(item => item.Count !== ""&&item.Count !== "0");
    return newArr;
  }

  //选择范围第一个模态框，删除学校
  delSchool(currentSchool) {
    const {RangList} = this.state;
    let newArr = RangList.filter(item => item.GID !== currentSchool.GID);
    this.setState({RangList: newArr})
  }

  //取消
  returnCancel() {
    this.props.history.push({pathname: `/training-plan`})
  }

  //自定义上传文件
  handleCustomRequest = (options, callback) => {
    // 获取应用Token
    AppToken().then(res => {
      if (typeof res === 'string') {
        callback(options.file, res);
      } else {
        let token = res.Data.Token;
        StorageService('session').set('AppToken', token);
        Config.setToken({name: 'appToken', value: token});
        callback(options.file, token);
      }
    })
  };
// 上传附件
  handleUploadHeadPic = (file, token) => {
    const fd = new FormData();
    fd.append('filename', file);
    const attachmentStr = `{"Path": "youls","AttachType": 1, "ExtName": ".${file.type.split('/')[1]}","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`;
    this.setState({uploadIDPic: true});
    Api.Base.upload({
      token,
      attachmentStr,
      body: fd
    }).then(res => {
      if (res.Ret === 0) {
        this.handleBase64(file, imageUrl => this.setState({headPic: imageUrl}));
        this.props.form.setFieldsValue({headPic: res.Data.Url});
      } else {
        message.error('上传失败！');
        //this.props.form.setFieldsValue({headPic: undefined});
      }
      this.setState({uploadIDPic: false},()=>message.success("更改附件成功"));
    })
  };

  // 将图像转为base64
  handleBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 文件上传组件值更新时
  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.res.status === 200;
      }
      return true;
    });
    this.setState({fileList},()=>this.setState({AttachName:this.state.fileList[0].name}));
  };

  // 课程提交截至时间，不能小于当天
  disabledEndDate=(current)=>{
    return current && current.valueOf() < Date.now();
  };
  //课程截至时间改变
  limitTime=(selectDate)=>{
    this.setState({trainStartDate:selectDate.valueOf()})
  };
  //打开日期选择面板
  openStartEnd=()=>{
    if(!this.state.trainStartDate){
      this.setState({isOpen:false});
      message.warn("请先选择课程提交截至时间");
      return;
    }
  }
  //培训起止时间
  disabledRangeDate=(current)=>{
    return current && current.valueOf() < this.state.trainStartDate;
  };

  render() {
    let EndDate = "";
    let TrainSEDate = [];

    const {NowData} = this.props.location.state
    EndDate = moment(NowData.EndDate)
    TrainSEDate = [moment(NowData.TrainSDate), moment(NowData.TrainEDate)]
    const {TrainType, uploadIDPic, TrainObj, TeachWay, ProvinceData, addShool, visible, TeacherInfo, HaveSelectTeacher, ProCityRangList, areas, headPic, organizationModal, organization, RangList} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 2},
      wrapperCol: {span: 10},
    };
    const width = 4;
    return (
      <div className="AddTrainingPlan">
        <Form className="form-search-group" onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label={'培训名称'}>
            {getFieldDecorator(`TrainingName`, {rules: [{required: true, message: '请填写培训名称'}]})(
              <Input placeholder="培训名称"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={'培训类型'}>
            {
              getFieldDecorator(`TrainingType`)(//默认显示子组件的值
                <Select
                  style={{width: 100}}
                  placeholder="培训类型"
                  optionFilterProp="children"
                  onChange={() => {
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    TrainType.map((item, key) => {
                      return (
                        <Option value={item.Value} key={key}>{item.Text}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem {...formItemLayout} label="培训对象">
            {getFieldDecorator(`TrainingObj`, {rules: [{required: true, message: '请选择培训对象'}]})(
              <CheckboxGroup>
                {
                  TrainObj.map(item => <Checkbox value={item.ID} key={item.ID}>{item.Name}</Checkbox>)
                }
              </CheckboxGroup>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={'限制人数'}>
            {getFieldDecorator(`QtyLimit`, {rules: [{required: true, message: '请填写本计划限制人数'}]})(
              <InputNumber placeholder="限制人数" min={0} precision={0}/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="可见范围">
            {getFieldDecorator(`SchoolScopeName`)(
              <Input onClick={() => this.selectScope()} placeholder="请选择可见范围 " disabled
                     addonAfter={<Icon type="plus" onClick={() => this.selectScope()}/>}/>
            )}

          </FormItem>

          <Modal
            width="50%"
            visible={organizationModal}
            title="请填写限定名额"
            onCancel={() => this.CancelOrganization()}
            footer={[
              <Button key="back" size="large" onClick={() => this.CancelOrganization()}>取消</Button>,
              <Button key="submit" type="primary" size="large" onClick={() => this.sureOrganization(ProCityRangList)}>
                确定
              </Button>
            ]}
          >
            <div className="select-scope">
              <Form layout="inline">
                <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={'区域'}>
                  <Input disabled defaultValue={this.state.AreaName}/>
                </FormItem>
                {/*<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="学校名称">*/}
                {/*<Input onChange={(e) => this.schoolName(e.target.value)} placeholder="请输入学校名称"/>*/}
                {/*</FormItem>*/}
                {/*<FormItem wrapperCol={{span: 12}} style={{textAlign: "right"}}>*/}
                {/*<Button disabled={this.state.visibleBtn} type="primary" style={{marginLeft: 8}}*/}
                {/*onClick={() => this.searchScope()}>查询可见范围</Button>*/}
                {/*</FormItem>*/}
                <FormItem wrapperCol={{span: 12}} style={{textAlign: "right"}}>
                  <Button style={{marginLeft: 8}} type="primary"
                          onClick={() => this.addSchool()}>添加学校</Button>
                </FormItem>
              </Form>
              <div className="show-shoolCount">
                {
                  RangList.length !== 0 ? RangList.map(item => {
                    return (
                      <div className="single-school" key={item.GID}>
                        {item.GName}({item.Count})人
                        <a onClick={() => this.delSchool(item)}>x</a>
                      </div>
                    )
                  }) : <NoContent/>
                }

              </div>
              <div className="content">
                {
                  ProvinceData && ProvinceData.length ? ProvinceData.map((item) => {
                    return (
                      <Row key={item.ID} style={{marginBottom: "0.5rem"}}>
                        <Col span={width}/>
                        <Col span={8} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                          {item.Name}:
                        </Col>
                        <Col span={10} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                          限定名额&nbsp;&nbsp;
                          <InputNumber placeholder="人数" min={0} precision={0} defaultValue={item.Cnt}
                                       onBlur={(e) => this.changProCityNum(e.target.value, item.ID, item.Name)}/>
                          &nbsp;&nbsp;人
                        </Col>
                      </Row>
                    )
                  }) : <NoContent/>
                }
              </div>

            </div>

          </Modal>
          <Spin spinning={this.state.loading} className="search-loading">
            <Modal
              width="50%"
              visible={addShool}
              title="添加学校"
              onCancel={() => this.cancelAddschool()}
              footer={[
                <Button key="back" size="large" onClick={() => this.cancelAddschool()}>取消</Button>,
                <Button key="submit" type="primary" size="large" onClick={() => this.sureAddShool(RangList)}>
                  确定
                </Button>
              ]}
            >
              <Form layout="inline">

                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="学校名称">
                  <Input onChange={(e) => this.schoolName(e.target.value)} placeholder="请输入学校名称"/>
                </FormItem>
                <FormItem wrapperCol={{span: 12}} style={{textAlign: "right"}}>
                  <Button style={{marginLeft: 8}} type="primary" disabled={this.state.schoolName ? false : true}
                          onClick={() => this.searchShool()}>搜索</Button>
                </FormItem>
              </Form>
              <div className="content">
                {
                  organization && organization.length ? organization.map((item, index) => {
                    return (
                      <Row key={item.ID} style={{marginBottom: "0.5rem"}}>
                        <Col span={width}/>
                        <Col span={8} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                          {item.FName}
                        </Col>
                        <Col span={10} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                          限定名额&nbsp;&nbsp;
                          <InputNumber placeholder="人数" min={0} precision={0} value={item.Count}
                                       onBlur={(e) => this.changPeopleNum(e.target.value, item.ID, item.FName, index)}
                                       onChange={(value) => this.handleUpdatePeopleNum(value, index)}

                          />
                          &nbsp;&nbsp;人
                        </Col>
                      </Row>
                    )
                  }) : <NoContent/>
                }
              </div>
            </Modal>
          </Spin>

          <FormItem {...formItemLayout} label={'培训内容'}>
            {getFieldDecorator(`TrainingContent`, {rules: [{required: true, message: '请填写培训内容'}]})(
              <Input placeholder="培训内容"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="授课方式">
            {getFieldDecorator(`TeachWay`, {rules: [{required: true, message: '请选择授课方式'}]})(
              <RadioGroup>
                {
                  TeachWay && TeachWay.length && TeachWay.map((item, key) => {
                    return (
                      <Radio value={item.Value} key={key}>{item.Text}</Radio>
                    )
                  })
                }
              </RadioGroup>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={'培训总学分'}>
            {getFieldDecorator(`TrainingTotalScore`)(
              <InputNumber placeholder="培训总学分"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={'授课讲师'}>
            {getFieldDecorator(`Teacher`, {rules: [{required: true, message: '请选择授课讲师'}]})(
              <Input disabled placeholder="请选择授课讲师 "
                     addonAfter={<Icon type="user-add" onClick={() => this.selectTeacher()}/>}/>
            )}
            <Modal
              width="80%"
              visible={visible}
              title="请选择授课讲师"
              onOk={this.handleOk}
              onCancel={() => this.handleCancel()}
              footer={[
                <Button key="back" size="large" onClick={() => this.handleCancel()}>取消</Button>,
                <Button key="submit" type="primary" size="large" onClick={() => this.sureSelect(HaveSelectTeacher)}>
                  确定
                </Button>
              ]}
            >
              <Row>
                <Col span={14}>
                  <FormItem {...formItemLayout} label={'讲师名称'}>
                    <Search onSearch={value => this.searchTeacher(value)}
                            placeholder="请输入讲师名称,按回车键进行搜索"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <Card style={{width: "100%"}} title="所有讲师">
                    {
                      TeacherInfo.length ? TeacherInfo.map((item, key) => {
                        return (
                          <div className="teacher-info" key={key} onClick={() => this.addTeacher(item)}>
                            <p>
                              <img src={item.HeadPic} alt={item.Name}/>
                            </p>
                            <span>{item.Name}</span>
                          </div>
                        )
                      }) : "暂无讲师"
                    }
                  </Card>
                </Col>
                <Col span={2}/>
                <Col span={10}>
                  <Card style={{width: "100%"}} title="已选讲师">
                    {
                      HaveSelectTeacher.length ? HaveSelectTeacher.map((item, key) => {
                        return (
                          <div className="teacher-info" key={key} onClick={() => this.delHaveSelect(item)}>
                            <p>
                              <img src={item.HeadPic} alt={item.Name}/>
                            </p>
                            <span>{item.Name}</span>
                          </div>
                        )
                      }) : "暂无讲师"
                    }
                  </Card>
                </Col>
              </Row>
            </Modal>
          </FormItem>

          <FormItem {...formItemLayout} label={'是否收费'}>
            {getFieldDecorator(`IsCharge`, {rules: [{required: true}], initialValue: false})(
              <RadioGroup onChange={(e) => this.changeIsCharge(e)}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <div className={this.state.IsCharge ? "current-block" : "current-none"}>
            <FormItem {...formItemLayout} label={'按学分收费'}>
              {getFieldDecorator(`AccordingScore`)(
                <InputNumber placeholder="按学分收费 "/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'总收费'}>
              {getFieldDecorator(`AccordingTrain`)(
                <InputNumber placeholder="总收费 "/>
              )}
            </FormItem>
          </div>

          <FormItem {...formItemLayout} label="课程提交截至时间">
            {getFieldDecorator(`CourseEDate`, {initialValue: EndDate})(<DatePicker
              format={dateFormat}
              allowClear={false}
              disabledDate={this.disabledEndDate}
              onChange = {this.limitTime}
              showTime={{format: 'HH:mm:ss'}}/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="培训起止时间">
            {getFieldDecorator(`TrainSEDate`, {initialValue: TrainSEDate})(<RangePicker
              format={dateFormat}
              onOpenChange={this.openStartEnd}
              open={this.state.isOpen}
              isabledDate={this.disabledRangeDate}
              showTime={{format: 'HH:mm:ss'}}/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="上传附件"
                    extra={<div>文件大小：50M以内<br/>文件类型：*.ppt, *.pptx, *.pps, *.ppsx，*.doc, *.docs, *.xls, *.xlsx, *.pdf,
                      *.jpg,
                      *.jpeg, *.png, *.mp3,mp4， *.wps, *.zip, *.rar, *.7z</div>}
          >
            {getFieldDecorator(`headPic`)(//headPic不代表头像（复制），代表的是文件
              <Upload
                //className="avatar-uploader"
                //name="avatar"
                showUploadList={false}
                multiple={true}
                fileList={this.state.fileList}
                onChange={(info) => this.handleChange(info)}
                beforeUpload={this.beforeUpload}
                customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadHeadPic(file, token))}
                disabled={uploadIDPic}
              >
                <Button>
                  <Icon type={uploadIDPic ? 'loading' : 'plus'}/>
                  {uploadIDPic ? '正在上传...' : '上传附件'}
                </Button>
                {
                  this.state.fileList && this.state.fileList.length ?

                    <div className="ant-upload-list ant-upload-list-text">
                      <div className="ant-upload-list-item ant-upload-list-item-done">
                        <div className="ant-upload-list-item-info">
                          <div>
                            <i className="anticon anticon-paper-clip"/>
                            <a className="ant-upload-list-item-name" href={this.state.fileList[0].url}
                               title={this.state.fileList[0].name}>{this.state.fileList[0].name}</a></div>
                        </div>
                        {/*<i className="anticon anticon-cross"/>*/}
                      </div>

                    </div> : null
                }
              </Upload>
            )}

          </FormItem>
          <FormItem {...formItemLayout} label={'附件内容'}>
            {getFieldDecorator(`Accessory`)(
              <TextArea placeholder="请填写附件内容 "/>
            )}
          </FormItem>
          <Row>
            <Col span={2} offset={6}>
              <Button onClick={() => this.returnCancel()}>取消</Button>
            </Col>
            <Col span={2}>
              <Button type="primary" style={{marginLeft: 8}} htmlType="submit">保存</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

class NoContent extends Component {
  render() {
    return (
      <div className="no-content">
        暂无数据
      </div>
    )
  }
}

export default withRouter(Form.create()(AddTrainingPlan));
