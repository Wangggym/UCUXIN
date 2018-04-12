import OSSClient from './oss-client';

// - file: 上传文件数据
// - domain: 所属领域（教学、营养健康、心理健康）
// - options: antDesign Uploader控件配置
// - callback: 回调函数，此处
const download = (fileUrl, fileName) => {
  OSSClient({
    callback: ({client}) => {
      let url = client.signatureUrl(fileUrl, {
        expires: 3600,
        response: {'content-disposition': `attachment; filename="${fileName + fileUrl.slice(fileUrl.lastIndexOf('.'))}"`}
      });
      window.location = url;

    }
  });
}

export default download;
