/**
 * Created by QiHan Wang on 2017/9/12.
 * uploader
 */

import qiniuClient from './qiniu-client';
//import ServiceAsync from '../../../api/service';

const uploader = (file, domain, options) => {
  qiniuClient({
    callback: ({uploadToken}) => {
      const data = new FormData();
      data.append('token', uploadToken.Token);
      data.append('file', file);
      //ServiceAsync('POST', {domain: 'http://upload-z0.qiniu.com/'},{body: data})
      /*fetch('http://upload-z0.qiniu.com/', {method: 'POST', body: data,})
        .then(res => consume(res.body))
        .then(() => console.log("consumed the entire body without keeping the whole thing in memory!"))
        .catch((e) => console.error("something went wrong", e))
        /!*.then(response => {console.log(response.json())})
        .catch((ex) => console.log('parsing failed', ex))*!/*/


      const onprogress = (event) => {
        if (event.lengthComputable) {
          options.onProgress({percent: event.loaded / event.total * 100})
          //console.log("Received " + event.loaded + " of " + event.total + " bytes")
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


  /* const data = new FormData()
   data.append('file', input.files[0])
   data.append('user', 'hubot')

   fetch('http://upload.qiniu.com/', {
     method: 'POST',
     body: data
   })*/
};

export default uploader;
