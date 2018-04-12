import apiList from './apiList'
import ServiceAsync from './ServiceAsync'
import Config from './config'

const api = {}

// POST 提交自动不使用rap2
apiList.forEach(({apiSite, method = 'GET', Notdebugger = method !== 'GET'}) => {
    api[apiSite.slice((apiSite.lastIndexOf('/') + 1))] = (params) => ServiceAsync(method, apiSite, params, Notdebugger)
})

// apiList.forEach(({apiSite, method = 'GET', Notdebugger = false}) => {
//     api[apiSite.slice((apiSite.lastIndexOf('/') + 1))] = (params) => ServiceAsync(method, apiSite, params, Notdebugger)
// })

export {Config}
export default api