import request,{sendRequest} from '@/utils/request'


const userApi = {
  Login: '/connect/authorizeUser',
  Logout: '/auth/logout',
  reset: '/account/user/reset',
  reg: '/account/user/reg',
  sendCode: '/connect/sendCode',
  refreshToken: '/connect/refresh',
  SendSmsErr: '/account/sms_err',
  // get my info
  userInfo: '/account/user/info',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }登录
 * @param parameter
 * @returns {*}
 */
export async function login(req) {
  // req.clientId = process.env.NODE_ENV=='development'?'f7b292feb696eb5b8c8dde8a10578844':'f7b292feb696eb5b8c8dde8a10578844'
  req.clientId="10a08aa3a662484da9d854c752e5d649"
  req.deviceType = 'PC'
  req.scope='management'
  req.user = req.mobile
  req.code=req.captcha
  delete  req.username
  delete  req.mobile
  delete req.captcha
  const res = await request({
    url: userApi.Login,
    method: 'post',
    data: req
  })
  return res
}

/*
  刷新token
*/

export async function refreshToken(req) {
  const res = await request({
    url: userApi.refreshToken,
    method: 'post',
    data: req
  })
  return res
}

/*
  发送短信验证码
*/
export async function sendCode(req) {
  const res = await request({
    url: userApi.sendCode,
    method: 'post',
    data: req
  })
  return res
}


/*
  获取用户信息
*/
export async function userInfo() {
  const res = await sendRequest({
    url: userApi.userInfo,
    method: 'get'
  })
  return res
}

export function logout() {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}