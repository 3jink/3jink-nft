<template>
  <view class="content flex fd-c">
    <login :is-show="showLogin" @changeTemp="changeTemp" @isLogin="isLogined" :title="title"/>
    <view class="flex-1 of-a pb-130">
      <z-paging width="100%" show-loading-more-when-reload
                ref="mine"
                v-model="firstList" @query="queryList" :default-page-size="5"
                :fixed="false" back-to-top-bottom="200rpx"
                height="100%">
        <view slot="empty">
          <view class="flex fd-c ai-c h-autoss">
            <img :src="emptyViewImg" alt="" class="emptyImg">
            <text class="fs-28 fc-205">{{ emptyViewText }}</text>
            <u-button v-if="emptyViewText==='暂无藏品~'"
                      :customStyle="{'width': '320rpx','height': '96rpx','background': '#7948F7','border-radius':'20rpx','color':'#fff',
              'font-size':'34rpx','margin':'28rpx 0','font-weight': 600}"
                      @click="onNavigateToPage('merchantDetail',{merchantId})">去购买
            </u-button>
          </view>
        </view>
        <view class="bx-top">
          <view class="bg bg-out">
            <!--          个人设置-->
            <view class="my-set flex ai-c jc-c" @click="selfSet">
              <image mode="aspectFill" src="@/static/img/my-set.svg" class="img-width"/>
            </view>
            <!--        头像-->
            <imageView v-if="mineInfo.Avatar" class="mt-202" mode="aspectFill" :img-url="mineInfo.Avatar"/>
            <image v-else-if="isLogin" class="mt-202" mode="aspectFill" src="@/static/img/default-avatar.png"/>
            <image v-else class="mt-202" mode="aspectFill" src="@/static/img/merchant-logo.svg"
                   @click="showLogin=true"/>
            <view class="bg">
            </view>
          </view>
          <view class="flex ai-c jc-c fd-c mb-80 tran-top" @click="loginOrRegister">
            <text
              :class="isLogin?'fs-48 fw-b ta-c px-4 lh-48 text-ellipsis-1 w-750':'fs-48 fw-b login-color ta-c px-4 lh-48 text-ellipsis-1 w-750'">{{
                mineInfo.NickName ||
                '登录/注册'
              }}
            </text>
            <text v-if="isLogin" class="fs-28 mt-34 fc-7f px-80 ta-c fw-b word-1 lh-28">{{ mineInfo.Remark ||
            '还没有个性签名哦~' }}
            </text>
          </view>
        </view>
        <view class="flex ai-c jc-c mt-88">
          <text :class="tabs?'tab-choose mr-4':'tab-no-choose mr-4'" class="fw-b fs-32" @click="tabChange(1)">我的藏品
          </text>
          <text :class="!tabs?'tab-choose':'tab-no-choose'" class="fw-b fs-32" @click="tabChange(2)">我的订单</text>
        </view>
        <view v-if="tabs" :class="isLogin&&firstList.length?'mt-80':''">
          <view class="mb-4" v-for="item in firstList" :key="item.id"
                @click="onNavigateToPage('collectionDetail',{id:item['nftGoods~id'],nftId:item.id,blindBox:item['nftGoods~goodsType'],tokenId:item['tokenId'],composing:item['state'] === 'Forging'?'xxx':''})">
            <view class="mx-4 bx">
              <image-view isBg :img-url="item['nftArt~mainImageFile']" mode="aspectFill" class="h-goods-img">
              </image-view>
<!--              <image src="../../static/img/blind-box-logo.svg" class="pos-abs"></image>-->
              <view class="pt-32 pb-32 border-btm">
                <view class="flex ai-c jc-sb">
                  <text class="pl-3 fw-600 fs-36 lh-36 text-ellipsis-1">{{ item['nftArt~name'] }}</text>
                </view>
                <view class="flex ai-c jc-sb px-3 mt-24">
