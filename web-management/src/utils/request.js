import router from '../router'
import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ID_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { refreshToken } from '@/api/login'
import { message } from 'ant-design-vue'

let jwt = require('jsonwebtoken')//引入jwt解析token
let autoRefreshToken=true
let isRefreshing = false  // 定义一个是否正在刷新token的标记


export async function sendRequest(payload) {
  //这里过滤掉登录，注册，获取
  //todo: 判断id_token是否过期
  let idTokenExpired = isIdTokenExpired()
  const idToken = storage.get(ID_TOKEN)
  if (idTokenExpired && autoRefreshToken && idToken) {
    //发起刷新token
    let refreshTokens = storage.get(REFRESH_TOKEN)
    let data = {token: refreshTokens}
    if (refreshTokens && !isRefreshing) {
      isRefreshing = true
      let res = await refreshToken(data)
      if (res.code === '200') {
        setJwtToken(res.data.idToken, res.data.refreshToken)
        isRefreshing = false
      } else {
        isRefreshing = false
        store.dispatch('Logout').then(() => {
          message.success('登录已失效，请重新登录！')
          router.push({name: 'login'})
          return false
        })
      }
    } else {
      return new Promise((resolve) => {
        let timer = setInterval(async () => {
          if (!isRefreshing) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      }).then(() => {
        return request(payload)
      })
    }
  }
  return request(payload)
}

export function setJwtToken(idToken, refreshToken) {
  storage.set('id-Token', idToken)
  storage.set('refresh-Token', refreshToken)
  let claims = jwt.decode(idToken)
  storage.set('id-Token-exp', claims.exp)
}

export function isIdTokenExpired() {
  let exp = storage.get('id-Token-exp')
  return !exp || exp <= getUtcNowTimestamp()
}


export function getUtcNowTimestamp() {
  return Math.round(new Date().getTime()/1000)
}

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_BASE_URL+'/api/v1',
  timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  let text = ''
  let err = JSON.parse(JSON.stringify(error))
  if (err.response && err.response.status) {
    switch (error.response.status) {
      case 400:
        text = '请求错误(400)，请重新申请'
        break
      case 401:
        text = '登录错误(401)，请重新登录'
        return this.$router.replace('/login')
      case 403:
        text = '拒绝访问(403)'
        break
      case 404:
        text = '请求出错(404)'
        break
      case 408:
        text = '请求超时(408)'
        break
      case 500:
        text = '服务器错误(500)，请重启软件或切换功能页！'
        break
      case 501:
        text = '服务未实现(501)'
        break
      case 502:
        text = '网络错误(502)'
        break
      case 503:
        text = '服务不可用(503)'
        break
      case 504:
        text = '网络超时(504)'
        break
      case 505:
        text = 'HTTP版本不受支持(505)'
        break
      default:
        text = '网络连接出错'
    }
  } else {
    text = '连接服务器失败,请退出重试!'
  }

  notification.error({
    message: '提示',
    description: text
  })
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  let idToken = storage.get(ID_TOKEN)
  if (idToken && !isIdTokenExpired()) {
    config.headers['Authorization'] = 'Bearer' + ' ' + idToken
  }
  return config
}, errorHandler)

// response interceptor


request.interceptors.response.use((response) => {
  const res = response.data
  if (res.code === '401' || res.code === '10008' || res.code === '10009' || res.code === '10020') {
    store.dispatch('Logout').then(() => {
      message.success('登录已失效，请重新登录！')
      router.push({ name: 'login' })
    })
  } else if (res.code !== '200') {
    // 文件导出
    if (res.type && res.type === 'text/xml'){
      return res
    }else{
      message.error(res.msg)
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  } else {
    return res
  }

}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
