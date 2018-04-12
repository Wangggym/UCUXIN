/**
 * Created by Yu Tian Xiong on 2017/1/26.
 * fileName:内容库专栏发布范围
 */
import React, {Component} from 'react';
import {Card, Switch, Checkbox, Select, Button, Tag,message} from 'antd';
import './publishRange.less'
import Api from '../../../api';


const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

//角色枚举
const RangeType = [
  {id: 13, name: '学生'},
  {id: 12, name: '家长'},
  {id: 11, name: '教师'},
];

export default class PublishRange extends Component {

  state = {
    checkSwitch: false,
    appointPeople: false,
    appointRange: false,
    appointClass: false,
    PhaseList: [],
    RegionList: [],
    cityList: [],
    countyList: [],
    tagList: [],
    tagBox:false,
    data:this.props.value || { MTypeRangeType:0,MTypeIDs:null,RegionRangeType:0,Regions:null,PhaseRangeType:0,PhaseIDs:null}
  };

  componentDidMount() {
    this.getPhaseList();
    this.getRegionList();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.value && nextProps.value !== this.props.value){
      this.setState({data: nextProps.value});
      if(nextProps.value.MTypeIDs){
        this.setState({checkSwitch:true,appointPeople:true});
      }
      if(nextProps.value.Regions){
        this.setState({checkSwitch:true,appointRange:true,tagBox:true,tagList:nextProps.value.Regions});
      }
      if(nextProps.value.PhaseIDs){
        this.setState({checkSwitch:true,appointClass:true});
      }
    }
  }

  //获取教育阶段
  getPhaseList = () => {
    Api.Content.getPhaseList().then(res => {
      if (res.Ret === 0) {
        this.setState({PhaseList: res.Data})
      }
    })
  };
  /*-------------------三级省市联动-------------------*/
  //rid为0获取全部省份
  getRegionList = () => {
    Api.Content.getRegionList({rid: 0}).then(res => {
      if (res.Ret === 0) {
        this.setState({RegionList: res.Data})
      }
    })
  };

  //根据省的rid 获取市列表
  getCityList = (value) => {
    this.setState({proviceData: value, cityData: undefined, countyData: undefined,cityText:[{key:'',label:'请选择市'}],countyText:[{key:'',label:'请选择县'}],proviceText:value});
    Api.Content.getRegionList({rid: value.key}).then(res => {
      if (res.Ret === 0) {
        this.setState({cityList: res.Data});
      }
    })
  };

  //根据市的rid 获取区列表
  getCountyList = (value) => {
    this.setState({cityData: value,cityText:value});
    Api.Content.getRegionList({rid: value.key}).then(res => {
      if (res.Ret === 0) {
        this.setState({countyList: res.Data})
      }
    })
  };

  //获取县级rid
  getCounty = (value) => {
    this.setState({countyData: value,countyText:value})
  };

  //添加省市区数组到TagBox里
  handleAdd = () => {
    const {proviceData, cityData, countyData} = this.state;
    if(!proviceData){message.info('请选择省');return};
    let arr = [proviceData, cityData, countyData];
    let newArr = arr.filter(item => item !== undefined);
    let nameArr = [];
    let id = "";
    for (var i = 0; i < newArr.length; i++) {
      nameArr.push(newArr[i].label);
      id = newArr[nameArr.length - 1].key
    }
    let newObj = {ID: +id, Name: nameArr.join("/")};
    let dataSource = [...this.state.tagList, newObj];
    //对象去重
    if(dataSource){
      let unique = {};
      dataSource.forEach((gpa)=>{ unique[ JSON.stringify(gpa) ] = gpa });
      dataSource = Object.keys(unique).map((u)=>{return JSON.parse(u) });
    }
    //打开tag盒子  设置 tag值  并传值给父组件
    const data = {...this.state.data,Regions:dataSource};
    this.setState({tagList:dataSource,tagBox:true,data:data});
    this.props.onChange(data);
  };
  //删除tag标签
  deleteTag = (index) =>{
    if(this.props.disabled){
     return;
    }
    const {tagList} = this.state;
    tagList.splice(index,1);
    const data = {...this.state.data,Regions:tagList};
    this.setState({data});
    this.props.onChange(data);
    if(tagList.length===0){this.setState({tagBox:false})}
  };

  //切换转换开关
  checkChange = (checked) => {
    this.setState({checkSwitch: checked});
  };
  //角色范围
  handlePeople = (e) =>{
    const data = {...this.state.data, MTypeRangeType:Number(e.target.checked)};
    this.setState({appointPeople: e.target.checked,data:data});
    this.props.onChange(data);
  };
  // 角色ids
  handleMTypeID = (value) =>{
    const data = {...this.state.data,MTypeIDs:value};
    this.setState({data});
    this.props.onChange(data);
  };

  // 区域范围
  handleRegionRange = (e) =>{
    const data = {...this.state.data,RegionRangeType:Number(e.target.checked)};
    this.setState({appointRange:e.target.checked,data:data});
    this.props.onChange(data);
  };

  //字段范围
  handlePhaseRange = (e) =>{
    const data = {...this.state.data,PhaseRangeType:Number(e.target.checked)};
    this.setState({appointClass:e.target.checked,data:data});
    this.props.onChange(data);
  };

  //字段ids
  handlePhaseID = (value) =>{
    const data = {...this.state.data,PhaseIDs:value};
    this.setState({data});
    this.props.onChange(data);
  };



  render() {
    const {checkSwitch, appointPeople, appointRange, appointClass, PhaseList, RegionList, cityList, countyList, tagList,tagBox,data} = this.state;
    return (
      <div className="visible-p">
        <Card title={<span style={{color:'gray'}}>指定范围</span>} noHovering={true}
              extra={<Switch onChange={this.checkChange} disabled={this.props.disabled} checked={checkSwitch}/>}>
          {
            checkSwitch &&
              <div className="visible-content">
                <dl className="range-item">
                  <dt><Checkbox onChange={this.handlePeople} defaultChecked={appointPeople} disabled={this.props.disabled}>指定角色</Checkbox></dt>
                  {appointPeople &&
                  <dd>
                    <CheckboxGroup onChange={this.handleMTypeID} value={data.MTypeIDs ? data.MTypeIDs.join(",").split(",").filter(i => i):''} disabled={this.props.disabled}>
                      {Array.isArray(RangeType) && RangeType.map(item => <Checkbox key={item.id} value={item.id.toString()}>{item.name}</Checkbox>)}
                    </CheckboxGroup>
                  </dd>
                  }
                </dl>
                <dl className="range-item">
                  <dt><Checkbox onChange={this.handleRegionRange} defaultChecked={appointRange} disabled={this.props.disabled}>指定地区</Checkbox></dt>
                  {appointRange &&
                  <dd>
                    <Select className="select-width" placeholder="请选择省" onChange={this.getCityList} labelInValue={true} value={this.state.proviceText?this.state.proviceText:[{key:'',label:'请选择省'}]} disabled={this.props.disabled}>
                      {Array.isArray(RegionList) && RegionList.map((item, i) => <Option
                        value={item.RID.toString()} key={i}>{item.Name}</Option>)}
                    </Select>
                    <Select className="select-width" placeholder="请选择市" onChange={this.getCountyList} labelInValue={true} value={this.state.cityText?this.state.cityText:[{key:'',label:'请选择市'}]} disabled={this.props.disabled}>
                      {Array.isArray(cityList) && cityList.map((item, i) => <Option
                        value={item.RID.toString()} key={i}>{item.Name}</Option>)}
                    </Select>
                    <Select className="select-width" placeholder="请选择县" onChange={this.getCounty} labelInValue={true} value={this.state.countyText?this.state.countyText:[{key:'',label:'请选择县'}]} disabled={this.props.disabled}>
                      {Array.isArray(countyList) && countyList.map((item, i) => <Option
                        value={item.RID.toString()} key={i}>{item.Name}</Option>)}
                    </Select>
                    <Button size="small" icon="plus" onClick={this.handleAdd} disabled={this.props.disabled}>添加</Button>
                    {tagBox && <div className="tagBoxList">
                      {Array.isArray(tagList) && tagList.map((item, i) => <Tag key={i} onClick={()=>this.deleteTag(i)}>{item.Name}X</Tag>)}
                    </div>}
                  </dd>
                  }
                </dl>
                <dl className="range-item">
                  <dt><Checkbox onChange={this.handlePhaseRange} defaultChecked={appointClass} disabled={this.props.disabled}>指定年级</Checkbox></dt>
                  {appointClass &&
                  <dd>
                    <CheckboxGroup onChange={this.handlePhaseID} value={data.PhaseIDs ? data.PhaseIDs.join(",").split(",").filter(i => i):''} disabled={this.props.disabled}>
                      {Array.isArray(PhaseList) && PhaseList.map(item => <Checkbox key={item.ID} value={item.ID.toString()}>{item.Name}</Checkbox>)}
                    </CheckboxGroup>
                  </dd>
                  }
                </dl>
              </div>
          }
        </Card>
      </div>
    )
  }
}