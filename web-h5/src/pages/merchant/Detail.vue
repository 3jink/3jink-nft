<template>
  <view class="content pos-bot flex fd-c">
    <Login :is-show="isShow" @changeTemp="isShow=false" @isLogin="isLogined" :is-auto="isAuto" @isAuto="isAuto=true"/>
    <view class="flex-1 of-a ">
      <!--      u-popup-->
      <u-popup :show="showPopup" :round="10" mode="bottom" @close="showPopup = false" @open="showPopup = true">
        <view class="flex fd-c" :style="{'max-height': autoPopHeight*0.8+'px','min-height': autoPopHeight*0.3+'px'}">
          <view class="flex jc-sb">
            <view class="w-h-100"></view>
            <view class="fw-600 fs-44 mt-56 mb-52">{{ topRow.merchantName }}</view>
            <view class="w-h-100 flex jc-sb" @click="showPopup = false">
              <view></view>
              <image src="@/static/img/close-login-x.svg" class="w-h-32 mr-4 mt-4"></image>
            </view>
          </view>
          <view class="pop-scroll of-a flex-1">
            <view class="fs-26 px-4 fc-7f fw-500 lh-42" :key="index" v-for="(item,index) in topRow.intro">
              {{ item }}
            </view>
          </view>
        </view>
      </u-popup>

      <z-paging width="100%" show-loading-more-when-reload ref="artList" refresher-threshold="100rpx"
                v-model="artList" @query="queryList" :default-page-size="3" :fixed="false"
                height="100%" back-to-top-bottom="200rpx">
        <view slot="empty">
          <view class="flex fd-c ai-c">
            <img src="../../static/img/home-goods.svg" alt="" class="emptyImg">
            <text class="fs-28 fc-205">暂无藏品~</text>
          </view>
        </view>
        <view class="flex ai-c ml-4 mt-44">
          <view class="flex ai-c">
            <imageView :default-avatar="true" :img-url="topRow.avatar" class="pos-avatar" @getUrl="getTitleUrl"
                       mode="aspectFill"/>
            <view class="fw-600 fs-36 ml-2 lh-48">{{ topRow.merchantName }}</view>
          </view>
          <image src="../../static/img/ip-top-more.svg" class="ml-2 w-h-40" @click="showPopup = true"></image>
        </view>
        <swiper v-if="bannerList.length" class="scroll-view_H mt-44" :indicator-dots="true"
                autoplay :interval="2500" circular
                indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
          <swiper-item v-for="(item,index) in bannerList" :key="index">
            <view @click="bannerJump(item)">
              <image-view :img-url="item['imageFile']" alt="" class="wd ta-c mx-4"
                          mode="aspectFill"/>
            </view>
          </swiper-item>
        </swiper>
        <view class="flex ai-c jc-c mt-68 mx-60">
          <view class="flex fd-c ai-c mr-108" @click="barClick(1)">
            <image src="../../static/img/ip-blind-box.png" class="w-h-76"></image>
            <text class="fs-28 fw-600 mt-2">盲盒</text>
          </view>
          <view class="flex fd-c ai-c mr-108" @click="barClick(2)">
            <image src="../../static/img/ip-group.png" class="w-h-76"></image>
            <text class="fs-28 fw-600 mt-2">合成</text>
          </view>
          <view class="flex fd-c ai-c mr-108" @click="barClick(3)">
            <image src="../../static/img/ip-air-drop.png" class="w-h-76"></image>
            <text class="fs-28 fw-600 mt-2">空投</text>
          </view>
          <view class="flex fd-c ai-c pos-rel" @click="barClick(5)">
            <image src="../../static/img/ip-notice.png" class="w-h-76"></image>
            <text class="fs-28 fw-600 mt-2">公告</text>
          </view>
        </view>
        <view class="mt-92 ml-4 mb-66">
          <image src="../../static/img/ip-collection-icon.svg" class="w-h-226"></image>
        </view>
        <view class="mt-4 ml-4 mr-4 bx" v-for="(item,index) in artList" :key="index"
              @click="onNavigateToPage('goodsDetail',{id:item.id,blindBox:item['goodsType']})">
          <imageView :img-url="item['nftArt~mainImageFile']" class="h-w-670 br-auto" mode="aspectFill" isBg>
            <view v-if="item['remainSeconds'] > 24*60*60" class="count-down-box flex jc-fs ai-c">
              <img src="@/static/img/white-time.svg" alt="" class="white-time-img">
              <view class="fs-24 lh-24 fw-500">敬请期待
                <span class="mr-08 ml-08">{{getStartsTime(item['startsAt'])}}</span>开售
              </view>
            </view>
            <view v-else-if="item['remainSeconds'] > 0" class="count-down-box flex jc-fs ai-c">
              <img src="@/static/img/white-time.svg" alt="" class="white-time-img">
              <view class="fs-24 lh-24 fw-500 flex jc-fs ai-c">
                即将开售
                <u-count-down :time="item['remainSeconds'] * 1000" format="HH:mm:ss"
                              @finish="init"/>
              </view>
            </view>
          </imageView>
          <view class="flex ai-c jc-sb pt-36">
            <text class="pl-3 fs-36 fw-600 flex-1 mr-2 text-ellipsis-1 lh-36">{{ item['nftArt~name'] }}</text>
          </view>
          <view class="pb-32 mt-24 pl-3 flex ai-c jc-sb">
            <view class="p-total flex ai-c jc-c fs-24 fc-46 br-8">
              限量
              <text class="px-0-5"></text>
              {{ item['issueNum'] }}
              <text class="px-0-5"></text>
            </view>
            <view class=" flex ai-c mr-3">
              <text class="fs-36 ml-1 fw-600 lh-40">￥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </z-paging>
      <view class="abs-bot"
            @click="enterHome">
        <view class="num-box"/>
        <imageView v-if="userInfo.Avatar" class="avatar-box br-50" mode="aspectFill"
                   :img-url="userInfo.Avatar"/>
        <image v-else-if="isLogin" class="avatar-box br-50" mode="aspectFill" src="@/static/img/default-avatar.png"/>
        <image v-else class="avatar-box br-50" mode="aspectFill" src="@/static/img/merchant-logo.svg"/>
        <view v-if="isLogin&&haveRedDot" class="pos-dot"></view>
      </view>
    </view>
    <hch-poster
      ref="hchPoster"
      @cancel=""
      :posterData.sync="posterData"
      @previewImage="previewImage"
    />
  </view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import uniBadge from '@/components/uni-badge/components/uni-badge/uni-badge.vue'
