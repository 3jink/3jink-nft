<template>
  <view class="content flex fd-c">
    <!--    <uni-nav-bar left-icon="left" :title="goodsDetail['nftArt~name']"/>-->
    <Login :is-show="isShow" @changeTemp="isShow=false" :is-auto="isAuto" @isAuto="isAuto=true"/>
    <view class="content-box flex-1 of-a">
      <image-view class="image-box" :img-url="goodsDetail['nftArt~mainImageFile']" :is-bg="true" @getUrl="getUrl">
        <view class="share-view"
              @click="handleShowPoster">
          <image mode="aspectFill" src="@/static/img/share.svg"
                 class="w-h-80"></image>
        </view>
        <view class="home-view"
              @click="onNavigateToPage('merchantDetail',{merchantId:merchant['id']})">
          <image mode="aspectFill" src="@/static/img/jump-home.svg"
                 class="w-h-80"></image>
        </view>
      </image-view>
      <!--      限量-->
      <view class="c-info px-4" :class="{'h-280':[20,35,50].includes(isBlindBox)}">
        <view class="fs-44 fw-600 c-name text-ellipsis-1" :class="{'c-name-margin':[20,35,50].includes(isBlindBox)}">{{
            goodsDetail['nftArt~name']
          }}
        </view>
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
        <view v-if="[10,30].includes(isBlindBox)" class="c-i-price fs-40 fw-b">
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
      <!--      藏品信息-->
      <view class="issue px-4">
        <view class="flex jc-fs ai-c issue-title">
          <image src="@/static/img/issue-icon.svg" class="title-img"></image>
        </view>
        <view class="issue-item flex jc-fs ai-c" v-if="[10,20,35,50].includes(isBlindBox) &&
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
        <view class="issue-item flex jc-fs ai-c" v-if="[10,30].includes(isBlindBox)">
          <image src="@/static/img/i-number.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            发行数量：
            <text class="ml-8">{{ goodsDetail['issueNum'] }}</text>
          </view>
        </view>
        <view class="issue-item flex jc-fs ai-c" v-if="$Route.query.tokenId || tokenId">
          <image src="@/static/img/tokenId.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            Token ID：
            <text class="ml-8">{{ $Route.query.tokenId || tokenId }}</text>
          </view>
        </view>
        <view class="issue-item flex jc-fs ai-c" v-if="[35].includes(isBlindBox)">
          <image src="@/static/img/get-rate.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            获得概率：
            <text class="ml-8">{{ openRate }}</text>
          </view>
        </view>
        <view class="issue-item flex jc-fs ai-c" v-if="[10,30,50].includes(isBlindBox)">
          <image src="@/static/img/sold-time.png" class="i-i-icon"></image>
          <view class="fs-28 fw-b">
            {{ '开售' }}时间：
            <text class="ml-8">{{ goodsDetail['startsAt'] }}</text>
          </view>
        </view>
      </view>

      <!--      获得权益-->
      <view class="get-box px-4" v-if="[50].includes(isBlindBox)">
        <image src="@/static/img/can-get-icon.svg" class="title-img"></image>
        <view class="equity-box">
          <view v-for="(item,index) in getEquity" :key="index" class="fs-28 fw-500 equity-text">
            {{ item }}
          </view>
        </view>
      </view>

      <view class="desc-box mb-5 px-4 mt-110" v-if="detailImageList.length">
        <view class="desc-title flex jc-fs ai-c">
          <image src="@/static/img/works-icon.svg" class="title-img"></image>
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
import { goodsDetail,  } from '@/api/detail'
import HchPoster from '@/components/hch-poster/hch-poster'
import Qrcode from 'qrious';
import Login from '@/components/Login/Login'
import { collectionList, merchant } from '../../api/detail'

