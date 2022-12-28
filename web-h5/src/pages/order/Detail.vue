<template>
  <view class="content flex fd-c">
    <!--    <uni-nav-bar left-icon="left" title="订单详情"/>-->
    <view class="flex-1 of-a mx-4">
      <!--    查看收i否支付-->

      <u-modal :show="paid" @confirm="$u.throttle(getPayResult,1000)" showCancelButton confirmText="已完成支付"
               cancelText="取消" cancelColor="rgba(138, 138, 138, 1)" confirmColor="rgba(51, 51, 51, 1)"
               @cancel="paid=false"
               ref="uModal"
               width="590rpx"
      >
        <view class="ta-c fw-600 ">
          <text class="fs-32-cancel">请确认微信支付是否完成？</text>
        </view>
      </u-modal>

      <view class="flex top-box jc-c ai-c">
        <image v-if="orderStatus==='wait-pay'" class="pay-wait " src="@/static/img/wait-pay.svg"/>
        <image v-else-if="orderStatus==='paid'" class="pay-wait " src="@/static/img/paid.svg"/>
        <image v-else-if="orderStatus==='cancel-pay'" class="pay-wait "
               src="@/static/img/cancel-pay.svg"/>
      </view>
      <view class="pay-tips ta-c fw-b fs-44">
        <view class="fs-44 top-text fw-600 lh-44">{{ orderStatusText }}</view>
      </view>
      <view v-if="orderStatus === 'wait-pay'" class=" flex jc-c ai-c fw-b fs-32 mt-3 lh-32">
        <view class="fs-32 payment-countdown">
          <u-count-down :time="getPaymentTimeoutRelativeTime(orderDetail)*60 * 1000" format="mm:ss"
                        @change="mockCancelOrder"/>
        </view>
        <text class="countdown-text fw-b fs-28">后订单将自动取消</text>
      </view>
      <view class="order-box flex jc-fs ai-c">
        <image-view class="mx-2 order-img" :img-url="orderDetail['nftArt~mainImageFile']" mode="aspectFill"/>
        <view class="flex-1">
          <view class="fs-36 fw-b text-ellipsis-1 name-max-width">{{ orderDetail['nftArt~name'] }}</view>
          <view class="fs-24 fw-b order-box-merchant mt-3">{{ orderDetail['merchant~merchantName'] }}</view>
        </view>
      </view>
      <view class="pay-number flex jc-sb ai-c">
        <view class="fw-b fs-32">订单金额</view>
        <view class="flex ai-fe">
          <text class="fs-40 ml-1 fw-b">
            <text class="mr-0-5 fs-40 fw-b">￥</text>
            {{ orderDetail['amount'] }}
          </text>
        </view>
      </view>
      <view class="info-box">
        <view class="fw-b fs-32">订单信息</view>
        <view class="info-item flex jc-sb ai-c" v-if="orderDetail['nftGoods~goodsType'] !== '20'">
          <view>支付方式</view>
          <view class="flex">
            <image class="wechat-pay mr-2 w-h-wx-pay" src="@/static/img/wechat-pay.svg"/>
            <text class="">微信支付</text>
          </view>
        </view>
        <view class="info-item flex jc-sb ai-c">
          <view>发行方</view>
          <view>数源三街</view>
        </view>
        <view class="info-item flex jc-sb ai-c">
          <view>版权方</view>
          <view>{{ orderDetail['merchant~merchantName'] }}</view>
        </view>
        <view class="info-item flex jc-sb ai-c">
          <view>订单时间</view>
          <view>{{ orderDetail['createdAt'] }}</view>
        </view>
        <view class="info-item flex jc-sb ai-c mb-80">
          <view>订单号</view>
          <view class="flex jc-fs ai-c">
            <view>{{ orderDetail['tradeNo'] }}</view>
            <image src="@/static/img/copy-icon.svg" class="copy-icon"
                   @click="copyValue(orderDetail['tradeNo'])"></image>
          </view>
        </view>
      </view>
    </view>
    <modal v-if="showModal">
      <view slot="content" class="modal-content">
        <view class="modal-title fw-b fs-36 lh-36">您确定取消订单吗？</view>
        <view class="flex jc-sb ai-c mx-3">
          <u-button @click="showModal = false" class="m-btn-see m-btn fw-b fs-34">
            我再想想
          </u-button>
          <u-button @click="onConfirm" :loading="cancelLoading" loading-text="取消订单"  class="m-btn-cancel m-btn fw-b
                    fs-34">取消订单
          </u-button>
        </view>
      </view>
    </modal>
    <view v-if="orderStatus==='wait-pay'" class="flex bottom-box jc-sb ai-c m-4 fw-b fs-34">
      <u-button @click="showModal = true"
                class="order-btn order-btn-cancel">
        取消订单
      </u-button>
      <u-button @click="getOrderResult" :loading="buyLoading" loading-text="正在支付..."
                class="order-btn order-btn-pay">
        立即支付
      </u-button>
    </view>


  </view>
