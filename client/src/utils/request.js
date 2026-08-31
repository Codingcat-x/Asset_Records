import axios from 'axios'

// 二次封装的 axios 实例
// baseURL 统一为 /api，配合 vue.config.js 中的 devServer.proxy 转发到后端 3000 端口
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器：可在发送前统一处理（如携带 token、打印日志等）
request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// 响应拦截器：统一取出业务数据，并归一化错误
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 优先取后端返回的错误信息，其次取网络错误信息
    const message = (error.response && error.response.data && error.response.data.error) ||
      error.message ||
      'Request failed'
    error.message = message
    return Promise.reject(error)
  }
)

// 封装 GET 请求：get(url) -> GET {baseURL}{url}
export function get (url) {
  return request.get(url)
}

// 封装 PUT 请求：put(url, data) -> PUT {baseURL}{url}
export function put (url, data) {
  return request.put(url, data)
}

// 封装 DELETE 请求：del(url) -> DELETE {baseURL}{url}
export function del (url) {
  return request.delete(url)
}

export default request
