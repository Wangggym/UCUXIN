/**
 * Created by WangQiHan on 2016/9/20.
 * Psychological Knowledge Controller
 */
app.controller('PsychologicalKnowledgeController', ['$scope', '$location', '$modal', '$filter', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $location, $modal, $filter, toastr, toastrConfig, applicationServiceSet) {
    'use strict';

    $scope.queryFields = {
        title: undefined,
        state: undefined,
        period: undefined
    };

    $scope.periodConfig = [
        {name: '学前', value: 2},
        {name: '小学', value: 4},
        {name: '初中', value: 8},
        {name: '高中', value: 16},
        {name: '职校', value: 32},
        {name: '大学', value: 64},
        {name: '全学段', value: 1024}
    ];

    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 50, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };

    // --- 时间配置 开始--------------------------------------------------
    $scope.clear = function () {
        $scope.sDate = null;
        $scope.eDate = null;
    };
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.openStartDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
        $scope.endOpened = false;
    };
    $scope.openEndDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = false;
        $scope.endOpened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 时间配置 结束 -------------------------------------------------------

    //---- 状态配置 开始 -------------------------------------------------------
    $scope.statusCharge = function () {
        if (!$scope.checkedCharge && !$scope.checkedFree) {
            $scope.queryFields.state = 0;
        }

        if (!$scope.checkedCharge) {
            $scope.checkedCharge = false;
            return;
        }

        $scope.checkedCharge = true;
        $scope.checkedFree = false;
        $scope.queryFields.state = 1;

    };
    $scope.statusFree = function () {
        if (!$scope.checkedCharge && !$scope.checkedFree) {
            $scope.queryFields.state = 0;
        }

        if (!$scope.checkedFree) {
            $scope.checkedFree = false;
            return;
        }
        $scope.checkedFree = true;
        $scope.checkedCharge = false;
        $scope.queryFields.state = 2;
    };
    //---- 状态配置 结束 -------------------------------------------------------

    // --- 表格全选功能 开始 --------------------------------------------------
    /*  $scope.selectedList = [];
     $scope.checkedAll = false;

     $scope.checkAll =  function () {
     $scope.selectedList = [];
     angular.forEach($scope.dataList, function (item) {
     //item.checked = $scope.checkedAll ? true : false;
     if($scope.checkedAll){
     item.checked = true;
     $scope.selectedList.push(item.ID);
     }else{
     item.checked = false;
     }
     });
     };

     $scope.checkedSingle = function (checked, id) {
     if(checked){
     $scope.selectedList.push(id);
     if($scope.selectedList.length === $scope.dataList.length){
     $scope.checkedAll = true;
     }
     }else{
     $scope.checkedAll = false;
     $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
     }
     }*/

    // --- 表格全选功能 结束 --------------------------------------------------

    // 服务
    var psychologicalKnowledge = (function () {

        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token;

        var getService = function (method, arr, list, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
        }


        var getKnowledge = function () {
            var pageIndex = $scope.pagination.currentPage,
                pageSize = $scope.pagination.itemsPerPage,
                sDate = $filter('date')($scope.sDate, 'yyyy-MM-dd') || null,
                eDate = $filter('date')($scope.eDate, 'yyyy-MM-dd') || null,
                title = $scope.queryFields.title || '',
                state = $scope.queryFields.state || 0,
                period = $scope.queryFields.period || 0;


            getService('getKnowledge', [token, pageIndex, pageSize, sDate, eDate, title, state, period], undefined, function (data) {
                if (data.Ret === 0) {
                    if (data.Data) {
                        $scope.dataList = data.Data.ViewModelList;
                        // 分页配置项更新
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.pagination.numPages = data.Data.Pages;
                    } else {
                        $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
                    }

                    // 重置选中功功能与数据
                    $scope.checkedAll = false;
                    $scope.selectedList = [];
                }
            })
        }

        var delPsychKnowledge = function (id) {
            getService('delPsychKnowledge', undefined, [id], function (data) {
                if (data.Ret === 0) {
                    toastr.success('删除成功！');
                    getKnowledge();
                }
            });
        }

        return {
            getKnowledgeList: getKnowledge,
            deletedPsychKnowledge: delPsychKnowledge
        }
    })();

    // 默认查询
    psychologicalKnowledge.getKnowledgeList();

    // 查询出列表
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if (event) {
            // 当点击查询时重置当页为首页
            var event = event || window.event;
            var target = event.target || window.srcElement;
            if (target.tagName.toLocaleLowerCase() == "button") {
                $scope.pagination.currentPage = 1;
            }
        }
        psychologicalKnowledge.getKnowledgeList();
    };

    // 删除心理知识
    $scope.del = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'removeConfirm.html',
            size: 'sm',
            controller: 'RemoveConfirmCtrl',
            resolve: {
                items: function () {
                    return item
                }
            }
        });

        modalInstance.result.then(function (id) {
            psychologicalKnowledge.deletedPsychKnowledge(id);
        }, function () {
            // 取消时作出操作
        });
    };


    // 添加修改心理知识维护
    $scope.save = function (id) {
        $location.path('access/app/internal/knowledgeInformation/addPsychologicalKnowledge/' + (id || 0));
    };

    /**
     * 查看详情
     */
    var detailedTemplate = {
        /**
         * 入口
         */
        init: function () {
            this.operation();
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 根据心理知识ID获取富文本内容
                 * @param id
                 * @param func
                 */
                getKnowledgeH5ByID: function (id, func) {
                    applicationServiceSet.internalServiceApi.psychologicalEvaluation.GetKnowledgeH5ByID.send([APPMODEL.Storage.getItem('copPage_token'), id]).then(function (data) {
                        if (data.Ret == 0) {
                            func(data.Data.Cont);
                        }
                    });
                }
            };
        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查看详情
             * @param item
             */
            $scope.detailedTemplate = function (item) {
                detailedTemplate.serviceApi.getKnowledgeH5ByID(item.ID, function (data) {
                    $modal.open({
                        templateUrl: 'detailedTemplate.html',
                        controller: 'detailedTemplateCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return data;
                            },
                            itemsId: function () {
                                return item;
                            }
                        }
                    });
                });
            };
        }
    };
    detailedTemplate.init();//查看详情入口
}]);

app.controller('RemoveConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.item = items;
    $scope.comfirm = function () {
        $modalInstance.close($scope.item.ID);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

/**
 * 效果预览
 */
app.controller('detailedTemplateCtrl', ['$scope', '$modalInstance', 'items', 'itemsId', function ($scope, $modalInstance, items, itemsId) {
    'use strict';
//    if (items) {
//        $scope.modelHtml = items;
//    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 200,
            height: 200
        });
        qrcode.makeCode(APPMODEL.lappUrl + APPMODEL.lappRootUrl + 'knowledge_detail.html?id=' + itemsId.ID + '&type=1');
    }, 100);
}]);