import {airdropLatest, goodsList, merchant} from '@/api/detail'
import {tableRowFormat} from '@/util/util'
import ImageView from '@/components/imageView/ImageView'
import HchPoster from '@/components/hch-poster/hch-poster'
import Qrcode from 'qrious'
import Login from '@/components/Login/Login'
import {accountClaim,avatarRedPointFlag} from '../../api/login'
import {bannerList} from '../../api/banner'
import {getDefaultMerchant} from '../../api/detail'
import {isWxOpen} from '../../util/util'

export default {
  data() {
    return {
      merchantId: '',
      //轮播图列表
      bannerList: [],
      userInfo: '',
      isLogin: uni.getStorageSync('id-Token'),
      haveRedDot: false,
      showPopup: false,
      isShow: true,
      isAuto: false,
      topRow: {},
      artList: [],
      isHaveDropId: '0',
      //弹窗高度适配
      autoPopHeight: document.documentElement.clientHeight,
      posterData: {
        poster: {
          //根据屏幕大小自动生成海报背景大小
          url: '', //图片地址
          w: 375, //海报宽度
          h: 500, //海报高度
          x: 0, y: 0
        },
        logo: {
          //海报主商品图
          url: '../../static/img/merchant_logo.svg',
          w: 175, //宽度
          h: 44, //高度
          x: 30, //margin-top
          y: 420 //圆角半径
        },
        mainImg: {
          //海报主商品图
          url: '',
          w: 355, //宽度
          h: 160,
          x: 10,
          y: 330
        },
        title: {
          //商品标题
          url: '',
          x: 30,
          y: 350,
          text: '', //文本
          fontSize: 22, //字体大小
          color: '#000', //颜色
          lineHeight: 37, //行高
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
    }
  },
  async onLoad() {
    let url = location.href.split('qrresult=')[1]
    url = decodeURIComponent(url)
    if (location.href.includes('qrresult=')) {
      location.href = url
    }

    let option = this.$Route.query
    //test merchantId  1496697173654376558
    //prod merchantId  1552185010528718848
    this.merchantId = option?.merchantId
  },
  async onShow() {
    await this.init();
  },
  components: {
    uniNavBar, uniBadge, ImageView, HchPoster, Login
  },
  methods: {
    getStartsTime(time){
      let t = new Date(time.replace(/-/g, '/'))
      let month = (t.getMonth()+1) + '.'
      let day = t.getDate().toString() + '         '
      let hour = t.getHours().toString() + ':'
      let minute = t.getMinutes().toString()
      return month + day + hour + minute
    },
    async getMerchant() {
      let res = await getDefaultMerchant()
      this.merchantId = res.data['Nft10DefaultMerchantID']
      if (this.merchantId) await this.init(true)
    },
    getTitleUrl(url) {
      this.$set(this.posterData.title, 'url', url)
    },
    async init(temp=false) {
      if (this.merchantId) {
        let req = {
          id: this.merchantId
        }
        let res = await merchant(req)
        // let res1=await goodsList(req)
        const topRows = tableRowFormat(res).data.list[0];
        this.topRow = topRows
        if (this.topRow['isEnabled'] === '0') this.$Router.replace({name: 'notFound'})
        this.topRow.intro = topRows.intro.split('\\n')
        this.topRow.introStr = topRows.intro.toString()

        //获取用户头像
        this.userInfo = uni.getStorageSync('user-Info')

        //获取是否有藏品
        const dropRes = await airdropLatest(this.merchantId);
        this.isHaveDropId = dropRes.data.id
        this.$set(this.posterData.title, 'text', this.topRow['merchantName'] || '')


        if(temp) this.$refs.artList.refresh()
        //设置页面title
        document.title = this.topRow.merchantName

        //查询用户是否有红点
        if (uni.getStorageSync('id-Token')) {
          const dotTemp = uni.getStorageSync('serverpush-avatarredpointflag')
          if(!dotTemp){
            const redRes = await accountClaim();
            this.haveRedDot = redRes.data['AvatarRedPointFlag']['claimValue'] === '1';
          }else{
            this.haveRedDot = dotTemp === '1';
          }
        }
        //获取轮播图列表
        try {
          const res = await bannerList({
            "merchantId": this.merchantId,
            "areaType": "home"
          })
          this.bannerList = res.data
        } catch (e) {
        }
      } else {
        await this.getMerchant()
      }
    },
    async queryList(page, num) {
      if (this.merchantId) {
        let reqData = {
          id: this.merchantId,
          paging: {
            pageNumber: page,
            pageSize: num
          },
          sorting: {
            "columnNames": [
              "createdAt"
            ],
            "direction": "desc"
          }
        }
        let res1 = await goodsList(reqData)
        let artList = this.transformData(res1.data.rows)
        this.$refs.artList.complete(artList)
        // await this.init()
      } else {
        this.$refs.artList.complete(false)
      }
    },
    async handleShowPoster() {
      await this.getQrCode()
      this.$refs.hchPoster.posterShow()
      this.deliveryFlag = false
    },
    getQrCode() {
      let qr = new Qrcode({
        value: window.location.href
      });
      this.posterData.codeImg.url = qr.toDataURL();
    },
    previewImage(base64) {
      // 预览图片
      uni.previewImage({
        urls: [base64]
      })
    },
    getUrl(url) {
      this.posterData.poster.url = url
    },
    isLogined() {
      this.userInfo = uni.getStorageSync('user-Info')
    },
    async enterHome() {
      //消除红点
      if(this.isLogin) await avatarRedPointFlag();
      this.onNavigateToPage('home', {
        'merchantId': this.merchantId
      })
      uni.setStorageSync('ip-Name',this.topRow.merchantName)
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
    },
    async barClick() {
      uni.$u.toast('功能暂未开通！')
    }
  }
}
</script>

<style lang="scss">
@import "static/css/variable";

.content {
  height: 100%;
}

.w-d {
  height: 920rpx;
}

.share-view {
  position: absolute;
  right: 30rpx;
  //background: rgba(235, 240, 240, 1);
  //border-radius: 50%;
}

.w-h-80 {
  width: 80rpx;
  height: 80rpx;
  background: rgba(235, 240, 240, 0.1);
  border-radius: 50%;
}

/* .img-title{
top:200rpx
} */
.pos-rel {
  position: relative;

}

.pos-abs {
  position: absolute;
  bottom: -100rpx;
  left: 287rpx;

}

.pos-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
}

.z-index-1000 {
  z-index: 1000;
  background: white
}

.fc-46 {
  background: #F5F5F5;
  color: #7F7F7F;
  font-weight: bold;
}

.br-w {
  border: 3px solid white;
  border-radius: 100%;
}

.bg {
  height: 690rpx;
}

.fc-b {
  color: rgba(0, 0, 0, 1);
}

.fc-w {
  color: white
}

.wd {
  width: 670rpx;
  display: inline-block;
  height: 220rpx !important;
  border-radius: 20rpx;
  overflow: hidden;
}

.fs-80 {
  font-size: 80rpx;
}

.fs-38 {
  font-size: 38rpx;
}

.fs-44 {
  font-size: 44rpx;
}

.br-8 {
  border-radius: 8rpx;
}

.mb-29 {
  margin-bottom: 29rpx;
}

.mb-8 {
  margin-bottom: 8rpx;
}

.mt-115 {
  margin-top: 115rpx;
}

.fs-54 {
  font-size: 54rpx;
}

.mt-27 {
  margin-top: 27rpx;
}

.title-auth {
  width: 64rpx;
  height: 64rpx;
  color: #fff;
  background-image: url("@/static/img/auth.svg");
  background-size: cover;
}

.content-1 {
  color: rgba(93, 93, 91, 1);
  word-wrap: break-word;
  font-size: 26rpx;
  line-height: 46rpx;
  text-align: center;
}


.word-3 {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /*控制行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fs-27 {
  font-size: 27rpx;
  line-height: 40rpx;
}

[v-cloak] {
  display: none;
}

//.mb-60 {
//  border-bottom: 2rpx solid rgba(207, 219, 213, 1);
//}

.pb-6 {
  padding-bottom: 60rpx;
}

.pb-7 {
  padding-bottom: 70rpx;
}

.mt-6 {
  margin-top: 60rpx;
}

.mt-8 {
  margin-top: 80rpx;
}


.mt-14 {
  margin-top: 14rpx;
}

.px-90 {
  padding: 0 90rpx;
}

.mt-51 {
  margin-top: 51rpx;
}

.m-46 {
  margin: 51rpx 46rpx;
}

.h-w-670 {
  height: 670rpx;
}

.fs-40 {
  font-size: 40rpx
}


.fs-42 {
  font-size: 42rpx
}

.mt-0-5 {
  margin-top: 5rpx;
}

.fc-small {
  color: rgba(93, 93, 91, 1)
}

.bl {
  border-left: 1.92px solid rgba(207, 219, 213, 1);
  padding-left: 24rpx;
}

.w-160 {
  width: 160rpx;
}

.p-total {
  padding: 4rpx 12rpx;
  height: 40rpx;
}

.ww {
  word-break: break-all;
}

.bx {
  border-radius: 20rpx;
  width: 670rpx;
  box-shadow: 0 4rpx 36rpx rgba(0, 0, 0, 0.05);
}

.mt-150 {
  margin-top: 150rpx;
}

.pos-bot {
  position: relative;
}

.abs-bot {
  position: fixed;
  bottom: 40rpx;
  right: 24rpx;
  z-index: 10;
}

.pb-150 {
  padding-bottom: 150rpx;
}

.avatar-box {
  width: 110rpx;
  height: 110rpx;
  box-shadow: 0 16rpx 28rpx rgba(39, 50, 43, 0.18);
}

.num-box {
  height: 20rpx;
  width: 20rpx;
  line-height: 20rpx;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  padding: 0 10rpx;
  //background: #F95151;
  color: #ffffff;
}

.pos-dot {
  position: absolute;
  top: 8rpx;
  right: 0rpx;
  background: #F95151;
  width: 26rpx;
  height: 26rpx;
  border-radius: 50%;
  border: 4rpx solid white;
}
.pos-dot-notice{
  position: absolute;
  top: -8rpx;
  right: -10rpx;
  background: #F95151;
  width: 22rpx;
  height: 22rpx;
  border-radius: 50%;
}

.my-avatar {
  position: absolute;
  right: 0;
  background: rgba(235, 240, 240, 1);
  border-radius: 50%
}

.my-avatar-image {
  width: 33rpx;
  height: 33rpx
}

.mt-24 {
  margin-top: 24rpx;
}

.emptyImg {
  width: 260rpx;
  height: 260rpx;
}

.fc-205 {
  color: rgba(205, 205, 205, 1)
}

.w-h-40 {
  width: 40rpx;
  height: 40rpx;
}

.w-h-32 {
  width: 32rpx;
  height: 32rpx;
}

.w-h-100 {
  width: 100rpx;
  height: 100rpx;
}

.ml-64 {
  margin-left: 64rpx;
}

.mt-44 {
  margin-top: 44rpx;
}

.w-h-76 {
  width: 76rpx;
  height: 76rpx;
}

.mt-68 {
  margin-top: 68rpx;
}

.mx-60 {
  margin-left: 60rpx;
  margin-right: 60rpx;
}

.mr-108 {
  margin-right: 108rpx;
}

.ml-6 {
  margin-left: 4rpx;
}

.mt-92 {
  margin-top: 92rpx;
}

.w-h-226 {
  width: 226rpx;
  height: 50rpx;
}

.title-icon {
  margin-left: 26rpx;
  height: 48rpx;
  line-height: 48rpx;
}

.mb-66 {
  margin-bottom: 66rpx;
}

.pb-32 {
  padding-bottom: 32rpx;
}

.br-auto {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

.mt-56 {
  margin-top: 56rpx;
}

.mb-52 {
  margin-bottom: 52rpx;
}

.fc-7f {
  color: #7F7F7F;
}

.lh-42 {
  line-height: 42rpx;
}

.pop-scroll {
  margin-bottom: 50rpx;
}

.scroll-view_H {
  height: 220rpx !important;
  white-space: nowrap;
}

.lh-48 {
  height: 48rpx;
  line-height: 48rpx;
}

.pos-abs-blind {
  position: absolute;
  width: 150rpx;
  height: 56rpx;
  top: 30rpx;
  left: 30rpx;
}

.pt-36 {
  padding-top: 36rpx;
}

.lh-36 {
  height: 36rpx;
  line-height: 36rpx;
}

.lh-40 {
  height: 40rpx;
  line-height: 40rpx;
}

::v-deep .uni-swiper-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 12rpx !important;
}

::v-deep .uni-swiper-dots-horizontal {
  bottom: 20rpx !important;
}
.notice-view{
  margin: 40rpx 40rpx 44rpx 40rpx;
}

.count-down-box {
  position: absolute;
  height: 50rpx;
  padding: 0 16rpx;
  bottom: 30rpx;
  color: #FFFFFF;

  left: 30rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50rpx;
  .white-time-img{
    width: 26rpx;
    height: 26rpx;
    margin-right: 12rpx;
  }
  ::v-deep .u-count-down__text{
    color: #fff;
    font-weight: bold;
    font-size: 24rpx;
    margin-left: 8rpx;
  }
}
</style>
