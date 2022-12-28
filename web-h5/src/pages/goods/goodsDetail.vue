<template>
  <view class="content flex fd-c">
    <Login :is-show="isShow" @changeTemp="isShow=false" :is-auto="isAuto" @isAuto="isAuto=true"/>
    <view class="content-box flex-1 of-a">
      <image-view class="image-box" :img-url="goodsDetail['nftArt~mainImageFile']" :is-bg="true" @getUrl="getUrl">
        <view class="share-view"
              @click="handleShowPoster">
          <image mode="aspectFill" src="@/static/img/share.svg"
                 class="w-h-80"></image>
        </view>
        <view class="home-view"
              @click="onNavigateToPage('merchantDetail',{merchantId:goodsDetail['nftArt~luMerchantId']})">
          <image mode="aspectFill" src="@/static/img/jump-home.svg"
                 class="w-h-80"></image>
        </view>
        <view v-if="goodsDetail['remainSeconds'] > 24*60*60" class="count-down-box flex jc-fs ai-c">
          <img src="@/static/img/white-time.svg" alt="" class="white-time-img">
          <view class="fs-24 lh-24 fw-500">敬请期待
            <span class="mr-08 ml-08">{{getStartsTime(goodsDetail['startsAt'])}}</span>开售
          </view>
        </view>
        <view v-else-if="goodsDetail['remainSeconds'] > 0" class="count-down-box flex jc-fs ai-c">
          <img src="@/static/img/white-time.svg" alt="" class="white-time-img">
          <view class="fs-24 lh-24 fw-500 flex jc-fs ai-c">
            即将开售
            <u-count-down :time="goodsDetail['remainSeconds'] * 1000" format="HH:mm:ss"
                          @finish="init"/>
          </view>
        </view>
      </image-view>
      <view class="c-info px-4" :class="{'h-280':[20,35,50].includes(isBlindBox)}">
        <view class="fs-44 fw-600 c-name text-ellipsis-1">{{ goodsDetail['nftArt~name'] }}</view>
        <view class="c-i-box flex jc-fs ai-c" v-if="[10,30].includes(isBlindBox)">
          <view class="tag-issue fs-24 pl-2 pr-16 flex jc-c ai-c fw-b">限量
            <text
              class="ml-8">{{ goodsDetail['issueNum'] }}
            </text>
          </view>
          <view class="tag-issue-right fs-24  pr-2 flex jc-c ai-c ml-8 fw-b">剩余
            <text class="ml-8">{{ goodsDetail['stockNum'] }}</text>
          </view>
        </view>
        <view class="c-i-price fs-40 fw-b" v-if="[10,30].includes(isBlindBox)">
          <span class="mr-8">￥</span>{{ goodsDetail['price'] }}
        </view>
        <view class="c-i-merchant flex jc-fs ai-c px-3"
              @click="onNavigateToPage('merchantDetail',{merchantId:merchant.id})">
          <image-view :default-avatar="true" class="merchant-avatar" :is-circle="true" @getUrl="getMerchantAvatar"
                      :img-url="merchant['avatar']"
                      :is-bg="false"/>
          <view class="flex-1 fw-b fs-30 text-ellipsis-1">{{ merchant['merchantName'] }}</view>
          <view class="c-i-text fs-24 fw-b">版权方</view>
        </view>
      </view>
      <view class="issue px-4" v-if="isBlindBox !== 50">
        <view class="flex jc-fs ai-c issue-title">
          <image src="@/static/img/issue-icon.svg" class="title-img"></image>
        </view>
        <view class="issue-item flex jc-fs ai-c" v-if="[10,30].includes(isBlindBox) &&
        goodsDetail['nftArt~contractAddress']">
          <image src="@/static/img/nft-address.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            藏品地址：
            <text class="ml-8">{{
                goodsDetail['nftArt~contractAddress'] &&
                goodsDetail['nftArt~contractAddress'].length > 10 ? goodsDetail['nftArt~contractAddress'].substr(0, 6) + '...' + goodsDetail['nftArt~contractAddress'].substr(goodsDetail['nftArt~contractAddress'].length - 4) :
                  goodsDetail['nftArt~contractAddress']
              }}
            </text>
          </view>
          <image @click="copyContractAddress(goodsDetail['nftArt~contractAddress'])" class="copy-icon"
                 src="@/static/img/copy-icon.svg"></image>
        </view>
        <view class="issue-item flex jc-fs ai-c">
          <image src="@/static/img/i-merchant.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            发行方：
            <text class="ml-8">数源三街</text>
          </view>
        </view>
        <view v-if="isBlindBox !== 50" class="issue-item flex jc-fs ai-c">
          <image src="@/static/img/i-number.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            发行数量：
            <text class="ml-8">{{ goodsDetail['issueNum'] }}</text>
          </view>
        </view>
        <view class="issue-item flex jc-fs ai-c">
          <image src="@/static/img/sold-time.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            {{ isBlindBox === 50 ? '合成' : '开售' }}时间：
            <text class="ml-8">{{ goodsDetail['startsAt'] }}</text>
          </view>
        </view>
      </view>
      <swiper v-if="bannerList.length" class="scroll-view_H mt-80" :indicator-dots="true"
              autoplay :interval="2500" circular
              indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
        <swiper-item v-for="(item,index) in bannerList" :key="index">
          <view @click="bannerJump(item)">
            <image-view :img-url="item['imageFile']" alt="" class="wd ta-c mx-4"
                        mode="aspectFill"/>
          </view>
        </swiper-item>
      </swiper>
      <view class="desc-box mb-5 px-4 mt-110" v-if="detailImageList.length">
        <view class="desc-title flex jc-fs ai-c">
          <image src="@/static/img/works-icon.svg" v-if="isBlindBox !== 50" class="title-img"></image>
          <image src="@/static/img/compose-desc.svg" v-else class="title-img"></image>
        </view>
        <view class="">
          <image-view v-for="(item,index) in detailImageList" :class="{'first-img':index === 0,'last-img':index+1 ===
          detailImageList.length}"
                      :key="index"
                      :img-url="item"
                      is-pro
                      class="detail-desc"></image-view>
        </view>
      </view>
    </view>
    <view class="pay-box flex jc-sb ai-c pb-auto" v-if="showBuy">
      <modal v-if="showModal">
        <view slot="content" class="modal-content">
          <view class="modal-title fw-b fs-36 lh-36">您有订单未完成支付</view>
          <view class="flex jc-sb ai-c mx-3">
            <u-button @click="showModal = false" class="m-btn-cancel m-btn fw-b fs-34">取消
            </u-button>
            <u-button @click="onConfirm" class="m-btn-see m-btn fw-b fs-34">
              立即查看
            </u-button>
          </view>
        </view>
      </modal>
      <!--      合成藏品-->

      <!--      藏品详情-->
      <u-button v-if="sellOut" class="end-btn fw-b">{{ this.goodsDetail['stockNum'] === '0' ? '已售罄' : '已结束' }}
      </u-button>
      <u-button @click="toastText(true)" v-else-if="goodsDetail['remainSeconds'] > 24*60*60" :loading="buyLoading"
                class="buy-btn fw-b"
                loadingText="正在支付...">
        <view class="fs-36 fw-500 flex jc-fs ai-c white ">
            <view class="mr-08 lh-36 fw-500 fs-36">{{getStartsTime(goodsDetail['startsAt'])}}</view>
            <view class="lh-36 fw-500 fs-36">开售</view>
        </view>
      </u-button>
      <u-button @click="toastText(false)" v-else-if="goodsDetail['remainSeconds'] > 0" :loading="buyLoading"
                class="buy-btn fw-b"
                loadingText="正在支付...">
        <view  class="flex jc-fs ai-c white fs-36 fw-500">
                    <view class="mr-08 fs-36 fw-500 lh-36">即将开售</view>
          <u-count-down :time="goodsDetail['remainSeconds'] * 1000" format="HH:mm:ss"
                        @finish="init"/>
        </view>
      </u-button>
      <u-button v-else :loading="buyLoading" class="buy-btn fw-b" @click="onCreateOrder"
                loadingText="正在支付...">
        立即购买
      </u-button>
    </view>

    <hch-poster
      ref="hchPoster"
      :posterData.sync="posterData"
      @previewImage="previewImage"
    />
  </view>
