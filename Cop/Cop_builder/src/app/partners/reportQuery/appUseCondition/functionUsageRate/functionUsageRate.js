/**
 * Created by LXF on 2017/06/21.
 */
app.controller('functionUsageRate', ['$scope','$state', function ($scope,$state) {
    $scope.currentUser = JSON.parse(APPMODEL.Storage.getItem("copPage_user"));
    $scope.orgid = APPMODEL.Storage.getItem("orgid");
    //老师使用率查询
    $scope.goTeacher = function () {
        window.open("http://112.74.51.208:88/production/ReportServer?reportlet=rpt%2Fpartner%2F%5B8001%5D%5B5e08%5D%5B529f%5D%5B80fd%5D%5B4f7f%5D%5B7528%5D%5B7387%5D%5B62a5%5D%5B8868%5D_%5B5408%5D%5B4f5c%5D%5B4f19%5D%5B4f34%5D.cpt"
         + "&uid=" + $scope.currentUser.UID + "&orgid=" + $scope.orgid);
    };
    //班级使用率查询
    $scope.goClass = function () {
        window.open("http://112.74.51.208:88/production/ReportServer?reportlet=rpt%2Fpartner%2F%5B73ed%5D%5B7ea7%5D%5B529f%5D%5B80fd%5D%5B4f7f%5D%5B7528%5D%5B7387%5D%5B62a5%5D%5B8868%5D_%5B5408%5D%5B4f5c%5D%5B4f19%5D%5B4f34%5D.cpt"
            + "&uid=" + $scope.currentUser.UID + "&orgid=" + $scope.orgid);
    };
    //学校使用率查询
    $scope.goSchool = function () {
        window.open("http://112.74.51.208:88/production/ReportServer?reportlet=rpt%2Fpartner%2F%5B5b66%5D%5B6821%5D%5B529f%5D%5B80fd%5D%5B4f7f%5D%5B7528%5D%5B7387%5D%5B62a5%5D%5B8868%5D_%5B5408%5D%5B4f5c%5D%5B4f19%5D%5B4f34%5D.cpt"
            + "&uid=" + $scope.currentUser.UID + "&orgid=" + $scope.orgid);
    }
}]);