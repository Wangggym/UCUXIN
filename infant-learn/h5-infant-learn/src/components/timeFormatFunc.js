import moment from 'moment'
const showTime = (time, format = 'YYYY-MM-DD HH:mm:ss', showTimeFormat = 'MM-DD HH:mm') => moment(time, format).format(showTimeFormat)
export default showTime

