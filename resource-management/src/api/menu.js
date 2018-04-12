/**
 * Created by QiHan Wang on 2017/8/15.
 * question-bank
 * 试题组卷模块API配置
 */
import ServiceAsync from '../common/service';
import {Token} from '../common/utils';

const token = Token();
export default {
  // 获取菜单权限列表
  Authority_GetAuthorList: (data) => ServiceAsync('GET', 'Authority/v3/Authority/GetAuthorList', {...data, token}),
  // 新增修改菜单
  Authority_AddOrEditAuthor: (data) => ServiceAsync('POST', 'Authority/v3/Authority/AddOrEditAuthor', {...data, token}),


  // GET_获取类型下拉列表
  Authority_GetAuthorityRoleTypeList: (data) => ServiceAsync('GET', 'Authority/v3/Role/GetAuthorityRoleTypeList', {
    ...data,
    token
  }),

  // POST_新增修改角色
  Authority_AddOrEditRole: (data) => ServiceAsync('POST', 'Authority/v3/Role/AddOrEditRole', {...data, token}),

  // GET_获取角色权限列表
  Authority_GetRolePage: (data) => ServiceAsync('GET', 'Authority/v3/Role/GetRolePage', {...data, token}),

  // GET_根据角色获取菜单  ?roleID=${code}
  Authority_GetAuthorityRoleListByID: (data) => ServiceAsync('GET', 'Authority/v3/Role/GetAuthorityListByRoleID', {
    ...data,
    token
  }),

  // POST_添加或删除角色菜单
  Authority_AddAndRemoveAuthorRole: (data) => ServiceAsync('POST', 'Authority/v3/Role/AddAndRemoveAuthorRole', {
    ...data,
    token
  }),

  // GET_获取组织机构列表  type=${code}
  Org_GetOrgList: (data) => ServiceAsync('GET', 'COP/v3/Org/GetOrgList', {...data, token}),

  // 获取组织下的所有用户  orgid=${code}
  Org_GetSimpleOrgUsers: (data) => ServiceAsync('GET', 'COP/v3/User/GetSimpleOrgUsers', {...data, token}),

  // GET_根据角色获取人员  roleID=${code}
  Authority_GetUserRoleListByID: (data) => ServiceAsync('GET', 'Authority/v3/Role/GetUserRoleListByID', {
    ...data,
    token
  }),

  // POST_添加角色人员
  Authority_AddUserRole: (data) => ServiceAsync('POST', 'Authority/v3/Role/AddUserRole', {...data, token}),


  // 按关键字获取学校信息
  GetSchoolsByKeyword: (data) => ServiceAsync('GET', 'sns/v3/Web/GetSchoolsByKeyword', {...data, token}),

  //获取人员的接口来了：只传gid和mName即可。
  GetPageMembers: (data) => ServiceAsync('GET', 'sns/v3/Web/GetPageMembers', {...data, token}),

}
