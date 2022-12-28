import {sendRequest} from '@/utils/request'

const advertisement = {
  create: '/banner/create',
  bannerList:'/banner/list',
  bannerEdit:'/banner/edit',
  bannerDisable:'/banner/setdisable',
  bannerEnable:'/banner/setenable'
}

/**
 * 新增轮播图
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function create(req) {
  const res = await sendRequest({
    url: advertisement.create,
    method: 'post',
    data: req
  })
  return res
}

/**
 * 轮播图列表
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function bannerList(req) {
  const res = await sendRequest({
    url: advertisement.bannerList,
    method: 'post',
    data: req
  })
  return res
}

/**
 * 编辑轮播图
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function bannerEdit(req,id) {
  const res = await sendRequest({
    url: advertisement.bannerEdit+'?id='+id,
    method: 'post',
    data: req
  })
  return res
}

/**
 * 下架轮播图
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function bannerDisable(req) {
  const res = await sendRequest({
    url: advertisement.bannerDisable+'?id='+req.id,
    method: 'post'
  })
  return res
}

/**
 * 上架轮播图
 * @param req
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function bannerEnable(req) {
  const res = await sendRequest({
    url: advertisement.bannerEnable+'?id='+req.id,
    method: 'post'
  })
  return res
}