</template>

<script>
import modal from '../../components/modal/Modal'
import {getRelativeTime, isWxOpen, redirectUrl} from '@/util/util'
import {cancelOrder, orderList, prePay} from '@/api/detail'
import {wxPay} from '@/util/wxPay'
import imageView from '@/components/imageView/ImageView'
import {payResult, wxPayResult} from '../../api/detail'


export default {
  data() {
    return {
      paid: false,
      copyPaid: false,
      buyLoading: false,
      orderStatus: '', //  订单待支付  wait-pay  订单完成 paid  订单取消 cancel-pay
      showModal: false,
      cancelLoading: false,
      orderDetail: {},
      id: ''
    }
  },
  onLoad() {
    let option = this.$Route.query
    if (!option.orderId) {
      this.$u.toast('订单未找到')
      return
    }
    if (option.paid === 'true') {
      this.paid = true
      this.copyPaid = true
    }
    this.id = option.orderId
    this.getOrderDetail()
  },
  onShow() {
    //设置页面title
    document.title = '订单详情'
    this.getOrderDetail()
  },
  components: {
    modal, imageView
  },
  computed: {
    orderStatusText() {
      return this.orderStatus === 'wait-pay' ? '请完成支付' : this.orderStatus ===
      'paid' ? '订单已完成' : this.orderStatus ===
      'cancel-pay' ? '订单已取消' : ''
    }
  },
  methods: {

    randomTimeSleep(n) {
      return new Promise((resolve, reject) => {
        let time = n * 500 + ((Math.random() * 1000).toFixed(0) * 1)
        setInterval(() => {
          resolve('pass')
        }, time)
      }).then()
    },
    getWxPayResult(goodsId) {
      const req = {
        goodsId
      }
      wxPayResult(req).then((res) => {
        if (res.data?.state === 'SUCCESS') {
          uni.hideLoading()
          setTimeout(() => {
            uni.navigateTo({url: '/pages/order/Success?name=' + this.orderDetail['nftArt~name']})
          }, 200)
        } else {
          uni.hideLoading()
        }
      }).catch((e) => {
        uni.hideLoading()
      })
    },
    async getPayResult() {
      uni.showLoading({title: '支付结果查询中'})
      let hasGotResult = false
      for (let i = 0; i < 10; i++) {
        await this.randomTimeSleep(i).then((ret) => {
          const req = {
            goodsId: this.orderDetail['luNftGoodsId'],
            orderId: this.id
          }
          payResult(req).then((res) => {
            if (res.data?.state === 'SUCCESS') {
              hasGotResult = true
              uni.hideLoading()
              setTimeout(() => {
                uni.navigateTo({url: '/pages/order/Success?name=' + this.orderDetail['nftArt~name']})
              }, 200)
            }
            if (res.data?.state !== 'SUCCESS' && i === 9) {
              this.getWxPayResult(this.id)
            }
          }).catch((e) => {
            hasGotResult = true
            uni.hideLoading()
            console.log(e, 'e')
          })
        })
        if (hasGotResult) {
          return
        }
      }
    },
    mockCancelOrder(e) {
      if (e.minutes === 0 && e.seconds === 0 && e.milliseconds === 0) {
        this.orderStatus = 'cancel-pay'
      }
    },
    getPaymentTimeoutRelativeTime(orderRow) {
      const createdAt = new Date(orderRow.createdAt.replace(/-/g, '/'));
      const expireAt = createdAt.setMinutes(createdAt.getMinutes() + 15);
      const timerArr = getRelativeTime(new Date(), expireAt).split(':');
      return ((Number(timerArr[0] * 60) + Number(timerArr[1])) / 60)
    },
    async getOrderDetail() {
      let req = {
        "paging": {
          "pageNumber": 1,
          "pageSize": 10
        },
      }
      try {
        const res = await orderList(req, this.id);
        this.orderDetail = this.transformData(res.data.rows[0])

        switch (this.orderDetail.state) {
          case '待支付':
            this.orderStatus = 'wait-pay'
            break
          case '已取消':
            this.orderStatus = 'cancel-pay'
            break
          default :
            this.orderStatus = 'paid'
            break
        }
      } catch (e) {
        console.log(e, 'e')
      }
    },
    async onConfirm() {
      this.cancelLoading = true
      let req = {
        goodsId: this.orderDetail['luNftGoodsId']
      }
      try {
        await cancelOrder(req);
        this.$u.toast('取消订单成功')
        await this.getOrderDetail()
        this.showModal = false
        this.cancelLoading = false
      } catch (e) {
        this.cancelLoading = false
        console.log(e, 'e')
        this.showModal = false
      }
    },
    onCancel() {
      this.showModal = false
    },
    async getOrderResult() {
      this.buyLoading = true
      this.orderId = this.orderDetail['id']
      await this.prePay()
    },
    async prePay() {
      try {
        let req = {
          goodsId: this.orderDetail['luNftGoodsId'],//this.orderId
          wxId: uni.getStorageSync('code'),
          name: this.orderDetail['nftArt~name'],
          paymentType: isWxOpen() ? 1 : 2
        }

        await prePay(req)

        await this.getPayResult(this.orderDetail['luNftGoodsId'])

        this.buyLoading = false
      } catch (e) {
        this.$u.toast(e)
        console.log(e, 'e')
        this.buyLoading = false
      }
    },
  }
}
</script>

