/**
 * Created by fanweihua on 8/8/2016.
 * 服务封装
 */
app.factory('applicationSend', ['$http', '$q', 'publicService', 'internalService', 'parApplicationService', 'commonService', 'chargeService', 'cloudWatchService', 'toastr', 'attendanceService', 'themeSkinService','liveService', 'cloudRegionService','shopInternalService','mentalHealthService', function ($http, $q, publicService, internalService, parApplicationService, commonService, chargeService, cloudWatchService, toastr, attendanceService, themeSkinService,liveService, cloudRegionService,shopInternalService,mentalHealthService) {
    return {
        init: function () {
            var serviceSend = function () {
                for (var a in arguments) {
                    for (var i in arguments[a]) {
                        for (var j in arguments[a][i]) {
                            arguments[a][i][j].send = send;
                            arguments[a][i][j].fileUpload = fileUpload;
                        }
                    }
                }
            };
            serviceSend(publicService, commonService, internalService, parApplicationService, chargeService, cloudWatchService, attendanceService, themeSkinService,liveService, cloudRegionService,shopInternalService,mentalHealthService);
        }
    };
    //ajax请求服务
    function send(params, list) {
        var serviceApiObj = this;
        var defer = $q.defer();
        var httpRequest = {
            url: serviceApiObj.requestUrl,
            type: serviceApiObj.method,
            dataType: "json",
            async: !serviceApiObj.async,
            data: params ? serviceApiObj.requestParams(params) : undefined
        };
        if (serviceApiObj.requestPost && list && list != "") {
            var requestPost = serviceApiObj.requestPost(list);
            if (httpRequest.url.indexOf('?') == -1) {
                for (var i in requestPost) {
                    if (httpRequest.url.indexOf('?') != -1) {
                        httpRequest.url += '&' + i + '=' + requestPost[i];
                    } else {
                        httpRequest.url += '?' + i + '=' + requestPost[i];
                    }
                }
            } else {
                for (var i in requestPost) {
                    httpRequest.url += '&' + i + '=' + requestPost[i];
                }
            }
        }
        var returnData = {
            success: function (data) {
                defer.resolve(data);
                if (data.Ret != 0) {
                    toastr.toastrConfig.timeOut = 6000;
                    toastr.error(data.Msg);
                }
                $("#loader").hide();
            },
            error: function (error) {
                $("#loader").hide();
                $('#uiBasicModal').modal('show');
                defer.reject(error)
            }
        };
        try {
            $("#loader").show();
            $.ajax(httpRequest).success(function (data) {
                returnData.success(data);
            }).error(function (error) {
                returnData.error(error);
            });
        } catch (e) {
            console.log(e);
        }
        return defer.promise;
    }

    //文件上传服务
    function fileUpload(file, request) {
        var fr = new FileReader();
        var fd = new FormData();
        if (file) {
            fr.readAsDataURL(file);
            fd.append('filename', file);
        }
        var serviceApiObj = this;
        var defer = $q.defer();
        var httpRequest = {
            url: serviceApiObj.requestUrl,
            type: serviceApiObj.method,
            data: serviceApiObj.requestParams(fd),
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json'
        };
        if (request != undefined) {
            if (request.length > 0) {
                var requestPost = serviceApiObj.requestPost(request);
                if (httpRequest.url.indexOf('?') == -1) {
                    for (var i in requestPost) {
                        if (!requestPost[i]) {
                            continue;
                        }
                        if (httpRequest.url.indexOf('?') != -1) {
                            httpRequest.url += '&' + i + '=' + requestPost[i];
                        } else {
                            httpRequest.url += '?' + i + '=' + requestPost[i];
                        }
                    }
                } else {
                    for (var i in requestPost) {
                        if (!requestPost[i]) {
                            continue;
                        }
                        httpRequest.url += '&' + i + '=' + requestPost[i];
                    }
                }
            }
        }
        try {
            $("#loader").show();
            $.ajax(httpRequest).success(function (data) {
                defer.resolve(data);
                if (data.Ret != 0) {
                    toastr.toastrConfig.timeOut = 6000;
                    toastr.error(data.Msg);
                }
                $("#loader").hide();
            }).error(function (error) {
                $("#loader").hide();
                $('#uiBasicModal').modal({
                    closable: false
                }).modal('show');
                defer.reject(error);
            });
        } catch (e) {
            console.log(e);
        }
        return defer.promise;
    }
}]);
