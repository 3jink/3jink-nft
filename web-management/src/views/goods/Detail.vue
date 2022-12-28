<template>
  <div class="content">
    <Breadcrumb :title="goodsDetail['nftArt~name']"></Breadcrumb>
    <div class="top-box p-2 m-2">
      <a-modal
        :maskClosable="false"
        v-model:visible="showModal"
        title="编辑NFT"
        @ok="handleOk"
        @cancel="showModal = false"
        width="80%"
        wrapClassName="full-modal"
      >
        <div class="w-100 modal-wrapper">
          <div v-if="showMask" class="mask flex jc-c ai-c">
            <a-spin size="large"/>
          </div>
          <a-form-model ref="ruleForm"
                        :model="form"
                        :rules="rules"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 12 }">
            <a-form-model-item label="上架NFT" ref="nftArt~name" prop="nftArt~name">
              <a-select disabled v-model="form['nftArt~name']" >
                <a-select-option value="test">
                  test
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="售价" ref="price" prop="price">
              <a-input placeholder="请输入售价" v-model="form.price"
                       @blur="() => { getPrice(form,'price',form.price);$refs.price.onFieldBlur();}"
                       suffix="元"
                       type="number"
              />
            </a-form-model-item>

            <a-form-model-item label="发行份数" ref="issueNum" prop="issueNum">
              <a-input placeholder="请输入售价" v-model="form.issueNum"
                       @blur="() => { $refs.issueNum.onFieldBlur();}" suffix="份"
                       type="number"
              />
            </a-form-model-item>

            <a-form-model-item label="起售时间" ref="startsAt" prop="startsAt">
              <a-date-picker show-time placeholder="选择起售时间" v-model="form.startsAt"/>
            </a-form-model-item>

            <a-form-model-item label="计划结束时间" ref="endsAt" prop="endsAt">
              <a-date-picker show-time placeholder="选择结束时间" v-model="form.endsAt"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>

      <div class="flex jc-sb ai-fs">
        <div class="fs-22 fw-b">{{ goodsDetail['nftArt~name'] }}</div>
        <div>
          <a-button v-if="goodsDetail['saleStatus']==='未开始'" type="primary" @click="showModal = true">编辑NFT
          </a-button>
        </div>
      </div>
      <a-tabs v-model="value">
        <a-tab-pane key="1" tab="详情">
          <div class="detail-wrapper">
            <div class="detail-text pb-1 fw-b pl-2 fs-18 mb-2">
              上架信息
            </div>
            <a-row class="pl-2">
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                上架数量：{{ goodsDetail['issueNum'] }} 份
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                售价：{{ goodsDetail['price'] }} 元
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                上架时间：{{ goodsDetail['createdAt'] }}
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                开售时间：{{ goodsDetail['startsAt'] }}
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                计划结束时间：{{ goodsDetail['endsAt'] }}
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                上架状态：{{ goodsDetail['onsaleStatus'] }}
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                销售状态：{{ goodsDetail['saleStatus'] }}
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                已售：{{ goodsDetail['soldCount'] }} 份
              </a-col>
              <a-col class="mt-1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                未售：{{ goodsDetail['stockNum'] || 0 }} 份
              </a-col>
            </a-row>
            <div class="story-box">
              <div class="story-title p-2 flex jc-sb ai-c">
                <div class="fs-18 fw-b">
                  关联NFT
                </div>
                <a @click="$router.push({path:`/NFT/library/detail?artId=${goodsDetail['luNftArtId']}`})">
                  查看详情>></a>
              </div>
              <div class="mt-2 flex jc-fs ai-c">
                <view-picture class="img-box" :img-str="nftGoodsDetail['mainImageFile']"></view-picture>
                <div class="ml-2">
                  <div>{{ nftGoodsDetail['name'] }}</div>
                  <div class="detail-publish mt-1">认证网络：{{ nftGoodsDetail['contractNetwork'] }}</div>
                  <div class="detail-copyright mt-1">合约标准：{{ nftGoodsDetail['contractProtocol'] }}</div>
                  <div class="detail-num mt-1">合约地址： {{ nftGoodsDetail['contractAddress'] }}</div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="订单记录" force-render>
          <div class="detail-wrapper">
            <div class="detail-text pb-1 fw-b fs-18 mb-2">
              订单记录
            </div>
            <s-table
              class="mt-2"
              ref="table"
              size="small"
              :scroll="{ x: 1500}"
              :columns="columns"
              :rowKey="(record) => record.id"
              :data="getTable"
            >
              <div slot="paidType" slot-scope="text,record">{{ record.state === '已完成' ? '微信支付' : '' }}</div>
              <div slot="sell" slot-scope="text,record">{{ record.amount }}</div>
              <a slot="nftArt~name" slot-scope="text, record" @click="$router.push({ path:
                  '/NFT/library/detail?artId='+record['nftArt~id'] })">{{ record['nftArt~name'] }}</a>
              <a slot="merchant~merchantName" slot-scope="text, record" @click="$router.push({ path:
                  '/merchant/merchantManage/detail?id='+record['merchant~id'] })">{{ record['merchant~merchantName'] }}</a>
              <a v-if="!merchantPermission" slot="accountClaim~claimValue" slot-scope="text, record" @click="$router.push({ path:
                  '/user/userManage/detail?userId='+record.userId })">{{ record['accountClaim~claimValue'] }}</a>
              <a v-else slot="accountClaim~claimValue" slot-scope="text, record" @click="$message.error('您没有权限访问该页面')">
                {{ record['accountClaim~claimValue'] }}</a>
              <div slot="totalAmount" slot-scope="text,record">{{ record.amount }}</div>
              <div slot="discountPrice" slot-scope="text,record">0</div>
            </s-table>
          </div>
        </a-tab-pane>
      </a-tabs>

    </div>
  </div>