<!--                  <text class="fs-24 fc-93">{{ item['paidAt'] }}</text>-->
                  <text class="fs-24 fc-7f lh-24 fw-b">{{ item['createdAt'] }}</text>
                  <view class="fc-153 fw-b" v-if="item['nftGoods~goodsType']!=='30'">{{ states[item['state']]
                    }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="!tabs" :class="isLogin&&firstList.length?'mt-100':''">
          <view>
            <view class="px-4">
              <view class="flex fd-c mb-88" v-for="item in firstList" :key="item.id"
                    @click="onNavigateToPage('orderDetail',{orderId:item.id,showBuy:false})">
                <view class="flex jc-sb">
                  <view class="flex ai-c jc-c">
                    <image-view :img-url="item['nftArt~mainImageFile']" class="main-style"/>
                    <view class="flex fd-c pl-3 jc-c">
                      <text class="fs-36 fw-600 lh-36 w-440 text-ellipsis-1">{{ item['nftArt~name'] }}</text>
                      <text
                        :class="item.state==='待支付'?'mb-44 fs-24 fc-153 mt-22 lh-24 fw-b':'mb-74 fs-24 fc-153 mt-22 lh-24 fw-b'">{{ item['createdAt'] }}</text>
                      <view class="flex ai-c jc-sb">
                        <view class="fs-32 fw-600 lh-32">￥{{ item['amount'] }}</view>
                        <view class="fc-153 fs-24 lh-24 fw-600 fc-7f" v-if="item.state!=='待支付'">
                          {{ item.state }}
                        </view>
                        <view class="flex ai-c jc-sb" v-if="item.state==='待支付'">
                          <view class="tab-col flex ai-c jc-c fw-b">
                            <u-count-down :time="getPaymentTimeoutRelativeTime(item)*60 * 1000" format="mm:ss"
                                          @finish="mockCancelOrder(item)"/>
                          </view>
                          <u-button
                            :customStyle="{'margin':'0','width': '136rpx','height': '68rpx','background': '#7948F7','border-radius':'20rpx',
                            'color':'#fff','font-size':'28rpx','font-weight': 600,'white-space':'nowrap'}">
                            去支付
                          </u-button>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
    <view class="pos-fix" @click="onNavigateToPage('index')">
      <img src="../../static/img/my-watch-more.svg" class="w-h-img"/>
    </view>
  </view>
</template>

<script>
import {getRelativeTime} from '@/util/util'
import uniBadge from '@/components/uni-badge/components/uni-badge/uni-badge.vue'
import login from '@/components/Login/Login'
import ImageView from '@/components/imageView/ImageView'
import {collectionList, orderList} from '@/api/detail'

