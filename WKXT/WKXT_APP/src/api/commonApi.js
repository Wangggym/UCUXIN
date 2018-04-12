//公共部分api

//参数 apiSite接口信息  Notdebugger:false 使用Rap2网站接口数据
//post 请求方式自动为 非Rap2

export default [
    // 获得身份列表
    {apiSite: 'mcs/v3/CommonH5/GetUserMembers'},

    // 获取分页机构考核值（注意：grouplevel=99的机构指标值是不允许修改的）
    {apiSite: 'HaiNDE/v3/GroupConfig/GetGroupConfigPage', Notdebugger: true},
 
    {apiSite: 'HaiNDE/v3/GroupConfig/ImportGroupConfig', method: 'POST'},

]