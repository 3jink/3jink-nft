import request, {sendRequest} from "./../util/request"


const nftApi = {
  merchant: '/merchant/list',
  goodsList: '/nftgoods/list',
  collectionList: '/nftcollection/list',
  orderList: '/order/my/list',
  cancelOrder: '/order/cancel',
  goodsDetail: '/nftgoods/list',
  airdropLatest: '/nftgoods/airdrop/latest'
}

/**
 * 获取商家信息相关头部
 * @param req
 * @returns {Promise<*>}
 */
export async function merchant(req) {
  const res = await sendRequest({
    url: nftApi.merchant + `${req.id ? '?dataId=' + req.id : ''}`,//'?dataId=' + req.id,
    method: 'post',
    data: req
  })
  return res
}

/**
 * 查询是否该商家有藏品
 * @param req
 * @returns {Promise<*>}
 */
export async function airdropLatest(req) {
  const res = await request({
    url: nftApi.airdropLatest + '?id=' + req,//'?dataId=' + req.id,
    method: 'get'
  })
  return res
}

/**
 * 获取商家信息列表
 * @param req
 * @returns {Promise<*>}
 */
export async function goodsList(req) {
  let reqData = {
    paging: req.paging,
    "searchItems": [{
      "columnName": "nftArt~luMerchantId",
      "value": req.id,
      "visible": true

    }],
  }
  const res = await sendRequest({
    url: nftApi.goodsList + '?tableView=CustomerList',
    method: 'post',
    data: reqData
  })
  return res
}


/**
 *  获取盲盒里的nft李斯特
 */
export const getItemList = (req, id) => sendRequest({
  url: `/nftgoods/mysterybox/itemslist${id ? '?dataId=' + id : ''}`,
  method: 'post',
  data: req
})


/**
 * 获取用户页面我的藏品列表
 *
 * @returns {Promise<*>}
 */
export async function collectionList(req, id) {
  if (id) {
    return await sendRequest({
      url: nftApi.collectionList + '?dataId=' + id,
      method: 'post',
      data: req
    })
  }
  return await sendRequest({
    url: nftApi.collectionList + `${req?.searchItems ? '?tableView=merchantNftCollection' : ''}`,
    method: 'post',
    data: req
  })
}

/**
 * 获取用户页面我的订单列表
 * @param req
 * @returns {Promise<*>}
 */
export async function orderList(req, id) {
  const res = await sendRequest({
    url: nftApi.orderList + `${id ? '?dataId=' + id : ''}`,
    method: 'post',
    data: req
  })
  return res
}


export const goodsDetail = (req, id, flag = false, custom = false) => {
  if (flag) {
    return sendRequest({
      url: nftApi.goodsDetail + '?dataId=' + id + `${custom?'&tableView=NftGoodsCompoudPiecesView':''}`,
      method: 'post',
      data: req
    })
  }
  return sendRequest({
    url: nftApi.goodsDetail + '?dataId=' + id + '&tableView=CustomerList',
    method: 'post',
    data: req
  })
}


export const getSwiperList = (req, tableview) => sendRequest({
  url: `/nftgoods/list${tableview ? '?tableView=' + tableview : ''}`,
  method: 'post',
  data: req
})

export const cancelOrder = (req) => sendRequest({
  url: nftApi.cancelOrder,
  method: 'post',
  data: req
})

export const getWxPayParams = (req) => sendRequest({
  url: 'order/pay',
  method: 'post',
  data: req
})

export const createOrder = (req) => sendRequest({
  url: 'order/create',
  method: 'post',
  data: req
})


export const createOrderResult = (req) => sendRequest({
  url: 'order/create/result',
  method: 'post',
  data: req
})


export const prePay = (req) => sendRequest({
  url: 'order/prepay',
  method: 'post',
  data: req
})


export const payResult = (req) => sendRequest({
  url: 'order/pay/result',
  method: 'post',
  data: req
})

export const wxPayResult = (req) => sendRequest({
  url: 'order/wxpay/result',
  method: 'post',
  data: req
})


/**
 * 打开盲盒
 * @param req
 * @returns {Promise<*>}
 */
export function onOpenBlindBox(req) {
  return request({
    url: 'nftcollection/mysterybox/prize',//'?dataId=' + req.id,
    method: 'get',
    params: req
  })
}

/*
* 获取开盲盒id
* */
export const getAcquireId = (req, id) => sendRequest({
  url: 'nftcollection/mysterybox/acquire?id=' + id,
  method: 'post',
  data: req
})

/*
* 检查当前帐号是否有足够的材料合成某个藏品
* */
export const getCheck = (req, id) => sendRequest({
  url: 'nftcollection/compund/check?id=' + id,
  method: 'post',
  data: req
})

/*
* 根据碎片的NftArtID获取能够获取到此碎片的商品列表
* */
export const getGoodsList = (id) => sendRequest({
  url: 'nftgoods/compund/goodslistbypiecesids?ids=' + id,
  method: 'get',
})

/*
* 合成藏品
* */
export const composeCollection = (id) => sendRequest({
  url: 'nftcollection/compund/mint?id=' + id,
  method: 'post',
})


/*
* 根据NftCollectionID获取当前帐号的权益列表
* */
export const getEquityList = (id) => sendRequest({
  url: 'nftcollection/rewards/findbycollectionid?id=' + id,
  method: 'get',
})


/*
* 根据AccountRewardID生权益核销码
* */
export const getAccountRewardID = (id) => sendRequest({
  url: 'nftcollection/rewards/generaterewardtoken?id=' + id,
  method: 'get',
})


/*
* 根据AccountRewardID生权益核销码
* */
export const userReward = (req) => sendRequest({
  url: 'nftcollection/rewards/usereward',
  method: 'post',
  data: req
})

/*
* 获取默认merchantId
* */
export const getDefaultMerchant = (req) => sendRequest({
  url: 'settings',
  method: 'get'
})