let url = window.location.href
export default {
  name: "collectionDetail",
  components: {
    modal, upload, imageView, HchPoster, Login
  },
  data() {
    return {
      isSpecial: true,
      id: '',
      isBlindBox: 10,  //10普通藏品    20空投藏品  30 打开盲盒  35 盲盒藏品
      blindBoxList: [],
      openBlindBox: false,
      merchant: '',
      tokenId: '',
      showBuy: true,
      orderId: '',
      isShow: true,
      isAuto: false,
      buyLoading: false,
      orderResultNum: 0,
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
          lineHeight: 16 //行高
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
          lineHeight: 13 //行高
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
      verifyModal: false,//核销弹窗
      stopCompose: false,//是否能够合成
      collectionState: '',//藏品状态   是否为生成中
      verifyDetail: {},
      verifyUrl: '',//核销弹窗
      goodsDetail: {},
      blindBoxDetail: {},
      getBlindBox: {},
      option: {},
      //已开盲盒概率
      openRate: ''
    }
  },
  async mounted() {
    await this.getOption()
    await this.init()

  },
  computed: {
    //作品介绍 list
    detailImageList() {
      return this.goodsDetail['nftArt~detailImageFiles'] ? this.goodsDetail['nftArt~detailImageFiles']?.split(',') : []
    },
    //获取权益 list
    getEquity() {
      return this.goodsDetail['rewardIntro'] ? this.goodsDetail['rewardIntro'].split('\n') : []
    }
  },
  methods: {
    async init() {
      let option = this.$Route.query //nftId 藏品id  id nft商品id
      this.isBlindBox = Number(option.blindBox || 10)
      if (option.show === true || option.show === 'true') this.showBuy = false
      if (option['id']) await this.getGoodsDetail(option)
      if (!this.$Route.query['tokenId']) await this.checkCollectionState()
    },
    async getGoodsDetail(option) {
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

        //设置页面title
        document.title = this.goodsDetail['nftArt~name']

        //获取藏品详情
        let merchantRes = await merchant({id: this.goodsDetail['nftArt~luMerchantId']})
        this.merchant = this.transformData(merchantRes.data.rows)[0]

        //设置分享参数
        if (this.isBlindBox !== 50) this.$set(this.posterData.price, 'text', this.goodsDetail['price'] || '')
        this.$set(this.posterData.title, 'text', this.goodsDetail['nftArt~name'] || '')
        this.$set(this.posterData.merchant, 'text', this.merchant.merchantName || '')

      } catch (e) {
      }
    },
    //睡眠函数
    sleepCheckStatus() {
      uni.$u.sleep(10000).then(() => {
        this.checkCollectionState()
      })
    },
    //查询藏品状态 是否为生成中
    async checkCollectionState() {
      let req = {
        "paging": {
          "pageNumber": 1,
          "pageSize": 10
        }
      }
      let res = await collectionList(req, this.$Route.query.nftId)
      this.collectionState = this.transformData(res.data.rows[0])?.state
      if (this.collectionState === 'Forging') {
        this.sleepCheckStatus()
      } else {
        this.tokenId = this.transformData(res.data.rows[0])?.tokenId
        uni.$u.toast('生成成功')
      }
    },
    //获取核销id  生成qrCode
    async getOption() {
      this.option = this.$Route.query
    },
    getMerchantAvatar(url) {
      this.$set(this.posterData.merchant, 'url', url || '')
    },
    //赋值分享链接
    copyContractAddress(address) {
      uni.setClipboardData({
        data: address,
        success: () => {
          uni.$u.toast('复制成功')
          this.canvasShow = false
          this.$emit('cancel', true)
        }, fail: (err) => {
        }
      });
    },
    async handleShowPoster() {
      await this.getQrCode()
      this.$refs.hchPoster.posterShow()
    },
    //获取分享qr code
    getQrCode() {
      let qr = new Qrcode({
        value: window.location.href,
        size: 90
      });
      this.posterData.codeImg.url = qr.toDataURL();
    },
    //预览
    previewImage(base64) {
      // 预览图片
      uni.previewImage({
        urls: [base64]
      })
    },
    onCancel() {
      this.showModal = false
    },
    getUrl(url) {
      this.$set(this.posterData.mainImg, 'url', url)
    }
  }
}
</script>

<style scoped lang="scss">
@import "detail.scss";
</style>
