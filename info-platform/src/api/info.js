/**
 * Created by Yu Tian Xiong on 2017/12/14.
 */
import InfoFetch from './fetch';

export default {
    //-------资讯列表--------
    //获取用户基本信息   首次进入机构页
    getUserInfo: data => InfoFetch('GET', 'ZX/v3/AuthGW/GetCurrUserInfo', data),
    //获取组织机构
    getUserPubFrmGroups: data => InfoFetch('GET', 'ZX/v3/AuthGW/GetCurrUserGroupList', data),
    //获取首页tab菜单列表
    getCurrMbrInfo: data => InfoFetch('GET', 'ZX/v3/AuthGW/GetCurrUserMenuList', data),
    //获取资讯列表
    getList: data => InfoFetch('POST', 'ZX/v3/NewsGW/GetList', data),
    //获取频道
    getChannelList: data => InfoFetch('GET', 'ZX/v3/BaseDataGW/GetChannelList', data),
    //获取资讯详情
    getInfoDetail: data=> InfoFetch('GET', 'ZX/v3/NewsGW/Get', data),
    //关闭资讯
    handleCloseInfo: data=> InfoFetch('POST', 'ZX/v3/NewsGW/Close', data),
    //开启资讯
    handleStartInfo: data=> InfoFetch('POST', 'ZX/v3/NewsGW/RePublish', data),
    //立即发布资讯
    nowPublishInfo: data=> InfoFetch('POST', 'ZX/v3/NewsGW/PublishNow', data),
    //删除资讯
    deleteInfo:data=> InfoFetch('POST', 'ZX/v3/NewsGW/Delete', data),

    //-------编辑文章--------
    //保存文章资讯
    saveInfo:data=> InfoFetch('POST', 'ZX/v3/ArticleGW/Save', data),
    //发布文章资讯
    publishInfo:data=> InfoFetch('POST', 'ZX/v3/ArticleGW/Publish', data),
    //获取标签
    getTags:data=> InfoFetch('GET', 'ZX/v3/BaseDataGW/GetHotTags', data),

    //-------编辑话题--------
    //保存话题资讯
    saveTopic:data=> InfoFetch('POST', 'ZX/v3/TopicGW/Save', data),
    //发布话题资讯
    publishTopic:data=> InfoFetch('POST', 'ZX/v3/TopicGW/Publish', data),
    //获取话题详情
    getTopicDetail:data=> InfoFetch('GET', 'ZX/v3/TopicGW/Get', data),

    //-------编辑图集--------
    //保存图集
    saveAltas:data=> InfoFetch('POST', 'ZX/v3/PicturesGW/Save', data),
    //发布图集
    publishAltas:data=> InfoFetch('POST', 'ZX/v3/PicturesGW/Publish', data),
    //获取图集详情
    getAltasDetail:data=> InfoFetch('GET', 'ZX/v3/PicturesGW/Get', data),

    //-------编辑宣传--------
    //保存宣传
    savePropaganda:data=> InfoFetch('POST', 'ZX/v3/PublicityGW/Save', data),
    //发布宣传
    publishPropaganda:data=> InfoFetch('POST', 'ZX/v3/PublicityGW/Publish', data),
    //获取宣传详情
    getPropagandaDetail:data=> InfoFetch('GET', 'ZX/v3/PublicityGW/Get', data),

    //-------公共--------
    //获取用户端H5页面配置信息
    getUrl:data=> InfoFetch('GET', 'ZX/v3/BaseDataGW/GetH5PageConfig', data),
    //上传文件
    FileUpload:data => InfoFetch('POST', 'ZX/v3/FileGW/Upload', data),
    //获取文件列表
    getFileList:data => InfoFetch('POST', 'ZX/v3/FileGW/GetList', data),
}