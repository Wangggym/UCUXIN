const urls = {
  // 获取菜单权限列表
  Authority_GetAuthorList: (code) => `Authority/v3/Authority/GetAuthorList?` + code,
  // 新增修改菜单
  Authority_AddOrEditAuthor: () => `Authority/v3/Authority/AddOrEditAuthor`,
}
export default urls
