import {sendRequest} from '@/utils/request'

const baseApi = '/merchant/';
const merchantApi = {
  NFTList: merchantApi + 'list',
}


/**
 *  获取商户列表
 */
export const merchantList = (req,id)=>sendRequest({
  url: `/merchant/list${id?'?dataId='+id:''}`,
  method: 'post',
  data: req
})


/**
 *  获取商户列表
 */
export const activeMerchant = (id)=>sendRequest({
  url: '/merchant/active'+'?id='+id,
  method: 'post',
  data: {}
})



/**
 *  获取商户列表
 */
export const suspendMerchant = (id)=>sendRequest({
  url: '/merchant/suspend'+'?id='+id,
  method: 'post',
  data: {'profile':'merchant_staff'}
})


/**
 *  获取商户列表
 */
export const editMerchant = (req,id)=>sendRequest({
  url: '/merchant/edit'+'?id='+id,
  method: 'post',
  data: req
})


/**
 *  获取商户列表
 */
export const createMerchant = (req,id)=>sendRequest({
  url: '/merchant/create',
  method: 'post',
  data: req
})

/**
 * 新增商户的核销人员
 */
export const addVerfy = (req,id)=>sendRequest({
  url: '/account/merchant/create',
  method: 'post',
  data: req
})

/**
 * 删除商户的核销人员
 */
export const delVerfy = (req,id)=>sendRequest({
  url: '/account/merchant/suspend',
  method: 'post',
  data: req
})