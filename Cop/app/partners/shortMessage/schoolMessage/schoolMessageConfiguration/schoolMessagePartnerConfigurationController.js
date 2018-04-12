/**
 * Created by fanweihua on 2016/9/13.
 * schoolMessagePartnerConfigurationController
 * school message configuration
 */
app.controller('schoolMessagePartnerConfigurationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * school message configuration
     */
    var schoolMessageConfiguration = (function () {
        /**
         * model function init
         */
        var init = function () {
            variableState.basic();//basic variable
            serviceAPI.getOrgSchoolPage();//get school org pages list
            serviceAPI.pageIndex();//paging function
        };
        /**
         * variable statement
         * @type {{basic: basic, active: active}}
         */
        var variableState = {
            /**
             * basic variable
             */
            basic: function () {
                $scope.model = {
                    selectedGid: undefined,
                    partnersList: [],
                    sendActive: undefined,
                    receiveActive: undefined,
                    sendActivePath: 'partners/shortMessage/schoolMessage/schoolMessageConfiguration/sendActivePath.html',
                    receiveActivePath: 'partners/shortMessage/schoolMessage/schoolMessageConfiguration/receiveActivePath.html',
                    partnersReceiveList: undefined,
                    partnersReceive: undefined,
                    selectedReceiveGid: undefined,
                    schoolReceiveList: [],
                    schoolList: [],
                    indexPax: 20
                };
                $scope.searchSendDisable = true;
                $scope.searchReceiveDisable = true;
                this.active();//judge active
            },
            /**
             * judge active
             */
            active: function () {
                var num = APPMODEL.Storage.getItem('num');
                if (num == 1) {
                    $scope.model.sendActive = true;
                } else if (num == 2) {
                    $scope.model.receiveActive = true;
                }
            }
        };
        /**
         * service set
         * @type {{getOrgSchoolPage: getOrgSchoolPage, getInfoSmsSendRules: getInfoSmsSendRules, getInfoSmsRvRules: getInfoSmsRvRules, pageIndex: pageIndex}}
         */
        var serviceAPI = {
            /**
             * get school org pages list
             */
            getOrgSchoolPage: function () {
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.schoolList = data.Data;
                        $scope.model.schoolReceiveList = data.Data;
                        operation.basic();//operation basic
                    }
                });
            },
            /**
             * get information send rules
             */
            getInfoSmsSendRules: function () {
                applicationServiceSet.internalServiceApi.message.GetInfoSmsSendRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedGid, $scope.model.indexPax, 1]).then(function (data) {
                    if (data.Ret == 0) {
                        operation.dataShowOperation.server.send(data.Data.ViewModelList);
                        $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                        $scope.pageIndexSend.pageindexList(data.Data);//paging
                    }
                });
            },
            /**
             * get information receive rules
             */
            getInfoSmsRvRules: function () {
                applicationServiceSet.internalServiceApi.message.GetInfoSmsRvRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedReceiveGid, $scope.model.indexPax, 1]).then(function (data) {
                    if (data.Ret == 0) {
                        operation.dataShowOperation.server.receive(data.Data.ViewModelList);
                        $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                        $scope.pageIndexReceive.pageindexList(data.Data);//paging
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
                $scope.pageIndexSend = {
                    /**
                     * click paging
                     * @param page
                     */
                    fliPage: function (page) {
                        applicationServiceSet.internalServiceApi.message.GetInfoSmsSendRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedGid, $scope.model.indexPax, page.pIndex]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                                $scope.pageIndexSend.pageindexList(data.Data);//paging
                                operation.dataShowOperation.server.send(data.Data.ViewModelList);
                            }
                        });
                    },
                    /**
                     * nextPage
                     * @param pageNext
                     */
                    nextPage: function (pageNext) {
                        applicationServiceSet.internalServiceApi.message.GetInfoSmsSendRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedGid, $scope.model.indexPax, pageNext]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                                $scope.pageIndexSend.pageindexList(data.Data);//paging
                                operation.dataShowOperation.server.send(data.Data.ViewModelList);
                            }
                        });
                    },
                    /**
                     * previousPage
                     * @param pageNext
                     */
                    previousPage: function (pageNext) {
                        applicationServiceSet.internalServiceApi.message.GetInfoSmsSendRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedGid, $scope.model.indexPax, pageNext]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                                $scope.pageIndexSend.pageindexList(data.Data);//paging
                                operation.dataShowOperation.server.send(data.Data.ViewModelList);
                            }
                        });
                    }
                };
                /**
                 * page index receive
                 * @type {{fliPage: fliPage, nextPage: nextPage, previousPage: previousPage}}
                 */
                $scope.pageIndexReceive = {
                    /**
                     * click paging
                     * @param page
                     */
                    fliPage: function (page) {
                        applicationServiceSet.internalServiceApi.message.GetInfoSmsRvRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedReceiveGid, $scope.model.indexPax, page.pIndex]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                                $scope.pageIndexReceive.pageindexList(data.Data);//paging
                                operation.dataShowOperation.server.receive(data.Data.ViewModelList);
                            }
                        });
                    },
                    /**
                     * nextPage
                     * @param pageNext
                     */
                    nextPage: function (pageNext) {
                        applicationServiceSet.internalServiceApi.message.GetInfoSmsRvRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedReceiveGid, $scope.model.indexPax, pageNext]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                                $scope.pageIndexReceive.pageindexList(data.Data);//paging
                                operation.dataShowOperation.server.receive(data.Data.ViewModelList);
                            }
                        });
                    },
                    /**
                     * previousPage
                     * @param pageNext
                     */
                    previousPage: function (pageNext) {
                        applicationServiceSet.internalServiceApi.message.GetInfoSmsRvRules.send([APPMODEL.Storage.getItem('applicationToken'), APPMODEL.Storage.getItem("orgid"), $scope.model.selectedReceiveGid, $scope.model.indexPax, pageNext]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                                $scope.pageIndexReceive.pageindexList(data.Data);//paging
                                operation.dataShowOperation.server.receive(data.Data.ViewModelList);
                            }
                        });
                    }
                }
            }
        };
        /**
         * operation
         * @type {{basic: basic, judgeGid: judgeGid}}
         */
        var operation = {
            /**
             * operation basic
             */
            basic: function () {
                $scope.clickHeading = function (num) {
                    APPMODEL.Storage.setItem('num', num);
                };
                /**
                 * search send
                 */
                $scope.searchSend = function () {
                    serviceAPI.getInfoSmsSendRules();//get information send rules
                };
                /**
                 * search receive
                 */
                $scope.searchReceive = function () {
                    serviceAPI.getInfoSmsRvRules();//get information receive rules
                };
                /**
                 * edit item
                 * @param item
                 */
                $scope.editSend = function (item) {
                    APPMODEL.Storage.setItem('TopGrpName', item.TopGrpName);
                };
                $scope.selectModelGid = function () {
                    $scope.searchSendDisable = false;
                    $scope.searchSend();//search send
                };
                $scope.deleteModelGid = function () {
                    $scope.model.selectedGid = undefined;
                    $scope.searchSendDisable = true;
                    $scope.sendList = [];
                };
                $scope.selectModelGidReceive = function () {
                    $scope.searchReceiveDisable = false;
                    $scope.searchReceive();//search receive
                };
                $scope.deleteModelGidReceive = function () {
                    $scope.model.selectedReceiveGid = undefined;
                    $scope.searchReceiveDisable = true;
                    $scope.receiveList = [];
                };
                if ($stateParams.gid) {
                    operation.judgeGid();//judge gid
                }
            },
            /**
             * judge gid
             */
            judgeGid: function () {
                if ($stateParams.type == 'send') {
                    this.stateParamsType.send();
                    this.stateParamsType.receive();
                } else if ($stateParams.type = 'receive') {
                    this.stateParamsType.receive();
                    this.stateParamsType.send();
                }
            },
            stateParamsType: (function () {
                return {
                    send: function () {
                        $scope.searchSendDisable = false;
                        $scope.model.selectedGid = $stateParams.gid;
                        $scope.searchSend();//search
                    },
                    receive: function () {
                        $scope.searchReceiveDisable = false;
                        $scope.model.selectedReceiveGid = $stateParams.gid;
                        $scope.searchReceive();//search receive
                    }
                };
            })(),
            /**
             * data show
             */
            dataShowOperation: {
                server: {
                    send: function (data) {
                        for (var i in data) {
                            if (data[i].ST == false) {
                                data[i].STName = '否';
                            } else {
                                data[i].STName = '是';
                            }
                        }
                        $scope.sendList = data;
                    },
                    receive: function (data) {
                        for (var i in data) {
                            if (data[i].ST == false) {
                                data[i].STName = '否';
                            } else {
                                data[i].STName = '是';
                            }
                            if (data[i].RelateStatus == false) {
                                data[i].RelateStatusName = '否';
                            } else {
                                data[i].RelateStatusName = '是';
                            }
                            if (data[i].FuncStatus == false) {
                                data[i].FuncStatusName = '否';
                            } else {
                                data[i].FuncStatusName = '是';
                            }
                        }
                        $scope.receiveList = data;
                    }
                }
            }
        };
        /**
         * return init function
         */
        return {
            init: init
        }
    })();
    schoolMessageConfiguration.init();//school message configuration model function init
}]);