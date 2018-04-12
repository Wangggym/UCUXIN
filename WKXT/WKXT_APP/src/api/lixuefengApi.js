
//参数 apiSite接口信息  Notdebugger:false 使用Rap2网站接口数据
//post 请求方式自动为 非Rap2

export default [
    // 获得身份列表
    {apiSite: 'mcs/v3/HomeH5/GetUserMembers'},
 	//获取班级报告
	{apiSite: 'mcs/v3/ClassRptH5/GetClassReport'},
	//获取班级每周荣誉
	{apiSite: 'mcs/v3/UserRptH5/GetWeekHonorRoll'},
	//获取我的本周排行
	{apiSite: 'mcs/v3/UserRptH5/GetMyWeekRank'},
	//获取我的本周排行
	{apiSite: 'mcs/v3/ClassRptH5/GetAttentionUserList'},
    //获取连续学习列表【页面36】
	{apiSite: 'mcs/v3/ClassRptH5/GetContinLearnList'},
	//获取累计学习列表【页面37】
	{apiSite: 'mcs/v3/ClassRptH5/GetAccumuLearnList'},
	//获取观看统计【页面35】
	{apiSite: 'mcs/v3/ClassRptH5/GetPlayStatis'},
	//获取科目已学人员列表【页面35】
	{apiSite: 'mcs/v3/ClassRptH5/GetSubjectLearnList'},
	//获取科目未学习学人员列表【页面35】
	{apiSite: 'mcs/v3/ClassRptH5/GetSubjectNoLearnList'},
	//获取科目列表【页面14】、【页面34】、【页面35】、【页面44】
	{apiSite: 'mcs/v3/HomeH5/GetSubjectList'}, 
	//微课学堂介绍页，两种情况：app内部进入，外链进入【页面5,6合并】
	{apiSite: 'mcs/v3/HomeH5/GetIntroduce'}, 
	//领取奖励【页面7】
	{apiSite: 'mcs/v3/UserRptH5/GetAward'},
    //获取每周报表【页面30】
    {apiSite: 'mcs/v3/ClassRptH5/GetWeekReport'},





    // 获取分页机构考核值（注意：grouplevel=99的机构指标值是不允许修改的）
    {apiSite: 'HaiNDE/v3/GroupConfig/GetGroupConfigPage', Notdebugger: true},
 
    {apiSite: 'HaiNDE/v3/GroupConfig/ImportGroupConfig', method: 'POST'},

]