//转换时分秒
function changeTime(second) {

  let commomTime;
  if (second < 60) {
    commomTime = `${second}秒`;
  } else if (second > 60 && second < 3600) {
    commomTime = parseInt(second / 60) + '分' + second % 60 + '秒'
  } else if (second >= 3600) {
    commomTime = parseInt(second / 3600) + '时' + parseInt((second % 3600 / 60)) + '分'
  }
  return commomTime
}

export default changeTime;