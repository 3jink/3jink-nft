import {sendRequest} from '@/utils/request'

const userApi = {
  adminList: '/account/list',
  accountList: '/accountcenter/accountlist',
  accountRealNameList: '/accountcenter/accountrealnamelist',
  profiles: '/account/profiles',
  createAdmin: '/account/admin/create',
  lock: '/account/admin/lock',
  unlock: '/account/admin/unlock',
  suspend: '/account/admin/suspend',
  editAdmin: '/account/admin/update',
  collectionList: '/nftcollection/list',
  orderList: '/order/list',
  collectionNumberList:'/accountcenter/collectionnumbers'
}

/**
 * 获取用户列表
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export function adminLists(req) {
  let urlStr = ''
  if (req.id) {
    urlStr += '?dataId=' + req.id
    urlStr += '&tableView=' + req.view
  } else {
    urlStr += '?tableView=' + req.view
  }
  return sendRequest({
    url: userApi.adminList + urlStr,
    method: 'post',
    data: req.req
  })
}
/**
 * 获取用户管理的用户列表
 * @param req
 * @returns {Promise<*>}
 */
export async function adminList(req,id) {
  let ids = ''
  if(id) ids='?dataId='+id+'&claimTypes=avatar,nickname';
  else ids='?claimTypes=avatar,nickname'
  return await sendRequest({
    url: userApi.accountList+ids,
    method: 'post',
    data: req
  })
}
/**
 * 同时获取用户的身份列表
 * @param req
 * @returns {Promise<*>}
 */
export async function accountRealNameList(req) {
  // let ids = ''
  // if(id) ids='?dataId='+id;
  return await sendRequest({
    url: userApi.accountRealNameList,
    method: 'post',
    data: req
  })
}

/**
 * 统计用户藏品数
 * @param req
 * @returns {Promise<*>}
 */
export async function collectionNumberList(req) {
  return await sendRequest({
    url: userApi.collectionNumberList+'?ids='+req,
    method: 'post'
  })
}

/**
 * 停用管理端管理员列表
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export function adminLock(req) {
  return sendRequest({
    url: userApi.lock,
    method: 'post',
    data: req
  })
}

/**
 * 启用管理端管理员列表
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export function adminUnLock(req) {
  return sendRequest({
    url: userApi.unlock,
    method: 'post',
    data: req
  })
}

/**
 * 删除管理端管理员列表
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export function adminSuspend(req) {
  return sendRequest({
    url: userApi.suspend,
    method: 'post',
    data: req
  })
}

/**
 * 新增管理端管理员
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export function createAdmin(req) {
  return sendRequest({
    url: userApi.createAdmin,
    method: 'post',
    data: req
  })
}

/**
 * 获取用户页面我的藏品列表
 *
 */
export async function collectionList(req, flag = true) {
  const res = await sendRequest({
    url: userApi.collectionList,
    method: 'post',
    data: req
  })
  return res
}

/**
 * 获取用户页面我的订单列表
 * @param req
 * @returns {Promise<*>}
 */
export async function orderList(req) {
  const res = await sendRequest({
    url: userApi.orderList,
    method: 'post',
    data: req
  })
  return res
}