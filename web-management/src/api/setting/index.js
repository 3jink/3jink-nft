import {sendRequest} from '@/utils/request'

/**
 *  获取商户列表
 */
export const getDefaultMerchant = ()=>sendRequest({
  url: '/settings',
  method: 'get',
})

/**
 *  获取商户列表
 */
export const setDefaultMerchant = (req)=>sendRequest({
  url: '/settings',
  method: 'post',
  data: req
})