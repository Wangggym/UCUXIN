/**
 * Created by EVEN on 2016/10/24.
 */
app.directive('uUeditor',['$http', '$timeout',function ($http,$timeout) {
   return{
     restrict: 'EA',
     replace: true,
     require:'?ngModel',
     scope: {
       ngModel: '=',
       isShow : '@',
       ucuConfig: '='
     },
     template:'<script id="container" name="content" type="text/plain"></script>',
     link: function (scope,elem, attrs, ctrl) {
       if (!ctrl) return;
       var config = scope.ucuConfig;

       var ue, editorReady = false,modelContent;

       var setContent = function (content) {
         if(ue && editorReady){
           ue.setContent(content);
         }
       };

       var initEditor = function () {
         // 功能性扩展
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
                       url: config.ucu.url, //urlConfig + 'base/v3/OpenApp/UploadAttachment',
                       params: config.ucu.params, //{'token': APPMODEL.Storage.applicationToken, 'attachmentStr' :{"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}},
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
         ue = UE.getEditor('container',config.ue);
         ue.ready(function() {
           editorReady = true;
           // 监听编辑器内容并绑定到ngModel
           ue.addListener('contentChange', function () {
             scope.$apply(function () {
               ctrl.$setViewValue(ue.getContent());
             });
           });

           /*
            scope.$watch('isShow', function (nv, ov) {
            if(nv === ov) return;
            nv === 'true' ?ue.setShow() : ue.setHide();
            });*/
         });
       };


       ctrl.$render = function () {
         _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
         console.log(_initContent);
         editorReady = true;
         setContent(_initContent);
       };

       initEditor();
     }
   }
}]);
