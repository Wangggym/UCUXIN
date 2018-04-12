/**
 * Created by Administrator on 2016/11/22.
 */
app.controller('teacherSendNoteController', ['$scope', function ($scope) {
    $scope.openReport = function () {
        var useUid  = JSON.parse(sessionStorage.getItem('copPage_user')).UID;
        var useOrgid = sessionStorage.getItem('orgid');
        window.open('http://112.74.51.208:88/production/ReportServer?reportlet=rpt%2Fpartner%2F%5B8001%5D%5B5e08%5D%5B4fe1%5D%5B606f%5D%5B53d1%5D%5B9001%5D%5B6548%5D%5B679c%5D%28%5B7535%5D%5B8bdd%5D%29_%5B5408%5D%5B4f5c%5D%5B4f19%5D%5B4f34%5D.cpt&uid='+useUid+'&orgid='+useOrgid)
    }
}]);