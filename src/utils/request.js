// 1.创建一个新的axios实例
// 2.请求拦截器，如果有token进行头部携带
// 3.响应拦截器：1、剥离无效数据 2、处理token失效
// 4.导出一个函数，调用当前的axios实例发请求，返回promise对象

import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
// 导出基准地址，方便不通过axios发起的请求
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截
instance.interceptors.request.use((config) => {
  // 拦截业务逻辑、进行请求配置的修改、如果本地有token就在头部携带
  // 获取用户信息对象
  const { profile } = store.state.user
  // 判断是否带有token
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截
instance.interceptors.response.use((res) => res.data, err => {
  // 401状态码。进入该函数
  if (err.response && err.response.status === 401) {
    // 清空无效的用户信息、跳转到登录页面、登录完跳转 需要传参（当前路由地址）给登录页码
    store.commit('user/setUser', {})
    // 当前路由地址,router.currentRoute是ref响应式数据，需要加.value,地址需进行转码
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1、如果是get请求，需要使用params来传递submitData
    // 1、如果不是get请求，需要使用data来传递submitData，请求体传参
    // []设置成一个动态的key，写JS表达式，需要注意把method统一转换为小写再来判断
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
