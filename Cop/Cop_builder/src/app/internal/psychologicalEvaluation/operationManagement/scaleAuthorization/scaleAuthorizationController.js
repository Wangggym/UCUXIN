/**
 * Created by fanweihua on 2016/11/15.
 * scaleAuthorizationController
 * scale authorization
 */
app.controller('scaleAuthorizationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr, $modal) {
    /**
     * 量表授权
     * @type {{init: init, variable: variable, serviceApi, operation: operation, dataManipulation}}
     */
    var scaleAuthorization = {
        /**
         * function init
         */
        init: function () {
            this.variable();//variable state
            this.serviceApi.pageIndex();//paging function
            this.operation();//basic operation
            this.dataManipulation.tip();//tip
            this.serviceApi.getScales();//获取量表清单
        },
        /**
         * variable state
         */
        variable: function () {
            $scope.model = {
                scaleId: undefined,
                selectedGid: undefined,
                scaleList: [],
                schoolList: [],
                pSize: 20,
                pIndex: 1,
                itemList: []
            };
        },
        /**
         * service collection
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * get school org pages list
                 * @param func
                 * @param orgid
                 */
                newGetOrgSchoolPage: function (orgid, func) {
                    applicationServiceSet.internalServiceApi.psychologicalEvaluation.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), orgid]).then(function (data) {
                        if (data.Ret == 0) {
                            if (func !== undefined) {
                                func(data.Data);
                            }
                        }
                    });
                },
                /**
                 * 获取量表清单
                 */
                getScales: function (func) {
                    applicationServiceSet.internalServiceApi.psychologicalEvaluation.GetScales.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            if (func !== undefined) {
                                func(data.Data);
                            } else {
                                $scope.model.scaleList = data.Data;
                            }
                        }
                    });
                },
                /**
                 * 获取量表授权清单
                 */
                getScaleAccredit: function () {
                    applicationServiceSet.internalServiceApi.psychologicalEvaluation.GetScaleAccredit.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.scaleId, $scope.model.selectedGid, $scope.model.pIndex, $scope.model.pSize]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList = data.Data.ViewModelList;
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * 编辑和新增
                 */
                addOrModifyScaleAccredit: function (dataItem, item, func) {
                    applicationServiceSet.internalServiceApi.psychologicalEvaluation.AddOrModifyScaleAccredit.send([dataItem.ID, dataItem.ScaID, dataItem.OrgID, dataItem.TopGID, dataItem.Desc, dataItem.ScaName], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('保存成功');
                            if (item) {
                                item.Desc = dataItem.Desc;
                                item.OrgID = dataItem.OrgID;
                                item.OrgName = dataItem.Name;
                                item.ScaID = dataItem.ScaID;
                                item.ScaName = dataItem.ScaName;
                                item.TopGID = dataItem.TopGID;
                                item.TopGName = dataItem.FName;
                            } else {
                                var items = {
                                    Desc: dataItem.Desc,
                                    OrgID: dataItem.OrgID,
                                    OrgName: dataItem.Name,
                                    ScaID: dataItem.ScaID,
                                    ScaName: dataItem.ScaName,
                                    TopGID: dataItem.TopGID,
                                    TopGName: dataItem.FName
                                };
                                $scope.model.itemList.push(items);
                            }
                            func();
                        }
                    });
                },
                /**
                 * get org list
                 * @param func
                 */
                getOrgList: function (func) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getOrganization.send([APPMODEL.Storage.getItem('copPage_token'), 8]).then(function (data) {
                        if (data.Ret == 0) {
                            if (func !== undefined) {
                                func(data.Data);
                            }
                        }
                    });
                },
                /**
                 * 删除量表授权
                 * @param item
                 */
                removeScaleAccredit: function (item) {
                    applicationServiceSet.internalServiceApi.psychologicalEvaluation.RemoveScaleAccredit.send([APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
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
                            applicationServiceSet.internalServiceApi.psychologicalEvaluation.GetScaleAccredit.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.scaleId, $scope.model.selectedGid, page.pIndex, $scope.model.pSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.model.itemList = data.Data.ViewModelList;
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.psychologicalEvaluation.GetScaleAccredit.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.scaleId, $scope.model.selectedGid, pageNext, $scope.model.pSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.model.itemList = data.Data.ViewModelList;
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.psychologicalEvaluation.GetScaleAccredit.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.scaleId, $scope.model.selectedGid, pageNext, $scope.model.pSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.model.itemList = data.Data.ViewModelList;
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        }
                    };
                }
            }
        })(),
        /**
         * basic operation
         */
        operation: function () {
            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    scaleAuthorization.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * search
             */
            $scope.search = function () {
                scaleAuthorization.serviceApi.getScaleAccredit();//获取量表授权清单
            };
            /**
             * newly added
             */
            $scope.addNew = function () {
                $modal.open({
                    templateUrl: 'newAddMyModalContent.html',
                    controller: 'newAddMyModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [scaleAuthorization.serviceApi];
                        }
                    }
                });
            };
            /**
             * 修改
             */
            $scope.modify = function (item) {
                $modal.open({
                    templateUrl: 'newAddMyModalContent.html',
                    controller: 'newAddMyModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [scaleAuthorization.serviceApi, item];
                        }
                    }
                });
            };
            /**
             * 删除
             * @param item
             */
            $scope.deleteMine = function (item) {
                scaleAuthorization.serviceApi.removeScaleAccredit(item);//删除量表授权
            };
            $scope.search();//search
        },
        /**
         * data manipulation
         */
        dataManipulation: (function () {
            return {
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                }
            }
        })()
    };
    scaleAuthorization.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddMyModalContentCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    /**
     * variable
     * @type {{scaleId: undefined}}
     */
    $scope.newAddMyModelCtrl = {
        partnersList: [],
        scaleIdList: [],
        schoolList: [],
        selectedGid: undefined,
        ID: 0,
        ScaID: undefined,
        OrgID: undefined,
        TopGID: undefined,
        Desc: undefined,
        ScaName: undefined,
        Name: undefined,
        FName: undefined
    };
    /**
     * 获取量表
     */
    items[0].getScales(function (data) {
        $scope.newAddMyModelCtrl.scaleIdList = data;
    });
    /**
     * 获取合作伙伴
     */
    items[0].getOrgList(function (data) {
        $scope.newAddMyModelCtrl.partnersList = data;
    });
    /**
     * 合作伙伴的选择
     * @param judge
     */
    $scope.selectPartner = function (judge) {
        if (!judge) {
            $scope.newAddMyModelCtrl.TopGID = undefined;
        }
        if ($scope.newAddMyModelCtrl.OrgID) {
            items[0].newGetOrgSchoolPage($scope.newAddMyModelCtrl.OrgID, function (data) {
                $scope.newAddMyModelCtrl.schoolList = data;
            });//学校选择
        }
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
        if ($scope.newAddMyModelCtrl.scaleIdList) {
            for (var i in $scope.newAddMyModelCtrl.scaleIdList) {
                if ($scope.newAddMyModelCtrl.ScaID == $scope.newAddMyModelCtrl.scaleIdList[i].ID) {
                    $scope.newAddMyModelCtrl.ScaName = $scope.newAddMyModelCtrl.scaleIdList[i].Name;
                    break;
                }
            }
        }
        if ($scope.newAddMyModelCtrl.partnersList) {
            for (var i in $scope.newAddMyModelCtrl.partnersList) {
                if ($scope.newAddMyModelCtrl.OrgID == $scope.newAddMyModelCtrl.partnersList[i].OrgID) {
                    $scope.newAddMyModelCtrl.Name = $scope.newAddMyModelCtrl.partnersList[i].Name;
                    break;
                }
            }
        }
        if ($scope.newAddMyModelCtrl.schoolList) {
            for (var i in $scope.newAddMyModelCtrl.schoolList) {
                if ($scope.newAddMyModelCtrl.TopGID == $scope.newAddMyModelCtrl.schoolList[i].ID) {
                    $scope.newAddMyModelCtrl.FName = $scope.newAddMyModelCtrl.schoolList[i].FName;
                    break;
                }
            }
        }
        items[0].addOrModifyScaleAccredit($scope.newAddMyModelCtrl, items[1], function () {
            $modalInstance.dismiss('cancel');
        });
    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
    if (items[1]) {
        $scope.newAddMyModelCtrl.ScaID = items[1].ScaID;
        $scope.newAddMyModelCtrl.OrgID = items[1].OrgID;
        $scope.newAddMyModelCtrl.TopGID = items[1].TopGID;
        $scope.newAddMyModelCtrl.Desc = items[1].Desc;
        $scope.newAddMyModelCtrl.ID = items[1].ID;
        $scope.selectPartner(true);
    }
}]);