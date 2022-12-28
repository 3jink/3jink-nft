import {sendRequest} from '../util/request'

export async function uploadFile(req) {
  return await sendRequest({
    url: 'file',
    method: 'post',
    data: req
  })
}

export async function accessView(req) {
  return await sendRequest({
    url: 'file/'+ req,
    method: 'get',
  })
}
