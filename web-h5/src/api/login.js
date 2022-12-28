import request, { sendRequest } from "./../util/request"

const baseApi = '/connect/';

const userApi = {
  sendCode:baseApi+'sendCode',
  authorizeUser:baseApi+'authorizeUser',
  refreshToken:baseApi+'refresh',
  editUserInfo:'/account/personalinfo',
  getWxAvatar:'/account/syncwechatavatar',
  accountClaim:'/account/claims',
  avatarRedPointFlag:'/account/avatarredpointflag',
  getTicket:baseApi+'wxticket'
}

/**
 * 获取验证码
 * @param req
 * @returns {Promise<*>}
 */
export  async function sendCode(req){
    const res = await request({
        url: userApi.sendCode,
        method: 'post',
        data: req
    })
    return res
}

/**
 * 登录
 * @param req
 * @returns {Promise<*>}
 */
export  async function authorizeUser(req){
    const res = await request({
        url: userApi.authorizeUser,
        method: 'post',
        data: req
    })
    return res
}

/**
 * 修改个人信息
 * @param req
 * @returns {Promise<*>}
 */
export  async function editUserInfo(req){
    const res = await sendRequest({
        url: userApi.editUserInfo,
        method: 'post',
        data: req
    })
    return res
}

/**
 * 获取微信头像
 * @param req
 * @returns {Promise<*>}
 */
export  async function getWxAvatar(req){
  const res = await sendRequest({
    url: userApi.getWxAvatar,
    method: 'post',
    data: req
  })
  return res
}

/**
 * 获取用户是否有红点
 * @param req
 * @returns {Promise<*>}
 */
export  async function accountClaim(){
  const res = await sendRequest({
    url: userApi.accountClaim+'?types=AvatarRedPointFlag&clientId=066cb24e9cac47eda81e5d189f24b94d',
    method: 'get'
  })
  return res
}

/**
 * 消除原点
 * @param req
 * @returns {Promise<*>}
 */
export  async function avatarRedPointFlag(){
  const res = await request({
    url: userApi.avatarRedPointFlag,
    method: 'post'
  })
  return res
}

/**
 * 刷新token
 * @param req
 * @returns {Promise<*>}
 */
export  async function refreshToken(req){
    const res = await request({
        url: userApi.refreshToken,
        method: 'post',
        data: req
    })
    return res
}

/**
 * 获取微信临时票据
 * @param req
 * @returns {Promise<*>}
 */
export  async function getTicket(){
  const res = await sendRequest({
    url: userApi.getTicket,
    method: 'get'
  })
  return res
}

