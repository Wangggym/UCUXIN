/**
 * Created by EVEN on 2016/9/29.
 * Whole Network Banner Set Controller
 */
app.controller('bannerSetController', ['$scope', 'toastr', '$location', '$modal', 'applicationServiceSet', '$window', function ($scope, toastr, $location, $modal, applicationServiceSet, $window) {
    'use strict';
    var banner = {
        /**
         * 入口
         */
        init : function () {
            banner.pageData();
            banner.onEvent();
            banner.getAllData();
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            // 所有数据
            $scope.allData = [];

            // 分页指令配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 35, // 默认查询10条
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
            // 新增或修改banner
            $scope.change = $scope.addItem = function (item) {
                if(!item){
                    item = {
                        ID:0
                    }
                }
                item.getAllData = banner.getAllData;
                var modalInstance = $modal.open({
                    templateUrl: 'pushMsgDetail.html',
                    controller: 'ModalPushMsgDetailCtrl',
                    size: 'md',
                    resolve: {
                        items: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                }, function () {
                });
            };
            // 展示图片
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
                });
            };
        },
        /**
         * 获取所有数据
         */
        getAllData:function () {
            applicationServiceSet.mentalHealthService._CourseClassify._GetBannerPage.send([sessionStorage.getItem('copPage_token'),$scope.pagination.itemsPerPage,$scope.pagination.currentPage]).then(function (data) {
                if(data.Ret == 0){
                    $scope.allData = data.Data.ViewModelList;
                }
            });
        }
    };
    /**
     *
     */
    banner.init();
}]);

app.controller('ModalPushMsgDetailCtrl', ['$scope', '$modalInstance', 'items','applicationServiceSet','toastr', function ($scope, $modalInstance, items,applicationServiceSet,toastr) {
    var change = {
        /**
         * 入口
         */
        init:function(){
            change.pageDataInit();
            change.onEvent();
            change.timeInit();
        },
        /**
         * 页面数据初始化
         */
        pageDataInit:function(){
            // bannerid
            $scope.id = items.ID;
            // 图片url
            $scope.imgUrl = items.Pic || '';
            // 图片链接
            $scope.link= items.Url || '';
        },
        /**
         * 绑定页面相关操作
         */
        onEvent:function(){
            // 上传图片
            $scope.fileChange = function (file) {
                change.fileUp(file);
            };
            // 取消
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            // 保存
            $scope.confirm = function () {
                change.save();
            }
        },
        /**
         * 时间控件初始化
         */
        timeInit:function () {
            $scope.clear = function () {
                $scope.sDate = null;
                $scope.eDate = null;
            };
            $scope.minDate = $scope.minDate ? null : new Date();
            $scope.openStartDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = true;
                $scope.endOpened = false;
            };
            $scope.openEndDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.endOpened = true;
                $scope.startOpened = false;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.format = 'yyyy-MM-dd';
            $scope.sDate = items.SDate||null;
            $scope.eDate = items.EDate||null;
        },
        /**
         * 上传图片
         */
        fileUp:function(file){
            if (file) {
                applicationServiceSet.mentalHealthService._CourseClassify._ImageRegistrationUpload.fileUpload(file).then(function (data) {
                    if(data.Ret == 0){
                        $scope.imgUrl= data.Data.Url;
                    }
                });
            }
        },
        /**
         * 日期格式化
         */
        timeFormat:function (time) {
            var year,month,date;
            time = new Date(time);
            year = time.getFullYear();
            month = (time.getMonth()<10)?'0'+(time.getMonth()+1):time.getMonth()+1;
            date = (time.getDate()<10)?'0'+time.getDate():time.getDate();
            return year+'-'+month+'-'+date;
        },
        /**
         * 保存
         */
        save:function () {
            if(!$scope.sDate){
                toastr.error('请填写开始日期！');
                return;
            }
            if(!$scope.eDate){
                toastr.error('请填写结束日期！');
                return;
            }
            var reg=/^([hH][tT]{2}[pP]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if($scope.link){
                if(!reg.test($scope.link)){
                    toastr.error('请输入正确的图片链接！');
                    return;
                }
            }
            if(!$scope.imgUrl || $scope.imgUrl==''){
                toastr.error('请上传图片！');
                return;
            }
            var stime = change.timeFormat($scope.sDate);
            var etime = change.timeFormat($scope.eDate);
            applicationServiceSet.mentalHealthService._CourseClassify._AddOrUpBanner.send([$scope.id,
                $scope.imgUrl,$scope.link,stime,etime],[sessionStorage.getItem('copPage_token')]).then(function (data) {
                if(data.Ret == 0){
                    items.getAllData();
                    if($scope.id==0){
                        toastr.success('保存成功！');
                    }else {
                        toastr.success('修改成功！');
                    }
                    $modalInstance.close();
                }
            });
        }
    };
    change.init();
}]);
app.controller('showImgCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
