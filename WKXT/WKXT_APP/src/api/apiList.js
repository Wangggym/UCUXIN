//参数 apiSite接口信息  Notdebugger:false 使用Rap2网站接口数据
//post 请求方式自动为 非Rap2

//公共部分api
import commonApi from './commonApi'

//lvcan
import lvchan from './lvchanApi'

//wangyimin
import wangyimin from './wangyiminApi'

//lixuefeng
import lixuefeng from './lixuefengApi'


export default [...commonApi, ...lvchan, ...wangyimin, ...lixuefeng]
