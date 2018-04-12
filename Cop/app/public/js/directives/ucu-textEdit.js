/**
 * Created by fanweihua on 2016/10/11.
 * imageUpload directive
 * picture upload
 */
app.directive('textEdit', function () {
    return {
        restrict: "E",
        require: '?ngModel',
        scope: {
            options: "=", isOpen: "=", ngModel: '='
        },
        templateUrl: "public/tpl/directive/ucuTextEdit.html",
        link: function (scope, element, attrs, ctrl) {
            /*scope.$watch('ngModel', function (nv, ov) {
             if(nv === ov) return;
             $("div[name='text-angular'] div[ng-model='html']")[0].innerHTML = scope.ngModel;
             });*/

            /*element.bind('blur keyup onchange', function() {
             scope.$apply(function () {
             ctrl.$setViewValue($("div[name='text-angular'] div[ng-model='html']")[0].innerHTML);
             });
             });*/
            scope.options.call = function () {
                return $("div[name='text-angular'] div[ng-model='html']")[0].innerHTML;
            };
            scope.options.textContent = function (content) {
                if (content && content != "") {
                    $("div[name='text-angular'] div[ng-model='html']").html(content);
                }
            };
//            setTimeout(function () {
//                $("div[name='text-angular'] div[ng-model='html']").children().mouseup(function (e) {
//                    var test = "<span>435456fdsg</span>";
//                    $(this).append(test);
//                });
//            }, 1000);
        }
    };
});
app.controller('imageUploadController', ['$scope', 'applicationServiceSet', function ($scope, applicationServiceSet) {
    /**
     * image upload
     * @type {{init: init, serviceApi, operation: operation}}
     */
    var imageUpload = {
        /**
         * function init
         */
        init: function () {
            this.operation();
        },
        /**
         * service aggregate
         */
        serviceApi: (function () {
            return {
                imageUpload: function (file) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.options.imageAddress(data.Data)
                        }
                    });
                }
            };
        })(),
        /**
         * basic operation
         */
        operation: function () {
            $scope.UploadImage = undefined;
            $scope.htmlVariable = undefined;
            $scope.editor = undefined;
            $scope.options = {
                ImageUpload: function (editor) {
                    document.getElementById("fileUploadImage").click();
                    $scope.editor = editor;
                },
                imageAddress: function (data) {
                    if (data.Url) {
                        $scope.editor.$editor().wrapSelection("insertImage", data.Url, !0);
                    }
                }
            };
            /**
             * 图片上传
             * @param file
             */
            $scope.fileChangeImage = function (file) {
                if (file) {
                    imageUpload.serviceApi.imageUpload(file);
                }
            };
        }
    };
    imageUpload.init();//image upload function init
}]);