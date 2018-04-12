/**
 *  Create by xj on 2018/1/12.
 *  fileName: systemSetting
 */
import InfoFetch from './fetch';

export default {
  //获取内容订单列表
  GetGroupSettings: data => InfoFetch('GET', 'ZX/v3/SettingGW/GetGroupSettings', data),
  //获取机构内容包设置
  GetGroupPackages: data => InfoFetch('GET', 'ZX/v3/SettingGW/GetGroupPackages', data),
  //设置机构内容包
  SetGroupPackages: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGroupPackages', data),
  //设置机构空间菜单
  SetGSpaceMenus: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGSpaceMenus', data),
  //设置机构空间公告
  SetGSpaceNotice: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGSpaceNotice', data),
  //设置专家阵容照片
  SetGSpaceMembersPhoto: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGSpaceMembersPhoto', data),
  //设置机构空间简介
  SetGSpaceIntroduce: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGSpaceIntroduce', data),
  //设置机构空间模块
  SetGSpaceModule: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGSpaceModule', data),
  //设置机构内容包类型
  SetGroupPackageType: data => InfoFetch('POST', 'ZX/v3/SettingGW/SetGroupPackageType', data),
  //获取轮播列表
  getBannerList: data => InfoFetch('GET', 'ZX/v3/BannerGW/GetList', data),
  //清除banner
  cleanBanner:data => InfoFetch('POST', 'ZX/v3/BannerGW/Close', data),
  //保存banner
  saveBanner:data => InfoFetch('POST', 'ZX/v3/BannerGW/Save', data),

}