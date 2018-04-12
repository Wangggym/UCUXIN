// return true => 学生端  || false => 老师端 
export default () => {
    return (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).MTypeID !== 11)
}