
/*-------------------------------------------------------------------------------正式配置start---------------------------------------------------------------------------------------------------*/

/**
 * Created by admin on 2017/11/24
 * 公共测试接口
 */
var urlConfig = "https://api.ucuxin.com/";

var APPMODEL = {
    APPID: 204,
    AppSecret: '30abc40238c040a2b379t23a42ed535r',
    $stateProvider: undefined,//路由存储
    Storage: sessionStorage,//define storage
    dateMath: '?v='+Math.round(new Date()),
    lappUrl:"https://lapp.ucuxin.com/",//预览请求地址
    jxjdAPPID:1046, // 江西禁毒app入口id(正式版)
    shopAddress:'https://shop.ucuxin.com/sell/login',
    lappRootUrl: "phys/preview/",//预览拼接地址
    payUrl:'https://pay.ucuxin.com/v3/CreatePay.ashx?',// 支付3.0拉起支付地址
    /**
     * PHP配置接口参数
     */
    PHPConfig: (function () {
        return {
            url: "https://cms.ucuxin.com/cop/",//cms正式地址
            yyjkUrl: "https://cms.ucuxin.com/yyjk/",//cms正式地址
            app_id_cop: 11,//cop appID
            app_id_nutr: 13,//营养健康appID
            app_data_id: undefined//唯一标识ID
        };
    })(),
    /**
     * 不同模块的api服务的集合
     * 配置自己的服务
     */
    privateServiceSet: (function () {
        var service =
            [
                'public/api/application/identity/internalService.js' + '?v=' + Math.round(new Date()),//内部运营API服务
                'public/api/application/identity/parApplicationService.js' + '?v=' + Math.round(new Date()),//合作伙伴API服务
                'public/api/application/identity/commonService.js' + '?v=' + Math.round(new Date()),//公共与基础API
                'public/api/application/identity/chargeService.js' + '?v=' + Math.round(new Date()),//收费API服务
                'public/api/application/identity/cloudWatchService.js' + '?v=' + Math.round(new Date()),//云监控
                'public/api/application/identity/attendanceService.js' + '?v=' + Math.round(new Date()),//考勤打卡
                'public/api/application/identity/themeSkinService.js' + '?v=' + Math.round(new Date()),//换肤服务
                'public/api/application/identity/cloudRegionService.js' + '?v=' + Math.round(new Date()),//区域云管理
                'public/api/application/identity/shopInternalService.js' + '?v=' + Math.round(new Date()),//积分管理
                'public/api/application/identity/mentalHealthService.js' + '?v=' + Math.round(new Date()),//心理健康
                'public/api/application/identity/liveService.js' + '?v=' + Math.round(new Date())//直播
            ];
        return {
            service: service
        };

    })()
};



/*-------------------------------------------------------------------------------正式配置end---------------------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------test配置start---------------------------------------------------------------------------------------------------*/
/**
 * Created by admin on 2017/11/24
 * 公共测试接口
 */
// var urlConfig = "https://apitest.ucuxin.com/";
//
// var APPMODEL = {
//     APPID: 204,
//     AppSecret: 'dh12340238c04rtyb379t23a42ed535r',
//     $stateProvider: undefined,//路由存储
//     Storage: sessionStorage,//define storage
//     dateMath: '',
//     lappUrl: "https://lapptest.ucuxin.com/",//预览请求地址
//     jxjdAPPID: 1048, // 江西禁毒app入口id
//     shopAddress:'http://shoptest.ucuxin.com/sell/login',
//     lappRootUrl: "phys/preview/",//预览拼接地址
//     payUrl:'https://pay.ucuxin.com/v3test/CreatePay.ashx?',// 支付3.0拉起支付地址
//     /**
//      * PHP配置接口参数
//      */
//     PHPConfig: (function () {
//         return {
//             url: "http://cmstest.ucuxin.com:85/cop/",//测试地址
//             yyjkUrl: "http://cmstest.ucuxin.com:85/yyjk/",//营养健康测试地址
//             app_id_cop: 11,//cop appID
//             app_id_nutr: 13,//营养健康appID
//             app_data_id: undefined//唯一标识ID
//         };
//     })(),
// /**
//  * 不同模块的api服务的集合
//  * 配置自己的服务
//  */
// privateServiceSet: (function () {
//     var service =
//         [
//             'public/api/application/identity/internalService.js' + '?v=' + Math.round(new Date()),//内部运营API服务
//             'public/api/application/identity/parApplicationService.js' + '?v=' + Math.round(new Date()),//合作伙伴API服务
//             'public/api/application/identity/commonService.js' + '?v=' + Math.round(new Date()),//公共与基础API
//             'public/api/application/identity/chargeService.js' + '?v=' + Math.round(new Date()),//收费API服务
//             'public/api/application/identity/cloudWatchService.js' + '?v=' + Math.round(new Date()),//云监控
//             'public/api/application/identity/attendanceService.js' + '?v=' + Math.round(new Date()),//考勤打卡
//             'public/api/application/identity/themeSkinService.js' + '?v=' + Math.round(new Date()),//换肤服务
//             'public/api/application/identity/cloudRegionService.js' + '?v=' + Math.round(new Date()),//区域云管理
//             'public/api/application/identity/shopInternalService.js' + '?v=' + Math.round(new Date()),//积分管理
//             'public/api/application/identity/mentalHealthService.js' + '?v=' + Math.round(new Date()),//心理健康
//             'public/api/application/identity/liveService.js' + '?v=' + Math.round(new Date())//直播
//         ];
//     return {
//         service: service
//     };
//
// })()
// };

