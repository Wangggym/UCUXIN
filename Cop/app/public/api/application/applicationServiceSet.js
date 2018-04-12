/**
 * Created by fanweihua on 2016/8/8.
 * API Service collection of interface
 */
app.factory('applicationServiceSet', ['publicService', 'parApplicationService', 'internalService', 'applicationSend', 'commonService', 'chargeService', 'cloudWatchService', 'attendanceService', 'themeSkinService','liveService','cloudRegionService','shopInternalService', 'mentalHealthService', function (publicService, parApplicationService, internalService, applicationSend, commonService, chargeService, cloudWatchService, attendanceService, themeSkinService,liveService, cloudRegionService,shopInternalService,mentalHealthService) {
    applicationSend.init();//assignment ajax send
    return {
        publicServiceApi: publicService,//公共服务接口
        parAppServiceApi: parApplicationService,//合作伙伴服务接口
        internalServiceApi: internalService,//内部运营服务接口
        commonService: commonService,//应用基础公共API服务
        chargeServiceApi: chargeService,//收费API服务
        cloudWatchService: cloudWatchService,//云监控API服务
        attendanceService: attendanceService,//考勤打卡
        themeSkinServiceApi: themeSkinService,//主题换肤
        couldRegionServiceApi:cloudRegionService, //区域云管理
        shopInternalServiceApi:shopInternalService, //积分管理
        mentalHealthService: mentalHealthService,//心理健康
        liveService:liveService //直播管理服务

    };
}]);