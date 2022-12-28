import {sendRequest} from '@/utils/request'

const userApi = {
  orderList: '/order/list'
}

export async function orderList(req, id) {
  req.sorting = {
    "columnNames": [
      "createdAt"
    ],
    "direction": "desc"
  }
  return await sendRequest({
    url: '/order/list' + `${id ? '?dataId=' + id : ''}`,
    method: 'post',
    data: req
  })
}