/*-------------------------------------------------------------------------------test配置end---------------------------------------------------------------------------------------------------*/









































/*******************************oldConfig备份****************************************************************/

//
//
// /**
//  * Created by fanweihua on 2016/8/29.
//  * 公共测试接口
//  */
// var urlConfig = "http://api.test.ucuxin.com/";
// // var urlConfig = "http://api.ucuxin.com/";//正式版
// // var urlConfig = "http://api.dev.ucuxin.com/";//开发版
// /*ss
//  *
//  * APPID  204
//  *
//  * 测试版AppSecret   dh12340238c04rtyb379t23a42ed535r
//  *
//  * 正式版  30abc40238c040a2b379t23a42ed535r
//  *
//  */
// var APPMODEL = {
//     APPID: 204,
//     // AppSecret: 'dh12340238c04rtyb379t23a42ed535r',
//     AppSecret: 'dh12340238c04rtyb379t23a42ed535r',
//     $stateProvider: undefined,//路由存储
//     Storage: sessionStorage,//define storage
//     // dateMath: '?v=' + Math.round(new Date()),//文件后缀（时间戳，避免文件缓存）
//     dateMath: '',
//     payRoot: "http://pay.ucuxin.com/pay",//正式
//     // payRoot: "http://pay.ucuxin.com/paytest",//测试
//     lappUrl:"http://lapp.ucuxin.com/",//预览请求地址
//     // lappUrl: "http://lapp.test.ucuxin.com/",//预览请求地址
//     jxjdAPPID:1046, // 江西禁毒app入口id(正式版)
//     // jxjdAPPID: 1048, // 江西禁毒app入口id
//     shopAddress:'http://shop.ucuxin.com/sell/login',
//     // shopAddress:'http://shoptest.ucuxin.com/sell/login',
//     lappRootUrl: "phys/preview/",//预览拼接地址
//     /**
//      * PHP配置接口参数
//      */
//     PHPConfig: (function () {
//         return {
//             url: "http://cms.ucuxin.com/cop/",//cms正式地址
//             yyjkUrl: "http://cms.ucuxin.com/yyjk/",//cms正式地址
//             // url: "http://cmstest.ucuxin.com:85/cop/",//测试地址
//             // yyjkUrl: "http://cmstest.ucuxin.com:85/yyjk/",//营养健康测试地址
//             app_id_cop: 11,//cop appID
//             app_id_nutr: 13,//营养健康appID
//             app_data_id: undefined//唯一标识ID
//         };
//     })(),
//     /**
//      * 不同模块的api服务的集合
//      * 配置自己的服务
//      */
//     privateServiceSet: (function () {
//         var service =
//             [
//                 'public/api/application/identity/internalService.js' + '?v=' + Math.round(new Date()),//内部运营API服务
//                 'public/api/application/identity/parApplicationService.js' + '?v=' + Math.round(new Date()),//合作伙伴API服务
//                 'public/api/application/identity/commonService.js' + '?v=' + Math.round(new Date()),//公共与基础API
//                 'public/api/application/identity/chargeService.js' + '?v=' + Math.round(new Date()),//收费API服务
//                 'public/api/application/identity/cloudWatchService.js' + '?v=' + Math.round(new Date()),//云监控
//                 'public/api/application/identity/attendanceService.js' + '?v=' + Math.round(new Date()),//考勤打卡
//                 'public/api/application/identity/themeSkinService.js' + '?v=' + Math.round(new Date()),//换肤服务
//                 'public/api/application/identity/cloudRegionService.js' + '?v=' + Math.round(new Date()),//区域云管理
//                 'public/api/application/identity/shopInternalService.js' + '?v=' + Math.round(new Date()),//积分管理
//                 'public/api/application/identity/mentalHealthService.js' + '?v=' + Math.round(new Date()),//心理健康
//                 'public/api/application/identity/liveService.js' + '?v=' + Math.round(new Date())//直播
//             ];
//         return {
//             service: service
//         };
//
//     })()
// };