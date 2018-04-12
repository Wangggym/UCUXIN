/**
 * Created by Administrator on 2016/11/22.
 */
app.controller('noteUseConditionSerchContoller', ['$scope', function ($scope) {
    $scope.openReport = function (url) {
        var useUid  = JSON.parse(sessionStorage.getItem('copPage_user')).UID;
        var useOrgid = sessionStorage.getItem('orgid');
        window.open(url+'&uid='+useUid+'&orgid='+useOrgid);
    };
}]);