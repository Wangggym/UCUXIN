/**
 * Created by wangbin on 2017/1/17.
 */

app.controller('addBannerController', ['$scope', '$location', '$stateParams', '$filter', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $location, $stateParams, $filter, toastr, toastrConfig, applicationServiceSet) {
    'use strict';
    var addBanner;

    function addBannerFunction() {
        //提交数据的model
        //跳转参数
        $scope.pageType = $stateParams.type;
        $scope.submitData = {
            bannerId: 0,
            title: '',
            goUrl: '',
            imgUrl: '',
            startTime: '',
            endTime: '',
            range: '',
            type: true,
            topGID: 0,
            sort: ''
        };
        this.getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr).then(fn);
        };
        this.init = function () {
            addBanner.change();
            addBanner.initTime();
            addBanner.sendImg();
            addBanner.submit();
            $scope.submitData.uid = JSON.parse(sessionStorage.getItem('copPage_user')).UID;
        }
    }

    /*---------------------是否是修改------------------------*/
    addBannerFunction.prototype.change = function () {
        if ($stateParams.type == 11) {
            sessionStorage.removeItem('banner');
            $scope.submitData.type = 'true';
        }
        if (sessionStorage.getItem('banner')) {
            $scope.imgName = '已上传图片';
            $scope.sessionData = JSON.parse(sessionStorage.getItem('banner'));
            $scope.submitData.bannerId = $scope.sessionData.ID;
            $scope.submitData.title = $scope.sessionData.Name;
            $scope.submitData.imgUrl = $scope.sessionData.ImgUrl;
            $scope.submitData.goUrl = $scope.sessionData.Url;
            $scope.submitData.startTime = $scope.sessionData.BDate;
            $scope.submitData.endTime = $scope.sessionData.EDate;
            ($scope.sessionData.Type == true) ? $scope.submitData.type = 'true' : $scope.submitData.type = 'false';
        }
    };
    /*---------------------时间配置开始------------------------*/
    addBannerFunction.prototype.initTime = function () {
        $scope.clear = function () {
            $scope.sDate = null;
            $scope.eDate = null;
        };
        $scope.minDate = $scope.minDate ? null : new Date();
        $scope.openStartDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = true;
        };
        $scope.openEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };
        $scope.format = 'yyyy-MM-dd';
    };
    /*---------------------图片上传------------------------*/
    addBannerFunction.prototype.sendImg = function () {
        // UEditor 配置
        $scope.config = {
            UEDITOR_HOME_URL: "/bower_components/ueditor/" //URL
            // , serverUrl: urlConfig + "net/controller.php"
            ,
            serverUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}&token=' + APPMODEL.Storage.getItem('applicationToken'),
            //urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}&token=' + APPMODEL.Storage.getItem('applicationToken'),
        };
        /**
         * 图片选择
         * @param file
         */
        $scope.fileChange = function (file) {
            if (file) {
                applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.submitData.imgUrl = data.Data.Url;
                    }
                });
            }
        };
    };
    /*---------------------判断是否为数字------------------------*/
    addBannerFunction.prototype.isNumber = function (s) {
        if (s != null) {
            var r, re;
            re = /\d*/i; //\d表示数字,*表示匹配多个数字
            r = s.match(re);
            return (r == s) ? true : false;
        }
        return false;
    };
    /*---------------------判断是否是正确的URL------------------------*/
    addBannerFunction.prototype.isURL = function (str_url) {
        var strRegex = '((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,4})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        var re = new RegExp(strRegex);
        if (re.test(str_url)) {
            return true;
        } else {
            return false;
        }
    };
    /*---------------------检验数据并提交------------------------*/
    addBannerFunction.prototype.submit = function () {
        var bannerApi;
        $scope.confirm = function () {
            if ($scope.submitData.title == '') {
                toastr.error("标题未填写！");
                return;
            }
            if ($scope.submitData.imgUrl == '') {
                toastr.error("图片上传失败！");
                return;
            }
            if (!$scope.submitData.type) {
                toastr.error("必须选择banner类型！");
                return;
            }
            // if(!addBanner.isURL($scope.submitData.goUrl)){
            //     toastr.error("请填写正确的链接！");
            //     return;
            // }
            if ($scope.submitData.startTime == '' || $scope.submitData.endTime == '') {
                toastr.error("显示时间未填写完整！");
                return;
            }
            // if($scope.submitData.range==''){
            //     toastr.error("收费类型未选择！");
            //     return;$scope.submitData.startTime
            // }
            if (new Date($scope.submitData.startTime) > new Date($scope.submitData.endTime)) {
                toastr.error("开始时间不能大于结束时间！");
                return;
            }
            $scope.submitData.startTime = $filter('date')($scope.submitData.startTime, 'yyyy-MM-dd');
            $scope.submitData.endTime = $filter('date')($scope.submitData.endTime, 'yyyy-MM-dd');
            $scope.submitData.creatTime = $filter('date')(new Date(), 'yyyy-MM-dd');
            //是否是修改
            if (sessionStorage.getItem('banner')) {
                bannerApi = 'changeBanner';
            } else {
                bannerApi = 'AddBanner';
            }
            addBanner.getService(bannerApi, [$scope.submitData.bannerId, $scope.submitData.title, $scope.submitData.goUrl, $scope.submitData.imgUrl, $scope.submitData.startTime, $scope.submitData.endTime, $scope.submitData.creatTime, $scope.submitData.type, $scope.submitData.uid], function (data) {
                if (data.Ret === 0) {
                    if (bannerApi == 'changeBanner') {
                        toastr.success('修改成功');
                    } else {
                        toastr.success('添加成功');
                    }
                    sessionStorage.removeItem('banner');
                    $location.path('access/app/internal/nutritionOperationManagement/bannerSet');
                }
            });
        };
    };
    addBanner = new addBannerFunction();
    addBanner.init();
}]);