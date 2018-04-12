/**
 * Created by ljq on 2017/8/15
 */
   app.controller('internalPolicyListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * c积分策略列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var internalPolicyList = {


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
                typeList:[
                    {id:-1,name:'全部策略'},
                    {id:1,name:'直接行为策略'},
                    {id:2,name:'间接行为策略'},
                ],
                stateList:[
                    {id:-1,name:'全部策略'},
                    {id:0,name:'已禁用'},
                    {id:1,name:'已启用'},

                ],
                type_v:-1,
                state_v:-1,
                name_v:undefined,

            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=APPMODEL.Storage.getItem("orgid");
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                internalPolicyList: function () {
                    applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.type_v,$scope.model.state_v,$scope.model.name_v,$scope.model.pSize, $scope.model.pIndex]).then(function (data) {

                        if (data.Ret == 0) {

                            internalPolicyList.setting.dataChange(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                AddStrategy: function (item,callBack) {
                    applicationServiceSet.shopInternalServiceApi.shopService.AddStrategy.send([item.Name,item.st, $scope.model.parterID,item.typev,item.Desc],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                           if(callBack) callBack();
                           $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                UpdateStrategy: function (item,callBack) {
                    applicationServiceSet.shopInternalServiceApi.shopService.UpdateStrategy.send([item.ID,item.Name,item.st, $scope.model.parterID,item.typev,item.Desc],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack) callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                //删除策略
                DeleteStrategy:function (item,callBack) {
                    var data = {};
                    data.msg = item.Name;
                    data.delet = function () {

                        applicationServiceSet.shopInternalServiceApi.shopService.DeleteStrategy.send([
                            [item.ID]
                        ],[APPMODEL.Storage.getItem('copPage_token'), [item.ID]]).then(function (data) {

                            if (data.Ret == 0) {

                                if(callBack)callBack();
                                $scope.search();
                            }
                            else {
                                // toastr.error(data.Msg)
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

                    });
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
                            applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send( [APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.type_v,$scope.model.state_v,$scope.model.name_v,$scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {

                                    internalPolicyList.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.type_v,$scope.model.state_v,$scope.model.name_v,$scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {

                                    internalPolicyList.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send( [APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.type_v,$scope.model.state_v,$scope.model.name_v,$scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {

                                    internalPolicyList.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        }
                    };
                }
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
                internalPolicyList.serviceApi.internalPolicyList();//服务集合
            };
            //添加积分策略
            $scope.add=function () {
                $modal.open({
                    templateUrl: 'newAddPolicyList.html',
                    controller: 'newAddPolicyList',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [{isEdit:false}];
                        },
                        service: function () {
                            return internalPolicyList.serviceApi;
                        }
                    }
                });
            }
            //添加积分策略
            $scope.edit=function (item) {
                item.isEdit=true;
                $modal.open({
                    templateUrl: 'newAddPolicyList.html',
                    controller: 'newAddPolicyList',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [item];
                        },
                        service: function () {
                            return internalPolicyList.serviceApi;
                        }
                    }
                });
            }

            //创建规则
            $scope.createRlue=function (item) {

                $location.url('access/app/partner/internalPolicy/listOfRegulation?sid='+item.ID+'&sName=' +item.Name+'&type='+item.SType);
            }
            //生效角色
            $scope.createEffctRole=function (item) {
                $location.url('access/app/partner/internalPolicy/listOfEffectiveRoleAll?sid='+item.ID+'&sName=' +item.Name);
            }

            /********
             *  移除区域云
             * ******/
            $scope.remove=function (item) {
                internalPolicyList.serviceApi.DeleteStrategy(item);
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
                    console.log(data);
                    for (var i in data.ViewModelList) {
                        data.ViewModelList[i].MDate=internalPolicyList.setting.dateFormart( data.ViewModelList[i].MDate ,'');
                        if(data.ViewModelList[i].ST){
                            data.ViewModelList[i].STName='已启用'
                        }else {
                            data.ViewModelList[i].STName='未启用'
                        }
                        //data.ViewModelList[i].ruleUrl='access.app.internal.internalPolicy.listOfRegulation?sid='+ data.ViewModelList[i].ID;
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
    internalPolicyList.init();//函数入口

}]);

app.controller('newAddPolicyList', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
    $scope.newModel = {
        ID: undefined,
        StateList:[
            {id:true,name:'开启'},
            {id:false,name:'未启用'}
        ],
        st:true,
        Name:'',
        isEdit:false,
        typev:undefined,
        typeList:[
            {id:1,name:'直接行为策略'},
            {id:2,name:'间接行为策略'}
        ],
        Desc:undefined,
    };

    $scope.newModel.isEdit=items[0].isEdit;
    if($scope.newModel.isEdit){
        $scope.newModel.title='编辑策略';
        $scope.newModel.ID= items[0].ID;
        $scope.newModel.Name= items[0].Name;
        $scope.newModel.st= items[0].ST;
        $scope.newModel.typev=items[0].SType;
        $scope.newModel.Desc=items[0].Desc;
    }
    else{
        $scope.newModel.title='添加策略';
    }


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
            service.AddStrategy($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
        else{

            service.UpdateStrategy($scope.newModel, function () {
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

