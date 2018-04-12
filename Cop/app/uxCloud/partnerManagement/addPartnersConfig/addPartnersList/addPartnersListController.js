//合作伙伴学校管理
app.controller('addPartnersListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    //声明变量
    $scope.model ={
        companyName:'',
        introduce:'',
        partnterName:'',
        cloudID:0,
        ID:'',
        cloudName:''
    }
    var copPageModel = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
    $scope.model.cloudID = copPageModel.CloudID;
    $scope.model.cloudName = copPageModel.CloudName;
    //请求服务集合
    var serviceApi = {
        //添加合作伙伴Api
        AddPartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner.AddPartnter.send([$scope.model.cloudID,$scope.model.companyName,$scope.model.introduce],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                if(data.Msg===''){
                    toastr.success('新增成功');
                }
            });
        },
        //更新合作伙伴api
        UpdatePartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner.UpdatePartnter.send([$scope.model.ID,$scope.model.cloudID,$scope.model.companyName,$scope.model.introduce],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                if(data.Msg===''){
                    toastr.success('修改成功');
                }
            });
        },
        //查询合作伙伴api
        SelectPartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner.SelectPartnter.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.partnterName,$scope.model.cloudID]).then(function (data) {
                $scope.PartnterList = data.Data;
            });
        },
        selectPartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner. selectPartnter.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.cloudID]).then(function (data) {
                $scope.PartnterList = data.Data;
            });
        }
    };
    //进入页面默认查询所有合作伙伴
    init();
    function init(){
        serviceApi.selectPartnter();
    }
    //关闭弹出框
    $scope.closeBox = function (){
        var key = document.getElementById('edit');
        key.style.display="none";
    };
    //添加合作伙伴
    $scope.partnterAdd = function (){
        var key = document.getElementById('edit');
        key.style.display="block";
    };
    //保存添加或者修改
    $scope.savePartnter = function (){
        var key = document.getElementById('edit');
        if($scope.model.ID===''){
            serviceApi.AddPartnter();
        }else if($scope.model.ID!==''){
            serviceApi.UpdatePartnter();
        }
        setTimeout(function(){
            key.style.display="none";
        },2000)
    }
    //查询合作伙伴
    $scope.searchPartnter = function () {
        if(!$scope.model.partnterName){
            serviceApi.selectPartnter();
        }else{
            serviceApi.SelectPartnter();
        }
    }
    //修改合作伙伴
    $scope.updatePartnter = function (list){
        //获取合作伙伴对应id
        $scope.model.ID = list.ID;
        $scope.model.companyName = list.Name;
        var key = document.getElementById('edit');
        key.style.display='block';
    }
    //路由跳转分配学校传递合作伙伴名称
    $scope.school = function(name){
        $rootScope.name = name;
        $state.go('access.app.cloud.addPartnersConfig.addPartnersListSchool',{name:name});
    }
}]);
//合作伙伴学校管理
app.controller('distributionSchoolController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
   //变量声明
    $scope.model ={
        scopeID:undefined,
        city:undefined,
        county:undefined,
        pid:'',
        isScope:true,
        scopeEdit:true,
        keyword:'',
        rid:0,
        btnScope:true,
        scopeType:undefined,
        number:0
    };
    var copPageModel = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
    $scope.model.cloudID = copPageModel.CloudID;
    //单独选择分配学校
    $scope.selectedList = [];
    $scope.FName = [];
    //选中所有
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.areaList, function (item) {
            if ($scope.checkedAll) {
                $scope.model.number = $scope.model.number+1;
                item.checked = true;
                $scope.selectedList.push(item.ID);
                $scope.FName.push({name:item.FName});
            } else {
                item.checked = false;
                $scope.model.number = $scope.model.number-1;
                $scope.FName = [];
            }
        });
        $scope.model.btnScope = false;
    };
    //单独选择
    $scope.checkedSingle = function (checked, id,Name) {
        if (checked) {
            $scope.model.number = $scope.model.number+1;
            $scope.model.btnScope = false;
            $scope.FName.push({name:Name});
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.areaList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.model.number = $scope.model.number-1;
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
            $scope.FName.splice($scope.selectedList.indexOf(id), 1);
        }
    };
    //删除框内分配学校
    $scope.delSelected = function (person,index) {
        $scope.FName.splice(index, 1);
        $scope.selectedList.pop();
        $scope.item.checked = false;
        $scope.model.number = $scope.model.number-1;
    };
    $scope.cancel = function () {
        $scope.FName =[];
        $scope.selectedList = [];
        angular.forEach($scope.areaList, function (item) {
                item.checked = false;
                $scope.model.number = 0;
                $scope.FName = [];
        });
    };
    //请求服务集合
    var serviceApi = {
        //获取行政区域省市县api
        GetArea: function () {
            applicationServiceSet.themeSkinServiceApi.partner.GetArea.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.rid]).then(function (data) {
                $scope.model.scopeList = data.Data;
            });
        },
        //根据行政区和关键字获取未分配合作伙伴的学校列表
        NoPartnterList: function () {
            applicationServiceSet.themeSkinServiceApi.partner.NoPartnterList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.rid,$scope.model.keyword]).then(function (data) {
               $scope.areaList = data.Data;
            });
        },
        //合作伙伴分配学校
        AddSchoolPartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner.AddSchoolPartnter.send([$scope.selectedList],[APPMODEL.Storage.getItem('copPage_token'),$scope.model.pid]).then(function (data) {
                if(data.Ret==0){
                    toastr.success('分配成功');
                    window.history.go(-1);
                }
            });
        },
        //查询伙伴名称
        selectPartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner. selectPartnter.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.cloudID]).then(function (data) {
                $scope.model.scopeTypeList = data.Data;
            });
        }
    };
    //获取合作伙伴pid
    $scope.changeScopeType = function (ID){
        $scope.model.pid = ID;
    };
    //合作伙伴分配学校
    $scope.save = function (){
        serviceApi.AddSchoolPartnter();
    };
    //获取省
    $scope.province=function(rid){
        $scope.model.rid = rid;
        applicationServiceSet.themeSkinServiceApi.partner.GetArea.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            $scope.model.scopePList = data.Data;
            $scope.model.isScope = false;
        });
    };
    //获取市
    $scope.city=function(rid){
        $scope.model.rid = rid;
        applicationServiceSet.themeSkinServiceApi.partner.GetArea.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            $scope.model.TypescopeList = data.Data;
            $scope.model.scopeEdit = false;
        });
    };
    $scope.county=function(rid){
        console.log(rid);
        $scope.model.rid = rid;
    };
    //根据关键字查询
    $scope.selectWord = function (){
        serviceApi.NoPartnterList();
    };
    //分配学校
    $scope.addOrEdit = function (item){
        $scope.model.pid = item.ID;
        $scope.Fname = item.FName;
    };
    //保存学校
    $scope.save = function (){
        if(!$scope.model.pid){
            toastr.error('请选择合作伙伴！');
            return;
        }
        if(!$scope.selectedList.length){
            toastr.error('请选择学校！');
            return;
        }
        serviceApi.AddSchoolPartnter();
    };
    init();
    function init(){
        serviceApi.GetArea();
        serviceApi.selectPartnter();
    }
}]);




