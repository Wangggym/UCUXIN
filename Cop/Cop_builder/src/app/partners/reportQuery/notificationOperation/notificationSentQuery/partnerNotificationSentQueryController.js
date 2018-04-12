/**
 * Created by fanweihua on 2016/9/27.
 * partnerNotificationSentQueryController
 * partner notification sent query
 */
app.controller('partnerNotificationSentQueryController', ['$scope', function ($scope) {
    /**
     * notification sent query
     * @type {{init: init, variable: variable, serviceApi, operation}}
     */
    var notificationSentQuery = {
        init: function () {
            this.variable();//variable declaration
            this.operation.basic();//basic operation
        },
        /**
         * variable declaration
         */
        variable: function () {
            $scope.model = {
                sendActivePath: 'partners/reportQuery/notificationOperation/notificationSentQuery/sendActivePath.html',
                receiveActivePath: 'partners/reportQuery/notificationOperation/notificationSentQuery/receiveActivePath.html'
            };
        },
        /**
         * operation
         */
        operation: (function () {
            return {
                basic: function () {
                    $scope.clickHeading = function (num) {
                        APPMODEL.Storage.setItem('num', num);
                    };
                    this.active();
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
        })()
    };
    notificationSentQuery.init();//notification sent query function init
}]);
/**
 * Created by fanweihua on 2016/9/27.
 * partnersNotificationSentQuerySendController
 * partners notification sent query send
 */
app.controller('partnersNotificationSentQuerySendController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet) {
    /**
     * notification sent query send
     * @type {{init: init, variable: variable, serviceApi, operation}}
     */
    var notificationSentQuerySend = {
        init: function () {
            this.variable();//variable declaration
            this.serviceApi.pageIndex();//paging function
            this.serviceApi.getOrgSchoolPage();//get school org pages list
        },
        /**
         * variable declaration
         */
        variable: function () {
            $scope.model = {
                selectedGid: undefined,
                schoolList: [],
                sendName: undefined,//发送人
                pIndex: 20
            };
            notificationSentQuerySend.operation.basic();//basic operation
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                            $scope.model.schoolReceiveList = data.Data;
                        }
                    });
                },
                /**
                 * get information send rpt
                 */
                getInfoSendRpt: function () {
                    applicationServiceSet.internalServiceApi.notification.GetInfoSendRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid, $scope.model.sendName, notificationSentQuerySend.operation.dateChange($scope.model.dateStart), notificationSentQuerySend.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, 1]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                            $scope.pageIndexSend.pageindexList(data.Data);//paging
                            notificationSentQuerySend.operation.dataShowOperation(data.Data.ViewModelList);
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
                            applicationServiceSet.internalServiceApi.notification.GetInfoSendRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid, $scope.model.sendName, notificationSentQuerySend.operation.dateChange($scope.model.dateStart), notificationSentQuerySend.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndexSend.pageindexList(data.Data);//paging
                                    notificationSentQuerySend.operation.dataShowOperation(data.Data.ViewModelList);
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.notification.GetInfoSendRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid, $scope.model.sendName, notificationSentQuerySend.operation.dateChange($scope.model.dateStart), notificationSentQuerySend.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndexSend.pageindexList(data.Data);//paging
                                    notificationSentQuerySend.operation.dataShowOperation(data.Data.ViewModelList);
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.notification.GetInfoSendRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid, $scope.model.sendName, notificationSentQuerySend.operation.dateChange($scope.model.dateStart), notificationSentQuerySend.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.pageIndexSend.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndexSend.pageindexList(data.Data);//paging
                                    notificationSentQuerySend.operation.dataShowOperation(data.Data.ViewModelList);
                                }
                            });
                        }
                    };
                }
            };
        })(),
        /**
         * operation
         */
        operation: (function () {
            return {
                /**
                 * basic operation
                 */
                basic: function () {
                    /**
                     * send search
                     */
                    $scope.searchSend = function () {
                        notificationSentQuerySend.serviceApi.getInfoSendRpt();//get information send rpt
                    };
                    /**
                     * delete gid
                     */
                    $scope.deleteModelGid = function () {
                        $scope.model.selectedGid = undefined;
                        $scope.model.sendList = [];
                    };
                    /**
                     * search
                     */
                    $scope.selectModelGid = function () {
                        $scope.searchSend();
                    };
                    this.timeData();//time controls
                },
                /**
                 * data show operation
                 */
                dataShowOperation: function (data) {
                    if (!data) {
                        return;
                    }
                    for (var i in data) {
                        if (data[i].IsSendSms) {
                            data[i].IsSendSmsName = '是';
                        } else {
                            data[i].IsSendSmsName = '否';
                        }
                        if (data[i].InfoCont.length > 10) {
                            data[i].InfoContName = data[i].InfoCont;
                            data[i].InfoCont = data[i].InfoCont.substring(0, 10) + '...';
                        } else {
                            data[i].InfoContName = data[i].InfoCont;
                        }
                    }
                    $scope.model.sendList = data;
                },
                /**
                 * date change
                 * @param date
                 * @returns {string}
                 */
                dateChange: function (date) {
                    var isEffective = date instanceof Date ? true : false;
                    if (isEffective) {
                        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    } else {
                        return date;
                    }
                },
                /**
                 * time controls
                 */
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.model.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        $scope.model.dateOver = $scope.model.dateStart;
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
                        $scope.isOpen = true;
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
                    $scope.format = 'yyyy-MM-dd';
                }
            }
        })()
    };
    notificationSentQuerySend.init();//notification sent query send function init
}]);
/**
 * Created by fanweihua on 2016/9/27.
 * partnersNotificationSentQueryReceiveController
 * partners notification sent query receive
 */
