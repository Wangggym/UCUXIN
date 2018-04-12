/**
 * Created by QiHan Wang on 2017/9/22.
 * uploader
 */

import Config from '../../../config';
const uploader = (options, search) => {
  const data = new FormData();
  data.append('filename', options.file);
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
        const res = JSON.parse(xhr.responseText);
        options.onSuccess({...res, res: {status: xhr.status}})
      } else {
        console.warn('Request was unsuccessful: ' + xhr.status)
      }
    }
  };

  xhr.upload.addEventListener("progress", onprogress, false);
  xhr.addEventListener("error", uploadFailed, false);
  xhr.open('post', `${Config.api}base/v3/OpenAppExt/UploadAttachment${search}`, true);
  xhr.send(data);

};

export default uploader;
