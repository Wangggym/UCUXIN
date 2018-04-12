/**
 * Created by QiHan Wang on 2017/9/12.
 * uploader
 */

import qiniuClient from './qiniu-client';

const uploader = (file, domain, options) => {
  qiniuClient({
    callback: ({uploadToken}) => {
      const data = new FormData();
      data.append('token', uploadToken.Token);
      data.append('file', file);

      const onprogress = (event) => {
        if (event.lengthComputable) {
          options.onProgress({percent: event.loaded / event.total * 100})
        }
      };
      const uploadFailed = (err) => options.onError(err);
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            const res = JSON.parse(xhr.responseText)
            options.onSuccess({...res, vid: uploadToken.VideoID, res: {status: xhr.status}})
          } else {
            console.warn('Request was unsuccessful: ' + xhr.status)
          }
        }
      };
      xhr.upload.addEventListener("progress", onprogress, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.open('post', 'http://upload.qiniu.com/', true);
      xhr.send(data);
    }
  });
};

export default uploader;
