/**
 * Created by QiHan Wang on 2017/8/12.
 */
import asyncComponent from '../AsyncComponent';
const FilesUpload = asyncComponent(() => import('../components/files-management/FilesUpload'));
const VideoUpload = asyncComponent(() => import('../components/files-management/VideoUpload'));

export default [
  {
    path: '/files-upload',
    component: FilesUpload,
  },
  {
    path: '/video-upload',
    component: VideoUpload,
  }
]
