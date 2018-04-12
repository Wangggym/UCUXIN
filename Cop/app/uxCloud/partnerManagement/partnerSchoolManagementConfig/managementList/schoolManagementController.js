//合作伙伴学校管理
app.controller('schoolManagementController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    //变量声明
    $scope.model ={
        keyWord: undefined,
        ScopeTypeEdit:true,
        bigBtn:true,
        scopeID:undefined,
        city:undefined,
        county:undefined,
        pid:'',
        isScope:true,
        scopeType:undefined,
        keyword:'',
        rid:0,
        ID:[]
    };
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 20, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };
    $scope.name = $rootScope.name;//添加合作伙伴页面代入的合作伙伴名称
    var copPageModel = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
    $scope.model.cloudID = copPageModel.CloudID;
    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.scopePageList, function (item) {
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
            if ($scope.selectedList.length === $scope.model.scopePageList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };
    // --- 表格全选功能 结束 --------------------------------------------------
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
            });
        },
        //查询伙伴名称
        selectPartnter: function () {
            applicationServiceSet.themeSkinServiceApi.partner. selectPartnter.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.cloudID]).then(function (data) {
                $scope.model.scopeTypeList = data.Data;
            });
        },
        //获取学校分页数据
        schoolList: function () {
            applicationServiceSet.themeSkinServiceApi.partner.schoolList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.cloudID,$scope.model.pid,$scope.model.rid,$scope.model.keyword,$scope.pagination.itemsPerPage,$scope.pagination.currentPage]).then(function (data) {
                $scope.pagination.totalItems = data.Data.TotalRecords;
                $scope.model.scopePageList = data.Data.ViewModelList;
            });
        },
        //删除合作伙伴分配学校
        DeleteSchool: function (item) {
            applicationServiceSet.themeSkinServiceApi.partner.DeleteSchool.send([$scope.selectedList],[APPMODEL.Storage.getItem('copPage_token'), $scope.model.pid]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success("删除成功");
                    serviceApi.schoolList();
                    $scope.model.scopePageList.splice( $scope.model.scopePageList.indexOf(item), 1);
                }
            });
        }
    };
    //获取省
    $scope.province=function(rid){
        $scope.model.rid = rid;
        applicationServiceSet.themeSkinServiceApi.partner.GetArea.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            $scope.model.scopePList = data.Data;
            $scope.model.ScopeTypeEdit = false;
        });
    };
    //获取市
    $scope.city=function(rid){
        $scope.model.rid = rid;
        applicationServiceSet.themeSkinServiceApi.partner.GetArea.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            $scope.model.TypescopeList = data.Data;
            $scope.model.isScope = false;
        });
    };
    //获取合作伙伴pid
    $scope.changeScopeType = function (ID){
        $scope.model.pid = ID;
    };
    //查询分页数据
    $scope.selectList = function (){
        if(!$scope.model.pid){
            toastr.success('请选择合作伙伴');
            return false
        }
        serviceApi.schoolList();
    };
    // 切换页码
    $scope.pageQuery = function () {
        serviceApi.schoolList();
    };
    //删除合作伙伴学校
    $scope.delete = function (item){
        if (item) {
            $scope.selectedList.push(item.ID);
            serviceApi.DeleteSchool(item);
        }
    };
    //批量删除
    $scope.checkAllList = function () {
        if(!$scope.selectedList|| $scope.selectedList.length == 0){
            toastr.info('请至少选中一个')
            return;
        }
        serviceApi.DeleteSchool();
        serviceApi.schoolList()
    };
    init();
    function init(){
        serviceApi.GetArea();
        serviceApi.selectPartnter();

    }

}]);


