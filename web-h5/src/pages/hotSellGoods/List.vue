<template>
  <z-paging width="100%" show-loading-more-when-reload ref="list"
            v-model="list" @query="queryList" :fixed="false" :default-page-size="5"
            height="100%">
    <view slot="empty">
      <view class="flex fd-c ai-c">
        <img src="../../static/img/home-goods.svg" alt="" class="emptyImg">
        <text class="fs-28 fc-205">暂无{{ type === 0 ? '藏品': type === 1 ? '盲盒':'合成' }}~</text>
      </view>
    </view>
    <view class="bm" v-for="item in list" :key="item.id"
          @click="onNavigateToPage('goodsDetail',{id:item['id'],blindBox:item['goodsType']})">
      <imageView isBg
        :img-url="item['nftArt~mainImageFile']"
        class="h-w-670" mode="aspectFill">

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
                          @finish="$refs.list.refresh()"/>
          </view>
        </view>
      </imageView>
      <view class=" px-3" :class="{'blind-info':type !== 2}">
        <view class="fs-36 fw-b text-ellipsis-1" :class="type === 2 ?'pt-4 pb-4':'blind-box-title'">
          {{ item['nftArt~name'] }}
        </view>
        <view v-if="type !== 2" class="flex jc-sb ai-c ">
          <view :class="type === 1?'p-total flex ai-c fs-24 fw-b bg-blind':'p-total flex ai-c fs-24 fw-b'">
            <view class="flex ai-c" v-if="type === 0">
              <image-view :img-url="item['merchant~avatar']" class="img-avatar" mode="aspectFill"/>
              <text class="ml-14 fs-24">{{ item['merchant~merchantName'] }}</text>
              <text class="mx-1">·</text>
            </view>
            限量
            <text class="px-0-2 fs-24">
              {{ item['issueNum'] }}
            </text>
          </view>
          <view class="fs-36 fw-b lh-36">￥
            <text class="fs-36 fw-b">{{ item.price || 0.00 }}</text>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<script>
import ImageView from '@/components/imageView/ImageView'
import {getSwiperList} from '@/api/detail'

export default {

  data() {
    return {
      isSpecial:true,
      type: 0,  //0 藏品  1 盲盒   2 合成
      merchantId: '',
      list: []
    }
  },
  components: {
    ImageView
  },
  async onLoad() {

    this.type = Number(this.$Route.query?.type || 0)
    this.merchantId = this.$Route.query?.id || false
    document.title =  '热售藏品'
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
    async queryList(page, size) {
      let req = {
        paging: {
          "pageNumber": page,
          "pageSize": size
        },
        searchItems: [],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      if (this.type === 1) {
        req.searchItems.push({
          "columnName": "goodsType",
          "value": '30',
        })
        req.searchItems.push({
          "columnName": "nftArt~luMerchantId",
          "value": this.merchantId,
        })
      } else if (this.type === 0) {
        req.searchItems.push({
          "columnName": "goods_type",
          "value": '10,30',
        })
      } else {
        req.searchItems.push({
          "columnName": "goodsType",
          "value": '50',
        })
        req.searchItems.push({
          "columnName": "nftArt~luMerchantId",
          "value": this.merchantId,
        })
      }
      try {
        let list = []
        let res = await getSwiperList(req, 'onsaleGoodsMerchantView')
        list = this.transformData(res.data.rows)
        this.$refs.list.complete(list)
      } catch (e) {
        console.log(e, 'e')
        this.$refs.list.complete(false)
      }

    },
  },
}
</script>

<style lang="scss">
@import "static/css/variable";

.blind-box {
  position: absolute;
  z-index: 50;
  width: 150rpx;
  height: 56rpx;
  border-radius: 28rpx;

  .blind-box-icon {
    position: absolute;
    width: 150rpx;
    height: 56rpx;
    top: 30rpx;
    left: 30rpx;
  }

  .blind-box-text {
    color: #fff;
    margin-left: 8rpx;
  }

}

.blind-info {
  padding-bottom: 32rpx;
}

.blind-box-title {
  margin-top: 32rpx;
  margin-bottom: 26rpx;
  height: 36rpx;
  line-height: 36rpx;
}

.w-670 {
  width: 670rpx;
}

.h-w-670 {
  width: 670rpx;
  height: 670rpx;
  border-radius: 20rpx 20rpx 0 0;
}

.px-0-2 {
  margin: 0 6rpx;
}

.bm {
  color: #101010;
  position: relative;
  box-shadow: 0 4px 26px rgba(0, 0, 0, 0.05);
  margin: 40rpx;
  border-radius: 20rpx;
  width: 670rpx;
}

.p-total {
  height: 40rpx;
  //padding: 8rpx 12rpx;
  //background: #f5f5f5;
  border-radius: 8rpx;
  color: #7F7F7F;
}

.mt-1-2 {
  margin-top: 12rpx;
}

.pt-2-4 {
  padding-top: 24rpx;
}

.mt-1-4 {
  margin-top: 14rpx;
}

.img-avatar {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
}

.ml-14 {
  margin-left: 14rpx;
}

.lh-36 {
  line-height: 36rpx;
  height: 36rpx;
}

.bg-blind {
  background: #F5F5F5;
  padding: 0 10rpx;
}

.fc-205 {
  color: rgba(205, 205, 205, 1)
}

.emptyImg {
  width: 260rpx;
  height: 260rpx;
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
    font-weight: bold;
    font-size: 24rpx;
    margin-left: 8rpx;
  }
}
</style>
