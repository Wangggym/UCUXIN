/**
 * Created by fanweihua on 2016/10/13.
 */
app.directive('ucuUeditor', function () {
    return {
        restrict: "E",
        scope: {
            options: "=", isOpen: "="
        },
        templateUrl: "public/tpl/directive/ucuUeditor.html",
        link: function (scope) {
            var ue = UE.getEditor('container');
            scope.ue = ue;
            UE.registerUI('simpleupload', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        scope.$$childHead.options.ImageUpload(ue);
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: uiName,
                    //点击时执行的命令
                    onclick: function () {
                        //这里可以不用执行命令,做你自己的操作也可
                        editor.execCommand(uiName);
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            });
            /**
             * 发送和接受富文本内容
             * @type {{returnUeditText: returnUeditText, receiveUeditText: receiveUeditText}}
             */
            scope.options = {
                returnUeditText: function () {
                    /*if(!ue.textarea){
                        return undefined;
                    }
                    return ue.textarea.value;*/
                  return ue.getContent();
                },
                receiveUeditText: function (text) {
                  ue.ready(function () {
                    ue.setContent(text);
                  });
                    /*setTimeout(function () {
                        var html = [text];
                        ue.execCommand('insertHtml', html.join(""), true);
                    }, 500);*/
                }
            };
        }
    };
});
app.controller('ucuUeditorController', ['$scope', 'applicationServiceSet', function ($scope, applicationServiceSet) {
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
            $scope.editorOther = undefined;
            $scope.options = {
                ImageUpload: function (ue) {
                    document.getElementById("fileupload").click();
                    $scope.editor = ue;
                },
                imageAddress: function (data) {
                    if (data.Url) {
                        insertHtml(data.Url);
                    }
                }
            };
            $('#fileupload').fileupload({
                dataType: 'json',
                add: function (e, data) {
                    imageUpload.serviceApi.imageUpload(data.files[0]);
                }
            });
            /**
             * 图片上传
             * @param file
             */
            $scope.fileChangeImage = function (file) {
                if (file) {
                    imageUpload.serviceApi.imageUpload(file);
                }
            };
            function insertHtml(url) {
                var html = ["<img src=" + url + "  _src=" + url + " />"];
                if (!$scope.editor) {
                    $scope.$parent.ue.execCommand('insertHtml', html.join(""), true);
                    return;
                }
                $scope.editor.execCommand('insertHtml', html.join(""), true);
            }
        }
    };
    imageUpload.init();//image upload function init
}]);
