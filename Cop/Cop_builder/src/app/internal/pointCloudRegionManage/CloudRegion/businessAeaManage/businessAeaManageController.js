/**
 * Created by Administrator on 2017/8/16.
 */
/**
 * Created by Administrator on 2017/8/9.
 */
/**
 * Created by lqw on 2017/8/202
 * businessAeaManage
 * list of organizations
 */
app.controller('businessAeaManageContoller', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 组织机构列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */

    var listOfCloudRegion = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                    currentProLineList:[],
                    allProLineList:[],
                    curBid:undefined,
                     proLineKey:undefined
            };
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取业务领域分页数据
                 */
                GetBusiAeaList: function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetBUs.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {
                            listOfCloudRegion.setting.dataChangeBus(data.Data);//类型转换

                            if(data.Data.length>0){
                                $scope.model.curBid=data.Data[0].ID;
                                listOfCloudRegion.serviceApi.GetBuByID(data.Data[0].ID);//业务领域集合
                            }

                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                AddBusinessAea:function (item,callBack) {

                    applicationServiceSet.couldRegionServiceApi.couldRegion.AddBU.send([
                        item.Name,item.Desc,
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack)callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                EditBusinessAea:function (item,callBack) {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.UpdateBU.send([
                        item.ID,  item.Name,item.Desc,item.ProdLine
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack)callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                DelBusinessAea:function (dataT,callBack) {
                    var data = {};
                    data.msg = dataT.Name;
                    data.delet = function () {

                        applicationServiceSet.couldRegionServiceApi.couldRegion.DeleteBU.send([
                            dataT.ID
                        ],[APPMODEL.Storage.getItem('copPage_token'), dataT.ID]).then(function (data) {

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
                        // console.log('Modal dismissed at: ' + new Date());
                    });
                },

                /**
                 * 获取产品线分页数据
                 */
                GetProdLines: function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetProdLines.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            listOfCloudRegion.setting.dataChangeProLine(data.Data);//类型转换
                            $scope.model.allProLineList=data.Data;

                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                AddProdLine:function (item,callBack) {

                    applicationServiceSet.couldRegionServiceApi.couldRegion.AddProdLine.send([
                        item.Name,item.Desc,
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack)callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                UpdateProdLine:function (item,callBack) {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.UpdateProdLine.send([
                        item.ID,  item.Name,item.Desc,
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack)callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                DeleteProdLine:function (dataT,callBack) {
                    var data = {};
                    data.msg = dataT.Name;
                    data.delet = function () {

                        applicationServiceSet.couldRegionServiceApi.couldRegion.DeleteProdLine.send([
                            dataT.ID
                        ],[APPMODEL.Storage.getItem('copPage_token'), dataT.ID]).then(function (data) {

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
                        // console.log('Modal dismissed at: ' + new Date());
                    });
                },

                GetProdLinesByKeyword: function (func) {

                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetProdLinesByKeyword.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.proLineKey]).then(function (data) {

                        if (data.Ret == 0) {

                            $scope.model.allProLineList = data.Data;
                            if(func) func();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                GetBuByID: function (id,func) {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetBuByID.send([APPMODEL.Storage.getItem('copPage_token'),id]).then(function (data) {

                        if (data.Ret == 0) {
                        if( !data.Data.ProdLine){ data.Data.ProdLine=[];}
                            $scope.model.currentProLineList = data.Data.ProdLine;
                            if(func)func();

                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },


                SaveBusAndLine:function (item) {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.UpdateBU.send([
                        item.ID,  item.Name,item.Desc,item.ProdLine
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {
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
                            applicationServiceSet.couldRegionServiceApi.couldRegion.GetBUs.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfCloudRegion.setting.dataChangeBus(data.Data);//类型转换
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
                            applicationServiceSet.couldRegionServiceApi.couldRegion.GetBUs.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfCloudRegion.setting.dataChangeBus(data.Data);//类型转换
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
                            applicationServiceSet.couldRegionServiceApi.couldRegion.GetBUs.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfCloudRegion.setting.dataChangeBus(data.Data);//类型转换
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
                listOfCloudRegion.serviceApi.GetBusiAeaList();//业务领域集合
                listOfCloudRegion.serviceApi.GetProdLines();//产品线集合
            };

            $scope.init=function () {
                $scope.search();//查询
                $scope.initProLine();
            }


            $scope.changeBusi=function (id) {
                listOfCloudRegion.serviceApi.GetBuByID(id,function () {
                    $scope.initProLine();
                });//业务领域集合

            }

            //添加业务领域
            $scope.addBusinessAea=function () {
                $modal.open({
                    templateUrl: 'addBusinessAea.html',
                    controller: 'addBusinessAeaContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [{isEdit:false}];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }

            //编辑业务领域
            $scope.editBusinessAea=function (item) {
                item.isEdit=true;
                $modal.open({
                    templateUrl: 'addBusinessAea.html',
                    controller: 'addBusinessAeaContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [item];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }
            /********
             *  移除业务领域
             * ******/
            $scope.removeBusinessAea=function (item) {
                listOfCloudRegion.serviceApi.DelBusinessAea(item);
            }
            
            //查找产品线
            $scope.searchAppProLine=function () {

                if($scope.model.proLineKey){

                    listOfCloudRegion.serviceApi.GetProdLinesByKeyword(function () {
                        $scope.initProLine();
                    });
                }
                else {
                    listOfCloudRegion.serviceApi.GetProdLines( );//产品线集合
                    $scope.initProLine();
                }

            }

            //保存业务领域和产品线的关系
            $scope.saveBusAndLine=function () {

                var item={};
                for(var i=0; i<$scope.model.itemList.length;i++){
                        if($scope.model.itemList[i].ID==$scope.model.curBid){
                             item=$scope.model.itemList[i];
                             break;
                        }
                }
                item.ProdLine = $scope.model.currentProLineList;
                listOfCloudRegion.serviceApi.SaveBusAndLine(item);
            }

            //选择产品线
            $scope.checkProLine=function (checked, item) {
                if(!$scope.model.currentProLineList)$scope.model.currentProLineList=[];
                if (checked) {
                    var hasadd=false;
                    for(var i = 0 ; i<$scope.model.currentProLineList.length; i++){
                        if($scope.model.currentProLineList[i].ID==item.ID){
                            $scope.model.currentProLineList.splice(i, 1);
                            hasadd = true;
                            break;
                        }
                    }
                    if(!hasadd) {
                        $scope.model.currentProLineList.push(item);
                    }

                } else {
                    for(var i = 0 ; i<$scope.model.currentProLineList.length; i++){
                         if($scope.model.currentProLineList[i].ID==item.ID){
                             $scope.model.currentProLineList.splice(i, 1);
                             break;
                         }
                    }
                }
            }

            //移除项
            $scope.removeLine=function (item) {
                for(var i=0; i<$scope.model.currentProLineList.length;i++){

                    if($scope.model.currentProLineList[i].ID==item.ID){
                        $scope.model.currentProLineList.splice(i, 1);

                        break;
                    }
                }
                for(var i = 0 ; i<$scope.model.allProLineList.length;i++){
                    if($scope.model.allProLineList[i].ID==item.ID){
                        $scope.model.allProLineList[i].checked = false;
                        break;
                    }
                }
            }

            //初始化产品线
            $scope.initProLine=function () { 

                function set() {
                    for (var i = 0; i < $scope.model.allProLineList.length; i++) {
                        $scope.model.allProLineList[i].checked = false;

                        if(!$scope.model.allProLineList[i] ){   break;}
                        for (var j = 0; j < $scope.model.currentProLineList.length; j++) {
                         if(!$scope.model.currentProLineList[j] ){  break;}
                            if ($scope.model.allProLineList[i].ID == $scope.model.currentProLineList[j].ID) {
                                $scope.model.allProLineList[i].checked = true;
                                break;
                            } else {

                            }

                        }
                    }
                }

                $timeout(function () {
                    set();
                },300);
            }



            //添加产品线
            $scope.addProLine=function () {

                $modal.open({
                    templateUrl: 'addProLine.html',
                    controller: 'addProdLineContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [{isEdit:false}];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }

            //编辑产品线
            $scope.editProLine=function (item) {
                item.isEdit=true;
                $modal.open({
                    templateUrl: 'addProLine.html',
                    controller: 'addProdLineContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [item];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }
            /********
             *  移除产品线
             * ******/
            $scope.removeProLine=function (item) {
                listOfCloudRegion.serviceApi.DeleteProdLine(item);
            }



            $scope.init();//查询
        },



        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 类型转换
                 * @param data
                 */
                dataChangeBus: function (data) {
                    var data={ViewModelList:data,Pages:20000000};
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages

                },
               dataChangeProLine:function (data) {
                   $scope.model.itemLineList = data.ViewModelList;

                   var data={ViewModelList:data,Pages:20000000};
                   $scope.model.itemLineList = data.ViewModelList;
                  // $scope.pageIndex.pages = data.Pages;//paging pages
               },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
            };
        })()
    };
    listOfCloudRegion.init();//函数入口
}]);

//业务领域添加
app.controller('addBusinessAeaContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
   $scope.newModel={
       ID:undefined,
       Name:undefined,
       Desc:undefined,
       isEdit:false,
       title:'',
   }

    $scope.newModel.isEdit=items[0].isEdit;
    if($scope.newModel.isEdit){
        $scope.newModel.title='编辑业务领域';
        $scope.newModel.ID= items[0].ID;
        $scope.newModel.Name= items[0].Name;
        $scope.newModel.Desc= items[0].Desc;
    }
    else{
        $scope.newModel.title='添加业务领域';
    }

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
            service.AddBusinessAea($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
        else{

            service.EditBusinessAea($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
    }


    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);


}]);


//产品线添加
app.controller('addProdLineContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
    $scope.newModel={
        ID:undefined,
        Name:undefined,
        Desc:undefined,
        isEdit:false,
        title:'',
    }

    $scope.newModel.isEdit=items[0].isEdit;
    if($scope.newModel.isEdit){
        $scope.newModel.title='编辑产品线';
        $scope.newModel.ID= items[0].ID;
        $scope.newModel.Name= items[0].Name;
        $scope.newModel.Desc= items[0].Desc;
    }
    else{
        $scope.newModel.title='添加产品线';
    }

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
            service.AddProdLine($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
        else{

            service.UpdateProdLine($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
    }


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