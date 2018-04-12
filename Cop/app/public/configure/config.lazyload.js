// lazyload config

angular.module('app')
/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
    .constant('JQ_CONFIG', {
            screenfull: ['../bower_components/screenfull/dist/screenfull.min.js'],
            slimScroll: ['../bower_components/slimscroll/jquery.slimscroll.min.js'],
            chosen: ['../bower_components/chosen/chosen.jquery.js',
                '../bower_components/chosen/chosen.css']
        }
    )
    // oclazyload config
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [
                {
                    name: 'ngGrid',
                    files: [
                        '../bower_components/ng-grid/build/ng-grid.min.js',
                        '../bower_components/ng-grid/ng-grid.min.css',
                        '../bower_components/ng-grid/ng-grid.bootstrap.css'
                    ]
                },
                {
                    name: 'ui.grid',
                    files: [
                        '../bower_components/angular-ui-grid/ui-grid.min.js',
                        '../bower_components/angular-ui-grid/ui-grid.min.css',
                        '../bower_components/angular-ui-grid/ui-grid.bootstrap.css'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        '../bower_components/angular-ui-select/dist/select.min.js',
                        '../bower_components/angular-ui-select/dist/select.min.css'
                    ]
                },
                {
                    name: 'ui.sortable',
                    files: [
                        '../bower_components/jquery-ui/jquery-ui.js',
                        '../bower_components/jquery-ui/themes/base/sortable.css',
                        '../bower_components/angular-ui-sortable/sortable.js'
                    ]
                },
                {
                    name: 'uiSwitch',
                    files: [
                        '../bower_components/angular-ui-switch/angular-ui-switch.min.css',
                        '../bower_components/angular-ui-switch/angular-ui-switch.min.js'
                    ]
                },
                {
                    name: 'xeditable',
                    files: [
                        '../bower_components/angular-xeditable/dist/css/xeditable.min.css',
                        '../bower_components/angular-xeditable/dist/js/xeditable.min.js'
                    ]
                },
                {
                    name: 'ngFileUpload',
                    files: [
                        '../bower_components/ng-file-upload/ng-file-upload-shim.min.js',
                        '../bower_components/ng-file-upload/ng-file-upload.min.js'
                    ]
                },
                {
                    name: 'ngImgCrop',
                    files: [
                        '../bower_components/ng-img-crop/ng-img-crop.css',
                        '../bower_components/ng-img-crop/dist/ng-img-crop.js'
                    ]
                },
                {
                    name: 'colorpicker.module',
                    files: [
                        '../bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css',
                        '../bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js'
                    ]
                },
                {
                    name: 'angularFileUpload',
                    files: [
                        '../bower_components/angular-file-upload/angular-file-upload.min.js'
                    ]
                },
                {
                    name: 'ui.calendar',
                    files: ['../bower_components/angular-ui-calendar/src/calendar.js']
                },
                {
                    name: 'ngImgCrop',
                    files: [
                        '../bower_components/ngImgCrop/compile/minified/ng-img-crop.js',
                        '../bower_components/ngImgCrop/compile/minified/ng-img-crop.css'
                    ]
                },
                {
                    name: 'angularBootstrapNavTree',
                    files: [
                        '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                        '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css'
                    ]
                },
                {
                    name: 'textAngular',
                    files: [
                        '../bower_components/textAngular/dist/textAngular-sanitize.min.js',
                        '../bower_components/textAngular/dist/textAngular.min.js'
                    ]
                },
                {
                    name: 'vr.directives.slider',
                    files: [
                        '../bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                        '../bower_components/venturocket-angular-slider/build/angular-slider.css'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular',
                    files: [
                        '../bower_components/videogular/videogular.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.controls',
                    files: [
                        '../bower_components/videogular-controls/controls.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.buffering',
                    files: [
                        '../bower_components/videogular-buffering/buffering.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.overlayplay',
                    files: [
                        '../bower_components/videogular-overlay-play/overlay-play.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.poster',
                    files: [
                        '../bower_components/videogular-poster/poster.min.js'
                    ]
                },
                {
                    name: 'com.2fdevs.videogular.plugins.imaads',
                    files: [
                        '../bower_components/videogular-ima-ads/ima-ads.min.js'
                    ]
                },
                {
                    name: 'smart-table',
                    files: [
                        '../bower_components/angular-smart-table/dist/smart-table.min.js'
                    ]
                },
                {
                    name: 'ng.ueditor',
                    files: [
                        '../bower_components/ueditor/ueditor.config.js',
                        '../bower_components/ueditor/custom.ueditor.js',
                        '../bower_components/ueditor/ueditor.all.min.js',
                        '../bower_components/angular-ueditor/dist/angular-ueditor.min.js'
                    ]
                }
            ]
        });
    }]);
