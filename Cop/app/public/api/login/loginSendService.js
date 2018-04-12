/**
 * Created by fanweihua on 2016/7/6.
 * loginSendService
 * ajax请求
 */
app.factory('loginSendService', ['$http', '$q', 'loginService', function ($http, $q, loginService) {
    var service = {
        init: function () {
            /**
             * 遍历登录API，赋予ajax请求
             */
            for (var i in loginService) {
                for (var j in loginService[i]) {
                    loginService[i][j].send = send;
                }
            }
        }
    };

    /**
     * ajax请求
     * @param params
     */
    function send(params) {
        var serviceApiObj = this;
        var defer = $q.defer();
        var httpRequest = {
            url: serviceApiObj.requestUrl,
            method: serviceApiObj.method,
            dataType: "json",
            async: serviceApiObj.async ? false : true,
            params: serviceApiObj.requestParams(params)
        };
        try {
            $("#loginLoader").show();
            $http(httpRequest).success(function (data) {
                defer.resolve(data);
                if (data.Ret != 0) {
                    $("#mySmallModalLabel").modal('show');
                    $("#exampleModalLabel").text(data.Msg);
                }
                $("#loginLoader").hide();
            }).error(function (error) {
                $("#mySmallModalLabel").modal('show');
                $("#exampleModalLabel").text("请稍等...");
                var index = localStorage.getItem("error");
                if (isNaN(index)) {
                    index = 0;
                }
                if (index) {
                    var num = parseInt(index);
                    if (num >= 4) {
                        $("#exampleModalLabel").text("服务器连接错误...");
                        setTimeout(function () {
                            localStorage.error = 0;
                            $('#uiBasicModal').modal({
                                closable: false,
                                onApprove: function () {
                                    window.location.href = "http://m.ucuxin.com/";
                                }
                            }).modal('show');
                        }, 1000);
                    } else {
                        num++;
                        localStorage.setItem("error", num);
                    }
                } else {
                    localStorage.setItem("error", 1);
                }
                if (parseInt(index) < 4) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
                defer.reject(error);
            });
        } catch (e) {
            console.log(e);
        }
        return defer.promise;
    }
    return service;
}]);