<style lang="scss">
@import "static/css/variable";
.name-max-width{
  max-width: 400rpx;
}

.order-btn {
  width: 320rpx;
  height: 96rpx;
  border-radius: 20rpx;
  margin: 0;
}

.modal-content {
  width: 630rpx;
  height: 304rpx;
  background: #FFFFFF;
  border-radius: 20rpx;

  .modal-title {
    text-align: center;
    margin-top: 60rpx;
    margin-bottom: 68rpx;
    color: #101010;
  }

  .m-btn {
    border-style: none;
    width: 260rpx;
    height: 96rpx;
    border-radius: 20rpx;
  }

  .m-btn-cancel {
    background: #F5F5F5;
    color: #101010;
    font-size: 34rpx;
    border: none;
  }

  .m-btn-see {
    color: #fff;
    background: #7948F7;
    font-size: 34rpx;
    border: none;
  }

}

.order-btn-cancel {
  color: #101010;
  background: #F5F5F5;
}

.order-btn-pay {
  color: #ffffff;
  background: #7948F7;
}

.paid-box {
  width: 590rpx;
  height: 331rpx;
  border-radius: 16rpx;
  mix-blend-mode: normal;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  overflow: hidden;

  .paid-title {
    border-radius: 8px;
    height: 150rpx;
    border-bottom: 2rpx solid rgba(237, 237, 237, 1);
  }

  .paid-complete {
    height: 91rpx;
    border-bottom: 2rpx solid rgba(237, 237, 237, 1);
    color: rgba(51, 51, 51, 1);
  }

  .paid-ques {
    color: rgba(138, 138, 138, 1);
  }
}

.countdown-text {
  color: #7F7F7F;
}

.copy-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 8rpx;
}

.content {
  color: #101010;
  position: relative;
}

.pb-128 {
  padding-bottom: 128rpx;
}

.pay-tips {
  color: #101010;
}

.top-box {
  .pay-wait {
    width: 120rpx;
    height: 120rpx;
    margin-top: 66rpx;
    margin-bottom: 40rpx;
  }

  .top-text {
    height: 50rpx;
    line-height: 50rpx;
  }

}

.wait-pay {
  color: #28AE5F;
}

.paid {
  color: #999999;
}

.cancel-pay {
  color: #F95151;
}

.top-desc {
  padding-left: 72rpx;

}

.order-box {
  margin-top: 68rpx;
  height: 160rpx;
  margin-bottom: 92rpx;
  background: #F5F5F5;
  border-radius: 20rpx;

  .order-box-merchant {
    color: #7F7F7F;
  }

  .order-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 20rpx;
  }
}

.pay-number {
  margin-bottom: 90rpx;

  .pay-text {
    color: #636669;
  }
}

.wechat-icon {
  height: 170rpx;
  padding: 60rpx 0;
  border-bottom: 2rpx solid rgb(238, 238, 238);
  border-top: 2rpx solid rgb(238, 238, 238);

  .wechat-pay {
    width: 52rpx;
    height: 50rpx;
  }

  .wechat-status {
    width: 44rpx;
    height: 44rpx;
  }
}

.w-h-wx-pay {
  width: 48rpx;
  height: 44rpx;
}

.info-box {
  > view:first-child {
    margin-bottom: 68rpx;
  }

  .info-item {
    font-weight: bold;
    color: #7F7F7F;
    font-size: 28px;
    margin-top: 60rpx;

    > view:last-child {
      color: #101010;
    }
  }

}

.mr-24 {
  margin-right: 24rpx;
}

::v-deep .u-button--normal{
  font-size: 34rpx;
}
.bottom-box {
  width: 670rpx;
  height: 88rpx;
  border: none;

  .cancel-btn {
    color: rgb(153, 153, 153);
    background: rgb(255, 255, 255);
    border: 2rpx solid rgb(245, 245, 245)
  }

  .pay-btn {
    background: rgb(40, 174, 95);
    color: #ffffff;
  }
}

.payment-countdown {
  margin-right: 8rpx;
}

::v-deep .u-count-down__text {
  font-size: 32rpx;
  color: #101010;
}

.mr-0-5 {
  margin-right: 5rpx;
}

.fs-32-cancel {
  font-size: 32rpx;
}
.mb-80{
  margin-bottom: 80rpx;
}
.lh-44{
  line-height: 44rpx;
  height: 44rpx;
}
.lh-32{
  line-height: 32rpx;
  height: 32rpx;
}
.lh-36{
  line-height: 36rpx;
}

::v-deep .u-button--info{
  border-style: none;
}
</style>
