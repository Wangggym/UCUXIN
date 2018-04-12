#src目录结构
api/ serve请求配置文档+相关api+ucuxToken获取
components/  所有公共组件
pages/ 页面
----/404 404
----/catalog 课程目录 --10   
----/collectList 收藏列表 --14  
----/courseList  课程列表 --9       
----/learnRecord 学习记录 --13  
----/searchList 搜索列表 --12    
----/learnCourse 学习课程 --11  （有点问题） 
----/thisWeekRank 本周排名
----/conLearnList 班主任_连续学习详情 --35  
----/home 首页选择用户 --2  （用户选择逻辑处理）            
----/introduce 微客介绍 --5  （主要是这个页面）
----/studentReport 微课观看与评价 --34  （分享功能）
----/subjectLearnDetail 微课观看率（表扬接口未调取） 
----/learningReport 学习报告 --16   
----/pointsItem 积分明细 --18       
----/pointsRank 积分排名 --17
----/pointsRuler 积分规则 --19  
----/studyDetails 学习详情 --32        
----/buyResult 购买 --22   
----/timeFrame 时段详情--33  
----/classReport 班级报告--31 
public/ 公共资源部分
---/assets 图片资源
global.css 全局基础样式

#打包
npm run build
打包后的目录为：dist/

--打包需要更改 src/api/config.js =>  
test_debugger => false
config 对象的{debugger: false}
切换shareUrl 切换shareIocn

#本地运行
npm start

#项目地址
http://10.10.10.21:8080/tfs/DC/RDUX/_git/WebWKXT

#主要项目依赖
umi



