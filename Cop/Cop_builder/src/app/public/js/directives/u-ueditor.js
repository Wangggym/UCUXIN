
/**
 Created by Dio on 17-9.
 http://inhu.net
 */

//(function() {
//  "use strict";
//  (function() {
//    var NGUeditor;
//    NGUeditor = angular.module("ng.ueditor", []);
    app.directive("ueditor", ['$http',
      function($http) {
        return {
          restrict: "C",
          require: "ngModel",
          scope: {
            config: "=",
            ready: "="
          },
          link: function($S, element, attr, ctrl) {
            var _NGUeditor, _updateByRender;
            _updateByRender = false;
            _NGUeditor = (function() {
              function _NGUeditor() {
                this.bindRender();
                this.initEditor();
                return;
              }


              /**
               * 初始化编辑器
               * @return {[type]} [description]
               */

              _NGUeditor.prototype.initEditor = function() {
                var _UEConfig, _editorId, _self;
                _self = this;
                if (typeof UE === 'undefined') {
                  console.error("Please import the local resources of ueditor!");
                  return;
                }
                _UEConfig = $S.config ? $S.config : {};
                _editorId = attr.id ? attr.id : "_editor" + (Date.now());
                element[0].id = _editorId;
                //---------------------

                UE.registerUI('singleImageUpload', function(editor, uiName) {
                  //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                  editor.registerCommand(uiName, {
                    execCommand: function() {
                      alert('execCommand:' + uiName)
                    }
                  });
                  //创建一个button
                  var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: uiName,
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -380px 0px;',
                    //点击时执行的命令
                    onclick: function() {
                      //这里可以不用执行命令,做你自己的操作也可
                      var createImage = (function () {
                        var imageFile;
                        return function () {
                          if(imageFile){ return imageFile;}
                          imageFile = document.createElement('input');
                          imageFile.setAttribute('type','file');
                          imageFile.setAttribute('id','ucuImageFileUpload');
                          imageFile.setAttribute('accept','image/jpg,image/jpeg,image/gif,image/png');
                          imageFile.click();
                          imageFile.addEventListener('change', function () {
                            var formData = new FormData();
                            formData.append('file',imageFile.files[0]);
                            editor.execCommand( 'insertimage', { src:'/bower_components/ueditor/themes/default/images/loading.gif'});
                            $http({
                              method: 'POST',
                              url: urlConfig + 'base/v3/OpenApp/UploadAttachment',
                              params: {'token': APPMODEL.Storage.applicationToken, 'attachmentStr' :{"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}},
                              //url: config.ucu.url, //urlConfig + 'base/v3/OpenApp/UploadAttachment',
                              //params: config.ucu.params, //{'token': APPMODEL.Storage.applicationToken, 'attachmentStr' :{"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}},
                              headers: {'Content-Type': undefined},
                              data: formData
                            }).success(function (data, status, headers, config) {
                              //editor.execCommand(uiName);
                              editor.execCommand( 'undo' );
                              editor.execCommand( 'insertimage', {
                                src:data.Data.Url,
                                width:data.Data.Width > 640 ? 640 : data.Data.Width
                              });
                            }).error(function (data, status, headers, config) {

                            });
                            document.body.removeChild(imageFile);
                          },false);
                          return imageFile;
                        }
                      })();
                      document.body.appendChild(createImage());
                    }
                  });
                  //当点到编辑内容上时，按钮要做的状态反射
                  editor.addListener('selectionchange', function() {
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
                },-8);

                // -----------------------

                this.editor = new UE.ui.Editor(_UEConfig);
                this.editor.render(_editorId);
                return this.editor.ready(function() {
                  _self.editorReady = true;
                  _self.editor.addListener("contentChange", function() {
                    ctrl.$setViewValue(_self.editor.getContent());
                    /*if (!_updateByRender) {
                      if (!$S.$$phase) {
                        $S.$apply();
                      }
                    }*/
                    _updateByRender = false;
                  });
                  if (_self.modelContent && _self.modelContent.length > 0) {
                    _self.setEditorContent();
                  }
                  if (typeof $S.ready === "function") {
                    $S.ready(_self.editor);
                  }
                  $S.$on("$destroy", function() {
                    if (!attr.id && UE.delEditor) {
                      UE.delEditor(_editorId);
                    }
                  });
                });
              };

              _NGUeditor.prototype.setEditorContent = function(content) {
                if (content == null) {
                  content = this.modelContent;
                }
                if (this.editor && this.editorReady) {
                  this.editor.setContent(content);
                }
              };

              _NGUeditor.prototype.bindRender = function() {
                var _self;
                _self = this;
                ctrl.$render = function() {
                  _self.modelContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
                  _updateByRender = true;
                  _self.setEditorContent();
                };
              };

              return _NGUeditor;

            })();
            new _NGUeditor();
          }
        };
      }
    ]);
//  })();

//}).call(this);

//# sourceMappingURL=angular-ueditor.js.map
