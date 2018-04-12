// 304 => 05:03
function formatTime(second) {
    const formatMinute = (second - second % 60) / 60
    const formatSecond = second - formatMinute * 60
    return `${formatNumber(formatMinute)}:${formatNumber(formatSecond)}`
}

function formatNumber(num) {
    if ( num < 10) {
        return "0" + num;
    }
    return num
}

export default formatTime


