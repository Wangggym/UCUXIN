import co from 'co';
import aliClient from './ali-client';

// - file: 上传文件数据
// - domain: 所属领域（教学、营养健康、心理健康）
// - options: antDesign Uploader控件配置
// - callback: 回调函数，此处
const uploader = (file, domain, options) => {
  aliClient({
    domain,
    attachType: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
    callback: ({objKey, client}) => {
      console.log(objKey)
      // 分片上传
      co(function* () {
        let result = yield client.multipartUpload(objKey, file, {
          progress: function* (p) {
            options.onProgress({percent: p * 100})
          }
        });
        // 重置显示url地址
        result.url = result.name;
        options.onSuccess(result)
      }).catch(function (err) {
        //console.log(err);
        options.onError(err)
      });

      // 断点上传
      /*co(function* () {
        let checkpoint;
        // retry 5 times

        for (let i = 0; i < 5; i++) {
          let result = yield client.multipartUpload(name, file, {
            checkpoint: checkpoint,
            progress: function* (percentage, cpt) {
              checkpoint = cpt;
              console.log(percentage, cpt)

              options.onProgress({percent: percentage*100})
            }
          });
          console.log(result);
          options.onSuccess(result.res)
          break; // break if success
        }
      }).catch ((err)=>{
        options.onError()
        console.log(err);
      })*/
    }
  });
}

export default uploader;
