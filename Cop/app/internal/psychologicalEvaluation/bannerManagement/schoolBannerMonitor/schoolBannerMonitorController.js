/**
 * Created by EVEN on 2016/9/29.
 * School Banner Monitor Controller
 */
app.controller('SchoolBannerMonitorController', ['$scope', 'toastr', '$modal', 'applicationServiceSet', '$window', function ($scope, toastr, $modal, applicationServiceSet, $window) {
    'use strict';
    function bannerFunction() {
        //定义请求参数
        $scope.bannerData = {
            pageIndex: 1,
            pageSize: 10,
            topGID: 0,
            range: 3,
            name: '',
            state: 0,
            type: 2
        };

        // 分页指令配置
        $scope.pagination = {
            currentPage: 1,
            itemsPerPage: 50, // 默认查询10条
            maxSize: 5,
            previousText: "上页",
            nextText: "下页",
            firstText: "首页",
            lastText: "末页"
        };

        //请求服务
        //arr存储的get的数据，list表示的是post的数据
        this.getService = function (method, arr, list, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
        };
        //初始化调用
        this.init = function () {
            banner.getBannerInfo();
            banner.onEvent();
        }
    }

    /*------------------------获取banner信息----------------------------*/
    bannerFunction.prototype.getBannerInfo = function () {
        // var schoolId = $scope.queryFields.school || 0;
        banner.getService('getAllBanner', [$scope.pagination.currentPage, $scope.pagination.itemsPerPage, $scope.bannerData.topGID, $scope.bannerData.range, $scope.bannerData.name, $scope.bannerData.state, $scope.bannerData.type], undefined, function (data) {
            if (data.Ret === 0) {
                if (data.Data && data.Data.ViewModelList.length) {
                    $scope.dataList = data.Data.ViewModelList;
                    // 分页配置项更新
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                    $scope.pagination.numPages = data.Data.Pages;
                } else {
                    $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
                }
            }
        });
    };
    /*------------------------获取学校list----------------------------*/
    bannerFunction.prototype.getAllSchool = function (keyword) {
        banner.getService('getFuzzySchoolList', [sessionStorage.getItem('applicationToken'), keyword], undefined, function (data) {
            if (data.Ret == 0) {
                $scope.schoolList = data.Data.length ? data.Data : undefined;
            }
        });
    };
    /*------------------------绑定页面事件----------------------------*/
    bannerFunction.prototype.onEvent = function () {
        //定义页面事件需要的参数
        $scope.EventData = {
            bannerTitle: '',
            bannerState: 0
        };
        $scope.queryFields = {
            school: undefined
        };
        // 查询学校
        $scope.refreshSchool = function (keyword) {
            if (!keyword) return;
            banner.getAllSchool(keyword);
        };
        $scope.selectGid = function () {
            var item = $scope.queryFields.school;
            $scope.bannerData.topGID = item.GID;
            banner.getBannerInfo();
        };
        //展示Img
        $scope.showImg = function (item) {
            var modalInstance = $modal.open({
                templateUrl: 'showImg.html',
                controller: 'showImgCtrl',
                size: 'sm',
                resolve: {
                    items: function () {
                        return item.ImgUrl;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.data = data;
            }, function () {
                // console.log('Modal dismissed at: ' + new Date());
            });
        };
        //模糊查询
        $scope.serch = $scope.pageQuery = function (event) {
            if (event) {
                // 当点击查询时重置当页为首页
                var event = event || window.event;
                var target = event.target || window.srcElement;
                if (target.tagName.toLocaleLowerCase() == "button") {
                    $scope.pagination.currentPage = 1;
                }
            }
            $scope.bannerData.state = $scope.EventData.bannerState;
            banner.getBannerInfo();
        };
        /**
         * 打开测试地址
         * @param url
         */
        $scope.openUrl = function (url) {
            $window.open(url);
        }
    };
    var banner = new bannerFunction();
    banner.init();
}]);
app.controller('showImgCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
