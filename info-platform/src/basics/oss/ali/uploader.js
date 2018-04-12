import co from 'co';
import aliClient from './ali-client';
import SparkMD5 from 'spark-md5';

// - file: 上传文件数据
// - domain: 所属领域（教学、营养健康、心理健康）
// - options: antDesign Uploader控件配置
// - callback: 回调函数，此处
const uploader = (file, domain, options) => {
  aliClient({
    domain,
    attachType: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
    callback: ({objKey, client,rootUrl}) => {
      // 分片上传
      co(function* () {
        let result = yield client.multipartUpload(objKey, file, {
          progress: function* (p) {
            options.onProgress({percent: p * 100})
          }
        });
        // 重置显示url地址
        result.url = `${rootUrl}/${result.name}`;
        options.onSuccess(result)
      }).catch(function (err) {
        //console.log(err);
        options.onError(err)
      });
    }
  });
};

export default uploader;
