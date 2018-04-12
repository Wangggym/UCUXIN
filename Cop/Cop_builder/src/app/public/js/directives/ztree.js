angular.module('app').directive('checktree', ['$http',function ($http) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            var setting = {
                check: {
                    enable: true
                    //chkboxType: {
                    //    "Y": "",
                    //    "N": ""
                    //}
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function (event, treeId, treeNode, clickFlag) {
                        var zTree = $.fn.zTree.getZTreeObj("ztree"),
                            nodes = zTree.getCheckedNodes(true),
                            str = "";
                        for (var i = 0;i < nodes.length;i++) {
                            str += nodes[i].id+',';
                        }
                        if(str){
                            str = str.substr(0,str.length-1);
                        }
                        $('#menuId').val(str);
                    }
                }
            };

            $http.get("")
                .then(function( res ) {
                    if( res.data.resultCode == 0 ){
                        var zNodes = [];
                        angular.forEach(res.data.resultData, function(value, key){
                            var temp = {};
                            temp.id = value.id_ysy_menu;
                            temp.pId = value.parent_id;
                            temp.name = value.menu_name;
                            temp.open = true;
                            zNodes.push(temp);
                        });
                        $.fn.zTree.init(element, setting, zNodes);
                    }
                }, function( res ) {
                    console.log( res.data.resultMsg );
                });
        }
    };
}]);