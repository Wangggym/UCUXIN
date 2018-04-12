/**
 * Created by QiHan Wang on 2017/11/9.
 * E-Mail: whenhan@foxmail.com
 * File Name: uploader
 */
import config from '../../../config';
import Token from '../../../basics/token';
export default function uploader({token, options, url, attachmentStr,cropRate} ={}, callback){

    token = token || Token.getUserToken();
    url = `${config.api + (url || 'ZX/v3/FileGW/UploadImage')}?token=${token}&attachmentStr=${attachmentStr}&cropRate=${cropRate}`;
    const file = options.file;
    const data = new FormData();
    data.append('token', token);
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
                const res = JSON.parse(xhr.responseText);
                // options.onSuccess({...res, res: {status: xhr.status}, url: res.Data.Url});
                callback && callback(res);
            } else {
                console.warn('Request was unsuccessful: ' + xhr.status);
            }
        }
    };
    //xhr.upload.addEventListener("progress", onprogress, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.open('post', url, true);
    xhr.send(data);
}
