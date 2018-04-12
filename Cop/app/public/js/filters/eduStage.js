/**
 * Created by Wang QiHan on 2016/11/16.
 * 学段筛选
 */
'use strict';
    app.filter('eduStageFilter', function() {
        return function(value) {
            var arr = [];
            var period = [
               {name:'学前', value: 2},
               {name:'小学', value: 4},
               {name:'初中', value: 8},
               {name:'高中', value: 16},
               {name:'职校', value: 32},
               {name:'大学', value: 64},
               {name:'全学段', value: 1024}
            ];
           period.forEach(function (item, index, array) {
               if(value & item.value){
                   arr.push(item.name);
               }
           });

           return arr.join(',') || '全学段';
        }
    });