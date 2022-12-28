import request,{sendRequest} from '../util/request'


//图片上传相关
export const uploadImg = (req) => request({
  url: '/file/batch',
  method: 'post',
  data: req
})


export function accessView(req) {
  req.test = true
  return sendRequest({
    url: '/file/info',
    method: 'get',
    params: req
  })
}


export function getTicket() {
  return sendRequest({
    url: '/connect/ticket?scope=serverPushEvent',
    method: 'get',
  })
}
