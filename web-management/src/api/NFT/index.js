import {sendRequest} from '@/utils/request'

const baseApi = '/nftart/';
const NFTApi = {
  NFTList: baseApi + 'list',
}


/**
 *  获取直播列表
 */
export async function NFTList(req,state,id) {
  return sendRequest({
    url: `/nftart/list${state?'?tableView='+state:''}${id?'?dataId='+id:''}`,
    method: 'post',
    data: req
  })
}


export const createNFT = (req)=>sendRequest({
  url: '/nftart/create',
  method: 'post',
  data: req
})

export const editNFT = (req,id)=>sendRequest({
  url: '/nftart/edit'+'?id='+id,
  method: 'post',
  data: req
})