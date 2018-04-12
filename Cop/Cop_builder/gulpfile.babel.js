import gulpLoadPlugins from 'gulp-load-plugins'; //自动加载插件 省去一个一个require进来
const $ = gulpLoadPlugins();
var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    minifyCss = require("gulp-minify-css"),
    useref = require('gulp-useref'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    minifyHtml = require("gulp-minify-html");
var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
};

var src = './src/app/**';
var bowerSrc = './src/bower_components/**'
var version = Math.round(new Date());

gulp.task('html', function() {
    return gulp.src([src + '/*.html', '!index.html']) // 要压缩的html文件
        .pipe(minifyHtml(options)) //压缩html
        .pipe(gulp.dest('dist/app'));
});
gulp.task('index', function() {
    return gulp.src([src + '/index.html']) // 要压缩的html文件
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cleanCss()))
        .pipe($.replace('.css"', '.css?v=' + version + '"'))
        .pipe($.replace('.js"', '.js?v=' + version + '"'))
        .pipe(useref())
        .pipe(minifyHtml(options)) //压缩html
        .pipe(gulp.dest('dist/app/public'));
});

gulp.task('css', function() {
    return gulp.src(src + '/*.css') // 要压缩的css文件
        .pipe(minifyCss()) //压缩css
        .pipe(gulp.dest('./dist/app'));
});
gulp.task('js', () => {
    return gulp.src(src + '/*.js')
        .pipe($.babel()) //靠这个插件编译
        .pipe(uglify())
        .pipe(gulp.dest('dist/app'));
});
gulp.task('images', () => {
    return gulp.src('src/app/public/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({ //使用cache只压缩改变的图片
            optimizationLevel: 3, //压缩级别
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/app/public/img/'));
});
gulp.task('clean', function() {
    return gulp.src([
        './dist', //删除dist整个文件夹
    ]).pipe($.clean());
});
gulp.task('copyFonts', function() {
    return gulp.src(['src/app/public/fonts/sourcesanspro/*.woff'])
        .pipe(gulp.dest('dist/app/public/fonts/sourcesanspro'));
});

gulp.task('lib-build', function() {
    return gulp.src(bowerSrc + "/*.*")
        .pipe(gulp.dest('dist/bower_components'))
})
gulp.task('default', ['clean'], function() {
    return gulp.start(['css', 'html', 'js', 'copyFonts', 'index', 'lib-build','images']);
});
