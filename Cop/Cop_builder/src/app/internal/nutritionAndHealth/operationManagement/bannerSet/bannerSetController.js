/**
 * Created by wangbin on 2017/1/16.
 */
app.controller('bannerSetController', ['$scope', 'toastr', '$location', '$modal', 'applicationServiceSet', '$window', function ($scope, toastr, $location, $modal, applicationServiceSet, $window) {
    'use strict';
    var banner;
    function bannerFunction() {
        //定义请求参数
        $scope.bannerData = {
            pageIndex: 1,
            pageSize: 10,
            name: '',
            state: 0,
            type: 0
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
            applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr, list).then(fn);
        };
        //初始化调用
        this.init = function () {
            banner.getBannerInfo();
            banner.onEvent();
        }
    }

    /*------------------------获取banner信息----------------------------*/
    bannerFunction.prototype.getBannerInfo = function () {
        banner.getService('getBannerPages', [$scope.pagination.currentPage, $scope.pagination.itemsPerPage,$scope.bannerData.name,$scope.bannerData.state,$scope.bannerData.type],undefined,function (data) {
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
    /*------------------------绑定页面事件----------------------------*/
    bannerFunction.prototype.onEvent = function () {
        //定义页面事件需要的参数
        $scope.EventData = {
            bannerTitle: '',
            bannerState: 0,
        };
        //上一页
        $scope.prevPage = function () {
            if ($scope.dataList.PageIndex == 1) {
                toastr.warning('已经是第一页');
            } else {
                $scope.bannerData.pageIndex -= 1;
                banner.getBannerInfo();
            }
        };
        //下一页
        $scope.nextPage = function () {
            if ($scope.dataList.PageIndex == $scope.dataList.Pages) {
                toastr.warning('已经是最后一页');
            } else {
                $scope.bannerData.pageIndex += 1;
                banner.getBannerInfo();
            }
        };
        //查询
        $scope.serch = $scope.pageQuery = function (event) {
            if (event) {
                // 当点击查询时重置当页为首页
                var event = event || window.event;
                var target = event.target || window.srcElement;
                if (target.tagName.toLocaleLowerCase() == "button") {
                    $scope.pagination.currentPage = 1;
                }
            }
            $scope.bannerData.name = $scope.EventData.bannerTitle;
            $scope.bannerData.state = $scope.EventData.bannerState;
            banner.getBannerInfo();
        };

        //编辑
        $scope.BannerEdit = function (item) {
            sessionStorage.setItem('banner', JSON.stringify(item));
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
        //删除
        $scope.delete = function (item) {
            var data = {};
            data.msg = item.Name;
            data.delet = function () {
                banner.getService('deleteBanner', undefined, [item.ID], function (data) {
                    if (data.Ret === 0) {
                        toastr.success('删除成功');
                        banner.getBannerInfo();
                    }
                });
            };
            var modalInstance = $modal.open({
                templateUrl: 'pushMsgDetail.html',
                controller: 'ModalPushMsgDetailCtrl',
                size: 'sm',
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.data = data;
            }, function () {
                // console.log('Modal dismissed at: ' + new Date());
            });
        };
        /**
         * 打开测试地址
         * @param url
         */
        $scope.openUrl = function (url) {
            $window.open(url);
        }
    };
    banner = new bannerFunction();
    banner.init();
}]);

app.controller('ModalPushMsgDetailCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items.msg;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelDelet = function () {
        items.delet();
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('showImgCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
