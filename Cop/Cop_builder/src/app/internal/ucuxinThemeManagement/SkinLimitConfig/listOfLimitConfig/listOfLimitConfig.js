/**
 * Created by liuqw on 2016/11/21.
 * listOfLimitConfigController
 * list of organizations
 */
app.controller('listOfLimitConfigController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 组织机构列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.checked = true;
                $scope.selectedList.push(item.ID);
            } else {
                item.checked = false;
            }
        });
    };
    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.model.itemList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };
    // --- 表格全选功能 结束 --------------------------------------------------
    var listOfLimitConfig = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();
            this.setting.setCloudList()
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                keyWord: undefined,
                pSize: 20,
                imgUrl: undefined,
                pIndex: 1,
                cloudList: [],
                cloudid: 0,
                gid: 0,
                phaseid: 0,
                TryMinutes: undefined,
                phaseList: [],
                schoolList: [],
                ptnID: 0
            };
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取配置皮肤分页数据
                 */
                GetSkinPackRange: function () {

                    applicationServiceSet.themeSkinServiceApi.SkinLimit.GetSkinPackRange.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudid, $scope.model.gid, $scope.model.phaseid, $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            listOfLimitConfig.setting.dataChange(data.Data);//类型转换
                        }
                    });
                },
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.commonService.schoolApi.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid, $scope.model.cloudid, $scope.model.ptnID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * according to the school ID get parameters
                 */
                getParameters: function () {
                    applicationServiceSet.cloudWatchService.cloudWatchApi.GetGrpSetting.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.TryMinutes = data.Data.TryMinutes;
                        }
                    });
                },

                //获取云集合
                GetCloudList: function () {
                    applicationServiceSet.commonService.schoolApi.GetCloudList.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                        if (data.Ret == 0) {
                            var __coludlist = [];
                            __coludlist.push({id:0,name:'全部'})
                            for (var i = 0; i < data.Data.length; i++) {
                                var obj = {};
                                obj.id = data.Data[i].ID;
                                obj.name = data.Data[i].Name;
                                __coludlist.push(obj);
                            }
                            $scope.model.cloudList = __coludlist;
                        }
                    });
                },
                //获取教育阶段
                GetPhaseList: function () {
                    applicationServiceSet.commonService.schoolApi.GetPhaseList.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.gid]).then(function (data) {
                        if (data.Ret == 0) {
                            var __phaselist = [];
                            __phaselist.push({id: 0, name: '全部'});
                            for (var i = 0; i < data.Data.length; i++) {
                                var obj = {};
                                obj.id = data.Data[i].ID;
                                obj.name = data.Data[i].Name;
                                __phaselist.push(obj);
                            }

                            $scope.model.phaseList = __phaselist;
                        }
                    });
                },
                /**
                 * 根据组织ID获取组织信息
                 * @param item
                 * @param func
                 */
                GetSignSkinPack: function (item, func) {
                    applicationServiceSet.themeSkinServiceApi.SkinLimit.GetSignSkinPack.send([APPMODEL.Storage.getItem('applicationToken'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {

                            func(data.Data);
                        }
                    });
                },
                /**
                 * 根据组织ID删除配置信息
                 * @param item
                 */
                removeSkinPackRange: function (item) {



                    var data = {};
                    data.msg = item.SkinPackName;
                    data.delet = function () {
                        applicationServiceSet.themeSkinServiceApi.SkinLimit.RemoveSkinPackRange.send([APPMODEL.Storage.getItem('applicationToken'), item.ID], [APPMODEL.Storage.getItem('applicationToken'), item.ID]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                                toastr.success("删除配置成功");
                            } else {
                                toastr.success(data.InfoMsg);
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
                 * 推送
                 */
                submitPush: function (json) {
                    applicationServiceSet.themeSkinServiceApi.SkinLimit.submitPush.send([json], [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                        if (data.Ret == 0) {
                            if (data.Ret == 0) toastr.success("推送成功");
                        } else {
                            toastr.success(data.InfoMsg)
                        }
                    });
                },
                /**
                 * 添加或更新组织信息
                 * @param item
                 * @param model
                 * @param func
                 */
                AddSkinPackRange: function (item, model, func) {
                    applicationServiceSet.themeSkinServiceApi.SkinLimit.SaveSkinPack.send(
                        [item.ID, item.CloudID, item.GID, item.PhaseID, item.SkinPackID,],
                        [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("保存成功");
                            if (model.isEdit) {
                                model.CloudID = item.CloudID;
                                model.GID = item.GID;
                                model.PhaseID = item.PhaseID;
                                model.SkinPackID = item.SkinPackID;
                                model.Cloud = item.Cloud;
                                model.GrpName = item.GrpName;
                                model.Phase = item.Phase;
                                model.SkinPackName = item.SkinPackName;
                                model.SkinPackDesc = item.SkinPackDesc;
                                model.SkinPackPreview = item.Cloud;
                            } else {
                                var arr = {
                                    "CloudID": item.CloudID,
                                    "GID": item.GID,
                                    "SkinPackID": item.SkinPackID,
                                    "PhaseID": item.PhaseID,
                                    "Cloud": item.Cloud,
                                    "GrpName": item.GrpName,
                                    "Phase": item.Phase,
                                    "SkinPackName": item.SkinPackName,
                                    "SkinPackDesc": item.SkinPackDesc,
                                    "SkinPackPreview": item.SkinPackPreview
                                };
                                $scope.model.itemList.unshift(arr);

                            }
                            func();
                            $scope.search();
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
                            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackRange.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, page.pIndex, 223]).then(function (data) {
                                if (data.Ret == 0) {

                                    listOfLimitConfig.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackRange.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, pageNext, 223]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfLimitConfig.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackRange.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, pageNext, 223]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfLimitConfig.setting.dataChange(data.Data);//类型转换
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
                listOfLimitConfig.serviceApi.GetSkinPackRange();//服务集合
            };
            //图标选择
            $scope.fileChange = function (file) {
                if (file) {
                    listOfLimitConfig.serviceApi.imageUpload(file);//图标上传
                }
            };
            /**区域云改变**/
            $scope.changeCouldConfig=function () {
                 $scope.model.schoolList=[];
                 $scope.model.gid =undefined;

                $scope.model.phaseList=[];
                $scope.model.phaseid =undefined;
            }
            /**
             * 删除
             * @param item
             */
            $scope.delete = function (item) {
                listOfLimitConfig.serviceApi.removeSkinPackRange(item);
            };
          /***
           * 删除选择的学校
           * **/
          $scope.delChangeSchool = function () {
            $scope.model.schoolList = undefined;
            $scope.model.gid = undefined;
            $scope.model.phaseid = undefined;
            listOfLimitConfig.serviceApi.GetPhaseList();
          };
          /***
           * 选择的学校
           * **/
          $scope.changeSchool = function () {
            $scope.model.phaseid = undefined;
            listOfLimitConfig.serviceApi.GetPhaseList();
          };

            /**
             * 编辑
             * @param item
             */
            $scope.edit = function (item) {
                if (item) {
                    listOfLimitConfig.serviceApi.GetSignSkinPack(item, function (data) {
                        $modal.open({
                            templateUrl: 'newAddSkinContent.html',
                            controller: 'newAddConfigMyModalContentCtrl',
                            keyboard: false,
                            backdrop: false,
                            resolve: {
                                items: function () {
                                    return [data, item, $scope.model];
                                },
                                service: function () {
                                    return listOfLimitConfig.serviceApi;
                                }
                            }
                        });
                    });//根据组织ID获取组织信息
                }
            };
            /**
             * 添加组织
             */
            $scope.add = function () {
                var item = {ID: 0};
                $modal.open({
                    templateUrl: 'newAddSkinContent.html',
                    controller: 'newAddConfigMyModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {

                            return [$scope.model];
                        },
                        service: function () {
                            return listOfLimitConfig.serviceApi;
                        }
                    }

                });
            };
            //推送
            $scope.push = function () {
                var skinPackRangeIDs = {};
                var len = 0;
                for (var i = 0; i < $scope.model.itemList.length; i++) {
                    var ni = $scope.model.itemList[i];
                    if (ni.checked) {
                        skinPackRangeIDs["skinPackRangeIDs[" + i + "]"] = ni.ID;
                        len++;
                    }
                }
                if (len > 0) {
                    listOfLimitConfig.serviceApi.submitPush(skinPackRangeIDs);
                }
                else {
                    toastr.error('请选择推送记录');
                }
            };
            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    listOfLimitConfig.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            $scope.remove = function (id) {
                listOfLimitConfig.serviceApi.removeSkinPackRange(id);
            };
            $scope.search();//查询
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
                dataChange: function (data) {
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
                 * 获取教育阶段、云集合、学校基础数据源的接口
                 * ***/
                setCloudList: function () {
                    listOfLimitConfig.serviceApi.GetCloudList();
                  listOfLimitConfig.serviceApi.GetPhaseList();
                }
            };
        })()
    };
    listOfLimitConfig.init();//函数入口
}]);
/**
 * newAddConfigMyModalContentCtrl
 */