export default {
  data() {
    return {
      isSpecial:true,
      title: '登录/注册',
      isLogin: false,
      states: {'Forging': '生成中', 'ForgeFailed': '铸造失败', 'Collected': '', 'Transfered': '已转出', 'Destroyed': '已销毁'},
      merchantId: '',
      merchantName: '',
      showLogin: false,
      tabs: true,
      mineInfo: {},
      firstList: [],
      secondList: [],
      totalCollection: 0,
      countDown: [0, 0]
    }
  },
  components: {
    uniBadge, ImageView, login
  },
  async onLoad() {
    let option = this.$Route.query
    this.merchantId = option['merchantId']
    this.merchantName = option['merchantName']
  },
  async onShow() {
    if(!uni.getStorageSync('wx-Login')) this.init()
    this.$refs.mine?.refresh()
    //设置页面title
    document.title = uni.getStorageSync('ip-Name')
  },

  methods: {
    init(){
      //如果用户登录了，取出用户信息
      const userInfo = uni.getStorageSync('user-Info')
      this.mineInfo = userInfo || {}
      if (userInfo) this.isLogin = true
      // await this.getData();
    },
    //个人设置相关
    selfSet() {
      if (this.isLogin) {
        this.onNavigateToPage('setting')
      } else {
        this.title = '请先登录'
        this.showLogin = true
      }
    },
    loginOrRegister() {
      if (!this.isLogin) {
        this.showLogin = true
      }
    },
    async isLogined() {
      this.isLogin = true
      const userInfo = uni.getStorageSync('user-Info')
      this.mineInfo = userInfo || {}
      // await this.getData()
      this.$refs?.mine?.reload()
    },
    mockCancelOrder(item) {
      item.state = '已取消'
    },
    async queryList(page, num) {
      if (this.isLogin) {
        let req = {
          "paging": {
            "pageNumber": page,
            "pageSize": num
          },
          sorting: {
            "columnNames": [
              "updatedAt"
            ],
            "direction": "desc"
          }
        }
        if (this.tabs) {
          req.searchItems = [
            {
              "columnName": "merchant~id",
              "value": this.merchantId
            }
          ]
          try {
            const res = await collectionList(req);
            this.totalCollection = res.data.paging?.totalCount || 0
            let list = this.transformData(res.data.rows)
            this.$refs.mine?.complete(list)
          } catch (e) {
            this.$refs.mine?.complete(false)
          }
        } else {
          req.searchItems = [
            {
              "columnName": "merchant~id",
              "dataType": "",
              "value": this.merchantId,
              "visible": true
            }
          ]
          req.sorting = {
            "columnNames": [
              "createdAt"
            ],
            "direction": "desc"
          }
          try {
            const res = await orderList(req);
            let list = this.transformData(res.data.rows)
            this.$refs.mine.complete(list)
          } catch (e) {
            console.log(e, 'e')
            this.$refs.mine?.complete(false)
          }
        }
      } else {
        this.$refs.mine.complete([])
      }
    },
    getPaymentTimeoutRelativeTime(orderRow) {
      const createdAt = new Date(orderRow.createdAt.replace(/-/g, '/'));
      const expireAt = createdAt.setMinutes(createdAt.getMinutes() + 15);
      const timerArr = getRelativeTime(new Date(), expireAt).split(':');
      return ((Number(timerArr[0] * 60) + Number(timerArr[1])) / 60)
    },
    tabChange(temp) {
      this.tabs = temp === 1
      this.$refs.mine?.refresh()
    },
    changeTemp() {
      this.showLogin = false
    }
  },
  computed: {
    emptyViewImg() {
      if (this.isLogin && this.tabs) {
        return '../../static/img/home-goods.svg'
      } else if (this.isLogin && !this.tabs) {
        return '../../static/img/home-order.svg'
      } else if (!this.isLogin && this.tabs) {
        return '../../static/img/empty-home-goods.svg'
      } else {
        return '../../static/img/empty-home-order.svg'
      }
    },
    emptyViewText() {
      if (this.isLogin && this.tabs) {
        return '暂无藏品~'
      } else if (this.isLogin && !this.tabs) {
        return '暂无订单~'
      } else if (!this.isLogin && this.tabs) {
        return '登录后查看'
      } else {
        return '登录后查看'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/variable";
.content {
  height: 100%;
  position: relative;
}

.pb-130 {
  //padding-bottom: 128rpx;
}

.bg {
  height: 406rpx;
  width: 100%;
  object-fit: cover;
  background: repeating-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 255) 100%);
  position: absolute;
  top: 0
}

.bg-out {
  position: relative;
}

.my-set {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  z-index: 10;
  width: 164rpx;
  height: 72rpx;
  border-radius: 40rpx;
  background: #FFFFFF;
}

.fc-w {
  color: white;
}

::v-deep .u-count-down__text {
  font-weight: bold;
  font-size: 28rpx;
  color: #7948F7;
  margin-right: 20rpx;
}

.mt-202 {
  margin-top: 162rpx;
  position: absolute;
  top: 0;
  left: 286rpx;
  z-index: 1;
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
}

.mt-34 {
  margin-top: 34rpx;
}

.fc-93 {
  color: rgb(93, 93, 91);
}

.fc-153 {
  color: #7F7F7F;
}

.px-80 {
  padding: 0 80rpx;
}

.tran-top {
  transform: translateY(-2rpx);
  background: white;
}

.word-4 {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  /*控制行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.word-1 {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /*控制行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mb-80 {
  margin-bottom: 88rpx;
}

.line {
  margin: 0 50rpx 46rpx 46rpx;
  background: rgb(207, 219, 213);
  height: 2rpx;
}

.ml-46 {
  margin-left: 46rpx;
  font-size: 38rpx;
  margin-right: 10rpx;
}

.emptyImg {
  width: 260rpx;
  height: 260rpx;
}

.fc-205 {
  color: rgba(205, 205, 205, 1)
}

.ml-46-bto {
  margin-left: 46rpx;
  font-size: 38rpx;
}

.bg-cangpin {
  background: rgba(238, 238, 238, 1);
  font-size: 32rpx;
  border-radius: 18rpx;
  height: 38rpx;
  min-width: 39rpx;
}

.ml-81 {
  margin-left: 81rpx;
  font-size: 38rpx;
}

.ml-0-1 {
  margin-left: 2rpx;
}

.tab-col {
  color: #7948F7
}


.mt-36 {
  margin-top: 36rpx;
}

.w-h-autos {
  width: 200rpx;
  height: 39rpx;
}

.line-col {
  background: rgb(40, 174, 95);
}

.mt-100 {
  margin-top: 100rpx;
}

.mb-88 {
  margin-bottom: 88rpx;
}

.px-46 {
  padding: 0 46rpx;
}

.h-goods-img {
  height: 670rpx;
  width: 670rpx;
  display: block;
  border-top-right-radius: 20rpx;
  border-top-left-radius: 20rpx;
}

.w-160 {
  width: 160rpx;
}

.mt--1 {
  margin-top: -2rpx;
}

.bx {
  border-radius: 20rpx;
  box-shadow: 0 4rpx 36rpx rgba(0, 0, 0, 0.05);
}

.pos-fix {
  position: fixed;
  bottom: 40rpx;
  left: 40rpx;
  width: 670rpx;
  height: 124rpx;
  z-index: 10;
  box-shadow: 0 4rpx 30rpx 0 rgba(0,0,0,0.06);
  border-radius: 20rpx;
}
.w-h-img{
  width: 670rpx;
  height: 124rpx;
}

.img-width {
  width: 164rpx;
  height: 72rpx;
}

.ml-25 {
  margin-left: 25rpx;
}
.br-order {
  border-bottom: 2rpx solid rgb(238, 238, 238);
}

.btm-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
}

.btm-logo {
  width: 260rpx;
  height: 66rpx;
}

.login-color {
  color: #7948F7;
}

.fs-60 {
  font-size: 60rpx;
}

.main-style {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
}

::v-deep .u-button--square {
  border: 0 !important;
}

.mt-0-6 {
  margin-top: 6rpx;
}

.py-17 {
  padding-top: 34rpx;
  padding-bottom: 34rpx;
}

.pt-32 {
  padding-top: 32rpx;
}

.mt-22 {
  margin-top: 22rpx;
}

.mb-74 {
  margin-bottom: 74rpx;
}

.mb-44 {
  margin-bottom: 44rpx;
}
.mt-0-7 {
  margin-bottom: 4rpx;
}

.px-12 {
  padding-left: 12rpx;
  padding-right: 12rpx;
}
.bx-top{
  height: 604rpx;
  box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.05);
  border-bottom-right-radius: 20rpx;
  border-bottom-left-radius: 20rpx;
}
.mt-88{
  margin-top: 88rpx;
}
.tab-choose{
  background: #101010;
  padding: 20rpx 40rpx;
  border-radius: 102rpx;
  color: white;
}
.tab-no-choose{
  background: #F5F5F5;
  padding: 20rpx 40rpx;
  border-radius: 102rpx;
  color: #7F7F7F;
}
.mt-80{
  margin-top: 80rpx;
}
.pb-32{
  padding-bottom: 32rpx;
}
.mt-24{
  margin-top: 24rpx;
}
.fc-7f{
  color: #7F7F7F;
}
.border-btm{
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
}
.lh-36{
  height: 36rpx;
  line-height: 36rpx;
}
.lh-24{
  height: 24rpx;
  line-height: 24rpx;
}
.lh-32{
  height: 32rpx;
  line-height: 32rpx;
}
.w-440{
  width: 440rpx;
}
.pos-abs-blind{
  position: absolute;
  width: 150rpx;
  height: 56rpx;
  top: 30rpx;
  left: 30rpx;
}
::v-deep .zp-l-container{
  margin-bottom: 120rpx;
}
.h-autoss{
  margin-bottom: 200rpx;
  margin-top: 104rpx;
}
.lh-48{
  line-height: 48rpx;
  height: 48rpx;
}
.lh-28{
  line-height: 28rpx;
  height: 28rpx;
}
.w-750{
  width: 750rpx;
}
</style>
