/**
 * Create by fanweihua on 2016/8/22.
 * publicService
 * public service collection of interface
 */
app.factory('publicService', [function () {
    var service = {};
    /**
     * 用户权限
     */
    var getUserPermissions = function () {
        var service = {
            //获取当前用户所在组织的菜单
            GetCurUserMenu: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Auth/GetCurUserMenu",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1],
                        orgLevel:params[2]
                    };
                }
            }
        };
        return service;
    };
    service.userPermissions = getUserPermissions();
    return service;
}]);
