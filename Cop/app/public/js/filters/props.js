/**
 * Created by warden on 2016/2/23.
 */
'use strict';
angular.module('app')
    .filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = (typeof props[prop] === 'number')? props[prop] : props[prop].toLowerCase();

                    var target =(typeof item[prop] === 'number')? item[prop].toString() : item[prop].toString().toLowerCase();
                    if (target.indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
