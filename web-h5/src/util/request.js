import axios from 'axios'
import {VueAxios} from './axios'
import jwt from 'jsonwebtoken'
import {refreshToken} from '../api/login'
import Vue from 'vue'


const REFRESH_TOKEN = 'refresh-Token'
const ID_TOKEN = 'id-Token'
let isRefreshing = false  // 定义一个是否正在刷新token的标记
let retryRequests = []// 定义一个空数组，承载请求队列
let autoRefreshToken = true


export async function sendRequest(payload) {
  //这里过滤掉登录，注册，获取
  //todo: 判断id_token是否过期
  let idTokenExpired = isIdTokenExpired()
  const idToken = uni.getStorageSync(ID_TOKEN);
  if (idTokenExpired && autoRefreshToken && idToken) {
    //发起刷新token
    let refreshTokens = uni.getStorageSync(REFRESH_TOKEN)
    let data = {token: refreshTokens}
    if (refreshTokens && !isRefreshing) {
      isRefreshing = true
      let res = await refreshToken(data)
      if (res.code === '200') {
        setJwtToken(res.data.idToken, res.data.refreshToken)
        isRefreshing = false
      } else {
        isRefreshing = false
        uni.clearStorageSync();
        uni.redirectTo({url: '/pages/merchant/Home'})
        uni.setStorageSync('refresh', true)
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

// 延時函數
async function sleep(payload) {
  while (isRefreshing) {
  }
  return request(payload)
}


export function setJwtToken(idToken, refreshToken) {
  uni.setStorageSync(ID_TOKEN, idToken)
  uni.setStorageSync(REFRESH_TOKEN, refreshToken)
  let claims = jwt.decode(idToken)
  uni.setStorageSync('id-Token-exp', claims.exp)
}

export function isIdTokenExpired() {
  let exp = uni.getStorageSync('id-Token-exp')
  return !exp || exp <= getUtcNowTimestamp()
}


export function getUtcNowTimestamp() {
  return Math.round(new Date().getTime() / 1000)
}

// 创建 axios 实例
const request = axios.create({
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
        break
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

  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  let idToken = uni.getStorageSync(ID_TOKEN)
  uni.setStorageSync('refresh', false)
  if (idToken && !isIdTokenExpired()) {
    //let res = jwt.decode(idToken)
    config.headers['Authorization'] = 'Bearer' + ' ' + idToken
  }
  return config
}, errorHandler)


request.interceptors.response.use((response) => {
  const res = response.data
  // 如果自定义的返回码不等于200, 就返回一个错误
  if (res.code === '401' || res.code === '10008' || res.code === '10009' || res.code === '10020') {
    uni.clearStorageSync();
    uni.$u.toast('登录已失效')
    setTimeout(() => {
      uni.redirectTo({url: '/pages/merchant/Home'})
      uni.setStorageSync('refresh', true)
    }, 700)
  } else if (res.code === '404') {
    //导出使用request请求后台错误提示
    location.href = location.href.split('#')[0] + '#/pages/404'
    return Promise.reject((res.msg || 'Error'))
  } else if (res.code !== '200' && res.code !== '10042') {
    //导出使用request请求后台错误提示
    uni.$u.toast(res.msg || '未知错误')
    return Promise.reject((res.msg || 'Error'))
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
