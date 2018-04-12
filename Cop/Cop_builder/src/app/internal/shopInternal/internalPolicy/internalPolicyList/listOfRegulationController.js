
/**
 * Created by lqw on 2017/8/16
 */

    app.controller('listOfRegulationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * c积分策略列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var listOfRegulation = {


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
                ActionList:[],
                stype:0,
                isOne:false,
                isTwo:false,
                // isOne:true,
                // isTwo:true,
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=orgModel.OrgType;

            if ($stateParams.sid) {
                   $scope.model.sid=$stateParams.sid;
                 $scope.model.sName=$stateParams.sName;
                 $scope.model.stype=$stateParams.type;
                 if($scope.model.stype == 1 ){
                     $scope.model.isOne=true;

                 }
                 else if($scope.model.stype == 2 ){
                     $scope.model.isTwo=true;

                 }
                 else
                {

                }
            }
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                GetBaseRules: function () {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetBaseRules.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.sid ]).then(function (data) {

                        if (data.Ret == 0) {
                            console.log(data);
                            listOfRegulation.setting.dataChangeBaseRule(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                SetBaseRule: function (item,callBack) {
                    applicationServiceSet.shopInternalServiceApi.shopService.SetBaseRule.send([
                        item.ID,$scope.model.sid,item.ActionID,item.ST,item.Point,item.LimitType,item.LimitPoint
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack) callBack();
                            listOfRegulation.serviceApi.GetBaseRules();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },


                GetMinRules:function () {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetMinRules.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.sid ]).then(function (data) {

                        if (data.Ret == 0) {

                            listOfRegulation.setting.dataChangeMinRule(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                SetMinRule: function (item,callBack) {
                    applicationServiceSet.shopInternalServiceApi.shopService.SetMinRule.send([
                        item.ID,$scope.model.sid,item.ActionID,item.ST,item.MinPer  ,item.MinPoint,item.Per,item.PerPoint
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack) callBack();
                            listOfRegulation.serviceApi.GetMinRules();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },


                //获取积分项
                GetActions:function (stype,func) {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetActions.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.sid,stype ]).then(function (data) {
                        $scope.model.ActionList = data.Data;
                        if (data.Ret == 0) {
                            $scope.model.ActionList = data.Data;
                            if(func)func(data.Data);
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                pageIndex: function () {}

            };
        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                listOfRegulation.serviceApi.GetBaseRules();
                listOfRegulation.serviceApi. GetMinRules()
            };
            //添加积分策略
            $scope.addBaseRule=function () {
                listOfRegulation.serviceApi.GetActions(1,function (data) {
                    $modal.open({
                        templateUrl: 'addBaseRule.html',
                        controller: 'newAddBaseRule',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return [{isEdit:false},{ActionList:data}];
                            },
                            service: function () {
                                return listOfRegulation.serviceApi;
                            }
                        }
                    });
                });


            }
            //添加积分策略
            $scope.editBaseRule=function (item) {
                item.isEdit=true;
                listOfRegulation.serviceApi.GetActions(1,function (data) {
                    $modal.open({
                        templateUrl: 'addBaseRule.html',
                        controller: 'newAddBaseRule',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return [item,{ActionList:data}];
                            },
                            service: function () {
                                return listOfRegulation.serviceApi;
                            }
                        }
                    });
                });

            }

            //添加积分策略
            $scope.addMinRule=function () {
                listOfRegulation.serviceApi.GetActions(2,function (data) {
                    $modal.open({
                        templateUrl: 'addMinRule.html',
                        controller: 'newAddMinRule',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return [{isEdit:false},{ActionList:data}];
                            },
                            service: function () {
                                return listOfRegulation.serviceApi;
                            }
                        }
                    });
                });


            }
            //添加积分策略
            $scope.editMinRule=function (item) {
                item.isEdit=true;
                listOfRegulation.serviceApi.GetActions(2,function (data) {
                    $modal.open({
                        templateUrl: 'addMinRule.html',
                        controller: 'newAddMinRule',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return [item,{ActionList:data}];
                            },
                            service: function () {
                                return listOfRegulation.serviceApi;
                            }
                        }
                    });
                });

            }

            /********
             *  移除区域云
             * ******/
            $scope.remove=function (item) {
                listOfRegulation.serviceApi.DeleteStrategy(item);
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
                dataChangeBaseRule: function (data) {
                    for (var i in data ) {

                        if(data[i].ST){
                            data[i].STName='已启用'
                        }else {
                            data[i].STName='未启用'
                        }
                    }
                    $scope.model.itemList = data;

                },
                dataChangeMinRule:function (data) {
                    for (var i in data) {

                        if(data[i].ST){
                            data[i].STName='已启用'
                        }else {
                            data[i].STName='未启用'
                        }
                    }
                    $scope.model.itemListMin = data;
                    // $scope.pageIndex.pages = data.Pages;//paging pages
                    // $scope.pageIndex.pageindexList(data);//paging
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
        listOfRegulation.init();//函数入口

}]);

