/**
 * Created by Yu Tian Xiong on 2017/12/18.
 * fileName:系统设置
 */
import React, {Component} from 'react';
import {Card, message, Spin} from 'antd';
import Api from '../../api';

import './system.less';
import OrderSetting from './Component/OrderSetting';

import OrgAll from "./Component/OrgAll";                 //机构整体订阅、单类订阅
import Banner from "./Component/Banner";                 //轮播图
import Menu from './Component/Menu';                    //菜单
import Introduce from './Component/Introduce';         //机构简介
import MembersPoto from './Component/MembersPoto';     //专家阵容
import Notice from './Component/Notice';               //机构空间公告


class System extends Component {
  state = {
    leftMenu: null,
    loading: true
  };

  componentDidMount() {
    this.getMenuList()//change
  }

  //获取左侧设置菜单列表
  getMenuList = () => {
    Api.systemSetting.GetGroupSettings().then(res => {
      if (res.Ret === 0) {
        this.setState({leftMenu: res.Data, loading: false})
      } else {
        message.error(res.Msg)
      }
    })
  }
  //点击左侧菜单
  setMenuType = (selectDataType, PackageType) => {
    this.setState({menuType: selectDataType})
    if (PackageType) {
      this.getOrgPackages(PackageType);
    }
  };
  //获取机构内容包设置
  getOrgPackages = (packageType) => {
    Api.systemSetting.GetGroupPackages({packageType: packageType}).then(res => {
      if (res.Ret === 0) {
        this.setState({OrgData: res.Data})
      } else {
        message.error(res.Msg)
      }
    })
  };

  //根据不同的菜单类型显示不同的菜单内容
  judgeMenuType = () => {
    const {menuType, leftMenu, OrgData} = this.state;
    switch (menuType) {
      case "ContentPackageType-Group":
        return OrgData && <OrgAll Menus={OrgData} isAll={true}/>;
        break;
      case "ContentPackageType-Class":
        // return <OrgSingle Menus={OrgData}/>;
        return OrgData && <OrgAll Menus={OrgData}/>;
        break;
      case "Banner":
        return <Banner leftMenu={leftMenu} Menus={leftMenu.Menus}/>;
        break;
      case "Menu":
        return <Menu leftMenu={leftMenu} Menus={leftMenu.Menus}/>;
        break;
      case "Notice":
        return <Notice leftMenu={leftMenu} Notice={leftMenu.Notice} changeValue={this.changeValue}/>;
        break;
      case "Members":
        return <MembersPoto leftMenu={leftMenu} MembersPoto={leftMenu.MembersPoto}/>;
        break;
      case "Introduce":
        return <Introduce leftMenu={leftMenu} Introduce={leftMenu.Introduce}/>;
        break;
    }
  };
  //回调刷新
  changeValue = (data) =>{
    this.setState({leftMenu:data})
  };

  render() {
    const {leftMenu, menuType} = this.state;
    return (
      <Spin spinning={this.state.loading}>
        <div className='system-setting'>
          <Card className='left-nav' style={{width: 400, marginRight: 50}}>
            {
              leftMenu &&
              <OrderSetting leftMenu={leftMenu}
                             setMenuType={(selectData, PackageType) => this.setMenuType(selectData, PackageType)}/>
            }
          </Card>
          <Card className='right-content' style={{width: 800}}>
            {
              menuType ? this.judgeMenuType() : "请选择左侧菜单内容"
            }
          </Card>
        </div>
      </Spin>

    )
  }
}

export default System;