app.controller('newAddConfigMyModalContentCtrl', ['$scope', '$modalInstance', 'items', '$modal', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, $modal, service, applicationServiceSet) {
    $scope.newModel = {
        ID: 0,
        CloudID: 0,
        GID: 0,
        PhaseID: 0,
        SkinPackID: undefined,
        Cloud: '全部',
        GrpName: undefined,
        Phase: undefined,
        SkinPackName: undefined,
        SkinPackDesc: undefined,
        SkinPackPreview: undefined,
        ptnID: 0
    };
    /**model API**/
    var newModelServiceApi = {
        /**
         * get school org pages list
         * @param selectedGid
         */
        getOrgSchoolPage: function (selectedGid) {
            applicationServiceSet.commonService.schoolApi.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid, $scope.newModel.CloudID, $scope.newModel.ptnID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.newModel.schoolList = data.Data;
                }
            });
        },
        //获取教育阶段
        GetPhaseList: function () {
            applicationServiceSet.commonService.schoolApi.GetPhaseList.send([APPMODEL.Storage.getItem('applicationToken'), $scope.newModel.GID]).then(function (data) {
                if (data.Ret == 0) {
                    var __phaselist = [];
                    __phaselist.push({id: 0, name: '全部'});
                    for (var i = 0; i < data.Data.length; i++) {
                        var obj = {};
                        obj.id = data.Data[i].ID;
                        obj.name = data.Data[i].Name;
                        __phaselist.push(obj);
                    }


                    $scope.newModel.phaseList = __phaselist;

                }
            });
        },
        /****获取主题ID*************/
        getSkinID: function (skinID, skinName, previmg) {
            $scope.newModel.SkinPackID = skinID;
            $scope.newModel.SkinPackName = skinName;
            $scope.newModel.SkinPackPreview = previmg
        }
    };
    /***选择主题包****/
    $scope.CheckSkin = function () {
        $modal.open({
            templateUrl: 'checkSkinContent.html',
            controller: 'AddSkinConfigModalContentCtrl',
            keyboard: false,
            backdrop: false,
            resolve: {
                items: function () {
                    return [$scope.model];
                },
                service: function () {
                    return newModelServiceApi;
                }
            }

        });
    };
    /**
     * refresh service get school list
     * @param selectedGid
     */
    $scope.refreshAddresses = function (selectedGid) {
        if (selectedGid) {
            newModelServiceApi.getOrgSchoolPage(selectedGid);//get school org pages list
        }
    };
    /**
     * 选择学校
     */
    $scope.changeModelSchool = function () {
      $scope.newModel.PhaseID = undefined;
        newModelServiceApi.GetPhaseList();
    };
    /***
     * 删除选择的学校
     * **/
    $scope.delChangeSchool = function () {
        $scope.newModel.schoolList = undefined;
        $scope.newModel.GID = undefined;
      $scope.newModel.PhaseID = undefined;
      newModelServiceApi.GetPhaseList();
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
        if (items[1]) {
            items[1].isEdit = true;
            service.AddSkinPackRange($scope.newModel, items[1], function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        } else {
            items[0].isEdit = false;
            service.AddSkinPackRange($scope.newModel, items[0], function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }

    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);
    if (items[1]) {

        $scope.newModel.ID = items[0].ID;
        $scope.newModel.CloudID = items[0].CloudID;
        $scope.newModel.cloudList = items[2].cloudList;
        $scope.newModel.schoolList = [{GID: items[0].GID, FName: items[0].GrpName}];
         $scope.newModel.phaseList = [{id: items[0].PhaseID, name: items[0].Phase}];

        $scope.newModel.ID = items[0].ID;
        $scope.newModel.GID = items[0].GID;
        $scope.newModel.PhaseID = items[0].PhaseID;
        $scope.newModel.SkinPackID = items[0].SkinPackID;
        $scope.newModel.Cloud = items[0].Cloud;
        $scope.newModel.GrpName = items[0].GrpName;
        $scope.newModel.Phase = items[0].Phase;
        $scope.newModel.SkinPackName = items[0].SkinPackName;
        $scope.newModel.SkinPackDesc = items[0].SkinPackDesc;
        $scope.newModel.SkinPackPreview = items[0].SkinPackPreview;
        $scope.newModel.disabled = true;
        $scope.newModel.onlyreadInput = true;
    } else {

        $scope.newModel.cloudList = items[0].cloudList;
       $scope.newModel.phaseList =items[0].phaseList ;
        $scope.newModel.schoolList = [{GID: 0, FName: '全部'}];
       // $scope.newModel.phaseList = [{id: 0, name: '全部'}];
        $scope.newModel.GID = 0;
        $scope.newModel.CloudID = items[0].cloudList[0].id;
        $scope.newModel.onlyreadInput = true;
    }

    newModelServiceApi.GetPhaseList();
}]);
app.controller('AddSkinConfigModalContentCtrl', ['$scope', '$modalInstance', 'items', '$modal', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, $modal, service, applicationServiceSet) {
    $scope.skinModel = {
        skinID: undefined,
        skinName: undefined,
        previewImg: undefined
    };
    var skinServiceApi = {
        /**
         * 获取换肤主题分页数据
         */
        GetSkinPackPageList: function (name) {
            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackPageList.send([APPMODEL.Storage.getItem('applicationToken'), name, undefined, 5, 1]).then(function (data) {
                if (data.Ret == 0) {
                    setting.skinDataChange(data.Data);//类型转换
                }
            });
        }
    };

    var setting = {
        skinDataChange: function (data) {
            $scope.skinModel.itemList = data.ViewModelList;
        }
    };

    /******搜索皮肤********/
    $scope.skinSearch = function (name) {
        skinServiceApi.GetSkinPackPageList(name);
    };


    /*******选中事件********/
    $scope.checkedSkin = function (id, name, previmg) {
        $scope.skinModel.skinID = id;
        $scope.skinModel.skinName = name;
        $scope.skinModel.previewImg = previmg;
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
    $scope.skinSave = function () {
        if ($scope.skinModel.skinID) {
            service.getSkinID($scope.skinModel.skinID, $scope.skinModel.skinName, $scope.skinModel.previewImg);
            $modalInstance.dismiss('cancel');
        }
        else {
            toastr.error('请选择主题!');
        }
    };
    $scope.skinSearch();
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
