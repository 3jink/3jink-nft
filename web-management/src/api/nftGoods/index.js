import {sendRequest} from '@/utils/request'

const goodsApi = '/nftgoods/';


/**
 *  获取商户列表
 */
export const nftGoodsList = (req, text) => sendRequest({
  url: `/nftgoods/list${text ? '?tableView=' + text : ''}`,
  method: 'post',
  data: req
})

/**
 *  编辑
 */
export const editGoods = (req, id) => sendRequest({
  url: '/nftgoods/edit' + '?id=' + id,
  // url: '/nftgoods/edit',
  method: 'post',
  data: req
})


/**
 *  创建
 */
export const createGoods = (req) => sendRequest({
  url: '/nftgoods/create',
  method: 'post',
  data: req
})

/**
 *  上架
 */
export const onSaleGoods = (req, id) => sendRequest({
  url: '/nftgoods/onsale' + '?id=' + id,
  method: 'post',
  data: req
})

/**
 *  goodsDetail
 */
export const goodsDetail = (req, id) => sendRequest({
  url: '/nftgoods/list' + '?dataId=' + id,
  method: 'post',
  data: req
})
