import axios from 'axios'
import { ElMessage } from 'element-plus'
import { toLower, trim } from 'lodash'

const service = axios.create({
  baseURL: '/api',
  timeout: 800000,
  withCredentials: false // 异步请求携带cookie
})

// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        if (config.method) {
            config.method = toLower(trim(config.method))
        }
        if (config.interceptor?.requestInterceptor) {
            // 调用接口传递过来的拦截器函数，接收最新的config
            config = config.interceptor.requestInterceptor(config)
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    ({ data, config, headers }) => {
        // 文件类型
        if (config.responseType === 'blob') {
            return { data, headers }
        }
        // 请求拦截
        if (data.code && data.code * 1 !== 200 && data.code * 1 !== 0 && data.code * 1 !== 20001) {
            ElMessage({
                message: data.message || 'Error',
                grouping: true,
                type: 'error',
                duration: 5 * 1000
            })
        }
        return data
    },
    error => {
        ElMessage({
            message: error.message || 'Error',
            grouping: true,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
