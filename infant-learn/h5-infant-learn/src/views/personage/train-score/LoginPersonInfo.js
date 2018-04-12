/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {Icon, Toast} from 'antd-mobile';
import trainPlan from "../../../api/trainPlan";

class LoginPersonInfo extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      roleList: [],//角色列表
      memeberList:[],//成员列表
      initData: '',
      show: false,
      LoginPerson: this.props.LoginPerson//登陆人员信息
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      LoginPerson: nextProps.LoginPerson
    })
  }

  componentDidMount(){
    this.getRoleList();
  }
  handleClick=()=>{
    this.setState({show:!this.state.show},()=>{
      if(this.state.show){
        document.body.style.overflow = 'hidden';//控制移动端穿透（pc可以完全控制，移动端不行）
      }else {
        document.body.style.overflow = 'scroll';
      }
    });

    //this.getRoleList();
  };

  //获取角色列表
  getRoleList() {
    trainPlan.GetSchMemberRoles().then(res => {
      if (res.Ret === 0) {
        this.setState({roleList:res.Data})
        Toast.hide()
      }else {
        Toast.fail(res.Msg)
      }
    })
  }
  //切换角色列表
  switchRole=(RoleId)=>{
    Toast.loading(null,0)
    this.setState({stateID:RoleId})
    //根据角色ID获取人员列表
    trainPlan.GetSchMembers({roleID: RoleId}).then(res=>{
      if(res.Ret===0){
        this.setState({memeberList:res.Data});
        Toast.hide();
      }else {
        Toast.fail(res.Msg)
      }
    })
  };
//根据选中人员获取学分信息
  switchMember=(memberID,Name,UID)=>{
    this.setState({stateMemberId:memberID});
    this.props.getNewCredit(UID);
    //更改父组件中状态的值
    this.props.changUserName(Name);
    this.setState({show:false})
  }

  render() {
    const {roleList, show, LoginPerson,memeberList,stateID,stateMemberId} = this.state;
    return (
      <div className={show ? 'menu-active' : ''}>
        <div className="role-title">
          <span>{LoginPerson ? LoginPerson.UName : ""}</span>
          {
            roleList&&roleList.length!==0&& <div onClick={this.handleClick}>
              <span>查看其他人员</span>
              <Icon type="down" color="#a7a7a7"/>
            </div>
          }

        </div>
        <div className={show?"current-block":"current-none"} onTouchMove={(e)=>e.preventDefault()}>
          <div className="pannel" >
            <ul className="pannel-left" >
              {
                roleList.map(item=>{
                  return(
                    <li key={item.ID} className={stateID===item.ID?"select-active":""} onClick={()=> this.switchRole(item.ID)}>{item.Name}</li>
                  )
                })
              }
            </ul>
            <ul className="pannel-right">
              {
                memeberList.map(item=>{
                  return(
                    <li key={item.ID} className={stateMemberId===item.ID?"member-active":""}  onClick={()=>this.switchMember(item.ID,item.Name,item.UID)}>{item.Name}</li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPersonInfo;
