const urls = {
  // GET_获取类型下拉列表
  Authority_GetAuthorityRoleTypeList: () => `Authority/v3/Role/GetAuthorityRoleTypeList`,
  
  // POST_新增修改角色
  Authority_AddOrEditRole: () => `Authority/v3/Role/AddOrEditRole`,
  // GET_获取角色权限列表
  Authority_GetRolePage: (code) => `Authority/v3/Role/GetRolePage?` + code,

  // GET_根据角色获取菜单
  Authority_GetAuthorityRoleListByID: (code) => `Authority/v3/Role/GetAuthorityListByRoleID?roleID=${code}`,
  // POST_添加或删除角色菜单
  Authority_AddAndRemoveAuthorRole: () => `Authority/v3/Role/AddAndRemoveAuthorRole`,

  // GET_获取组织机构列表
  Org_GetOrgList: (code = '0') => `COP/v3/Org/GetOrgList?type=${code}`,
  // 获取组织下的所有用户
  Org_GetSimpleOrgUsers: (code) => `COP/v3/User/GetSimpleOrgUsers?orgid=${code}`,

  // GET_根据角色获取人员
  Authority_GetUserRoleListByID: (code) => `Authority/v3/Role/GetUserRoleListByID?roleID=${code}`,
  // POST_添加角色人员
  Authority_AddUserRole: () => `Authority/v3/Role/AddUserRole`,
}
export default urls
