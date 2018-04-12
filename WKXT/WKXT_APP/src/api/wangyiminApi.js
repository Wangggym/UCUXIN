//参数 apiSite接口信息  Notdebugger:false 使用Rap2网站接口数据
//post 请求方式自动为 非Rap2

export default [
    // 获得身份列表
    { apiSite: 'mcs/v3/CommonH5/GetUserMembers' },

    // 获取分页机构考核值（注意：grouplevel=99的机构指标值是不允许修改的）
    { apiSite: 'HaiNDE/v3/GroupConfig/GetGroupConfigPage', Notdebugger: true },

    { apiSite: 'HaiNDE/v3/GroupConfig/ImportGroupConfig', method: 'POST' },


    // GET mcs/v3/MicroClassH5/GetCoursePackageList
    // 获取课程包列表【页面9】、【页面38】
    { apiSite: 'mcs/v3/MicroClassH5/GetCoursePackageList' },

    // GET mcs/v3/MicroClassH5/GetCoursePackageList
    // 获取课程包列表【页面9】、【页面38】
    { apiSite: 'mcs/v3/MicroClassH5/GetCoursePackageList' },


    // 获取今日学习情况【页面13】
    // mcs/v3/MicroClassH5/GetTodayLearn
    { apiSite: 'mcs/v3/MicroClassH5/GetTodayLearn' },

    // 获取学习记录(观看记录)【页面13】、【页面43】
    // mcs/v3/MicroClassH5/GetTodayLearn
    { apiSite: 'mcs/v3/MicroClassH5/GetPlayRecordList' },


    // 获取科目列表【页面14】、【页面34】、【页面35】、【页面44】
    // GET mcs/v3/HomeH5/GetSubjectList
    { apiSite: 'mcs/v3/MicroClassH5/GetSubjectList' },

    //     分页获取收藏的课时列表【页面14】、【页面44】
    { apiSite: 'mcs/v3/InteractH5/GetFavList' },

    // 收藏课时(取消收藏课时)【页面11】、【页面14】、【页面41】
    { apiSite: 'mcs/v3/InteractH5/SetFavarite', method: 'POST' },

    // 分页获取课时列表【页面12】、【页面42】搜索页面
    // GET mcs/v3/MicroClassH5/GetCoursePeriodList?Keyword={Keyword}&TopSize={TopSize}&CursorID={CursorID}&IsAsc={IsAsc}
    { apiSite: 'mcs/v3/MicroClassH5/GetCoursePeriodList' },

    //获取课程目录【页面10】、【页面39】
    { apiSite: 'mcs/v3/MicroClassH5/GetCourseCatalog' },

    // GET mcs/v3/MicroClassH5/GetCoursePeriodDetail?coursePeriodID={coursePeriodID}
    // 获取课时详情【页面11】、【页面41】
    { apiSite: 'mcs/v3/MicroClassH5/GetCoursePeriodDetail' },


    //   POST mcs/v3/MicroClassH5/Complete?coursePeriodID={coursePeriodID}
    //   结束播放【页面11】、【页面41】
    { apiSite: 'mcs/v3/MicroClassH5/Complete', method: 'POST' },

    // POST mcs/v3/MicroClassH5/Start?coursePeriodID={coursePeriodID}
    //     开始播放【页面11】、【页面41】
    { apiSite: 'mcs/v3/MicroClassH5/Start', method: 'POST' },

    // 分页获取评价列表【页面11】、【页面25】、【页面41】、【页面47】
    { apiSite: 'mcs/v3/InteractH5/GetEvaluateList' },


    // GET mcs/v3/InteractH5/GetEvaluateItemList
    // 获取评价项【页面24】、【页面46】
    { apiSite: 'mcs/v3/InteractH5/GetEvaluateItemList' },

    // POST mcs/v3/InteractH5/Evaluate
    // 评价【页面24】、【页面46】
    { apiSite: 'mcs/v3/InteractH5/Evaluate', method: 'POST' },


    // POST mcs/v3/MicroClassH5/Start?coursePeriodID={coursePeriodID}
    //     开始播放【页面11】、【页面41】
    { apiSite: 'mcs/v3/MicroClassH5/Start', method: 'POST' },

    // POST mcs/v3/MicroClassH5/Complete?coursePeriodID={coursePeriodID}
    //     结束播放【页面11】、【页面41】
    { apiSite: 'mcs/v3/MicroClassH5/Complete', method: 'POST' },

    // GET base/v3/Auth/GetH5Token?uxcode={uxcode}&md5pwd={md5pwd}&appid={appid}&ts={ts}&md5ts={md5ts}
    //     获取H5登录令牌
    { apiSite: 'base/v3/Auth/GetH5Token' },

    // GET mcs/v3/HomeH5/GetTrialDays
    // 获取试用天数（大于等于0，则提示，小于0，直接进入下一页）【页面6->页面9】
    { apiSite: 'mcs/v3/HomeH5/GetTrialDays' },


    // POST mcs/v3/HomeH5/SaveUserMemberCache
    // 保存用户身份信息缓存【获取身份列表仅有一个或者从多个中选择了一个之后调用本接口】
    { apiSite: 'mcs/v3/HomeH5/SaveUserMemberCache', method: 'POST' },

    // GET mcs/v3/MicroClassH5/GetLastLearnRecode
    // 获取用户最近学习记录【页面9】
    { apiSite: 'mcs/v3/MicroClassH5/GetLastLearnRecode' },

    // GET mcs/v3/InteractH5/IsCanEvaluate?coursePeriodID={coursePeriodID}
    // 是否能够评价
    { apiSite: 'mcs/v3/InteractH5/IsCanEvaluate' },

    // POST mcs/v3/InteractH5/Share	
    // 分享【页面7】、【页面15】、【页面45】
    { apiSite: 'mcs/v3/InteractH5/Share', method: 'POST' },

]