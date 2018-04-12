/**
 * Created by Lenovo on 2017/11/6.
 */



app.controller('advertising', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.pubAd = function () {
        //发布前获取信息
        $scope.SaveAD.Title = $(".saveTitle").val();
        $scope.SaveAD.ValidStartDate = $(".saveStartTime").val();
        $scope.SaveAD.ValidEndDate = $(".saveEndTime").val();
        $scope.SaveAD.Url = $(".saveUrl").val();
        $scope.SaveAD.Url = ctr.setting.urlReg($scope.SaveAD.Url);
    }

    var ctr = {
        init:function () {
            ctr.variable();
            ctr.date();
            ctr.pageIndex();
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

        serviceAPI:{
            //发布或修改广告【页面75、86】
            SaveAD: function () {
                applicationServiceSet.liveService.officialBackground.SaveAD.send([
                    $scope.SaveAD.ID,
                    $scope.SaveAD.Title,
                    $scope.SaveAD.Url,
                    $scope.SaveAD.ValidStartDate,
                    $scope.SaveAD.ValidEndDate,

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
        date:function () {
            $scope.today = function () {
                var date = new Date();
                $scope.dateStart = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + 1;
                $scope.dateOver = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            };
            $scope.today();
            $scope.clear = function () {
                $scope.dt = null;
            };
            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.openStart = function ($event) {
                $scope.openedOver = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
            };
            $scope.openOver = function ($event) {
                $scope.openedStart = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedOver = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.initDate = new Date('2017/11/20');
            $scope.formats = ['dd/MMMM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[1];
        },
        //数据处理
        setting:(function () {
            return {
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
            }
        })()
    };
    ctr.init()
}]);

