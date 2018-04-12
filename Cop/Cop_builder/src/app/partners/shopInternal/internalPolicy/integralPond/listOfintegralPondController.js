
/**
 * Created by lqw on 2017/8/16
 */

app.controller('listOfintegralPondController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {



    /**
     * c积分策略列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var listOfintegralPond = {


        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();//tip

        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                parterID:0,
                pSize: 20,
                pIndex: 1,
                sid:undefined,
                sName:undefined,
                schoolList:[],
                schoolID:undefined,
                point:0,
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=APPMODEL.Storage.getItem("orgid");



        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                GetParterPoolDetails: function () {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize, $scope.model.pIndex]).then(function (data) {

                        if (data.Ret == 0) {

                            listOfintegralPond.setting.dataChange(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                GetParterPoint:function () {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoint.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID ]).then(function (data) {

                        if (data.Ret == 0) {
                         $scope.model.point=  data.Data.Point;
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                GetPartnerTel:function (func) {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetPartnerTel.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID ]).then(function (data) {

                        if (data.Ret == 0) {
                            if(func) func(data);
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                SetPartnerTel:function (item,func) {
                    applicationServiceSet.shopInternalServiceApi.shopService.SetPartnerTel.send([item.ID,207,$scope.model.parterID,item.tel],[APPMODEL.Storage.getItem('copPage_token')  ]).then(function (data) {

                        if (data.Ret == 0) {
                            if(func) func(data);
                            toastr.success('保存成功');
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                /**
                 * paging function
                 */
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
                            applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize,page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {

                                    listOfintegralPond.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize,  pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfintegralPond.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize,  pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfintegralPond.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        }
                    };
                }

            }

        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {

                    listOfintegralPond.serviceApi.GetParterPoolDetails();

            };

            listOfintegralPond.serviceApi.GetParterPoint();
            //支付
            $scope.pay=function () {
              // $location.url('access/app/internal/shopInternal/pay ' );
              window.open('partners/shopInternal/internalPolicy/integralPond/pay.html');

            }

            $scope.sendMessage=function () {
                $modal.open({
                    templateUrl: 'newAddMessage.html',
                    controller: 'newMessageContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [{}];
                        },
                        service: function () {
                            return listOfintegralPond.serviceApi;
                        }
                    }
                });
            }


            $scope.toshop = function () {

                window.open(APPMODEL.shopAddress+'?token='+APPMODEL.Storage.getItem('copPage_token'));
            }

            $scope.search();//查询
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据类型转换
                 * @param data
                 */
                dataChange: function (data) {
                    for (var i in data.ViewModelList) {
                        data.ViewModelList[i].CDate=listOfintegralPond.setting.dateFormart( data.ViewModelList[i].CDate ,'');

                    }
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },

                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
                /**
                 * dateFormart
                 */
                dateFormart:function(date, format){
                    date = date.substring(0,10);
                    return date;
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
                }
            };
        })()
    };
    listOfintegralPond.init();//函数入口

}]);



app.controller('newMessageContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'toastr','applicationServiceSet', function ($scope, $modalInstance, items, service,toastr, applicationServiceSet) {
    $scope.newModel = {
      tel:undefined,
        ID:undefined
    };


    var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));


    $scope.newModel.AppID=207;
    $scope.newModel.ParterID=APPMODEL.Storage.getItem("orgid");
    $scope.newModel.ST=0;

   service.GetPartnerTel(function (data) {
          $scope.newModel.tel=data.Data.Tel;
          $scope.newModel.ID=data.Data.ID;
   });


   //保存
   $scope.save=function () {
        service.SetPartnerTel($scope.newModel,function () {
            $modalInstance.dismiss('cancel');
        });
    }

  
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
 
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);

}]);