</template>

<script>
import sTable from '@/components/Table'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {editGoods, goodsDetail} from '@/api/nftGoods'
import {tableRowFormat} from '@/utils/tableUtils'
import {orderList} from '@/api/order'
import {NFTList} from '@/api/NFT'
import viewPicture from '@/components/ViewPicture/ViewPicture'
import moment from 'moment'
import {Copy} from '@/core/icons'

const columns = [
  {
    title: '订单号',
    dataIndex: 'tradeNo',
    width: 200,
    fixed: 'left'
  },
  {
    title: '作品名称',
    dataIndex: 'nftArt~name',
    width: 200,
    fixed: 'left',
    scopedSlots: {customRender: 'nftArt~name'}
  },
  {
    title: '版权方',
    dataIndex: 'merchant~merchantName',
    width: 200,
    scopedSlots: {customRender: 'merchant~merchantName'},
    merchant:true
  },
  {
    title: '下单用户',
    dataIndex: 'accountClaim~claimValue',
    width: 200,
    scopedSlots: {customRender: 'accountClaim~claimValue'}
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    width: 200
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt',
    width: 200
  },
  {
    title: '售价',
    dataIndex: 'sell',
    width: 200,
    scopedSlots: {customRender: 'sell'}
  },
  {
    title: '购买数量',
    dataIndex: 'goodsNum',
    width: 200
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    width: 200,
    scopedSlots: {customRender: 'totalAmount'}
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: 200
  },
  {
    title: '实付金额',
    dataIndex: 'amount',
    width: 200
  },
  {
    title: '付款时间',
    dataIndex: 'paidAt',
    width: 200
  },
  {
    title: '付款方式',
    dataIndex: 'paidType',
    width: 200,
    scopedSlots: {customRender: 'paidType'}
  }
]
export default {
  name: 'library',
  data() {
    return {
      showMask: false,
      goodsDetail: {},
      nftGoodsDetail: {},
      value: '1',
      columns,
      rules: {
        'nftArt~name': [
          {required: true, message: '请选择一个NFT', trigger: 'change'},
        ],
        price: [
          {required: true, message: '请输入售价', trigger: 'blur'},
        ],
        issueNum: [
          {required: true, message: '请输入发行份数', trigger: 'blur'},
        ],
        startsAt: [
          {required: true, message: '请输入起售时间', trigger: 'change'},
        ]
      },
      form: {
        startsAt: null,
        endsAt: null,
      },
      showModal: false,
      reason: '',
      query: {},
      approveDetail: {},
      approveModal: false,
      confirmLoading: false,
    }
  },
  components: {
    sTable, Breadcrumb, viewPicture, Copy
  },
  async created() {
    this.query = this.$route.query
    await this.getGoodsDetail()
  },
  methods: {

    async getGoodsDetail() {
      let req = {}
      try {
        let res = await goodsDetail(req, this.$route.query.goodsId)
        this.goodsDetail = tableRowFormat(res)?.data.list[0]
        this.form = JSON.parse(JSON.stringify(this.goodsDetail))
        await this.getNftDetail()
      } catch (e) {
      }
    },
    async getNftDetail() {
      let id = this.goodsDetail['luNftArtId']
      try {
        let res = await NFTList({}, '', id)
        this.nftGoodsDetail = this.transformData(res.data.rows[0])
      } catch (e) {
      }
    },
    copy(value) {
      // 模拟 输入框
      let cInput = document.createElement("input");
      cInput.value = value;
      document.body.appendChild(cInput);
      cInput.select();
      document.execCommand("copy");
      this.$message.success('复制成功！')
      document.body.removeChild(cInput);
    },
    handleOk() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.showMask = true
          let req = {
            "endsAt": this.form.endsAt ? moment(this.form.endsAt).format('YYYY-MM-DD HH:mm:ss') : '',
            "nftArtId": this.form.id,
            "price": this.form.price,
            "issueNum": this.form.issueNum,
            "startsAt": this.form.startsAt ? moment(this.form.startsAt)?.format('YYYY-MM-DD HH:mm:ss') : ''
          }
          try {
            await editGoods(req, this.form.id)
            setTimeout(async () => {
              this.showModal = false
              this.showMask = false
              this.$message.success('编辑成功')
              await this.getGoodsDetail()
            }, 500)
          } catch (e) {
            this.showMask = false
          }
        } else {
          return false;
        }
      })
    },
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      let opt = {
        paging: req,
        "searchItems": [
          {
            "columnName": "luNftGoodsId",
            "value": this.$route.query.goodsId
          }
        ]
      }
      return await orderList(opt)
    }
  }
}
</script>

<style scoped lang="less">
.reason-length {
  width: 400px;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
.approve-color {
  color: #1fc14c;
}

.cancel-color {
  color: #ff0851;
}
.top-box {
  background: #fff;
}

.detail-text {
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.story-title {
  border-bottom: 1px solid #f0f0f0;
}

.detail-color {
  color: #4ba2ff;
}

.img-box {
  width: 150px;
  height: 150px;
  background: #7ACE4C;
}

.modal-box {
  max-height: 70vh;
  overflow: auto;
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(246, 248, 250, 0.3);
  z-index: 555;
}

.copy {
  width: 12px;
  height: 12px;
  margin-left: 2px
}

.copy:hover {
  transform: scale(1.3, 1.3);
}
</style>