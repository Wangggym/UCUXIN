/**
 * Created by fanweihua on 2016/8/4.
 * loginService
 * login service API Collection of interface
 */
app.factory('loginService', [function () {
    var service = {};
    /**
     * 登录服务
     */
    var loginService = function () {
        var service = {
            //根据token获取用户开通功能的身份
            GetOpenAPITokenByUser: {
                method: "get",
                requestUrl: urlConfig + "base/v3/Auth/GetWebToken",
                requestParams: function (params) {
                    return {
                        appid: params[0],
                        uxcode: params[1],
                        md5pwd: params[2],
                        ts: params[3],
                        md5ts: params[4]
                    };
                }
            },
            //获取用户身份权限
            GetCurUserRole: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Auth/GetCurUserRole",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //获取应用级token
            GetOpenAPITokenByAppid: {
                method: "get",
                requestUrl: urlConfig + "base/v3/Auth/GetOpenAPITokenByAppid",
                requestParams: function (params) {
                    return {
                        appid: params[0],
                        ts: params[1],
                        md5ts: params[2]
                    };
                }
            }
        };
        return service;
    };
    service.login = loginService();
    return service;
}]);
