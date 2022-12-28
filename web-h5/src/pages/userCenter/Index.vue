<template>
  <view class="content flex fd-c">
    <login :is-show="showLogin" @changeTemp="changeTemp" @isLogin="isLogined" :is-auto="isAuto" @isAuto="isAuto=true"
           :title="loginTitle"/>
    <!--    所有版权方弹窗-->
    <u-popup :show="showPop" @close="closePop" @open="openPop">
      <view class="mx-4 flex fd-c" :style="{'max-height': autoPopHeight*0.8+'px','min-height': autoPopHeight*0.3+'px'}">
        <view class="flex ai-c jc-sb mb-56">
          <view class="w-h-36"></view>
          <view class="fw-b fs-44 mt-56">选择版权方</view>
          <image src="../../static/img/close-login-x.svg" class="w-h-36" @click="showPop = false"></image>
        </view>
        <view class="of-a flex-1">
          <view class="flex ai-c jc-sb mb-70" @click="chooseMerchant()">
            <view class="flex ai-c">
              <image src="../../static/img/all-merchant.svg" class="w-h-74"></image>
              <view class="fw-b fs-32 ml-3">全部版权方</view>
            </view>
            <image src="../../static/img/user-center-choose.svg" class="w-h-48" v-if="chooseTitle==='全部版权方'"></image>
          </view>
          <view class="flex ai-c jc-sb mb-70" v-for="(item,index) in merchantList" :key="index"
                @click="chooseMerchant(item)">
            <view class="flex ai-c">
              <image-view :img-url="item['avatar']" class="w-h-74" mode="aspectFill"></image-view>
              <view class="fw-b fs-32 ml-3">{{ item['merchantName'] }}</view>
            </view>
            <image src="../../static/img/user-center-choose.svg" class="w-h-48" v-if="item['checked']"></image>
          </view>
        </view>
      </view>
    </u-popup>
    <view class="flex-1 of-a flex fd-c" :style="{'max-height': (autoPopHeight-50)+'px'}">
      <view class="h-100 ">
        <z-paging v-show="tabsPage"
                  width="100%"
                  show-loading-more-when-reload
                  ref="mine" v-model="mineList" @query="queryList" :default-page-size="5"
                  :fixed="false" :loading-more-custom-style="{'marginBottom':'100rpx'}"
        >
          <view slot="empty">
            <view :class="isLogin?'flex fd-c ai-c':'flex fd-c ai-c mt-104'">
              <img :src="emptyViewImg" alt="" class="emptyImg">
              <text class="fs-28 fc-205">{{ emptyViewText }}</text>
            </view>
          </view>
          <view class="bg bg-out mb-88">
            <view class="top-center" v-if="isLogin">
              <view class="flex flex-1 jc-sb ml-16 h-108">
                <view class="flex flex-1 jc-fs ai-c" @click="onNavigateToPage('setting')">
                  <imageView v-if="mineInfo.Avatar" class="top-avatar" mode="aspectFill" :img-url="mineInfo.Avatar"/>
                  <image v-else-if="isLogin" class="top-avatar" mode="aspectFill"
                         src="@/static/img/default-avatar.png"/>
                  <image v-else class="top-avatar" mode="aspectFill" src="@/static/img/merchant-logo.svg"
                         @click="showLogin=true"/>
                  <view class="flex flex-1 fd-c ml-2">
                    <view class="fs-32 fw-600 word-1">{{ mineInfo.NickName }}</view>
                    <!--                    <view class="fc-93 fs-24 mt-1 word-2">{{ mineInfo.Remark || ' 还没有设置个性签名 ~' }}</view>-->
                  </view>
                  <image src="../../static/img/arrow-right-center.svg" class="arrow-right"></image>
                </view>
              </view>
              <!--              全部藏品-->
              <view class="flex ai-c jc-c fs-40 fw-b all-title">全部藏品</view>
              <view class="all-num flex jc-c fw-b ml-44">{{ totalCollection }}
                <text class="all-num-ge fs-32">个</text>
              </view>
              <!--              <view class="flex jc-c all-price fs-28 fw-b">￥2888.00</view>-->
            </view>
            <view class="top-center" v-else @click="showLogin = true">
              <view class="flex flex-1 jc-sb ml-16 h-108">
                <view class="flex flex-1 jc-fs ai-c">
                  <image class="top-avatar" mode="aspectFill" src="@/static/img/un-login.png"/>
                  <view class="flex flex-1 fd-c ml-2">
                    <view class="fs-32 fw-600 word-1 fc-794">登录/注册</view>
                  </view>
                  <image src="../../static/img/arrow-right-center.svg" class="arrow-right"></image>
                </view>
              </view>
              <!--              全部藏品-->
              <view class="flex ai-c jc-c fs-40 fw-b all-title">全部藏品</view>
              <view class="all-num flex jc-c fw-400 w-92">
                <image src="../../static/img/un-login--.png" class="--txt"></image>
              </view>
              <view class="flex jc-c all-price fs-28 fc-cd">登录后查看</view>
            </view>
          </view>
          <view class="flex ai-c jc-c">
            <text :class="tabs?'tab-choose mr-4':'tab-no-choose mr-4'" class="fw-b fs-32" @click="tabChange(1)">我的藏品
            </text>
            <text :class="!tabs?'tab-choose':'tab-no-choose'" class="fw-b fs-32" @click="tabChange(2)">我的订单</text>
          </view>
          <view v-if="isLogin" :class="tabs?'flex ai-c mltb-44 mb-top-1':'flex ai-c mltb-44 mb-top-2'"
                @click="openMerchant">
            <view class="fs-28 fw-b">{{ chooseTitle }}</view>
            <image src="../../static/img/arrow-down.svg" class="flex ai-c w-h-18 ml-2"></image>
          </view>
          <view v-if="tabs" :class="isLogin?'mt-42':''">
            <view class="mb-42" v-for="item in mineList" :key="item.id"
                  @click="onNavigateToPage('collectionDetail',{id:item['nftGoods~id'],nftId:item.id,blindBox:item['nftGoods~goodsType'],tokenId:item['tokenId'],composing:item['state'] === 'Forging'?'xxx':''})">
              <view class="mx-4 bx">
                <!--              <image src="@/static/test.jpg" mode="aspectFill" class="h-580"></image>-->
                <image-view :img-url="item['nftArt~mainImageFile']" class="h-goods-img" isBg>
                </image-view>
                <view class=" pt-26">
                  <view class="flex ai-c jc-sb">
                    <text class="pl-3 fs-36 fw-600 lh-36 text-ellipsis-1 name-max-width">{{ item['nftArt~name']
                      }}</text>
                  </view>
                  <view class="flex px-3">
                    <text class="fs-24 fc-93">{{ item['paidAt'] }}</text>
                  </view>
                  <view class="flex ai-c jc-sb px-3  pb-34 pt-28">
                    <view class="flex ai-c">
                      <image-view mode="aspectFill" :img-url="item['merchant~avatar']" class="img-main"/>
                      <text class="ml-14 fc-101 fs-24 fw-b">{{ item['merchant~merchantName'] }}</text>
                    </view>
                    <view v-if="item['nftGoods~goodsType']!=='30'"
                          :class="states[item['state']]==='已取消'?'flex ai-c fc-f95 fw-b':'flex ai-c fc-153 fw-b'">{{
                        states[item['state']]
                      }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-else>
            <view :class="isLogin?'mb-42':''">
              <view class="px-4">
                <view @click="onNavigateToPage('orderDetail',{orderId:item.id})"
                      class="flex fd-c mt-3 mb-88" v-for="item in mineList" :key="item.id">
                  <view class="flex jc-sb">
                    <view class="flex ai-c jc-c">
                      <image-view :img-url="item['nftArt~mainImageFile']" class="main-style" mode="aspectFill"/>
                      <view class="flex fd-c pl-3 jc-c">
                        <text class="fs-36 fw-600 lh-36 w-440 text-ellipsis-1">{{ item['nftArt~name'] }}</text>
                        <text
                          :class="item.state==='待支付'?'mb-38 fs-24 fc-153 mt-22 lh-24 fw-b':'mb-74 fs-24 fc-153 mt-22 lh-24 fw-b'">
                          {{ item['createdAt'] }}
                        </text>
                        <view class="flex ai-c jc-sb">
                          <text class="fs-32 fw-600 lh-32">￥{{ item['amount'] }}</text>
                          <view
                            :class="item.state==='已取消'?'fc-f95 fs-24 lh-24 fw-600':'fc-153 fs-24 lh-24 fw-600'"
                            v-if="item.state!=='待支付'">
                            {{ item.state }}
                          </view>
                          <view class="flex ai-c jc-sb" v-if="item.state==='待支付'">
                            <view class="tab-col flex ai-c jc-c">
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
        <z-paging empty-view-text="暂无版权方~"
                  loading-more-no-more-text=""
                  v-show="!tabsPage"
                  width="100%"
                  show-loading-more-when-reload
                  ref="discoverList"
                  v-model="discoverList" @query="getMerchantList" :default-page-size="20000"
                  :fixed="false"
                  height="100%" :loading-more-custom-style="{'marginBottom':'100rpx'}"
                  back-to-top-bottom="140rpx"
                  @onRefresh="refresh"
        >
          <view slot="empty">
            <view class="flex fd-c ai-c">
              <img src="../../static/img/home-goods.svg" alt="" class="emptyImg">
              <text class="fs-28 fc-205">暂无版权方~</text>
            </view>
          </view>
          <swiper v-if="bannerList.length" class="scroll-view_H-1 mt-4 mb-88" :indicator-dots="true" autoplay
                  :interval="2500"
                  circular
                  indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
            <swiper-item v-for="(item,index) in bannerList" :key="index">
              <view @click="bannerJump(item)">
                <image-view :img-url="item['imageFile']" alt="" class="wd ta-c mx-4"
                            mode="aspectFill"/>
              </view>
            </swiper-item>
          </swiper>
          <view v-else class="mb-88"></view>
          <view class="flex ai-c jc-sb m-hot" @click="onNavigateToPage('hotList')">
            <view class="fs-40 fw-600 flex ai-c">热售藏品
              <image src="../../static/img/fire-logo.png" class="w-h-46"></image>
            </view>
            <view class="fs-28 fc-99 flex ai-c">
              <img src="@/static/img/arrow-right-black.svg" alt="" class="w-h-24 ml-2">
            </view>
          </view>
          <view>
            <swiper v-if="swiperList.length" class="swiper inset" @change="changeIndex" next-margin="60rpx"
                    previous-margin="20rpx">
              <swiper-item class="w-630" v-for="(item,index) in swiperList" :key="item.id"
                           @click="onNavigateToPage('goodsDetail',{id:item.id,blindBox:item['goodsType']})">
                <view :class="index===0?'w-630 box-s ml-2':'w-630 box-s ml-2'">
                  <imageView
                    :img-url="item['nftArt~mainImageFile']"
                    class="h-w-630" mode="aspectFill" isBg>
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
                                      @finish="$refs.discoverList.refresh()"/>
                      </view>
                    </view>
                  </imageView>
                  <view class="w-630 mt-34 flex ai-c jc-sb px-3">
                    <text class="fs-40 flex-1 text-ellipsis-1 fw-600 lh-40">{{ item['nftArt~name'] }}</text>
                  </view>
                  <view class="flex ai-c jc-sb px-3 pb-34 pt-26">
                    <view class="flex ai-c">
                      <image-view :default-avatar="true" :img-url="item['merchant~avatar']" class="w-h-36-c"
                                  mode="aspectFill"/>
                      <text class="ml-14 fc-101 fs-24 fw-b">{{ item['merchant~merchantName'] }}</text>
                      <text class="mx-1 fc-101 fw-b">·</text>
                      <text class="fc-101 fw-b fs-24">限量 {{ item['issueNum'] }}</text>
                    </view>
                    <view class="fs-36 fw-600 lh-36">￥{{ item['price'] }}</view>
                  </view>
                </view>
              </swiper-item>
            </swiper>
            <view v-else class="swiper flex ai-c jc-c">
              <view class="flex fd-c ai-c">
                <img src="../../static/img/home-goods.svg" alt="" class="emptyImg">
                <text class="fs-28 fc-205">暂无藏品~</text>
              </view>
            </view>
          </view>
          <view class="mb-80 pl-4 flex ai-c jc-sb">
            <view class="fs-40 fw-600">版权方</view>
          </view>
          <scroll-view class="scroll-view_H" scroll-x="true">
            <view class="scroll-view-item_H" v-for="(item,index) in getList" :key="index">
              <view class="flex ai-c mb-84 pos-rel ml-4"
                    @click="onNavigateToPage('merchantDetail',{merchantId:item[0].id},{dot:item[0]['id']})">
                <imageView :default-avatar="true"
                           :img-url="item[0]['avatar']"
                           mode="aspectFill" class="w-h-80"/>
                <view v-if="item[0]['isDot']" class="pos-dot"></view>
                <!--                <view>{{ item[0]['id'] }}</view>-->
                <view class="flex fd-c ml-26">
                  <view class="fw-b fs-32 lh-32">{{
                      item[0]['merchantName'].length >= 6 ? item[0]['merchantName'].slice(0, 4) + '...' :
                        item[0]['merchantName']
                    }}
                  </view>
                  <text class="fs-24 lh-24 fc-7f mt-2 fw-b">{{ item[0]['nftGoodsNum'] }} 件藏品</text>
                </view>
              </view>
              <view class="flex ai-c pos-rel ml-4" v-if="item[1]"
                    @click="onNavigateToPage('merchantDetail',{merchantId:item[1].id},{dot:item[1]['id']})">
                <imageView :default-avatar="true"
                           :img-url="item[1]['avatar']"
                           mode="aspectFill" class="w-h-80"/>
                <view v-if="item[1]['isDot']" class="pos-dot"></view>
                <!--                <view>{{ item[1]['id'] }}</view>-->
                <view class="flex fd-c ml-26">
                  <view class="fw-b fs-32 lh-32">{{
                      item[1]['merchantName'].length >= 6 ? item[1]['merchantName'].slice(0, 4) + '...' :
                        item[1]['merchantName']
                    }}
                  </view>
                  <text class="fs-24 lh-24 fc-7f mt-2 fw-b">{{ item[1]['nftGoodsNum'] }} 件藏品</text>
                </view>
              </view>
              <view class="flex ai-c" v-else>
                <view class="w-h-80"></view>
                <view class="flex fd-c ml-26">
                  <view class="fw-b fs-32 lh-32"></view>
                  <text class="fs-24 lh-24 fc-7f mt-2"></text>
                </view>
              </view>
            </view>
          </scroll-view>
          <!--            <view class="px-4 flex jc-sb ai-c mb-6" v-for="(item,index) in discoverList" :key="index"-->
          <!--                  @click="onNavigateToPage('merchantDetail',{merchantId:item.id})">-->
          <!--              &lt;!&ndash;                @click="onRedirectToPage('/pages/merchant/Detail',{merchantId:item.id})">&ndash;&gt;-->
          <!--              <view class="flex">-->
          <!--                <imageView :default-avatar="true"-->
          <!--                           :img-url="item['avatar']"-->
          <!--                           mode="aspectFill" class="w-h-110"/>-->
          <!--                <view class="flex fd-c pl-3 jc-c">-->
          <!--                  <text class="fs-32 fw-600">{{ item['merchantName'] }}</text>-->
          <!--                  <text class="fs-24 fc-93 mt-12">-->
          <!--                    <text class="number-right fs-24">{{-->
          <!--                        item['nftGoodsNum'] || 0-->
          <!--                      }}-->
          <!--                    </text>-->
          <!--                    件藏品-->
          <!--                  </text>-->
          <!--                </view>-->
          <!--              </view>-->
          <!--              <view class="fs-40 fc-93"><img src="@/static/img/arrow-right.svg" alt="" class="w-h-24"></view>-->
          <!--            </view>-->
        </z-paging>
      </view>

      <view class="pos-fix flex ai-c">
        <view class="flex-1 flex fd-c jc-c ai-c" @click="changeTabsPage(true,'藏品')">
          <image v-if="title==='藏品'" src="@/static/img/my-click.svg" class="w-img"/>
          <image v-else src="@/static/img/my.png" class="w-img"/>
          <text :class="title==='藏品'?'blue-col':'blue-col-no'" style="font-size: 20rpx;margin-top: 4rpx">藏品</text>
        </view>
        <view class="flex-1 flex  fd-c jc-c ai-c" @click="changeTabsPage(false,'发现')">
          <image v-if="title==='发现'" src="@/static/img/find-click.svg" class="w-img"/>
          <image v-else src="@/static/img/find.svg" class="w-img"/>
          <text :class="title==='发现'?'blue-col':'blue-col-no'" style="font-size: 20rpx;margin-top: 4rpx">发现</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getRelativeTime} from '@/util/util'
