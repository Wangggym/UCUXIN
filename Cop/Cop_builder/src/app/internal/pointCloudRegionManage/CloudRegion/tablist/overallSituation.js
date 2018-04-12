/**
 * Created by Lenovo on 2017/11/8.
 */
app.controller('overallSituation', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var  overallSituation= {
        //初始化
        init: function () {

            $scope.List = [];
            $scope.SortList = [];

            overallSituation.serviceAPI.GetGlobalTabs();
           $scope.model= {
               activeType:{
                   H5:'H5'
               },
           }


        },

        //API 服务
        serviceAPI: {
            /**
             * 获取全局tab
             */
            GetGlobalTabs: function () {
                applicationServiceSet.couldRegionServiceApi.couldRegion.GetGlobalTabs.send([APPMODEL.Storage.getItem('copPage_token')] ).then(function (data) {

                    if (data.Ret == 0) {
                        var items = data.Data;
                        for(var i =0 ; i<items.length; i ++) {
                            if (items[i].Visible)
                                items[i].VisibleName = "可见";
                            else {
                                items[i].VisibleName = "不可见";
                            }

                            if (items[i].ST)
                                items[i].STName = "启用";
                            else {
                                items[i].STName = "不启用";
                            }
                            if (items[i].ActType===1)
                                items[i].ActType = "H5";
                            if (items[i].ActType===2)
                                items[i].ActType = "Home";
                            if (items[i].ActType===3)
                                items[i].ActType = "Contact";
                            if (items[i].ActType===4)
                                items[i].ActType = "Fblog";
                            if (items[i].ActType===5)
                                items[i].ActType = "Msg";
                            if (items[i].ActType===6)
                                items[i].ActType = "SubApp";
                            if (items[i].ActType===7)
                                items[i].ActType = "Mine";
                        }
                        $scope.List= items;

                    }

                });
            },

            /**
             * 删除单个tab
             */
            RemoveGlobalTab: function (tabID) {

                applicationServiceSet.couldRegionServiceApi.couldRegion.RemoveGlobalTab.send([],[APPMODEL.Storage.getItem('copPage_token'),tabID ]).then(function (data) {

                    if (data.Ret == 0) {
                        var index = $scope.List.indexOf(tabID);

                        $scope.List.splice(index-1,1);
                        $scope.init();
                        toastr.success('删除成功');

                    }

                });
            },

            /**
             * 可见性tab
             */
            SetGlobalTabVisibility: function (visible,tabID,call) {
                applicationServiceSet.couldRegionServiceApi.couldRegion.SetGlobalTabVisibility.send([],[APPMODEL.Storage.getItem('copPage_token'),tabID ,visible]).then(function (data) {

                    if (data.Ret == 0) {
                        if(call) call();
                        toastr.success('设置成功');
                    }
                });
            },
            /**
             * 状态tab
             */
            SetGlobalTabStatus: function (ST,tabID,call) {
                // $scope.init();
                applicationServiceSet.couldRegionServiceApi.couldRegion.SetGlobalTabStatus.send([],[APPMODEL.Storage.getItem('copPage_token'),tabID ,ST]).then(function (data) {

                    if (data.Ret == 0) {
                        if(call) call();
                        toastr.success('设置成功');
                    }
                });
            },

            /**
             * 保存排序tab
             */
            SortGlobalTabs: function () {
                // $scope.init();
                applicationServiceSet.couldRegionServiceApi.couldRegion.SortGlobalTabs.send([ $scope.List],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                    if (data.Ret == 0) {
                        toastr.success('保存成功');
                    }
                });
            },


        },
        //设置，数据处理
        setting:(function () {

            //数据处理
            // $scope.dataChange=function (items) {
            //      $scope.List = items;
            // }

        })(),
        //事件
        events:(function () {
            //拖动排序
            settingGroupDrag();
            function settingGroupDrag() {
                var fixHelper = function (e, ui) {

                    ui.children().each(function () {
                        $(this).width($(this).width());     //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
                    });
                    return ui;
                };


                $(function () {
                    var ui_help;
                    $('#vbox_group').find(" table tbody").sortable({                //这里是talbe tbody，绑定 了sortable
                        helper: fixHelper,                  //调用fixHelper
                        axis: "y",
                        start: function (e, ui) {
                            //ui.helper.css({ "background": "#87CEFF" });  //拖动时的行，要用ui.helper
                            // ui.helper.addClass('setHover');

                            return ui;
                        },
                        stop: function (e, ui) {

                            $('#vbox_group table tbody tr').each(function () {
                                var _index=$(this).index();
                                var trTabID = $(this).attr('TabID');
                                for(var i =0; i< $scope.List.length; i++){
                                    if(trTabID == $scope.List[i].TabID){
                                        $scope.List[i].SNO = _index+1
                                        break;
                                    }
                                }
                            });
                            return ui;
                        }
                    }).disableSelection();
                });
            }

            //保存排序
            $scope.saveSort=function () {

                if($scope.SortList.length){
                    toastr.success('请先改变排序后再保存');
                    return ;

                }else {

                    overallSituation.serviceAPI.SortGlobalTabs();
                }
            }


            //新增
            $scope.addtabhtml = function () {

                $location.url('access/app/internal/CloudRegion/addtabs')

            };

            //删除
            $scope.deletetab = function (TabID) {

                    overallSituation.serviceAPI.RemoveGlobalTab(TabID);

            },

            //编辑
             $scope.edittab = function (item) {

                 $location.url('access/app/internal/CloudRegion/addtabs?TabID='+item.TabID)
                 // console.log(item.TabID)
              },


                //可见/不可见
                $scope.visibleAction = function (isVisible,item) {
                    //todo
                    overallSituation.serviceAPI.SetGlobalTabVisibility(isVisible,item.TabID,visibleCall);
                    function  visibleCall() {
                        item.Visible=!isVisible;
                        if(isVisible){
                            item.VisibleName='不可见';
                        }
                        else{
                            item.VisibleName='可见'
                        }
                    }

                },
                //启用/不启用
                $scope.sTAction = function (isST,item) {
                    //todo
                    overallSituation.serviceAPI.SetGlobalTabStatus(isST,item.TabID,stCall);
                    function  stCall() {
                        item.ST=!isST;
                        if(isST){
                            item.STName='不启动';
                        }
                        else{
                            item.STName='启动'
                        }
                    }
                }

        })()

    }

        overallSituation.init()

}]);
