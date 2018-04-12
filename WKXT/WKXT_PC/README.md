# 微课学堂

* 项目名称： 微课学堂PC端
* 交接人：   王毅敏
* 交接时间： 2018-4-11
---

## 总体概要

* 依赖：ant-pro
* 代码管理：[Git地址：http://10.10.10.21:8080/tfs/DC/RDUX/_git/WebWKXT](http://10.10.10.21:8080/tfs/DC/RDUX/_git/WebWKXT)

**项目目录结构**

```
WKXT_PC/
├── src/                                 # 项目资源
│   ├── assets/                          # 静态公共资源
│   ├── common                           
│   │   ├── menu.js                      # 侧边栏菜单
│   │   └── router.js                    # 配置路由
│   ├── components/                      # 公共组件
│   ├── models                         
│   │   ├── common.js                   
│   │   ├── courseDetail.js             
│   │   ├── courseList.js                
│   │   ├── resSetting.js                    
│   │   ├── supplyDetail.js                    
│   │   ├── supplyList.js                 
│   │   ├── textVersionManagement.js                    
│   │   ├── global.js                    
│   │   ├── watchList.js                    
│   │   └── form.js                     
│   ├── routes                         
│   │   ├── dataStc/                     # 数据统计
│   │   ├── management/                  # 资源管理
│   │   └── setting/                     # 系统设置
│   ├── services/                         
│   ├── utils      
│   │   ├── request.js                   # 配置得请求方法（链条及配置方法）
│   ├── router.js                        # 配置得token请求得地方
├── package.json
└── README.md

```
**打包说明**
- 修改utils文件目录下request.js文件中Config直接修改development_api

**项目完成情况**
- 资源管理（完成）
- 系统设置（完成）
- 数据统计（路由建立）