app.controller('partnersNotificationSentQueryReceiveController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet) {
    /**
     * notification sent query receive
     * @type {{init: init, variable: variable, serviceApi, operation}}
     */
    var notificationSentQueryReceive = {
        init: function () {
            this.variable();//variable declaration
            this.serviceApi.pageIndex();//paging function
            this.serviceApi.getOrgSchoolPage();//get school org pages list
        },
        /**
         * variable declaration
         */
        variable: function () {
            $scope.model = {
                selectedReceiveGid: undefined,
                schoolReceiveList: [],
                sendName: undefined,//发送人
                receiveName: undefined,//接收人
                pIndex: 20
            };
            notificationSentQueryReceive.operation.basic();//basic operation
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                            $scope.model.schoolReceiveList = data.Data;

                        }
                    });
                },
                /**
                 * get information send rpt
                 */
                getInfoRvRpt: function () {
                    applicationServiceSet.internalServiceApi.notification.GetInfoRvRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedReceiveGid, $scope.model.sendName, $scope.model.receiveName, notificationSentQueryReceive.operation.dateChange($scope.model.dateStart), notificationSentQueryReceive.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, 1]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                            $scope.pageIndexReceive.pageindexList(data.Data);//paging
                            notificationSentQueryReceive.operation.dataShowOperation(data.Data.ViewModelList);
                        }
                    });
                },
                /**
                 * paging function
                 */
                pageIndex: function () {
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
                            applicationServiceSet.internalServiceApi.notification.GetInfoRvRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedReceiveGid, $scope.model.sendName, $scope.model.receiveName, notificationSentQueryReceive.operation.dateChange($scope.model.dateStart), notificationSentQueryReceive.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndexReceive.pageindexList(data.Data);//paging
                                    notificationSentQueryReceive.operation.dataShowOperation(data.Data.ViewModelList);
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.notification.GetInfoRvRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedReceiveGid, $scope.model.sendName, $scope.model.receiveName, notificationSentQueryReceive.operation.dateChange($scope.model.dateStart), notificationSentQueryReceive.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndexReceive.pageindexList(data.Data);//paging
                                    notificationSentQueryReceive.operation.dataShowOperation(data.Data.ViewModelList);
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.notification.GetInfoRvRpt.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedReceiveGid, $scope.model.sendName, $scope.model.receiveName, notificationSentQueryReceive.operation.dateChange($scope.model.dateStart), notificationSentQueryReceive.operation.dateChange($scope.model.dateOver), $scope.model.pIndex, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.pageIndexReceive.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndexReceive.pageindexList(data.Data);//paging
                                    notificationSentQueryReceive.operation.dataShowOperation(data.Data.ViewModelList);
                                }
                            });
                        }
                    }
                }
            };
        })(),
        /**
         * operation
         */
        operation: (function () {
            return {
                /**
                 * basic operation
                 */
                basic: function () {
                    /**
                     * send search
                     */
                    $scope.searchReceive = function () {
                        notificationSentQueryReceive.serviceApi.getInfoRvRpt();//get information send rpt
                    };
                    /**
                     * delete gid
                     */
                    $scope.deleteModelGid = function () {
                        $scope.model.selectedReceiveGid = undefined;
                        $scope.model.receiveList = [];
                    };
                    /**
                     * search
                     */
                    $scope.selectModelGid = function () {
                        $scope.searchReceive();
                    };
                    this.timeData();//time controls
                },
                /**
                 * data show operation
                 */
                dataShowOperation: function (data) {
                    if (!data) {
                        return;
                    }
                    for (var i in data) {
                        if (data[i].IsRv) {
                            data[i].IsRvName = '已接收';
                        } else {
                            data[i].IsRvName = '未接收';
                        }
                        if (data[i].IsRvSms) {
                            data[i].IsRvSmsName = '是';
                        } else {
                            data[i].IsRvSmsName = '否';
                        }
                        if (data[i].InfoCont.length > 10) {
                            data[i].InfoContName = data[i].InfoCont;
                            data[i].InfoCont = data[i].InfoCont.substring(0, 10) + '...';
                        } else {
                            data[i].InfoContName = data[i].InfoCont;
                        }
                    }
                    $scope.model.receiveList = data;
                },
                /**
                 * date change
                 * @param date
                 * @returns {string}
                 */
                dateChange: function (date) {
                    var isEffective = date instanceof Date ? true : false;
                    if (isEffective) {
                        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    } else {
                        return date;
                    }
                },
                /**
                 * time controls
                 */
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.model.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        $scope.model.dateOver = $scope.model.dateStart;
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
                    $scope.format = 'yyyy-MM-dd';
                }
            }
        })()
    };
    notificationSentQueryReceive.init();//notification sent query receive function init
}]);