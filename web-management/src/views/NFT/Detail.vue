<template>
  <div class="content">
    <Breadcrumb :title="goodsDetail['name']"></Breadcrumb>

    <div class="top-box p-2 m-2">

      <a-modal
        :maskClosable="false"
        :bodyStyle="{'max-height':'70vh','overflow':'auto'}"
        :visible="showModal"
        title="编辑NFT"
        @ok="handleOk"
        @cancel="showModal = false"
        width="70%"
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
            <a-form-model-item :label="`NFT名称`" ref="name" prop="name">
              <a-input placeholder="请输入NFT名称" v-model="form.name" :maxLength="15"
                       @blur="() => { $refs.name.onFieldBlur();}"
              />
            </a-form-model-item>
            <a-form-model-item label="上传主图" ref="mainImageFile" prop="mainImageFile">
              <upload @getUrl="(url)=>form.mainImageFile = url" :file-type="1" :img-url="form['mainImageFile']"
                      ref="main"></upload>
            </a-form-model-item>
            <a-form-model-item label="上传详情图" ref="detailImageFiles" prop="detailImageFiles">
              <upload @getUrl="(url)=>getManyUrl(url)" :file-type="1"
                      :img-url="form['detailImageFiles']"
                      ref="detail"
                      :max-num="6"></upload>
            </a-form-model-item>
<!--            <a-form-model-item label="是否是合成材料" prop="isCompundPiece">-->
<!--              <a-checkbox-group v-model="form.isCompundPiece">-->
<!--                <a-checkbox value="1" name="isCompundPiece">-->
<!--                  是合成材料-->
<!--                </a-checkbox>-->
<!--              </a-checkbox-group>-->
<!--            </a-form-model-item>-->
          </a-form-model>
        </div>
      </a-modal>
      <div class="flex jc-sb ai-fs">
        <div class="fs-22 fw-b">{{ goodsDetail['name'] }}
        </div>
        <div>
          <a-button type="primary" @click="showModal = true">编辑NFT
          </a-button>
        </div>
      </div>
      <div class="detail-wrapper">
        <div class="detail-text pb-1 fw-b fs-18 mb-2 mt-3">
          NFT细节
        </div>
        <div class="detail-box flex">
          <view-picture class="left-box flex-1" :img-str="goodsDetail['mainImageFile']" width="500px"></view-picture>
          <div class="right-box ml-2">
            <div class="detail-title fs-16 fw-b">发行信息</div>
            <div class="detail-publish mt-1">发行方：数源三街</div>
            <div class="detail-copyright mt-1">版权方：{{ goodsDetail['merchant~merchantName'] }}</div>
<!--            <div class="detail-copyright mt-1">是否是合成材料：{{-->
<!--                goodsDetail['isCompundPiece']?goodsDetail['isCompundPiece'].toString()==='1'?'是':'否':'' }}</div>-->
            <div class="detail-date mt-1">发行日期：{{ goodsDetail['createdAt'] }}</div>
            <div class="line-box my-2"></div>
            <div class="detail-title fs-16 fw-b">认证信息</div>
            <div class="detail-publish mt-1">认证网络：{{ goodsDetail['contractNetwork'] }}</div>
            <div class="detail-copyright mt-1">合约标准：{{ goodsDetail['contractProtocol'] }}</div>
            <div class="detail-num mt-1 ws-n">合约地址： {{ goodsDetail['contractAddress'] }}</div>
            <div class="line-box my-2"></div>
            <div class="detail-title fs-16 fw-b mb-1">上架信息</div>

          </div>
        </div>

        <div class="story-box">
          <div class="story-title p-1 fs-18 fw-b mt-3">创作故事</div>
          <div class="story-content flex jc-c ai-c">
            <div class="pt-2">
              <view-picture class="detail-view" v-if="goodsDetail['detailImageFiles']"
                            :img-str="goodsDetail['detailImageFiles']"></view-picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sTable from '@/components/Table'
import upload from '@/components/Upload/Upload'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {editNFT, NFTList} from '@/api/NFT'
import viewPicture from '@/components/ViewPicture/ViewPicture'
import {orderList} from '@/api/order'
import {Copy} from '@/core/icons'
import {goodsDetail} from '@/api/nftGoods'


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
    fixed: 'left'
  },
  {
    title: '版权方',
    dataIndex: 'merchant~merchantName',
    width: 200
  },
  {
    title: '下单用户',
    dataIndex: 'orderUser',
    width: 200
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
    dataIndex: 'discountPrice',
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
      goodsType: '10',
      showMask: false,
      value: '1',
      columns,
      rules: {
        name: {required: true, message: '请输入NFT名称', trigger: 'blur'},
        mainImageFile: {required: true, message: '请上传主图', trigger: 'blur'},
      },
      form: {
      },
      goodsDetail: {},
      showModal: false,
      reason: '',
      query: {},
      approveDetail: {},
      approveModal: false,
      confirmLoading: false,

    }
  },
  components: {
    sTable, Breadcrumb, upload, viewPicture, Copy
  },
  created() {
    this.query = this.$route.query
    this.getNftDetail()


  },
  methods: {
    getManyUrl(url){
      this.form.detailImageFiles = url;
      console.log(url,'外面')
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
    async getNftDetail() {
      let id = this.$route.query.artId
      try {
        let res = await NFTList({}, '', id)
        this.goodsDetail = this.transformData(res.data.rows[0])
        this.goodsDetail['isCompundPiece'] = [...this.goodsDetail['isCompundPiece']]
        this.form = {...this.goodsDetail}
        let req = {
          "searchItems": [
            {
              "columnName": "nftArt~luMerchantId",
              "value": this.goodsDetail['luMerchantId']
            }
          ]
        }
        let goodsRow = await goodsDetail(req, this.goodsDetail['nftGoods~id'])

        this.goodsType = this.transformData(goodsRow.data.rows[0])['goodsType'] || '10'

      } catch (e) {
      }
    },
    handleOk() {
      console.log(111)
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log(222)
          let req = {
            "detailImageFiles": this.form.detailImageFiles,
            "issueNum": this.form.issueNum,
            "mainImageFile": this.form.mainImageFile,
            "merchantId": this.form.id,
            "name": this.form.name,
            "story": this.form.story,
            "nftFile": this.form.nftFile,
            "isCompundPiece":"0"
          }
          this.showMask = true
          setTimeout(async () => {
            try {
              await this.$refs.main.handleUpload()
              await this.$refs.detail.handleUpload()
              await editNFT(req, this.form.id)
              setTimeout(async () => {
                this.$message.success('修改成功')
                this.showModal = false
                this.showMask = false
                await this.getNftDetail()
              }, 500)
            } catch (e) {
              console.log('catch')
              this.showMask = false
            }
          }, 2000)
        } else {
          console.log('return')
          return false;
        }
      });
    },
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      return await orderList({paging: req}, this.$route.query.goodsId)
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

.detail-box {
  height: 500px;

  .left-box {
  }

  .right-box {
    width: 300px;
    background: #fff;
  }

  .line-box {
    border: 1px solid #f0f0f0;
  }
}

.story-title {
  border-bottom: 1px solid #f0f0f0;
}

.story-content {
  > div {
    width: 70%;
  }
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

.detail-view {
  max-width: 700px;
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