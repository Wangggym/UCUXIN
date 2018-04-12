/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React, {Component} from 'react';

import UEditor from '../../../common/components/Ueditor';

const config = {
  toolbars: [[
    //'fullscreen','source', '|',
    'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
    //'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
    //'customstyle', 'paragraph',
    'fontfamily', 'fontsize', '|',
    //'directionalityltr', 'directionalityrtl', 'indent', '|',
    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
    //'touppercase', 'tolowercase', '|',
    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
    'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment',
    //'map', 'gmap', 'insertframe', 'insertcode','webapp',
    //'pagebreak', 'template', 'background', '|',
    'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
    //'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
    //'print', 'preview', 'searchreplace', 'drafts', 'help'
  ]]
  //是否启用元素路径，默认是显示
  ,elementPathEnabled: false
  //wordCount
  ,wordCount:false          //是否开启字数统计
  //,maximumWords:10000       //允许的最大字符数
  //字数统计提示，{#count}代表当前字数，{#leave}代表还可以输入多少字符数,留空支持多语言自动切换，否则按此配置显示
  //,wordCountMsg:''   //当前已输入 {#count} 个字符，您还可以输入{#leave} 个字符
  //超出字数限制提示  留空支持多语言自动切换，否则按此配置显示
  //,wordOverFlowMsg:''    //<span style="color:red;">你输入的字符个数已经超出最大允许值，服务器可能会拒绝保存！</span>
  ,autoHeightEnabled: true
  ,autoFloatEnabled: true

}
class AddQuestion extends Component{

  handleChange = (content)=>{
    console.log(content)
  }

  render(){
    return(
      <div>
        <UEditor id="1" onChange={this.handleChange} value="366" config={config}/>
        <UEditor id="2" config={config}/>
        <UEditor id="4" value="这是第4个"/>
      </div>
    )
  }
}

export default AddQuestion;
