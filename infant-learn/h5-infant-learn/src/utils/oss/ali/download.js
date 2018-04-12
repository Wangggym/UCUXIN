import aliClient from './ali-client';

// - fileUrl: 文件下载地址
// - fileName: 文件名称
const download = (fileUrl, fileName) => {
  aliClient({
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
