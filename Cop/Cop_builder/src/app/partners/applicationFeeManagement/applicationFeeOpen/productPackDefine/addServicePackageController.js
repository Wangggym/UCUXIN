/**
 * Created by fanweihua on 2016/8/18.
 * addServicePackageController
 * add service pack
 */
app.controller('addServicePackageController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * add service packages
     * @type {{init: init, getFuncAppList: getFuncAppList, getSchoolList: getSchoolList, getFuncServiceProduct: getFuncServiceProduct, getProductGroupPage: getProductGroupPage, getClassList: getClassList, getFuncServiceProductList: getFuncServiceProductList, pageIndex: pageIndex, schoolOperation: schoolOperation, editSchoolDataOperation: editSchoolDataOperation, editServicePackagePermissions: editServicePackagePermissions, editBasicDataOperation: editBasicDataOperation, basicDataAndOperation: basicDataAndOperation, judgeDataThere: judgeDataThere, timeSetting: timeSetting, operation: operation, option: option, dateChange: dateChange, timeData: timeData}}
     */
    var addServicePackage = {
        /**
         * init function
         */
        init: function () {
            this.variable();
            this.timeData();//time controls
            this.pageIndex();//paging function
            this.operation();//operation
            this.getFuncAppList(function () {//get service item list
                addServicePackage.getFuncServiceProduct();//according to the service package ID get detailed list
                addServicePackage.getSchoolList();//get school list and basic operation
            });
        },
        variable: function () {
            $scope.removeList = [];
        },
        /**
         * get service item list
         */
        getFuncAppList: function (callBack) {
            this.editServicePackagePermissions();//edit service package permissions
            applicationServiceSet.internalServiceApi.applicationFeeOpen.GetFuncAppList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    addServicePackage.getFuncServiceProductList(function () {//get service product list
                        callBack();
                    });
                    addServicePackage.basicDataAndOperation(data.Data);//basic data and operation
                }
            });
        },
        /**
         * get school list and basic operation
         */
        getSchoolList: function () {
            applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetOrgSchool.send([APPMODEL.Storage.getItem('copPage_token'), 1, 10, APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                if (data.Ret == 0) {
                    addServicePackage.schoolOperation(data.Data.ViewModelList);//school list and class list operation function
                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data.Data);//paging
                }
            });
        },
        /**
         * according to the service package ID get detailed list
         */
        getFuncServiceProduct: function () {
            if ($stateParams.packAgeID) {
                applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetFuncServiceProduct.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.packAgeID]).then(function (data) {
                    if (data.Ret == 0) {
                        addServicePackage.editBasicDataOperation(data.Data);//edit basic data and operation
                        addServicePackage.getProductGroupPage();//according to service package ID get page data list
                    }
                });
            }
        },
        /**
         * according to service package ID get paging data list
         */
        getProductGroupPage: function () {
            applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetProductGroupPage.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.packAgeID, 1000, 1]).then(function (data) {
                if (data.Ret == 0) {
                    addServicePackage.editSchoolDataOperation(data.Data.ViewModelList);
                }
            });
        },
        /**
         * get class list
         * @param school
         */
        getClassList: function (school) {
            if (!school.ID) {
                school.ID = school.GID;
            }
            applicationServiceSet.parAppServiceApi.applicationFeeOpen.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), school.ID]).then(function (data) {
                if (data.Ret == 0) {
                    if (data.Data.length > 0) {
                        for (var i in data.Data) {
                            data.Data[i].GID = school.ID;
                            data.Data[i].FName = school.FName;
                        }
                    }
                    $scope.classServiceList = data.Data;
                }
            });
        },
        /**
         * get service product list
         */
        getFuncServiceProductList: function (callBack) {
            applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetFuncServiceProductList.send([APPMODEL.Storage.getItem("copPage_token"), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.funcServiceProductList = data.Data;
                    callBack();
                }
            });
        },
        /**
         * paging function
         */
        pageIndex: function () {
            /**
             * paging
             */
            $scope.pageIndex = {
                /**
                 * click paging
                 * @param page
                 */
                fliPage: function (page) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetOrgSchool.send([APPMODEL.Storage.getItem('copPage_token'), page.pIndex, 10, APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            addServicePackage.schoolOperation(data.Data.ViewModelList);//school list and class list operation function
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
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetOrgSchool.send([APPMODEL.Storage.getItem('copPage_token'), pageNext, 10, APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            addServicePackage.schoolOperation(data.Data.ViewModelList);//school list and class list operation function
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
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetOrgSchool.send([APPMODEL.Storage.getItem('copPage_token'), pageNext, 10, APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            addServicePackage.schoolOperation(data.Data.ViewModelList);//school list and class list operation function
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                }
            }
        },
        /**
         * school list and class list operation function
         * @param data
         */
        schoolOperation: function (data) {
            $scope.schoolServiceList = data;
            if ($scope.distriObjList) {
                if ($scope.distriObjList.length == 0) {
                    $scope.distriObjList = [];
                }
            } else {
                $scope.distriObjList = [];
            }
            /**
             * add school item
             * @param school
             */
            $scope.addSchoolItemService = function (school) {
                var judgeSchool = false;
                if (school.ID) {
                    school.GID = school.ID;
                }
                delete school.ID;
                school.FuncServiceProductID = 0;
//                school.typeList = [
//                    {
//                        id: 1,
//                        name: "个人购买"
//                    },
//                    {
//                        id: 2,
//                        name: "整体开通"
//                    }
//                ];
                for (var i in $scope.distriObjList) {
                    if ($scope.distriObjList[i].GID == school.GID) {
                        if (!$scope.distriObjList[i].ClassID) {
                            judgeSchool = true;
                            break;
                        }
                    }
                }
                if (judgeSchool) {
                    toastr.error("学校重复");
                } else {
                    $scope.distriObjList.push(school);
                }
                setTimeout(function () {
                    $("#selectType" + school.schoolClassID + "").dropdown({allowAdditions: true});
                }, 10);
            };
            /**
             * remove distribution
             * @param distribution
             */
            $scope.removeDistribution = function (distribution) {
                distribution.IsDelete = true;
                $scope.distriObjList.splice($scope.distriObjList.indexOf(distribution), 1);
                $scope.removeList.push(distribution);
            };
            /**
             * school search
             */
            $scope.searchSchool = function () {
                applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetOrgSchool.send([APPMODEL.Storage.getItem('copPage_token'), 1, 10, APPMODEL.Storage.getItem("orgid"), $scope.selectSchool]).then(function (data) {
                    if (data.Ret == 0) {
                        addServicePackage.schoolOperation(data.Data.ViewModelList);//school list and class list operation function
                        $scope.pageIndex.pages = data.Data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data.Data);//paging
                    }
                });
            };
            /**
             * click school to obtain class basic information
             * @param school
             */
            $scope.clickSchool = function (school) {
                $scope.schoolName = school.FName;
                addServicePackage.getClassList(school);
            };
            /**
             * add class item service
             * @param classService
             */
            $scope.addClassItemService = function (classService) {
                var judgeClass = false;
//                classService.typeList = [
//                    {
//                        id: 1,
//                        name: "个人购买"
//                    },
//                    {
//                        id: 2,
//                        name: "整体开通"
//                    }
//                ];
                for (var i in $scope.distriObjList) {
                    if ($scope.distriObjList[i].ClassID == classService.ClassID) {
                        judgeClass = true;
                        break;
                    }
                }
                if (judgeClass) {
                    toastr.error("班级重复");
                } else {
                    $scope.distriObjList.push(classService);
                }
                setTimeout(function () {
                    $("#selectType" + classService.schoolClassID + "").dropdown({allowAdditions: true});
                }, 10);
            };
        },
        /**
         * edit school data and operation
         * @param data
         */
        editSchoolDataOperation: function (data) {
//            var typeList = [
//                {
//                    id: 1,
//                    name: "个人购买"
//                },
//                {
//                    id: 2,
//                    name: "整体开通"
//                }
//            ];
            for (var i in data) {
//                data[i].typeList = typeList;
                data[i].schoolClassID = data[i].ID;
            }
            $scope.distriObjList = data;
            setTimeout(function () {
                $("tbody[name='distribution'] select").each(function () {
                    if ($stateParams.packAgeID) {
                        $("#" + this.id).addClass("disabled");
                    }
                    $("#" + this.id).dropdown({allowAdditions: true});
                });
//                if ($stateParams.packAgeID) {
//                    $("tbody[name='distribution'] td[name='remover'] a").each(function () {
//                        $(this).addClass("hide");
//                    });
//                }
                $("tbody[name='distribution'] select").each(function (index) {
                    var typeName = "";
                    switch ($scope.distriObjList[index].Type) {
                        case 1:
                            typeName = "个人购买";
                            break;
                        case 2:
                            typeName = "整体开通";
                            break;
                        default:
                            typeName = "";
                            break;
                    }
                    $("#" + this.id).siblings("div[class='text']").text(typeName);
                });
            }, 10);
        },
        /**
         * edit service package permissions
         */
        editServicePackagePermissions: function () {
            if ($stateParams.packAgeID) {
                $scope.judgeDisabled = true;
                $("#relyServicePack").addClass("disabled");
                $("#typeSelect").addClass("disabled");
                $scope.judageShow = false;
                $scope.model.disableAmount = true;
            } else {
                $scope.judageShow = true;
                $scope.model.disableAmount = false;
            }
        },
        /**
         * edit basic data and operation
         * @param data
         */
        editBasicDataOperation: function (data) {
            if (data) {
                for (var i in $scope.funcServiceProductList) {
                    if ($scope.funcServiceProductList[i].ID == data.FuncServiceProductID) {
                        $("#relyServicePack").siblings("div[class='text']").text($scope.funcServiceProductList[i].Name);
                        $scope.servicePro = data.FuncServiceProductID;
                        break;
                    }
                }
                $scope.packAgeName = data.Name;
                $scope.packAgeAmount = data.Amount;
                $scope.dateStart = data.SDate.split(" ")[0];
                $scope.dateOver = data.EDate.split(" ")[0];
                if (data.Type == 1) {
                    data.TypeName = "正式包个人购买包";
                } else if (data.Type == 2) {
                    data.TypeName = "试用包";
                } else {
                    data.TypeName = "正式整体开通包";
                }
                $("#typeSelect").siblings("div[class='text']").text(data.TypeName);
                $scope.typeModel = data.Type;
                $scope.desc = data.Desc;
                funcServiceProductItemListModel(data.FuncServiceProductItemListModel);//product item list model
            }
            /**
             *  product item list model
             * @param data
             */
            function funcServiceProductItemListModel(data) {
                for (var i = 0; i < $scope.serviceItemList.length;) {
                    var service = false;
                    for (var n in data) {
                        if (data[n].FuncAppID == $scope.serviceItemList[i].ID) {
                            data[n].Name = $scope.serviceItemList[i].Name;
                            data[n].Desc = $scope.serviceItemList[i].Desc;
                            $scope.serviceItemList.splice($scope.serviceItemList.indexOf($scope.serviceItemList[i]), 1);
                            service = true;
                            break;
                        }
                    }
                    if (service) {
                        i = 0;
                    } else {
                        i++
                    }
                }
//                for (var s in data) {
//                    data[s].SDate = data[s].SDate.split(" ")[0];
//                    data[s].EDate = data[s].EDate.split(" ")[0];
//                }
                $scope.serviceList = data;
                settingTimeControls();//setting time controls
            }

            /**
             * setting time controls
             */
            function settingTimeControls() {
                setTimeout(function () {
                    $("tbody[name='tableService'] td[name='timeStart']").each(function () {
//                        $("#" + this.id + " input").mobiscroll().date({
//                            demo: "date",
//                            theme: 'ios',
//                            display: 'bubble',
//                            lang: 'zh'
//                        });
                        laydate({
                            elem: "#" + this.id + " input"
                        });
                    });
                    $("tbody[name='tableService'] td[name='timeEnd']").each(function () {
//                        $("#" + this.id + " input").mobiscroll().date({
//                            demo: "date",
//                            theme: 'ios',
//                            display: 'bubble',
//                            lang: 'zh'
//                        });
                        laydate({
                            elem: "#" + this.id + " input"
                        });
                    });
                }, 10);
            }
        },
        /**
         * basic data and operation
         * @param data
         */
        basicDataAndOperation: function (data) {
            $scope.serviceItemList = data;
            $scope.serviceList = [];
            /**
             * add service item
             * @param serviceItem
             */
            $scope.addItem = function (serviceItem) {
                if (serviceItem) {
                    serviceItem.Amount = 0;
                    serviceItem.FuncServiceProductID = 0;
                    serviceItem.FuncAppID = serviceItem.ID;
                    delete serviceItem.ID;
                    $scope.serviceList.push(serviceItem);
                    $scope.serviceItemList.splice($scope.serviceItemList.indexOf(serviceItem), 1);
                    addServicePackage.timeSetting(serviceItem);//setting time controls
                }
            };
            /**
             * remove service item
             * @param serviceItem
             */
            $scope.remove = function (serviceItem) {
                if (serviceItem) {
                    serviceItem.ID = serviceItem.FuncAppID;
                    $scope.serviceItemList.push(serviceItem);
                    $scope.serviceList.splice($scope.serviceList.indexOf(serviceItem), 1);
                    if (!serviceItem.amount) {
                        serviceItem.amount = 0;
                    }
                    $scope.packAgeAmount = $scope.packAgeAmount - serviceItem.amount;
                }
            };
            /**
             * lose blur
             */
            $scope.loseBlur = function () {
                var amount = 0;
                $("tbody[name='tableService'] input[name='amount']").each(function (index) {
                    if (this.value != "") {
                        amount += parseFloat(this.value);
                        $scope.serviceList[index].amount = parseFloat(this.value);
                        $scope.serviceList[index].Amount = $scope.serviceList[index].amount;
                    }
                });
                if (typeof amount != "number") {
                    amount = 0;
                }
                $scope.packAgeAmount = addServicePackage.fomatFloat(amount, 2);
            };
            /**
             * save
             */
            $scope.save = function () {
                var judgeBoolean = addServicePackage.judgeDataThere();//there are judge data
                if (judgeBoolean && !$stateParams.packAgeID) {
                    var param = addServicePackage.option();
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.AddFuncServiceProduct.send([0, $scope.packAgeName, param.sDate, param.eDate, $scope.packAgeAmount, $scope.servicePro, APPMODEL.Storage.getItem("orgid"), $scope.typeModel, $scope.serviceList, $scope.distriObjList, $scope.desc]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("新增服务产品包成功");
                            $("button[name='return']").trigger("click");
                        } else {
                            if ($scope.model.optionalServiceAnimate) {
                                $scope.sidebarOperationService();//sidebar operation optional service animate
                            }
                            addServicePackage.errorTip();//error tip
                        }
                    });
                } else if (judgeBoolean && $stateParams.packAgeID) {
                    if ($scope.distriObjList) {
                        for (var i in $scope.distriObjList) {
                            $scope.removeList.push($scope.distriObjList[i]);
                        }
                    }
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.UpdateFuncServiceProduct.send([$stateParams.packAgeID, $scope.removeList]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("更新服务产品包成功");
                            $("button[name='return']").trigger("click");
                        }
                    });
                }
            };
            /**
             * type list
             * @type {{id: number, name: string}[]}
             */
            var typeJsonList = [
                {
                    id: 1,
                    name: "正式包个人购买包"
                },
                {
                    id: 2,
                    name: "试用包"
                },
                {
                    id: 3,
                    name: "正式整体开通包"
                }
            ];
            $scope.typeList = typeJsonList;
            $("#typeSelect").dropdown({allowAdditions: true});
            $("#relyServicePack").dropdown({allowAdditions: true});
        },
        fomatFloat: function (src, pos) {
            return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
        },
        /**
         * there are judge data
         */
        judgeDataThere: function () {
            var judgeBoolen = true;
            if (!$scope.packAgeName) {
                toastr.error("请填写服务包名称");
                judgeBoolen = false;
            }
            if (!$scope.packAgeAmount) {
                toastr.error("请填写金额");
                judgeBoolen = false;
            }
            if (!$scope.dateStart) {
                toastr.error("请填写购买开始日期");
                judgeBoolen = false;
            }
            if (!$scope.dateOver) {
                toastr.error("请填写购买结束日期");
                judgeBoolen = false;
            }
            if (!$scope.typeModel) {
                toastr.error("请选择类型");
                judgeBoolen = false;
            }
            $("tbody[name='tableService'] td[name='timeStart'] input").each(function (index) {
                $scope.serviceList[index].SDate = this.value
            });
            $("tbody[name='tableService'] td[name='timeEnd'] input").each(function (index) {
                $scope.serviceList[index].EDate = this.value
            });
//            var typeList = [
//                {
//                    id: 1,
//                    name: "个人购买"
//                },
//                {
//                    id: 2,
//                    name: "整体开通"
//                }
//            ];
//            $("tbody[name='distribution'] select").siblings("div[class='text']").each(function (index) {
//                for (var i in typeList) {
//                    if (this.innerText == typeList[i].name) {
//                        $scope.distriObjList[index].Type = typeList[i].id;
//                        break;
//                    }
//                }
//            });
            return judgeBoolen;
        },
        /**
         * setting time controls
         * @param serviceItem
         */
        timeSetting: function (serviceItem) {
            setTimeout(function () {
//                $("#" + serviceItem.FuncAppID + "start input").mobiscroll().date({
//                    demo: "date",
//                    theme: 'ios',
//                    display: 'bubble',
//                    lang: 'zh'
//                });
                laydate({
                    elem: "#" + serviceItem.FuncAppID + "start input"
                });
//                $("#" + serviceItem.FuncAppID + "end input").mobiscroll().date({
//                    demo: "date",
//                    theme: 'ios',
//                    display: 'bubble',
//                    lang: 'zh'
//                });
                laydate({
                    elem: "#" + serviceItem.FuncAppID + "end input"
                });
            }, 10);
        },
        /**
         * error tip
         */
        errorTip: function () {
            $("tbody[name='tableService'] input").each(function () {
                if ($("#" + this.id).val() == "") {
                    $("#" + this.id).parent().css({
                        'border': '2px solid #f05050',
                        'border-radius': '10px'
                    });
                } else {
                    $("#" + this.id).parent().css({
                        'border': '0',
                        'border-radius': '0'
                    });
                }
            });
        },
        /**
         * operation
         */
        operation: function () {
            /**
             * variable declaration collection
             * @type {{optionalScopeAnimate: boolean, optionalServiceAnimate: boolean, optionalScopeLength: number, optionalServiceLength: number}}
             */
            var variable = {
                optionalScopeAnimate: true,
                optionalServiceAnimate: true,
                optionalScopeLength: 0,
                optionalServiceLength: 0
            };
            $scope.model = {
                disableAmount: undefined,
                optionalServiceAnimate: undefined
            };
            variable.optionalScopeLength = $("#optionalScope").width();
            variable.optionalServiceLength = $("#optionalService").width();
            $("#optionalScope").css({
                right: -variable.optionalScopeLength + 20 + "px"
            });
            $("#optionalService").css({
                right: -variable.optionalServiceLength + 20 + "px"
            });
            /**
             * sidebar setting animate
             */
            $scope.sidebarOperation = function () {
                if (!variable.optionalScopeAnimate) {
                    $("#optionalScope").animate({
                        right: -variable.optionalScopeLength + 20 + "px"
                    });
                    variable.optionalScopeAnimate = true;
                } else {
                    $("#optionalScope").animate({
                        right: "0px"
                    });
                    variable.optionalScopeAnimate = false;
                }
            };
            /**
             * sidebar operation optional service animate
             */
            $scope.sidebarOperationService = function () {
                $scope.model.optionalServiceAnimate = variable.optionalServiceAnimate;
                if (!variable.optionalServiceAnimate) {
                    $("#optionalService").animate({
                        right: -variable.optionalServiceLength + 25 + "px"
                    });
                    variable.optionalServiceAnimate = true;
                } else {
                    $("#optionalService").animate({
                        right: "0px"
                    });
                    variable.optionalServiceAnimate = false;
                }
            };
            this.tip();//tip
        },
        /**
         * option params
         * @returns {{sDate: string, eDate: string}}
         */
        option: function () {
            var params = {
                sDate: addServicePackage.dateChange($scope.dateStart),
                eDate: addServicePackage.dateChange($scope.dateOver)
            };
            return params;
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
                $scope.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                $scope.dateOver = $scope.dateStart;
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
            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[1];
        },
        /**
         * tip
         */
        tip: function () {
            toastr.toastrConfig.positionClass = 'toast-top-center';
            toastr.toastrConfig.timeOut = 2000;
        }
    };
    addServicePackage.init();//init function
}]);