app.controller('newAddBaseRule', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
    $scope.newModel = {
        ID: undefined,
        ActionID:undefined,
        ActionList:[],
        LimitType:0,
        LimitTypeList:[
            {id:1,name:'每日最多上限'},
            {id:2,name:'全局最高上限'},
            {id:0,name:'得分不设上限'},
        ],
        StateList:[
            {id:true,name:'开启'},
            {id:false,name:'禁用'}
        ],
        ST:true,
        Name:'',
        LimitPoint:undefined,
        Point:undefined,
        ActionName:undefined,
        SID:0,
        isEdit:false,
    };

    $scope.newModel.isEdit=items[0].isEdit;
    if($scope.newModel.isEdit){
        $scope.newModel.title='编辑规则类型';
        $scope.newModel.ID= items[0].ID;
        $scope.newModel.ActionID=parseInt( items[0].ActionID);
        $scope.newModel.LimitType= items[0].LimitType;
        $scope.newModel.LimitPoint= items[0].LimitPoint;
        $scope.newModel.Point= items[0].Point;
        $scope.newModel.ST= items[0].ST;
        $scope.newModel.ActionName=items[0].ActionName;
        $scope.newModel.ActionList.push({ID:parseInt(items[0].ActionID),Name:items[0].ActionName});
    }
    else{
        $scope.newModel.title='添加规则类型';
    };

    for(var it in items[1].ActionList){
        var me= items[1].ActionList[it];
        $scope.newModel.ActionList.push({ID:me.ID,Name:me.Name});
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
        if (!$scope.newModel.isEdit) {
            console.log($scope.newModel);
            service.SetBaseRule($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
        else{

            service.SetBaseRule($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);

}]);
app.controller('newAddMinRule', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
    $scope.newModel = {
        ID: undefined,
        ActionID:undefined,
        ActionList:[],

        StateList:[
            {id:true,name:'开启'},
            {id:false,name:'禁用'}
        ],
        ST:true,
        Name:'',
        MinPer:undefined,
        MinPoint:undefined,
        Per:undefined,
        PerPoint:undefined,
        ActionName:undefined,
        SID:0,
        isEdit:false,
    };

    $scope.newModel.isEdit=items[0].isEdit;

    if($scope.newModel.isEdit){
        $scope.newModel.title='编辑规则类型';
        $scope.newModel.ID= items[0].ID;
        $scope.newModel.ActionID= parseInt( items[0].ActionID);
        $scope.newModel.MinPer= items[0].MinPer;
        $scope.newModel.MinPoint= items[0].MinPoint;
        $scope.newModel.Per= items[0].Per;
        $scope.newModel.PerPoint= items[0].PerPoint;
        $scope.newModel.ST= items[0].ST;
        $scope.newModel.ActionName=items[0].ActionName;
        $scope.newModel.ActionList.push({ID:parseInt(items[0].ActionID),Name:items[0].ActionName});
    }
    else{
        $scope.newModel.title='添加规则类型';
    };


    for(var it in items[1].ActionList){
         var me= items[1].ActionList[it];
        $scope.newModel.ActionList.push({ID:parseInt(me.ID),Name:me.Name});
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
        if (!$scope.newModel.isEdit) {
            console.log($scope.newModel);
            service.SetMinRule($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
        else{

            service.SetMinRule($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);

}]);


//确定删除
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

