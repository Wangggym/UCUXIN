/**
 * Created by Lenovo on 2017/11/2.
 */
app.controller('adviertisement', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {



    //广告上线或下线【页面84】
    $scope.offLine = function (item) {
        $scope.Downline.id = item.ID
        $scope.Downline.isDownline = item.Status==-1?true:false;
        advertAdviertisement.serviceAPI.Downline(function () {})
        if($scope.Downline.isDownline){
            item.Status = 0
        }else{
            item.Status = -1
        }
    }
    //排序
    $scope.pvSort = function (type) {
        if(type){
            $scope.GetADList.SortFieldList = [{SortField:"PV",IsAsc:true}];
        }else{
            $scope.GetADList.SortFieldList = [{SortField:"PV",IsAsc:false}];
        }
        advertAdviertisement.serviceAPI.GetADList();
    }
    $scope.uvSort = function (type) {
        if(type){
            $scope.GetADList.SortFieldList = [{SortField:"UV",IsAsc:true}];
        }else{
            $scope.GetADList.SortFieldList = [{SortField:"UV",IsAsc:false}];
        }
        advertAdviertisement.serviceAPI.GetADList();
    }


    var  advertAdviertisement={
        //初始化
        init:function () {
            $scope.visible = true;
            $scope.vible=false;
            $scope.visible2=true;
            $scope.vible2=false;
            $scope.block = false;
            $scope.display = false;

            advertAdviertisement.advert();
            advertAdviertisement.serviceAPI.GetADList();
            advertAdviertisement.serviceAPI.pageIndex();
        },
        //变量
        advert:function () {
            //广告
            $scope.model={
                pIndex:1,
                pSize:10,
                itemList:[] , //集合列表
                IsMoke:false,
            },
            //分页获取广告信息列表【页面84】
            $scope.GetADList = {
                SortFieldList:[],//排序字段集合
            },
            //广告上线或下线【页面84】
            $scope.Downline = {
                id:0,//广告ID
                isDownline:undefined,//是否下线
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
        },

        //API 服务
        serviceAPI:{
            //分页获取广告信息列表【页面84】
            GetADList:function () {
                applicationServiceSet.liveService.officialBackground.GetADList.send([APPMODEL.Storage.getItem('copPage_token'),
                    $scope.model.pIndex,
                    $scope.model.pSize,
                    $scope.GetADList.SortFieldList,
                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                    if(data.Ret == 0 && data.Data){
                        advertAdviertisement.setting.dataChange(data.Data);
                    }
                })
            },

            //广告上线或下线【页面84】
            Downline: function ( call) {

                applicationServiceSet.liveService.officialBackground.Downline.send( [],[APPMODEL.Storage.getItem('copPage_token'),
                    $scope.Downline.id,
                    $scope.Downline.isDownline,
                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                    if(data.Ret == 0){
                        if(call)call
                    }
                })
            },

            //分页服务
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
                            applicationServiceSet.liveService.officialBackground.GetADList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    page.pIndex,
                                    $scope.model.pSize,
                                    $scope.GetADList.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        advertAdviertisement.setting.dataChange(data.Data)
                                    }
                                });

                    },
                    /**
                     * nextPage
                     * @param pageNext
                     */
                    nextPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetADList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.GetADList.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        advertAdviertisement.setting.dataChange(data.Data)
                                    }
                                });

                    },
                    /**
                     * previousPage
                     * @param pageNext
                     */
                    previousPage: function (pageNext) {
                            applicationServiceSet.liveService.officialBackground.GetADList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.GetADList.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        advertAdviertisement.setting.dataChange(data.Data)
                                    }
                                });

                    }
                };
            },

        },


    //数据处理与设定
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
            //数据处理
            dataChange: function (data) {
                $scope.model.itemList = data.ViewModelList;
                console.log($scope.model.itemList);
                for(var i = 0;i < $scope.model.itemList.length;i++){
                    $scope.model.itemList[i].ValidStartDate = advertAdviertisement.setting.dateFormat(new Date($scope.model.itemList[i].ValidStartDate),'yyyy/MM/dd');
                    $scope.model.itemList[i].ValidEndDate = advertAdviertisement.setting.dateFormat(new Date($scope.model.itemList[i].ValidEndDate),'yyyy/MM/dd');
                }
                $scope.pageIndex.pages = data.Pages;//paging pages
                $scope.pageIndex.pageindexList(data);//paging


            }
        },
        //事件
        events:{


        },

    };
    //    pv uv数据操作按钮的显隐以及数据排序        sort()和reverse()
    $scope.sort1=function () {
        $scope.block = true;
    },
    $scope.sort2=function () {
        $scope.display = true;
    },
    //pu 数据操作
        $scope.ascending=function () {
            $scope.visible = true;
            $scope.vible=false;
            $scope.block = false;
        //  pv 数据升序
        //     $scope.Pv
        },

        $scope.descending=function () {
            $scope.vible = false;
            $scope.block = false;
            $scope.visible = false;
            $scope.vible=true;
            //  pv 数据降序
            //     $scope.Pv
        },

        //uv数据操作
        $scope.sx=function () {
            $scope.visible2=true;
            $scope.vible2=false;
            $scope.display = false;
            //  uv 数据升序
            //     $scope.Pv
        },

        $scope.jx=function () {
            $scope.vible2 = false;
            $scope.display = false;
            $scope.visible2 = false;
            $scope.vible2=true;
            //  uv 数据降序
            //     $scope.Pv
        },

        //修改广告
        $scope.change = function (item) {
            $location.url('access/app/internal/UXLive/changenew?ID='+item.ID);

        };


    advertAdviertisement.init()

}]);
