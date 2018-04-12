/**
 * Created by Lenovo on 2017/11/6.
 */



app.controller('changenew', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.saveAd = function () {
        //保存前获取修改后的信息
        $scope.SaveAD.Title = $(".saveTitle").val();
        $scope.SaveAD.ValidStartDate = $(".saveStartTime").val();
        $scope.SaveAD.ValidEndDate = $(".saveEndTime").val();
        $scope.SaveAD.Url = $(".saveUrl").val();
        ctr.setting.urlReg($scope.SaveAD.Url);
    }
    var ctr = {
        init:function () {
            this.variable();
            ctr.dateSet();
            ctr.pageIndex();
            this.serviceAPI.GetAD();
        },
        //变量
        variable: function () {
            //全局变量
            $scope.model = {
                itemList:[],
                IsMoke:false,
            },
            //发布或修改广告【页面75、86】
            $scope.SaveAD = {
                ID:$stateParams.ID,//主键ID
                Title:undefined,//标题
                Url:undefined,//链接
                ValidStartDate:undefined,//生效开始日期
                ValidEndDate:undefined,//生效结束日期
            },
            //获取广告信息
            $scope.GetAD = {
                id : $stateParams.ID,
            }

            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
        },
        dateChange: function (date) {
            var isEffective = date instanceof Date ? true : false;
            if (isEffective) {
                return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            } else {
                return date;
            }
        },
        pageIndex: function () {
            /**
             * paging index send
             */
            $scope.pageIndex = {
                /**
                 * click paging
                 * @param page
                 */
                fliPage: function (page) {
                    $scope.dateStart = ctr.dateChange($scope.dateStart);
                    $scope.dateOver = ctr.dateChange($scope.dateOver);
                    applicationServiceSet.attendanceService.basicDataControlService.GetClockRecordPage.send([20,page.pIndex,$scope.model.school,$scope.dateStart,$scope.dateOver,$scope.model.clockTime,$scope.model.class,$scope.stuName,$scope.card]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },


            };
        },
        //API服务
        serviceAPI:{
            //获取广告信息
            GetAD: function () {
                applicationServiceSet.liveService.officialBackground.GetAD.send([],[APPMODEL.Storage.getItem('copPage_token'),
                    $scope.GetAD.id,
                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                    if(data.Ret == 0 && data.Data){
                        ctr.setting.dataChange(data.Data);
                    }
                })
            },
            //发布或修改广告【页面75、86】
            SaveAD: function () {
                applicationServiceSet.liveService.officialBackground.SaveAD.send([
                    $scope.SaveAD.ID,
                    $scope.SaveAD.Title,
                    $scope.SaveAD.Url,
                    $scope.SaveAD.ValidStartDate,
                    $scope.SaveAD.ValidEndDate,
                    $scope.model.OrgLevel,$scope.model.OrgID

                ] ,[APPMODEL.Storage.getItem('copPage_token'),

                    $scope.model.IsMoke]).then(function (data) {
                    if(data.Ret == 0){
                        toastr.success("保存成功");
                        //setTimeout(function () {
                            $location.url('access/app/internal/UXLive/adviertisement')
                        //},100)
                    }
                })
            },
            
        },

    //数据的处理与设定
        setting:{
            //时间字符串截取方法。
            dateFormat : function (date, format) {
                if (typeof (date)=="undefined") {
                    return "";
                }
                if (!(date instanceof  Date)) {
                    return "";
                }
                var $this = date;
                var o = {
                    "M+": $this.getMonth() + 1, //month
                    "d+": $this.getDate(), //day
                    "h+": $this.getHours(), //hour
                    "m+": $this.getMinutes(), //minute
                    "s+": $this.getSeconds(), //second
                    "q+": Math.floor(($this.getMonth() + 3) / 3), //quarter
                    "S": $this.getMilliseconds() //millisecond
                }
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, ($this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            },
            //url地址输入判断
            urlReg: function (url){
                var urlRegExp=/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;


                if(urlRegExp.test(url)){
                    ctr.serviceAPI.SaveAD();
                    return true;
                }else{
                    toastr.error('不正确的URL');
                    return false;
                }
            },
            //数据处理
            dataChange: function (data) {
                $scope.model.itemList = data;
                $scope.model.itemList.ValidStartDate = ctr.setting.dateFormat(new Date($scope.model.itemList.ValidStartDate),'yyyy/MM/dd')
                $scope.model.itemList.ValidEndDate = ctr.setting.dateFormat(new Date($scope.model.itemList.ValidEndDate),'yyyy/MM/dd')
                $(".saveTitle").val(data.Title);
                $(".saveUrl").val(data.Url);
                $(".saveStartTime").val(data.ValidStartDate);
                $(".saveEndTime").val(data.ValidEndDate);
            }
        },
        //配置时间开始------------
        dateSet : function () {
            $scope.clear = function () {
                $scope.sDate = null;
                $scope.eDate = null;
            };
            var date = new Date();
            var sDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + 1;
            var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            $scope.sDate = sDate;
            $scope.eDate = nowDate;
            $scope.minDate = $scope.minDate ? null : new Date();
            $scope.openStartDate = function ($event) {
                $scope.endOpened = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
            };

            $scope.openEndDate = function ($event) {
                $scope.openedStart = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.endOpened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.format = 'yyyy/MM/dd';
        }
        //配置時間結束----------
    };
    ctr.init()
}]);

