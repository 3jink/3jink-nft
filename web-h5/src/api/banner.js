import request, { sendRequest } from "./../util/request"

const baseApi = '/banner/';

const userApi = {
  bannerList:baseApi+'find',
  getRolling:'/announcement/getrolling',
  setReadIP:'/announcement/setreadtime',
  noticeList:'/announcement/list'
}

/**
 * 获取轮播图列表
 * @param req
 * @returns {Promise<*>}
 */
export  async function bannerList(req){
    const res = await request({
        url: userApi.bannerList,
        method: 'post',
        data: req
    })
    return res
}


