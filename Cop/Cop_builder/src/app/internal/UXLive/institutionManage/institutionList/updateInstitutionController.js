/**
 * Created by LQW on 2017/11/21
 */



app.controller('updateInstitutionController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {



    var  updateInsitution={
        //初始化
        init:function () {
            this.variable();
            this.operation();//操作

            setTimeout(function () {
                updateInsitution.serviceApi.GetPubGroupList();

            },500);
        },
        //变量
        variable:function () {

            $scope.model={
                itemList:[],
                gid: $stateParams.ID,
                isUpdate:false,
                Title:$stateParams.Name,
                isMoke:false,
                item:{},
                channelslist:[
                    {id:1,name:'校园直播' },
                    {id:2,name:'学科课程'},
                    {id:3,name:'心理课程'},
                    {id:4,name:'营养课程'},
                ],
                IsAllowSelf:true,
                IsSpec:true,
                IsAllowOther:false,
                key:undefined,
                cnt:10,
                schoolInit:true,
                level:0,
                regionList:[],
                selectedRegionList:[],
                phaseList:[], //教育阶段
                selectedPhaseList:[],//选择的教育阶段
                schoolList:[],  //机构学校列表
                selectSchoolList:[],
                selectedChannelList:[],
                schoolID:undefined,
                regionid:undefined,
                grpList:[],
                cloudID:0,
            }

            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;

            if($scope.model.OrgLevel!=1){
                $scope.model.cloudID = orgModel.CloudID;
            }
            else{
                $scope.model.OrgID=0;
            }
            //处理特殊机构选择显示
            if($scope.model.OrgID > 0){
                $scope.model.IsSpec = false;
            }else if($scope.model.OrgID == 0){
                $scope.model.IsSpec = true;
            }

            //初始化时间
            $scope.loadDate=function () {

                //配置时间开始------------

                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                $scope.model.item.FreeStartDate =date.getFullYear() + "/" + (date.getMonth() + 1) + "/1" ;
                $scope.model.item.FreeEndDate = nowDate;
                $scope.minDate = $scope.minDate ? null : new Date();

                $scope.openStartDate = function ($event) {
                    $scope.endOpened = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedStart = true;
                };

                $scope.openEndDate = function ($event) {
                    $scope.openedStart = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.endOpened = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1,
                    class: 'datepicker'
                };
                $scope.format = 'yyyy/MM/dd';
                //配置時間結束----------
            }



            $scope.loadDate();

        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                //获取直播员列表
                GetPubGroupList:function () {
                    if($scope.model.gid==0) {
                        $scope.model.channelslist[0].checked=true;
                        updateInsitution.serviceApi.GetPhaseList();
                        return false;
                    }
                    applicationServiceSet.liveService.officialBackground.GetPubGroup.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.gid,$scope.model.isMoke])

                        .then(function (data) {
                            if(data.Ret==0){
                                updateInsitution.setting.dataChange(data.Data);

                            }
                        });
                },

                //保存机构信息
                SavePubGroup:function () {
                        applicationServiceSet.liveService.officialBackground.SavePubGroup.send([
                        $scope.model.item.ID,$scope.model.gid,$scope.model.item.GrpName,$scope.model.item.MasterName,
                        $scope.model.item.MasterTel,$scope.model.item.FreeCnt,$scope.model.item.FreeStartDate,$scope.model.item.FreeEndDate,
                        $scope.model.selectedChannelList,$scope.model.IsSpec,$scope.model.IsAllowSelf,$scope.model.IsAllowOther,
                        $scope.model.selectedRegionList,$scope.model.selectedPhaseList, $scope.model.selectSchoolList,
                    ],[APPMODEL.Storage.getItem('copPage_token'),$scope.model.isMoke, $scope.model.OrgLevel, $scope.model.OrgID])

                        .then(function (data) {
                            if(data.Ret==0){
                                $location.url('access/app/internal/UXLive/institutionList');
                                toastr.success('保存成功');
                            }
                        });
                },

                //获取区域
                GetRegionByKeyword:function (key) {
                    applicationServiceSet.liveService.officialBackground.GetRegionByKeyword.send([APPMODEL.Storage.getItem('copPage_token'), key,$scope.model.cnt,$scope.model.level,$scope.model.isMoke])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.regionList= data.Data;
                            }
                        });
                },
                //获取教育阶段
                GetPhaseList:function () {
                    applicationServiceSet.liveService.officialBackground.GetPhaseList.send([APPMODEL.Storage.getItem('copPage_token')])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.phaseList= data.Data;
                                for(var j = 0 ; j<$scope.model.phaseList.length;j++) {
                                    if($scope.model.item.PhaseList) {
                                        for (var i = 0; i < $scope.model.item.PhaseList.length; i++) {
                                            if ($scope.model.phaseList[j].ID == $scope.model.item.PhaseList[i].ID) {
                                                $scope.model.phaseList[j].checked = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                },
                //获取学校/机构
                GetSchoolList:function (key) {
                    applicationServiceSet.liveService.officialBackground.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'),key, $scope.model.cloudID,$scope.model.OrgID])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.schoolList= data.Data;
                            }
                        });
                },


                //获取学校/机构
                GetGrpList:function (key) {
                    applicationServiceSet.liveService.officialBackground.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'),key, $scope.model.cloudID,$scope.model.OrgID])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.grpList=[];
                                for(var i =  0 ; i<data.Data.length;i++){
                                    $scope.model.grpList.push({id:data.Data[i].GID,name:data.Data[i].FName});
                                }
                            }
                        });
                },

            };
        })(),
        /**
         * 操作
         */
        operation:function () {


            //查找区域
            $scope.refreshRegion=function (key) {
                if(!key)return false;
                updateInsitution.serviceApi.GetRegionByKeyword(key);
            }

            //选择区域
            $scope.changeRegion = function (item) {

                    var existItem = false;

                    if(!$scope.model.selectedRegionList)$scope.model.selectedRegionList=[];

                     for(var i = 0 ; i<$scope.model.selectedRegionList.length; i++){
                          var sel = $scope.model.selectedRegionList[i];
                            if(sel.RID == item.RID){
                                existItem = true;
                                break;
                            }
                     }


                     if(!existItem ){
                            var pName='';
                            var cityName='';
                            var conName='';
                            if(item.Type==1){
                                pName=item.Name;
                            }
                            if(item.Type==2){
                                cityName=item.Name;
                                pName= item.PName;
                            }
                         if(item.Type==3){
                             conName=item.Name;
                             cityName= item.PName;
                         }


                         $scope.model.selectedRegionList.push({
                             ID:item.RID,
                             Name:item.Name+(item.PName?'('+item.PName+')':''),
                             Level: item.Type
                         })
                     }

               // $scope.model.regionList=[];
            }
            //移除区域
            $scope.removeRegion = function ( item) {

                for(var i = 0 ; i<$scope.model.selectedRegionList.length; i++){
                    var sel = $scope.model.selectedRegionList[i];
                    if(sel.ID == item.ID){
                        $scope.model.selectedRegionList.splice(i,1);
                        break;
                    }
                }
            }


            //查找学校/机构
            $scope.refreshSchool=function (key) {
                if(!key)return false;
                updateInsitution.serviceApi.GetSchoolList(key);
            }

            //选择学校机构
            $scope.changeSchool = function (item) {

                var existItem = false;

               if($scope.model.selectSchoolList) {
                   for (var i = 0; i < $scope.model.selectSchoolList.length; i++) {
                       var sel = $scope.model.selectSchoolList[i];
                       if (sel.ID == item.GID) {
                           existItem = true;
                           break;
                       }
                   }
               }
               else{
                   $scope.model.selectSchoolList = [];
               }

                if(!existItem ){


                    $scope.model.selectSchoolList.push({
                        ID:item.GID,
                        Name:item.FName
                    })
                }

              //  $scope.model.schoolList=[];
            }

            //移除学校
            $scope.removeSchool= function ( item) {

                for(var i = 0 ; i<$scope.model.selectSchoolList.length; i++){
                    var sel = $scope.model.selectSchoolList[i];
                    if(sel.ID == item.ID){

                        $scope.model.selectSchoolList.splice(i,1);
                        break;
                    }
                }
            };


            /**
             * 勾选开启的业务
             */
            $scope.addCheckedOne = function (itemList, index) {

                angular.forEach(itemList, function (value, key) {
                    if (key == index) {
                        if (value.checked) {
                            value.checked = false;
                        } else {
                            value.checked = true;
                        }
                    }
                });
            };

            //保存
            $scope.save=function () {

                $scope.model.selectedPhaseList=[];
                $scope.model.selectedChannelList=[];

                for(var i = 0 ; i < $scope.model.channelslist.length;i++){
                      if($scope.model.channelslist[i].checked){
                          $scope.model.selectedChannelList .push($scope.model.channelslist[i].id)
                      }
                }


                for(var i = 0 ; i < $scope.model.phaseList.length;i++){
                    if($scope.model.phaseList[i].checked){
                        $scope.model.selectedPhaseList .push({ID:$scope.model.phaseList[i].ID,Name:$scope.model.phaseList[i].Name})
                    }

                }



                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                var sdate=date.getFullYear() + "/" + (date.getMonth() + 1) + "/1" ;

                $scope.model.item.FreeStartDate =  $scope.model.item.FreeStartDate?dateFormat($scope.model.item.FreeStartDate):sdate;
                $scope.model.item.FreeEndDate =  $scope.model.item.FreeEndDate?dateFormat($scope.model.item.FreeEndDate):nowDate;

                function  dateFormat(date) {
                    var df = new Date(date);
                    return  df.getFullYear()+ '-' + (df.getMonth() + 1) + '-' + df.getDate();
                }



                updateInsitution.serviceApi.SavePubGroup();
            }


            //查找机构
            $scope.refreshGrpList=function (key) {
                if(!key){
                    // toastr.error('请输入关键字');
                    return false;
                }
                updateInsitution.serviceApi.GetGrpList(key);
            }




        },
        /**
         * 设置
         */
        setting: (function () {
            return {

                dataChange:function (data) {
                    $scope.model.item= data;
                    $scope.model.IsAllowOther = data.IsAllowOther
                    $scope.model.IsAllowSelf =data.IsAllowSelf;
                    $scope.model.IsSpec =data.IsSpec;

                    $scope.model.selectSchoolList= data.GrpList;
                    $scope.model.selectedRegionList=data.RegionList;
                    $scope.model.gid=data.GID;
                    $scope.model.item.FreeStartDate = data.FreeStartDate.slice(0,-8);
                    $scope.model.item.FreeEndDate = data.FreeEndDate.slice(0,-8);

                    if($scope.model.item.Channels) {
                        //默认频道
                        for (var i = 0; i < $scope.model.item.Channels.length; i++) {
                            var cl = $scope.model.item.Channels[i];
                            for (var j = 0; j < $scope.model.channelslist.length; j++) {
                                if ($scope.model.channelslist[j].id == cl) {
                                    $scope.model.channelslist[j].checked = true;
                                }
                            }
                        }
                    }


                        $scope.model.grpList.push({id:data.GID,name:data.GrpName})

                        $scope.model.isUpdate=true;


                    updateInsitution.serviceApi.GetPhaseList();
                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
            }


        })()



    };
    updateInsitution.init();
}]);

