/**
 * Created by wangbin on 2017/2/7.
 */
app.controller('personalShowController', ['$scope', '$location', '$modal', '$filter', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $location, $modal, $filter, toastr, toastrConfig, applicationServiceSet) {
    'use strict';
    var article;

    function articleFunction() {
        /*入口*/
        this.init = function () {
            article.pageInit();
            article.getAllArticle();
            article.onEvent();
        };
        /*页面数据初始化*/
        this.pageInit = function () {
            // 分页指令配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 20, // 默认查询10条
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
            // 查询数据定义
            $scope.serchData = {
                pageIndex: 1,
                pageSize: 10,
                title: '',
                catid: 52,
                sDate: '',
                eDate: ''
            };
            // 时间配置
            $scope.openStartDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = true;
                $scope.endOpened = false;
            };
            $scope.openEndDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = false;
                $scope.endOpened = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.format = 'yyyy-MM-dd';
            // 点击预览
            $scope.detailedTemplate = function (data) {
                $modal.open({
                    templateUrl: 'showArticle.html',
                    controller: 'showArticleCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return data;
                        }
                    }
                });
            }
        };
        /*时间格式化*/
        this.DateFormat = function (ns) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }

            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(ns);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
        };
        /*页面操作*/
        this.onEvent = function () {
            //点击新增
            $scope.addArticle = function () {
                var  w = screen.width-4;
                var  h = screen.height-95;
                var winObj = window.open(APPMODEL.PHPConfig.yyjkUrl + 'index.php?m=content&c=content&a=add&catid=52&app_id=' + APPMODEL.PHPConfig.app_id_nutr + '&token=' + APPMODEL.Storage.copPage_token,'',"top=100,left=400,width=" + w + ",height=" + h + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
                var loop = setInterval(function () {
                    if (winObj.closed) {
                        clearInterval(loop);
                        article.getAllArticle();
                    }
                }, 1000);
            };
            // 点击查询
            $scope.pageQuery =  $scope.submitQuery = function () {
                article.getAllArticle();
            };
            // 点击删除
            $scope.delet = function (data) {
                // 删除文章
                data.deletArticle = function (id) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.deleteArticle.send([APPMODEL.PHPConfig.app_id_nutr, id]).then(function (data) {
                        if (data.Ret == '0') {
                            toastr.success('删除成功');
                            article.getAllArticle();
                        }
                    });
                };
                $modal.open({
                    templateUrl: 'deletArticle.html',
                    controller: 'deletArticleCtrl',
                    keyboard: false,
                    backdrop: false,
                    size: 'sm',
                    resolve: {
                        items: function () {
                            return data
                        }
                    }
                });
            };
            // 点击修改文章
            $scope.upDateArticle = function (item) {
                var  w = screen.width-4;
                var  h = screen.height-95;
                var winObj = window.open(APPMODEL.PHPConfig.yyjkUrl + 'index.php?m=content&c=content&a=edit&app_id=' + APPMODEL.PHPConfig.app_id_nutr + '&catid=' + item.catid + '&id=' + item.id,'',"top=100,left=400,width=" + w + ",height=" + h + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
                var loop = setInterval(function () {
                    if (winObj.closed) {
                        clearInterval(loop);
                        article.getAllArticle();
                    }
                }, 1000);
            };
            //  点击首页展示
            $scope.showHome = function (item) {
                article.sendShowHome(item);
            }
        }
    }

    articleFunction.prototype = {
        // 获取所有文章
        getAllArticle: function () {
            var sDate, eDate;
            if ($scope.serchData.sDate == '' || !$scope.serchData.sDate) {
                sDate = '';
            } else {
                sDate = new Date($scope.serchData.sDate) / 1000;
            }
            if ($scope.serchData.eDate == '' || !$scope.serchData.eDate) {
                eDate = '';
            } else {
                eDate = new Date($scope.serchData.eDate) / 1000 + 86400;
            }
            applicationServiceSet.internalServiceApi.nutritionHealth.getAllNutriArticle.send([APPMODEL.PHPConfig.app_id_nutr, $scope.serchData.title, 52, sDate, eDate, $scope.pagination.currentPage, $scope.pagination.itemsPerPage]).then(function (data) {
                if (data.Ret == '0') {
                    $scope.dataList = data.Data.ViewModelList;
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                }
            });
        },
        // 首页展示接口
        sendShowHome: function (item) {
            var uid, creatTime;
            uid = JSON.parse(sessionStorage.getItem('copPage_user')).UID;
            creatTime = article.DateFormat(parseInt(item.inputtime) * 1000);
            applicationServiceSet.internalServiceApi.nutritionHealth.showHome.send([0, item.title, item.pictureurls, item.catname, item.url, item.id, uid, creatTime, 0]).then(function (data) {
                if (data.Ret == '0') {
                    toastr.success('首页展示成功！');
                }
            });
        }
    };
    article = new articleFunction();
    article.init();
}]);


/**
 * 效果预览
 */
app.controller('showArticleCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.data = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 200,
            height: 200
        });
        qrcode.makeCode(items.url);
    }, 100);
}]);
/**
 * 删除文章
 */
app.controller('deletArticleCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.msgDetail = items.title;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelDelet = function () {
        items.deletArticle(items.id);
        $modalInstance.dismiss('cancel');
    };
}]);