import login from '@/components/Login/Login'
import uniBadge from '@/components/uni-badge/components/uni-badge/uni-badge.vue'
import ImageView from '@/components/imageView/ImageView'
import {collectionList, getSwiperList, merchant, orderList} from '@/api/detail'
import {bannerList} from '../../api/banner'

export default {
  data() {
    return {
      //分享进入，只执行一次swiper列表
      temps:false,
      loginTitle: '登录/注册',
      states: {'Forging': '生成中', 'ForgeFailed': '铸造失败', 'Collected': '', 'Transfered': '已转出', 'Destroyed': '已销毁'},
      showLogin: false,
      tabsPage: true,
      //用于让tab只能点一次
      tabStop: 0,
      bannerList: [],
      mineList: [],
      title: '藏品',
      autoHeight: 0,
      tabs: true,
      mineInfo: {},
      firstList: [],
      secondList: [],
      swiperList: [],
      parseRefresh:false,
      swiperPram: {num: 1, size: 5, done: false},
      discoverList: [],
      isLogin: true,
      isAuto: false,
      mainInfo: {},
      totalCollection: 0,
      isShowSwiper: false,
      showPop: false,
      merchantList: [],
      chooseTitle: '全部版权方',
      chooseMerchantRow: null,
      //弹窗高度适配
      autoPopHeight: document.documentElement.clientHeight,
    }
  },
  components: {
    uniBadge, ImageView, login
  },
  async onShow() {
    if (!uni.getStorageSync('wx-Login')) await this.init()
    document.title = this.title
    this.$refs.mine?.refresh()
    //判断是否是微信分享进入，需要跳转到发现页
    if(this.$Route.query['type']) {
      this.changeTabsPage(false, '发现')
      this.parseRefresh=true
    }
  },
  async onLoad() {
    //获取所有版权方
    // await this.getMerchant()
  },
  onHide() {
    // //将默认开始页置左
    // this.tabs = true
    // this.title = '藏品'
    // this.tabsPage = true
  },
  methods: {
    async getMerchant() {
      let req = {
        paging: {
          "pageNumber": 1,
          "pageSize": 20000,
        },
        searchItems: [
          {
            "columnName": "is_enabled",
            "dataType": "",
            "value": "1",
            "visible": true
          }
        ],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      try {
        let res = await merchant(req)
        this.merchantList = this.transformData(res.data.rows)
        //重置版权方为选择所有
        this.chooseMerchant();
      } catch (e) {
        return
      }
    },
    mockCancelOrder(item) {
      item.state = '已取消'
    },
    getPaymentTimeoutRelativeTime(orderRow) {
      const createdAt = new Date(orderRow.createdAt.replace(/-/g, '/'));
      const expireAt = createdAt.setMinutes(createdAt.getMinutes() + 15);
      const timerArr = getRelativeTime(new Date(), expireAt).split(':');
      return ((Number(timerArr[0] * 60) + Number(timerArr[1])) / 60)
    },

    async init() {
      this.isLogin = uni.getStorageSync('id-Token')
      //获取当前屏幕高度
      this.autoHeight = 750 / uni.getSystemInfoSync().screenWidth * uni.getSystemInfoSync().screenHeight - 140
      //如果用户登录了，取出用户信息
      const userInfo = uni.getStorageSync('user-Info')
      this.mineInfo = userInfo || {}

      //获取轮播图列表
      try {
        const res = await bannerList({
          "merchantId": this.merchantId,
          "areaType": "discover"
        })
        this.bannerList = res.data
      } catch (e) {
        return
      }
    },
    isLogined() {
      this.init()
      this.$refs?.mine?.reload()
      this.$refs?.discoverList?.reload()
    },
    changeTemp() {
      this.showLogin = false
      setTimeout(() => {
        this.loginTitle = '登录/注册'
      }, 200)
    },
    async queryList(page, num) {
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
      if (!this.isLogin) {
        this.$refs.mine.complete([])
        return
      }
      // await this.init()
      if (this.tabs) {
        //带上某个版权方
        if (this.chooseMerchantRow) {
          req.searchItems = [
            {
              "columnName": "merchant~id",
              "value": this.chooseMerchantRow['id']
            }
          ]
        }
        try {
          const res = await collectionList(req)
          let list = this.transformData(res.data.rows)
          this.$refs.mine?.complete(list)
          //查询我的藏品列表
          if (!req.searchItems) {
            this.totalCollection = res.data.paging.totalCount || 0
          }
        } catch (e) {
          this.$refs.mine?.complete(false)
        }
      } else {
        req.sorting = {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
        //带上某个版权方
        if (this.chooseMerchantRow) {
          req.searchItems = [
            {
              "columnName": "merchant~id",
              "value": this.chooseMerchantRow['id']
            }
          ]
        }
        try {
          const res = await orderList(req, '');
          let list = this.transformData(res.data.rows)
          this.$refs.mine?.complete(list)
        } catch (e) {
          this.$refs.mine?.complete(false)
        }
      }
    },
    changeIndex(e) {
      let current = e.detail.current
      if (current + 1 === this.swiperList.length && !this.swiperPram.done && !this.tabsPage) {
        this.swiperPram.num++
        this.getSwiperList()
      }
    },
    //下拉刷新事件
    refresh(){
      this.parseRefresh = true
    },
    async getSwiperList() {
      let req = {
        paging: {
          "pageNumber": this.swiperPram.num,
          "pageSize": this.swiperPram.size,
        },
        searchItems: [
          {
            "columnName": "goods_type",
            "dataType": "",
            "value": '10,30',
            "visible": true
          }
        ],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      // if (!this.isLogin) {
      //   return
      // }
      try {
        let res = await getSwiperList(req, 'onsaleGoodsMerchantView')
        let list = this.transformData(res.data.rows)
        if (list.length === 0) {
          this.swiperPram.done = true
        } else {
          if(!this.parseRefresh){
            this.$set(this, 'swiperList', [...this.swiperList, ...list])
          }else{
            this.parseRefresh=false
          }
        }
      } catch (e) {
      }
    },
    async getMerchantList(num = 1, size = 5) {
      // if (!this.isLogin) {
      //   this.$refs.mine?.complete([])
      //   return
      // }
      let req = {
        paging: {
          "pageNumber": num,
          "pageSize": size,
        },
        searchItems: [
          {
            "columnName": "is_enabled",
            "dataType": "",
            "value": "1",
            "visible": true
          }
        ],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      try {
        let res = await merchant(req)
        let list = this.transformData(res.data.rows)
        this.merchantList = this.transformData(res.data.rows)
        //重置版权方为选择所有
        this.chooseMerchant();
        //处理list列表
        this.$refs.discoverList?.complete(list)
        if (num === 1) await this.getSwiperList()
      } catch (e) {
        this.$refs.discoverList?.complete(false)
      }
    },
    tabChange(temp) {
      this.tabs = temp === 1
      if (this.isLogin) {
        this.$refs?.mine?.refresh()
      }
    },
    changeTabsPage(flag, title) {
      //此处避免重复点击相同的tab，导致问题
      if (flag && this.tabStop === 0) {
        return
      }
      if (!flag && this.tabStop === 1) {
        return
      }
      //先将swiper置初始值
      this.swiperPram.done = false
      this.tabStop = flag ? 0 : 1
      this.$set(this, 'swiperList', [])
      // this.getSwiperList()
      if (!this.isLogin) {
        this.tabsPage = flag;
        this.title = title
        // this.isLogined()
      } else {
        this.tabsPage = flag;
        this.title = title
        document.title = this.title
      }
      if (!this.tabsPage) {
        this.isShowSwiper = true
        this.swiperPram.num = 1
        this.swiperPram.size = 5
        this.$refs.discoverList.reload()
      } else {
        this.isShowSwiper = false
      }
      this.$refs.mine.reload();
    },
    openMerchant() {
      this.showPop = true
    },
    chooseMerchant(row) {
      const list = this.merchantList
      if (row) {
        this.chooseTitle = row['merchantName']
        this.chooseMerchantRow = row
        //修改merchantList的选择值
        list.forEach((item, index) => {
          if (row['id'] === item['id']) {
            list[index]['checked'] = true
          } else {
            list[index]['checked'] = false
          }
        })
        this.merchantList = list
      } else {
        this.chooseTitle = '全部版权方'
        this.chooseMerchantRow = null
        list.map((item, index) => {
          list[index]['checked'] = false
        })
        this.merchantList = list
      }
      //选择之后查询列表相关
      this.$refs?.mine?.reload()
      this.showPop = false
    },
    //版权方下拉
    closePop() {
      this.showPop = false
    },
    openPop() {
      this.showPop = true
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
        return
      }
    },
    getStartsTime(time){
      let t = new Date(time.replace(/-/g, '/'))
      let month = (t.getMonth()+1) + '.'
      let day = t.getDate().toString() + '         '
      let hour = t.getHours().toString() + ':'
      let minute = t.getMinutes().toString()
      return month + day + hour + minute
    },
  },
  computed: {
    emptyViewImg() {
      if (this.isLogin && this.tabs) {
        return '../../static/img/home-goods.svg'
      } else if (this.isLogin && !this.tabs) {
        return '../../static/img/home-order.svg'
      } else if (!this.isLogin && this.tabs) {
        return '../../static/img/empty-home-goods.svg'
      } else if (!this.isLogin && !this.tabs) {
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
      } else if (!this.isLogin && !this.tabs) {
        return '登录后查看'
      }
    },
    getList() {
      let redDot = []
      if (!uni.getStorageSync('red-dot').length) {
        //产生红点数组存到本地
        for (let i in this.discoverList) {
          if (Number(this.discoverList[i]['nftGoodsNum']) === 0) {
            redDot[i] = {id: this.discoverList[i]['id'], temp: false}
          } else {
            redDot[i] = {id: this.discoverList[i]['id'], temp: true}
          }
        }
        uni.setStorageSync('red-dot', redDot)
      }
      let arr = [];
      for (let i in this.discoverList) {
        let item = []
        if (i % 2 === 0) {
          if (!this.isLogin) {
            this.discoverList[i]['isDot'] = false
          } else {
            if (uni.getStorageSync('red-dot')[i]) {
              this.discoverList[i]['isDot'] = uni.getStorageSync('red-dot')[i]['temp']
            }
          }
          item.push(this.discoverList[i])
          if (this.discoverList[Number(i) + 1]) {
            if (!this.isLogin) {
              this.discoverList[Number(i) + 1]['isDot'] = false
            } else {
              if (uni.getStorageSync('red-dot')[Number(i) + 1]) {
                this.discoverList[Number(i) + 1]['isDot'] = uni.getStorageSync('red-dot')[Number(i) + 1]['temp']
              }
            }
            item.push(this.discoverList[Number(i) + 1])
          }
          arr.push(item)
        }
      }
      return arr
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

.w-img {
  width: 52rpx;
  height: 52rpx;
}

.blue-col {
  font-weight: bold;
  color: #101010;
  margin-top: 2rpx;
}

.blue-col-no {
  font-weight: bold;
  color: #8C8A92;
  margin-top: 2rpx;
}

.bg {
  height: 560rpx;
  object-fit: cover;
  box-shadow: 0 20rpx 60rpx 0 rgba(0, 0, 0, 0.05);
  border-radius: 0 0 20rpx 20rpx;
}

.top-center {
  position: absolute;
  left: 60rpx;
  top: 68rpx;
  width: 630rpx;
  height: 108rpx;
  background: #f8f8f8;
  border-radius: 92rpx;
  z-index: 1;
}

.bg-out {
  position: relative;
}

.img-main {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
}

.main-style {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
}

.mt-202 {
  margin-top: 202rpx;
  position: absolute;
  top: 0;
  left: 286rpx;
  z-index: 1;
  width: 178rpx;
  height: 178rpx;
  border-radius: 50%;
}

.mt-14 {
  margin-top: 14rpx;
}

.fc-93 {
  color: rgb(93, 93, 91);
}

.fc-153 {
  color: #7F7F7F;
}

.px-140 {
  padding: 0 140rpx;
}

.emptyImg {
  width: 260rpx;
  height: 260rpx;
}

.fc-205 {
  color: rgba(205, 205, 205, 1)
}

.word-4 {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  /*控制行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.word-2 {
  width: 350rpx;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*控制行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.word-1 {
  width: 350rpx;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /*控制行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ml-0-1 {
  margin-left: 2rpx;
}

.mb-88 {
  margin-bottom: 88rpx;
}

.line {
  margin: 0 50rpx 46rpx 46rpx;
  background: rgb(207, 219, 213);
  height: 2rpx;
}

.ml-46 {
  margin-left: 46rpx;
  font-size: 36rpx;
  margin-right: 10rpx;
  //width: 160rpx;
}

.h-108 {
  height: 108rpx;
}

.ml-46-bto {
  margin-left: 46rpx;
  font-size: 36rpx;
}

.fc-101 {
  color: #7f7f7f;
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

.tab-col {
  color: #7948F7;
}

.mt-36 {
  margin-top: 36rpx;
}

.w-h-24 {
  width: 28rpx;
  height: 28rpx;
}


.line-col {
  background: rgb(40, 174, 95);
}

.mt-42 {
  margin-top: 42rpx;
}

.mb-42 {
  margin-bottom: 42rpx;
}

.h-goods-img {
  height: 670rpx;
  width: 670rpx;
  display: block;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

.w-160 {
  width: 160rpx;
}

.pb-144 {
  padding-bottom: 144rpx
}

.bx {
  box-shadow: 0 4rpx 36rpx rgba(0, 0, 0, 0.06);
  border-radius: 20rpx;
}


.ml-25 {
  margin-left: 25rpx;
}

.col-bot {
  color: rgb(40, 174, 95);
}

.br-order {
  border-bottom: 2rpx solid rgb(238, 238, 238);
}

.mt-24 {
  margin-top: 24rpx;
}

.mb-6 {
  margin-bottom: 60rpx;
}

.btm-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
}

.top-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.h-w-100 {
  width: 150rpx;
  height: 44rpx
}

.h-100 {
  height: 100%;
}

.h-w-44 {
  width: 44rpx;
  height: 44rpx
}

::v-deep .u-tabbar {
  display: contents;
}

.p-total {
  padding: 8rpx 14rpx;
  height: 40rpx;
}

.pos-fix {
  padding-top: 2rpx;
  color: rgba(101, 101, 101, 1);
  position: fixed;
  bottom: 0;
  width: 750rpx;
  height: calc(112rpx + env(safe-area-inset-bottom));
  z-index: 10;
  background: #FCFCFD;
  //padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.ml-0-4 {
  margin-left: 4rpx;
}

.fs-50 {
  font-size: 50rpx;
}

.mt-15 {
  margin-top: 15rpx;
}

.fc-99 {
  color: rgba(99, 102, 105, 1);
}

::v-deep .zp-l-container {
  margin-bottom: 0rpx !important;
}

.swiper {
  height: 878rpx;
}

.h-w-630 {
  width: 630rpx;
  height: 630rpx;
  border-top-right-radius: 20rpx;
  border-top-left-radius: 20rpx;
}

.w-630 {
  width: 630rpx;
}

.box-s {
  box-shadow: 0 4rpx 26rpx rgba(0, 0, 0, 0.05);
  height: 796rpx;
  border-radius: 20rpx;
}

.w-h-110 {
  height: 110rpx;
  width: 110rpx;
  border-radius: 50%;
}

.fs-60 {
  font-size: 60rpx;
}

.login-color {
  color: rgba(40, 174, 95, 1)
}

::v-deep .u-button--square {
  border: 0 !important;
}

.mb-14 {
  margin-bottom: 14rpx;
}

.mt-0-4 {
  margin-top: 4rpx;
}

.mt-14 {
  margin-top: 14rpx;
}

.mt-12 {
  margin-top: 12rpx;
}

.mt-0-7 {
  margin-top: 14rpx;
}

.pt-26 {
  padding-top: 26rpx;
}

.pt-26 {
  padding-top: 26rpx;
}

.pt-28 {
  padding-top: 28rpx;
}

.px-12 {
  padding-left: 12rpx;
  padding-right: 12rpx;
}

.pb-34 {
  padding-bottom: 34rpx;
}

.pt-34 {
  padding-top: 34rpx;
}

.arrow-right {
  width: 28rpx;
  height: 28rpx;
  margin-right: 40rpx;
}

.ml-16 {
  margin-left: 16rpx;
}

.all-title {
  margin-top: 62rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.all-num {
  margin-top: 26rpx;
  height: 122rpx;
  line-height: 122rpx;
  margin-bottom: 6rpx;
  font-size: 100rpx;
  margin-bottom: 6rpx;
}

.ml-44 {
  margin-left: 44rpx;
}

.all-num-ge {
  line-height: 170rpx;
  margin-left: 12rpx;
}

.all-price {
  height: 34rpx;
  line-height: 34rpx;
  color: #7f7f7f;
}

.tab-choose {
  background: #101010;
  padding: 20rpx 40rpx;
  border-radius: 102rpx;
  color: white;
}

.tab-no-choose {
  background: #F5F5F5;
  padding: 20rpx 40rpx;
  border-radius: 102rpx;
  color: #7F7F7F;
}

.mltb-44 {
  margin-left: 44rpx;
  margin-top: 70rpx;
  height: 42rpx;
  line-height: 42rpx;
}

.mb-top-1 {
  margin-bottom: 12rpx;
}

.mb-top-2 {
  margin-bottom: 60rpx;
}

.w-h-18 {
  height: 42rpx;
  width: 24rpx;
}

.lh-36 {
  height: 36rpx;
  line-height: 36rpx;
}

.lh-24 {
  height: 24rpx;
  line-height: 24rpx;
}

.lh-32 {
  height: 32rpx;
  line-height: 32rpx;
}

.w-440 {
  width: 440rpx;
}

.mb-38 {
  margin-bottom: 38rpx;
}

.mt-22 {
  margin-top: 22rpx;
}

.fc-7f {
  color: #7F7F7F;
}

.mb-56 {
  margin-bottom: 56rpx;
}

::v-deep .u-count-down__text {
  font-weight: bold;
  font-size: 28rpx;
  color: #7948F7;
  margin-right: 20rpx;
}

.fc-f95 {
  color: #F95151;
}

.wd {
  width: 670rpx;
  height: 220rpx !important;
  border-radius: 20rpx;
  display: inline-block;
  overflow: hidden;
  margin-bottom: 76rpx;
}

.m-hot {
  margin: 0 40rpx 80rpx 40rpx;
  height: 40rpx;
  line-height: 40rpx;
}

.w-h-46 {
  width: 46rpx;
  height: 46rpx;
  margin-left: 12rpx;
}

.mb-80 {
  margin-bottom: 80rpx;
}

.scroll-view_H {
  white-space: nowrap;
  //width: 710rpx;
  //margin-left: 40rpx;
}


.scroll-view-item_H {
  display: inline-block;
  width: 334rpx;
  height: 80rpx;
  line-height: 80rpx;
}

.pos-rel {
  position: relative;
}

.w-h-80 {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.ml-26 {
  margin-left: 26rpx;
}

.mb-84 {
  margin-bottom: 84rpx;
}

.scroll-view_H-1 {
  height: 220rpx !important;
  white-space: nowrap;
  //::v-deep .uni-swiper-slides{
  //  inset: 0px 10rpx 0px 0rpx !important;
  //}
}

.inset {
  //::v-deep .uni-swiper-slides{
  //  inset: 0px 50rpx 0px 30rpx !important;
  //}
}

.mb-88 {
  margin-bottom: 88rpx;
}

.fc-794 {
  color: #7948F7;
}

.fc-cd {
  color: #cdcdcd;
}

::v-deep .u-popup {
  flex: 0;
}

::v-deep .u-popup__content {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

.w-h-36 {
  width: 36rpx;
  height: 36rpx;
}

.mt-56 {
  margin-top: 56rpx;
}

.mb-56 {
  margin-bottom: 56rpx;
}

.w-h-74 {
  width: 74rpx;
  height: 74rpx;
  border-radius: 50%;
}

.w-h-48 {
  width: 48rpx;
  height: 48rpx;
}

.mb-70 {
  margin-bottom: 70rpx;
}

.pos-dot {
  position: absolute;
  top: 5rpx;
  left: 65rpx;
  background: #F95151;
  width: 26rpx;
  height: 26rpx;
  border-radius: 50%;
  border: 4rpx solid white;
}

.pos-abs-blind {
  position: absolute;
  width: 150rpx;
  height: 56rpx;
  top: 30rpx;
  left: 30rpx;
}

::v-deep .zp-empty-view {
  flex: 0 !important;
}

.w-h-36-c {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
}

.fw-400 {
  font-weight: 400;
}

.mt-104 {
  margin-top: 104rpx;
  margin-bottom: 100rpx;
}

::v-deep .zp-empty-view-center {
  justify-content: start;
}

::v-deep .uni-swiper-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 12rpx !important;
}

::v-deep .uni-swiper-dots-horizontal {
  bottom: 20rpx !important;
}

.mt-34 {
  margin-top: 34rpx;
}

.ml-14 {
  margin-left: 14rpx;
}

.pb-34 {
  padding-bottom: 34rpx;
}

.lh-40 {
  line-height: 40rpx;
  height: 40rpx;
}

.lh-36 {
  line-height: 36rpx;
  height: 36rpx;
}

.--txt {
  height: 10rpx;
  width: 80rpx;
  margin-top: 60rpx;
}

.mt-0-4 {
  margin-top: 12rpx;
}

.name-max-width{
  max-width: 670rpx;
}
.mb-74{
  margin-bottom: 74rpx;
}
.count-down-box {
  position: absolute;
  height: 50rpx;
  padding: 0 16rpx;
  bottom: 30rpx;
  color: #FFFFFF;

  left: 30rpx;
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
    font-weight: bold;
    margin-left: 8rpx;
  }
}
</style>
