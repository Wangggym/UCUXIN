app.controller('addCourseController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var hg = 1;
    var dfas;
    var addCourse = {
    /**
     * 入口
     */
    init : function () {
      addCourse.onEvent();
      addCourse.pageData();
      addCourse.getClassify();
      addCourse.getAllPriceType();
      addCourse.getAllPsyOrgListg();
      addCourse.getAllAttribute();
      addCourse.setQiniu();
      if($stateParams.id && $stateParams.id!=0){
        addCourse.getCourseDetail();
      }
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
      $scope.pageShow = false;
      $scope.id = $stateParams.id || 0;
      //课程名称
      $scope.Name = '';
      // 课程类型
      $scope.courseType = {
          allType:[
            {ID:1,Name:'视频课程'},
            {ID:2,Name:'直播课程'},
            {ID:3,Name:'线下课程'},
            {ID:4,Name:'系列课程'}
          ],
          choiceType:undefined
      };
      // 课程分类
      $scope.courseClassify = {
        allInfo:[],
        choiceType:[]
      };
      // 上传图片
      $scope.imgUrl = undefined;
      // 简介
      $scope.intro = undefined;
      // 讲师
      $scope.teacher={
        org:[],
        teacherList:[],
        choiceOrg:undefined,
        choiceTeacher:undefined
      };
      // 价格
      $scope.price = {
          choiceType:undefined,
          typeList:[]
      };
      // 学段
      $scope.allTerm = [
          {
              TagID:30010,
              Name:'幼儿园',
              state:false
          },
          {
              TagID:30020,
              Name:'小学',
              state:false
          },
          {
              TagID:30030,
              Name:'初中',
              state:false
          },
          {
              id:30040,
              Name:'高中',
              state:false
          },
          {
              id:30050,
              Name:'职校',
              state:false
          }
      ];
      // 详细介绍
      $scope.context = new Object();
      // 属性标签
      $scope.attribute = {
        choiceList:[],
        allList:[]
      };
      // 选择课程
      $scope.course = {
        choiceList:[],
        singleCourse:undefined,
        allList:[]
      };
      // 视屏
      $scope.video = {
          key:undefined,
          showTip:false,
          choiceType:1,
          link:undefined
      };

        dfas =  setInterval(function () {
            // addCourse.setQiniu();
            hg = hg+1;
          // addCourse.onQiniu();
      },1000);
    },
  /**
   * 绑定视屏上传
   */onQiniu:function () {
      // console.log($("#pickfiles"));
      //   // if($("#pickfiles").data("events")["click"] ){
      //   //
      //   // }
    },
    /**
     * 绑定页面相关的事件
     */
    onEvent : function () {
      // 上传图片
      $scope.fileChange = function (file) {
        addCourse.fileUp(file);
      };
      // 选择讲师机构
      $scope.choiceOrg = function () {
        addCourse.getAllTeacher();
      };
      // 选择学段
      $scope.choiceTerm = function (data) {
          if(data.state){
              data.state = false;
          }else {
              data.state = true;
          }
      };
      // 课程模糊查询
      $scope.refreshSchool = function (name) {
        if(name){
          addCourse.serchCourse(name);
        }
      };
      $scope.choiceCourse = function (name) {
        addCourse.serchCourse();
      };
      // 选择收费类型
      $scope.choicePriceInput = function ($event,item) {
        $event.stopPropagation();
        if(item.inputSate == true){
          item.inputSate = false;
          item.price = '';
        }else {
          item.inputSate = true;
        }
      };
      // 添加课程
      $scope.addListCourse = function (item) {
          if(!item || item == ''){
            toastr.error('请先查询课程！');
            return;
          }
        if($scope.course.choiceList.length>0){
          $.each($scope.course.choiceList,function (e,elet) {
            if(elet.ID == item.ID){
              $scope.course.choiceList.splice(e,1);
            }
          })
        }
        $scope.course.choiceList.push(item);
      };
      // 删除已选择的课程
        $scope.deletCourse = function (item) {
            $.each($scope.course.choiceList,function (e,elet) {
                if(elet.ID == item.ID){
                    $scope.course.choiceList.splice(e,1);
                }
            })
        };
      // 保存
      $scope.confirm = function () {
        addCourse.confirm();
      };
    },
  /**
   * 七牛视屏上传设置
   */
  setQiniu:function () {
      console.log(Qiniu.uploader);
      console.log(plupload);
      if(hg>20){
          clearInterval(dfas)
      }
      var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4',      // 上传模式，依次退化
          browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
          // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
          // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
          // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
          uptoken : sessionStorage.getItem('videoToken'), // uptoken是上传凭证，由其他程序生成
          get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
          // downtoken_url: '/downtoken',
          // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
          // unique_names: true,               // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
          save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
          domain: 'http://qiniu-plupload.qiniudn.com/',     // bucket域名，下载资源时用到，必需
          container: 'containerVideo',             // 上传区域DOM ID，默认是browser_button的父元素
          max_file_size: '100mb',             // 最大文件体积限制
          // flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
          max_retries: 0,                     // 上传失败最大重试次数
          dragdrop: true,                     // 开启可拖曳上传
          drop_element: 'containerVideo',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '5mb',                  // 分块上传时，每块的体积
          auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
          init: {
              'FilesAdded': function(up, files) {
                  $(".uploadBtn").attr({"disabled":true})
                  $(".qiniu-result").hide();
                  $(".progress").show();
                  $(".progress-bar").width("0%");
                  $(".progress-bar b").text("0%");
                  console.log(1)

                  plupload.each(files, function(file) {
                      // 文件添加进队列后，处理相关的事情
                  });
              },
              'BeforeUpload': function(up, file) {
                  // 每个文件上传前，处理相关的事情
                  console.log(2)

              },
              'UploadProgress': function(up, file) {
                  // 每个文件上传时，处理相关的事情
                  // console.log($scope.dynamic);
                  $(".progress-bar").width(file.percent+"%");
                  $(".progress-bar b").text(file.percent+"%");
                  console.log(3)

              },
              'FileUploaded': function(up, file, info) {
                  // console.log(up,file,info)
                  $scope.submitBtn = false;

                  var data =  JSON.parse(info);
                  $scope.video.key = data.key;
                  $(".qiniu-result").text("视频上传成功！");
                  $(".qiniu-result").show();
                  toastr.success("上传成功！");
                  $scope.video.showTip=false;
                  // 每个文件上传成功后，处理相关的事情
                  // 其中info是文件上传成功后，服务端返回的json，形式如：
                  // {
                  //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                  //    "key": "gogopher.jpg"
                  //  }
                  // 查看简单反馈
                  // var domain = up.getOption('domain');
                  // var res = parseJSON(info);
                  // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url
                  console.log(4)

              },
              'Error': function(up, err, errTip) {
                  console.log(5)

                  $(".qiniu-result").show();
                  // if(errTip == "Duplicate file error.undefined"){
                  //     $(".qiniu-result").text("该文件已上传过！若想再次上传，请刷新页面重试");
                  //     return;
                  // }
                  $(".qiniu-result").text(errTip);
                  //上传出错时，处理相关的事情
              },
              'UploadComplete': function() {
                  $(".uploadBtn").attr({"disabled":false})
                  console.log(6)
                  //队列文件处理完毕后，处理相关的事情
              },
              'Key': function(up, file) {
                  // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                  // 该配置必须要在unique_names: false，save_key: false时才生效
                  var key = "";
                  // do something with key here
                  return key
              }
          },
          filters : {

              max_file_size : '1000mb',

              prevent_duplicates: true,

              mime_types: [
                  // {title : "flv files", extensions : "flv"}, //限定flv后缀上传格式上传

                  {title : "Video files", extensions : "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"}, //限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传

                  {title : "Image files", extensions : "jpg,gif,png"}, //限定jpg,gif,png后缀上传
                  //
                  // {title : "Zip files", extensions : "zip"} //限定zip后缀上传

              ]

          }
      });
// domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
// uploader为一个plupload对象，继承了所有plupload的方法
// domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
// uploader为一个plupload对象，继承了所有plupload的方法
  },
    /**
     * 上传图片
     */
    fileUp:function(file){
      if (file) {
        applicationServiceSet.mentalHealthService._CourseClassify._ImageRegistrationUpload.fileUpload(file).then(function (data) {
          if(data.Ret == 0){
            $scope.imgUrl= data.Data.Url;
          }
        });
      }
    },
    /**
     * 获取机构
     */
    getAllPsyOrgListg:function(){
      applicationServiceSet.mentalHealthService._CourseClassify._GetAllPsyOrgList.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.teacher.org = data.Data;
          // $scope.courseClassify.allInfo = data.Data;
        }
      });
    },
    /**
     *获取所有心理属性
     */
    getAllAttribute : function(){
      applicationServiceSet.mentalHealthService._PsychologicalAttribute._GetPsyAttrList.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.attribute.allList = data.Data;
          $.each($scope.attribute.allList,function (e,item) {
              item.TagID = item.ID;
              item.Type = 2;
          });
        }
      });
    },
    /**
     * 获取所有讲师
     */
    getAllTeacher:function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetExpertList.send([sessionStorage.getItem('copPage_token'),$scope.teacher.choiceOrg.ID]).then(function (data) {
        if (data.Ret == 0) {
          $scope.teacher.teacherList = data.Data;
        }
      });
    },
    /**
     * 获取价格类型
     */
    getAllPriceType:function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetAllPriceType.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.price.typeList = data.Data;
          $.each($scope.price.typeList,function (e,item) {
            item.inputSate = false;
            item.PriceTypeID = item.ID;
            item.PriceTypeName = item.Name;
            item.Price = undefined;
          });
        }
      });
    },
    /**
     * 获取所有分类
     */
    getClassify : function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetAllClassify.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.courseClassify.allInfo = data.Data;
          $.each($scope.courseClassify.allInfo,function (e,item) {
              item.TagID = item.ID;
              item.Type = 1;
          })
        }
      });
    },
    /**
     * 课程模糊查询
     */
    serchCourse:function(name){
      applicationServiceSet.mentalHealthService._CourseClassify._GetCourseList.send([sessionStorage.getItem('copPage_token'),name]).then(function (data) {
        if (data.Ret == 0) {
          $scope.course.allList = data.Data;
        }
      });
    },
    /**
     * 获取单个课程信息
     */
    getCourseDetail:function(){
      applicationServiceSet.mentalHealthService._CourseClassify._GetCourse.send([sessionStorage.getItem('copPage_token'),$scope.id]).then(function (data) {
        if (data.Ret == 0) {
           var choiceOrg;
          $scope.Name = data.Data.Name;
          $scope.courseType.choiceType = {
            ID:data.Data.CourseType,
            Name:data.Data.CourseTypeName
          };
          $scope.courseClassify.choiceType = data.Data.Classifys;
          $scope.imgUrl = data.Data.Pic;
          $scope.intro = data.Data.Desc;
          $scope.video.choiceType =  data.Data.VideoType;
          $scope.video.link =  data.Data.Path;
          $scope.video.key =  data.Data.FileKey;
          if($scope.video.key && $scope.video.key!=''){
              $scope.video.showTip = true;
          }
          choiceOrg = {
              ID:data.Data.PsyOrgID,
              Name:data.Data.PsyOrgName
          };
          $scope.teacher.choiceOrg = choiceOrg;
          addCourse.getAllTeacher();
          $scope.teacher.choiceTeacher = {
              ID:data.Data.ExpertID,
              Name:data.Data.ExpertName
          };
          if(data.Data.IsPrice){
              $scope.price.choiceType = true;
              $.each($scope.price.typeList,function (e,item) {
                $.each(data.Data.Prices,function (e,elet) {
                    if(item.PriceTypeID == elet.PriceTypeID){
                        item.Price = elet.Price;
                        item.inputSate = true;
                    }
                });
              });
          } else {
              $scope.price.choiceType = false;
          }
          $.each($scope.allTerm,function (e,item) {
              $.each(data.Data.Phase,function (e,elet) {
                  if(item.TagID == elet.TagID){
                      item.state = true;
                  }
              });
          });
          $scope.context.receiveUeditText(data.Data.Cont);
          $scope.attribute.choiceList=data.Data.PsyAttrs;
          $scope.course.choiceList =  data.Data.SubCourse;
        }
      });
    },
    /**
     * 验证数据完整性
     */
    confirm:function () {
        var text = $scope.context.returnUeditText();
        var priceType = Number($scope.price.choiceType);
        var tip = true,tip2=undefined,tip3 = false,term=[];
        $.each($scope.allTerm,function (e,item) {
            if(item.state){
                item.Type = 3;
                term.push(item);
            }
        });
        if(!$scope.Name || $scope.Name==''){
          toastr.error('请填写课程名称！');
          return;
        }
        if(!$scope.courseType.choiceType){
          toastr.error('请选择课程类型!');
          return;
        }
        if($scope.courseClassify.choiceType.length == 0){
          toastr.error('请选择课程分类！');
          return;
        }
        if(!$scope.imgUrl || $scope.imgUrl == ''){
          toastr.error('请上传图片！');
          return;
        }
        if(!$scope.intro || $scope.intro == ''){
          toastr.error('请填写简介！');
          return;
        }
        if(!$scope.teacher.choiceTeacher || $scope.teacher.choiceTeacher == ''){
          toastr.error('请选择讲师！');
          return;
        }
        if(priceType !==0 && priceType !==1){
          toastr.error('请选择价格！');
          return;
        }
        if(priceType == 1){
          $.each($scope.price.typeList,function (e,item) {
            if(item.inputSate==true){
              tip = false;
            }
          })
        }
        if(priceType == 0){
            tip = false;
        }
        if(tip){
          toastr.error('至少输入一个价格！');
          return;
        }
        if(priceType == 1){
          $.each($scope.price.typeList,function (e,item) {
            if(item.inputSate==true){
              if(!item.Price||item.Price ==''){
                tip2 = '请填写正确的价格！';
                return;
              }else if(parseFloat(item.Price)<=0){
                tip2 = '请填写大于0的价格！';
                return;
              }
            }
          })
        }
        if(tip2){
          toastr.error(tip2);
          return;
        }
        if(!term || term.length == 0){
          toastr.error('请选择适合学段！');
          return;
        }
        if(!text || text == ''){
          toastr.error('请填写详细介绍！');
          return;
        }
        // if($scope.attribute.choiceList.length==0){
        //   toastr.error('请选择属性标签！');
        //   return;
        // }
        if($scope.courseType.choiceType.ID == 4 && $scope.course.choiceList.length === 0){
            toastr.error('请添加课程！');
            return;
        }
        if($scope.courseType.choiceType.ID == 1){
            if($scope.video.choiceType == 1){
                if(!$scope.video.key || $scope.video.key == ''){
                    toastr.error('请上传视频！');
                    tip3 = true;
                    return;
                }
            }else {
                if(!$scope.video.link || $scope.video.link == ''){
                    toastr.error('请填写视屏链接！');
                    tip3 = true;
                    return;
                }
            }
        }
        if(tip3){
            return;
        }
      addCourse.add(term);
    },
    /**
     *保存
     */
    add:function (term) {
      var text = $scope.context.returnUeditText();
      var priceData = [];
      $.each($scope.price.typeList,function (e,item) {
        if(item.inputSate == true){
          priceData.push(item);
        }
      });
      applicationServiceSet.mentalHealthService._CourseClassify._AddOrUpCourse.send([$scope.id,$scope.Name,$scope.courseType.choiceType.ID,$scope.courseType.choiceType.Name,
        $scope.imgUrl,$scope.intro,text,$scope.teacher.choiceOrg.ID,$scope.teacher.choiceOrg.Name,$scope.teacher.choiceTeacher.ID,
        $scope.teacher.choiceTeacher.Name,0,$scope.price.choiceType,$scope.courseClassify.choiceType,
        $scope.attribute.choiceList,term,priceData,$scope.course.choiceList,$scope.video.choiceType,$scope.video.key,$scope.video.link],[sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          if($scope.id==0){
              toastr.success('新增成功！');
          }else {
              toastr.success('修改成功！');
          }
          $location.path('access/app/internal/courseManagement/courseMaintain');
        }
      });
    }
  };
  addCourse.init();
}]);