</template>

<script>
import modal from '../../components/modal/Modal'
import upload from '@/components/upload/Upload'
import imageView from '@/components/imageView/ImageView'
import {createOrder, createOrderResult, goodsDetail, merchant, prePay} from '@/api/detail'
import HchPoster from '@/components/hch-poster/hch-poster'
import {wxPay} from '@/util/wxPay'
import Qrcode from 'qrious';
import Login from '@/components/Login/Login'
import {isWxOpen, redirectUrl} from '../../util/util'
import {bannerList} from '../../api/banner'
import {collectionList, getGoodsList, payResult, wxPayResult} from '../../api/detail'
const randomTimeSleep = (n) => {
  return new Promise((resolve, reject) => {
    let time = n * 500 + ((Math.random() * 1000).toFixed(0) * 1)

    setInterval(() => {
      resolve('pass')
    }, time)
  }).then()

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
let url = window.location.href
export default {
  name: "GoodsDetail",
  components: {
    modal, upload, imageView, HchPoster, Login
  },
  data() {
    return {
      isSpecial:true,
      id: '',
      isBlindBox: 10,  ///10普通藏品    20空投藏品  30 打开盲盒  35 盲盒藏品 50合成
      //轮播图列表
      bannerList: [],
      blindBoxList: [],
      openBlindBox: false,
      merchant: '',
      showBuy: true,
      orderId: '',
      isShow: true,
      isAuto: false,
      buyLoading: false,
      orderResultNum: 0,
      isLogin: false, // 用户登录
      // 海报模板数据
      posterData: {
        poster: {
          //根据屏幕大小自动生成海报背景大小
          url: '', //图片地址
          w: 275, //海报宽度
          h: 406, //海报高度
          x: 0,
          y: 0,
          r: 10
        },
        mainImg: {
          //海报主商品图
          url: '',
          w: 275, //宽度
          h: 275,
          x: 0,
          y: 0,
          r: 10
        },
        title: {
          //商品标题
          x: 15,
          y: 291,
          text: '', //文本
          maxWidth: 245,
          fontSize: 16, //字体大小
          color: '#000', //颜色
          lineHeight: 16, //行高
        },
        merchant: {
          //商品标题
          url: '',
          x: 15,
          y: 315,
          w: 16,
          h: 16,
          text: '', //文本
          fontSize: 10, //字体大小
          color: '#666', //颜色
          lineHeight: 10, //行高
          maxWidth: 100
        },
        price: {
          x: 15,
          y: 317,
          text: '', //文本
          fontSize: 13, //字体大小
          color: '#101010', //颜色
          lineHeight: 13, //行高
        },
        codeImg: {
          //小程序码
          url: '',
          w: 63, //宽度
          h: 63, //高度
          x: 220, //margin-top
          y: 350 //圆角半径
        }
      },
      shareImg: '',
      showShare: false,
      showModal: false,
      stopCompose: false,//是否能够合成
      composeModal: false,
      modalLoading: false,
      verifyModal: false,//核销弹窗
      verifyUrl: '',//核销弹窗
      showMore: true,
      goodsDetail: {},
      blindBoxDetail: {},
      getBlindBox: {},
      option: {},
      //已开盲盒概率
      openRate: '',
      composeList: [],
      navigateList: [],
    }
  },
  async mounted() {
    await this.getOption()
    await this.init()
  },
  computed: {
    canBuy() {
      return this.goodsDetail['saleStatus'] && this.goodsDetail['saleStatus'] !== '进行中'
      // return !this.goodsDetail['saleStatus'] ? true : this.goodsDetail['saleStatus'] !== '进行中'
    },
    getEquity() {
      return this.goodsDetail['rewardIntro'] ? this.goodsDetail['rewardIntro'].split('\n') : []
    },
    detailImageList() {
      return this.goodsDetail['nftArt~detailImageFiles'] ? this.goodsDetail['nftArt~detailImageFiles']?.split(',') : []
    },
    getComposeList() {
      return this.showMore ? this.composeList.slice(0, 3) : this.composeList
    },
    sellOut() {
      return this.goodsDetail['stockNum'] === '0' || this.goodsDetail['saleStatus'] === '已结束'
    }
  },
  methods: {
    toastText(flag){
      uni.$u.toast(`${flag?'敬请期待':'即将开售，请耐心等待'}`)
    },
    getStartsTime(time){
      let t = new Date(time.replace(/-/g, '/'))
      let month = (t.getMonth()+1) + '.'
      let day = t.getDate().toString() + '         '
      let hour = t.getHours().toString() + ':'
      let minute = t.getMinutes().toString()
      return month + day + hour + minute
    },
    async init() {
      let option = this.$Route.query
      this.isBlindBox = Number(option.blindBox || 10)

      if (option.show === true || option.show === 'true') this.showBuy = false
      if (option['id']) {
        this.id = option['id']
        let req = {
          "searchItems": [
            {
              "columnName": "nftArt~luMerchantId",
              "value": option['id'],
              "visible": true
            }
          ]
        }
        try {

          //获取商品详情
          let res = await goodsDetail(req, option.id)
          this.goodsDetail = this.transformData(res.data.rows[0])
          if(this.goodsDetail['onsaleStatus'] === '20'){
            this.$Router.replace({name:'notFound'})
          }

          //设置页面title
          document.title = this.goodsDetail['nftArt~name']

          //获取藏品详情
          let merchantRes = await merchant({id: this.goodsDetail['nftArt~luMerchantId']})
          this.merchant = this.transformData(merchantRes.data.rows)[0]

          //设置分享参数
          if (this.isBlindBox !== 50) this.$set(this.posterData.price, 'text', this.goodsDetail['price'] || '')
          this.$set(this.posterData.title, 'text', this.goodsDetail['nftArt~name'] || '')
          this.$set(this.posterData.merchant, 'text', this.merchant.merchantName || '')

          const bannerRes = await bannerList({
            "merchantId": this.goodsDetail['nftArt~luMerchantId'],
            "areaType": "detail"
          })
          this.bannerList = bannerRes.data
        } catch (e) {
          console.log(e, 'e')
        }
      }
    },
    async getOption() {
      this.option = this.$Route.query
    },
    verify() {
      let qr = new Qrcode({
        value: window.location.href,
      });
      this.verifyUrl = qr.toDataURL();
      this.verifyModal = true
    },
    async getGoodsList() {
      let ids = this.composeList.map(item => item['luPiecesArtId'].toString())
      try {
        let res = await getGoodsList(ids)
        this.navigateList = res.data.items.filter(item => item['goodsType'] !== 'Airdrop')
      } catch (e) {

      }
    },
    //睡眠函数
    sleepCheckStatus(collectionId) {
      uni.$u.sleep(10000).then(() => {
        this.checkCollectionStatus(collectionId)
      })
    },
    //检查collection状态是否为生成中 “Forging”
    async checkCollectionStatus(collectionId) {
      try {
        let res = await collectionList({}, collectionId)
        let item = this.transformData(res.data.rows)[0] || {}
        if (item.state === 'Forging') {
          this.sleepCheckStatus(collectionId)
        } else {
        }
      } catch (e) {

      }
    },
    getMerchantAvatar(url) {
      this.$set(this.posterData.merchant,
        'url', url || '')
    },
    copyContractAddress(address) {
      uni.setClipboardData({
        data: address,
        success: () => {
          uni.$u.toast('复制成功')
          this.canvasShow = false
          this.$emit('cancel', true)
        }, fail: (err) => {
          console.log(err)
        }
      });
    },
    async handleShowPoster() {
      await this.getQrCode()
      this.$refs.hchPoster.posterShow()
    },
    getQrCode() {
      let qr = new Qrcode({
        value: window.location.href,
        size: 80
      });
      this.posterData.codeImg.url = qr.toDataURL();
    },
    previewImage(base64) {
      // 预览图片
      uni.previewImage({
        urls: [base64]
      })
    },
    onConfirm() {
      this.showModal = false
      this.onNavigateToPage('orderDetail', {orderId: this.orderId})
    },
    onCancel() {
      this.showModal = false
    },
    async onCreateOrder() {
      // if (this.canBuy) return
      this.isShow = true
      let userInfo = uni.getStorageSync('user-Info')
      const idToken = uni.getStorageSync('id-Token')

      //生成一个0-1000随机数
      if (idToken && userInfo.IsRealName === 'Verified') {
        this.buyLoading = true
        const random = Math.ceil(Math.random() * 1000)

        if (idToken && userInfo.IsRealName === 'Verified') {
          let req = {
            "concurrency": 0,
            "goodsId": this.goodsDetail['id'],
            "number": 1
          }
          try {
            let res = await createOrder(req)
            if (res.data?.repeated === 1) {
              await this.getOrderResult(true)  //传true表示已有订单  需要弹出modal
            } else await this.getOrderResult()
            //   1000-2000ms一次，轮询5次调/order/create/result这个接口获取订单创建结果，如果为200并且给你返回了订单号，你就再调/order/create/prepay这个接口获取支付参
          } catch (e) {
            setTimeout(() => {
              console.log(e, 'e')
              this.buyLoading = false
            }, 1000)
          }
        }
      }
    },
    async getOrderResult(flag) {
      let stop = false
      let time = (Math.random() * 1000).toFixed(0) * 1
      for (let i = 0; i < 5; i++) {
        setTimeout(async () => {
          if (stop) return
          try {
            let req = {
              goodsId: this.goodsDetail.id
            }
            let res = await createOrderResult(req)
            if (res.data) {
              this.orderId = res.data?.id
              if (flag) {
                this.showModal = true
                this.buyLoading = false
                stop = true
              } else {
                stop = true
                await this.prePay()
              }
            } else if (!res.data && i === 4) {
              uni.$u.toast('查询订单失败')
              this.buyLoading = false
            }
          } catch (e) {
            stop = true
            setTimeout(() => {
              this.buyLoading = false
            }, 1000)
          }
        }, time)
        time += 1000 + (Math.random() * 1000).toFixed(0) * 1
      }
    },
    async prePay() {
      try {
        let req = {
          goodsId: this.goodsDetail['id'],//this.orderId,
          wxId: uni.getStorageSync('code'),
          name: this.goodsDetail['nftArt~name'],
          paymentType: isWxOpen() ? 1 : 2
        }
        let res = await prePay(req)
        localStorage.req = JSON.stringify(req)
        // if (isWxOpen()) {
        //   await wxPay(res.data, this.orderId, this.goodsDetail['id'], this.goodsDetail['nftArt~name'])
        // } else {
        //   let url = redirectUrl(this.orderId)
        //   location.href = res.data?.h5Url + '&redirect_url=' + url + '&timestamp=' + new Date().getTime()
        // }

        await this.getPayResult(this.orderId, this.goodsDetail['id'], this.goodsDetail['nftArt~name'])

        // this.onNavigateToPage('orderDetail',{orderId:this.orderId,paid:true})

        this.buyLoading = false
      } catch (e) {
        console.log(e, 'e')
        this.buyLoading = false
      }
    },
    async getPayResult(orderId, goodsId, goodsName) {
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
    },
    getUrl(url) {
      this.$set(this.posterData.mainImg, 'url', url)
    },
    bannerJump(url) {
      try {
        let str =''
        if(url['redirectUrl'].includes('https')){
          str = url['redirectUrl'].match(/https:\/\/([^\/]+)\//i)
        }else {
          str = url['redirectUrl'].match(/http:\/\/([^\/]+)\//i)
        }
        const changeUrl = url['redirectUrl'].replaceAll(str[0],'')
        uni.navigateTo({url: changeUrl})
      } catch (e) {
        uni.showToast({
          title: '错误链接，请重新设置',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "detail.scss";
.count-down-box {
  position: absolute;
  height: 50rpx;
  padding: 0 16rpx;
  bottom: 30rpx;
  color: #FFFFFF;

  right: 30rpx;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50rpx;
  .white-time-img{
    width: 26rpx;
    height: 26rpx;
    margin-right: 12rpx;
  }
  ::v-deep .u-count-down__text{
    color: #fff;

    font-size: 24rpx;
    margin-left: 8rpx;
  }
}
.white{
  ::v-deep .u-count-down__text{
    color: #fff;
    font-size: 36rpx;
    line-height: 36rpx!important;
  }
}


</style>
