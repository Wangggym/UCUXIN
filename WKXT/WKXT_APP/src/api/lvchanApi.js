//参数 apiSite接口信息  Notdebugger:false 使用Rap2网站接口数据
//post 请求方式自动为 非Rap2

export default [
    // 获得身份列表
    {apiSite: 'mcs/v3/CommonH5/GetUserMembers'},
    //获取个人积分总览：当前积分及积分排名
    {apiSite: 'mcs/v3/PointH5/GetPointOverView'},
    // 获取分页机构考核值（注意：grouplevel=99的机构指标值是不允许修改的）
    {apiSite: 'HaiNDE/v3/GroupConfig/GetGroupConfigPage', Notdebugger: true},

    {apiSite: 'HaiNDE/v3/GroupConfig/ImportGroupConfig', method: 'POST'},


    //获取学习报告【页面16】
    {apiSite: 'mcs/v3/UserRptH5/GetLearnReport'},


    // 获取学生时段列表【页面33】
    {apiSite: 'mcs/v3/ClassRptH5/GetTimeFrameList'},
    // 获取个人积分总览：当前积分及积分排名【页面17】
    {apiSite: 'mcs/v3/PointH5/GetPointOverView'},
    // 获取个人积分增减明细【页面18总积分】
    {apiSite: 'mcs/v3/PointH5/GetPointDetlView'},

    // 获取个人积分增减明细【页面18总积分】---分页
    {apiSite: 'mcs/v3/PointH5/GetTopPointWeekSum'},

    //  获取已学人员【页面32】
    {apiSite: 'mcs/v3/ClassRptH5/GetLearnUserList'},

    // 获取未学习用户【页面32】
    {apiSite: 'mcs/v3/ClassRptH5/GetNoLearnUserList'},

    // 获取要提醒的用户信息【页面30】、【页面32】、【页面35】
    {apiSite: 'mcs/v3/ClassRptH5/GetRemindUserList'},

    // 获取要提醒的用户信息【页面30】、【页面32】、【页面35】
    {apiSite: 'mcs/v3/ClassRptH5/RemindUser', method: 'POST'},

    //领取奖励【页面7】
    {apiSite: 'mcs/v3/UserRptH5/GetAward'},

    //获取每周荣誉榜分享时的短参数【页面7】，参数名：hashid
    {apiSite: 'mcs/v3/UserRptH5/GetWeekHonorShareHashID'},

    //获分享
    {apiSite: 'mcs/v3/InteractH5/Share', method: 'POST'},

    //获取观看统计【页面35】
    {apiSite: 'mcs/v3/ClassRptH5/GetPlayStatis'},


]