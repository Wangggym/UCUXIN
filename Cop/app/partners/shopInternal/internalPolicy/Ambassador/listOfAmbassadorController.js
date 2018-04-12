
/**
 * Created by lqw on 2017/8/16
 */

app.controller('listOfAmbassadorController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {



    /**
     * c积分策略列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var listOfAmbassador = {


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
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=orgModel.OrgType;


            if ($stateParams.sid) {
                $scope.model.sid=$stateParams.sid;
                $scope.model.sName=$stateParams.sName;
            }


        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                GetGAiUserPointsBySchool: function () {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetGAiUserPointsBySchool.send([APPMODEL.Storage.getItem('copPage_token'),  $scope.model.schoolID]).then(function (data) {

                        if (data.Ret == 0) {

                            listOfAmbassador.setting.dataChange(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                GetCurUserSchool:function ( ) {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetCurUserSchool.send([APPMODEL.Storage.getItem('copPage_token') ,$scope.model.parterID ]).then(function (data) {

                        if (data.Ret == 0) {
                            $scope.model.schoolList=data.Data;
                            if(data.Data.length>0)
                                $scope.model.schoolID= data.Data[0].ID;
                            listOfAmbassador.serviceApi.GetGAiUserPointsBySchool();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },


                //增加积分
                IncPointAsync:function (item,func) {
                    applicationServiceSet.shopInternalServiceApi.shopService.IncPointAsync.send([item.justNumber,item.Desc],[APPMODEL.Storage.getItem('copPage_token') ,item.justNumber,item.Desc ,item.uID]).then(function (data) {

                        if (data.Ret == 0) {
                            if(func) func();
                            $scope.search();//查询
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                //扣减积分
                DecPoint:function (item,func) {

                    applicationServiceSet.shopInternalServiceApi.shopService.DecPoint.send([ parseInt(item.justNumber),item.Desc],[APPMODEL.Storage.getItem('copPage_token') ,item.justNumber,item.Desc ,item.uID]).then(function (data) {

                        if (data.Ret == 0) {
                            if(func) func();
                            $scope.search();//查询
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                pageIndex: function () {}

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
                if(!$scope.model.schoolID){
                    listOfAmbassador.serviceApi.GetCurUserSchool();
                }
                else {

                    listOfAmbassador.serviceApi.GetGAiUserPointsBySchool();
                }
            };


            //添加积分策略
            $scope.just=function (item) {
                $modal.open({
                    templateUrl: 'newAdjustAssador.html',
                    controller: 'newAdjustAssadorContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [item];
                        },
                        service: function () {
                            return listOfAmbassador.serviceApi;
                        }
                    }
                });
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

                    $scope.model.itemList = data;

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
    listOfAmbassador.init();//函数入口

}]);

app.controller('newAdjustAssadorContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'toastr','applicationServiceSet', function ($scope, $modalInstance, items, service,toastr, applicationServiceSet) {
    $scope.newModel = {
        justType:true,
        justTypeName:'增加积分',
        justNumber:undefined,
        Desc:undefined,
        uID:undefined,
        justTotal:undefined
    };

 $scope.newModel.uID=items[0].UID;
    $scope.newModel.justTotal=items[0].Score;

 $scope.setJustType=function (t) {
       $scope.newModel.justType=t;
       if($scope.newModel.justType)
       {

           $scope.newModel.justTypeName='增加积分';
       }
       else{
           $scope.newModel.justTypeName='扣减积分';
       }
 }


    var init=function () {


    }

    init();


    var newModelServiceApi = {

    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * save
     */
    $scope.save = function () {
        if($scope.newModel.justType){
            service.IncPointAsync($scope.newModel,function () {
                toastr.success('增加积分成功');
                $modalInstance.dismiss('cancel');
            });
        }
        else{
            service.DecPoint($scope.newModel,function () {
                toastr.success('扣减积分成功');
                $modalInstance.dismiss('cancel');
            });
        }
    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);

}]);



