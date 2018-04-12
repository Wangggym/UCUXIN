/**
 * Created by fanweihua on 2016/7/6.
 * loginServiceSet
 * 登录服务API接口
 */
app.factory('loginServiceSet', ['loginService', 'loginSendService', function (loginService, loginSendService) {
    var service = {};
    loginSendService.init();
    /**
     * 登录服务API接口
     */
    service.loginServiceApi = loginService;
    return service;
}]);