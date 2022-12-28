import { sendRequest } from '@/utils/request'

const userApi = {
}
export async function accessUpload(req) {
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