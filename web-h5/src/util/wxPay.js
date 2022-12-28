import wx from 'weixin-js-sdk'
import {payResult, wxPayResult} from '../api/detail'


const randomTimeSleep = (n) => {
  return new Promise((resolve, reject) => {
    let time = n * 500 + ((Math.random() * 1000).toFixed(0) * 1)

    setInterval(() => {
      resolve('pass')
    }, time)
  }).then()

}

export const getPayResult = async (orderId, goodsId, goodsName) => {
  let hasGotResult = false
  for (let i = 0; i < 10; i++) {
    await randomTimeSleep(i).then((ret) => {
      const req = {
        goodsId,
        orderId
      }
      if (!goodsId) delete req.goodsId
      payResult(req).then((res) => {
        if (res.data?.state === 'SUCCESS') {
          hasGotResult = true
          uni.hideLoading()
          setTimeout(() => {
            uni.navigateTo({url: '/pages/order/Success?name=' + goodsName})
          }, 200)
        }
        if (res.data?.state !== 'SUCCESS' && i === 9) {
          getWxPayResult(goodsId, goodsName)
        }
      }).catch((e) => {
        uni.hideLoading()
        console.log(e, 'e')
      })
    })
    if (hasGotResult) {
      return
    }
  }
}
const getWxPayResult = (goodsId, goodsName) => {
  const req = {
    goodsId
  }
  wxPayResult(req).then((res) => {
    if (res.data?.state === 'SUCCESS') {
      uni.hideLoading()
      setTimeout(() => {
        uni.navigateTo({url: '/pages/order/Success?name=' + goodsName})
      }, 200)
    } else {
      uni.hideLoading()
    }
  }).catch((e) => {
    uni.hideLoading()
    console.log('wxPayResult fail: ', e)
  })
}

export const wxPay = (data, oderId, goodsId, goodsName) => {
  wx.config({
    debug: false,
    appId: data.appId,
    timestamp: data.timeStamp,
    nonceStr: data.nonceStr,
    signature: data.paySign,
    jsApiList: ['chooseWXPay']
  });

  wx.ready(function () {
    wx.chooseWXPay({
        timestamp: data.timeStamp,//这个字段是为字符串后端返回时需检查
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success(res) {
          uni.showLoading({
            title: '支付查询中'
          });
          getPayResult(oderId, goodsId, goodsName)
        },
        fail(res) {
          console.log(res, 'e err')
        }
      });
  });


  wx.checkJsApi({
    jsApiList: ['chooseImage'], // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
    success: function (res) {
      console.log(res)
      // 以键值对的形式返回，可用的 api 值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    }
  });

  wx.error(function (res) {
    console.log(err, res)
    uni.showToast({
      title: '支付失败',
      icon: 'error'
    })
  });

}
