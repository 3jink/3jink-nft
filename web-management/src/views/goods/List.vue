<template>
  <div class="content">
    <Breadcrumb title="商品"></Breadcrumb>
    <a-modal
      :maskClosable="false"
      :bodyStyle="{'max-height':'70vh','overflow':'auto'}"
      :visible="showModal"
      :title="disabledName?'编辑NFT':'上架NFT'"
      @ok="handleOk"
      @cancel="$refs.ruleForm.resetFields();showModal = false;form={}"
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
          <a-form-model-item label="上架NFT" ref="id" prop="id">
            <a-select
              show-search
              v-model="form['id']"
              @blur="$forceUpdate()"
              placeholder="选择版权方"
              option-filter-prop="children"
              :filter-option="filterOption"
              :disabled="disabledName"
            >
              <a-select-option :value="item.id" v-for="item in nftList" :key="item.id">
                <div class="flex">
                  <span class="mr-1 flex-1">{{ item['name'] }}</span>
                  <!--                  <span class="mr-4 flex-1 ta-l">#{{ item['tokenId']}}</span>-->
                  <!--                  <span class="flex-1 ta-l"> {{ item['issueNum']}}份</span>-->
                </div>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="售价" ref="price" prop="price">
            <a-input placeholder="请输入售价" v-model="form.price"
                     @blur="() => { getPrice(form,'price',form.price);$refs.price.onFieldBlur();}" suffix="元"
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
            <a-date-picker show-time placeholder="选择起售时间" v-model="form.startsAt" valueFormat="YYYY-MM-DD HH:mm:ss"/>
          </a-form-model-item>
          <a-form-model-item label="计划结束时间" ref="endsAt" prop="endsAt">
            <a-date-picker show-time placeholder="选择结束时间" v-model="form.endsAt" valueFormat="YYYY-MM-DD HH:mm:ss"/>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <div class="top-wrapper p-2 br-5 flex jc-sb ai-c m-2">
      <a-button type="primary" @click="form.id='';getNFTList();showModal = true;disabledName = false"
      >上架NFT
      </a-button>
      <div></div>
      <div class="search-box ta-r">
        <a-radio-group class="mr-2" v-model:value="searchValue.select" @change="$refs.table.refresh()">
          <a-radio-button :value="item.value" :key="item.text" v-for="item in selectValue">{{
              item.text
            }}
          </a-radio-button>
        </a-radio-group>
        <span class="empty-box"></span>
        <a-input-search v-model:value="searchValue.input" placeholder="搜索NFT" style="width: 200px"
                        @blur="$refs.table.refresh()"
                        @search="$refs.table.refresh()"
        />
      </div>
    </div>
    <div class="table-box p-2 mt-2 mb-2">
      <s-table
        ref="table"
        size="small"
        :columns="columns"
        :rowKey="(record) => record.id"
        :scroll="{ x: 1500}"
        :data="getTable"
      >
        <div slot="nftArt~name" slot-scope="text, record">
          <a @click="$router.push({ path:
          `/NFT/library/detail?artId=${record['luNftArtId']}` })">{{
              record['nftArt~name']
            }}</a>
        </div>
        <div slot="merchant~merchantName" slot-scope="text, record">
          <a v-if="!merchantPermission" @click="$router.push({ path:
          `/merchant/merchantManage/detail?id=${record['nftArt~luMerchantId']}` })">{{
              record['merchant~merchantName']
            }}</a>
          <a v-else @click="$message.error('您没有权限访问该页面')">{{
              record['merchant~merchantName']
            }}</a>
        </div>
        <div slot-scope="text" slot="price">{{ text || 0 }}元</div>
        <div slot-scope="text,record" slot="soldCount">{{ (record.issueNum - record['stockNum']) || 0
          }}份</div>
        <div slot-scope="text" slot="saleStatus">
          <dot :type="text"></dot>
        </div>
        <div slot-scope="text" slot="onsaleStatus">
          <dot :type="text"></dot>
        </div>
        <div slot-scope="text" slot="endsAt">
          <div>{{ text === '9999-12-31 23:59:59' ? '长期有效' : text }}</div>
        </div>
        <div slot="action" slot-scope="text, record">
          <a-popconfirm
            :title="`确定${record['onsaleStatus']==='已上架'?'下架':'上架'}吗？`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="changeStatus(record)"
          >
            <a v-if="!merId || !record['approvalJoinView~state'] || record['approvalJoinView~state'] === '已通过'"
               class="pr-3">{{ record['onsaleStatus'] === '已上架' ? '下架' : '上架' }}</a>
          </a-popconfirm>
          <a v-if="!merchantPermission&&record['saleStatus']==='未开始'" class="mr-2" @click="editGoodsDetail(record)">编辑
          </a>
          <a
            @click="$router.push({ path:
            `/goods/list/detail?goodsId=${record.id}&merchantId=${record['nftArt~luMerchantId']}` })">
            查看</a>
        </div>
      </s-table>
    </div>
  </div>
</template>

<script>
import sTable from '@/components/Table'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {nftGoodsList, editGoods, createGoods, onSaleGoods} from '@/api/nftGoods'
import moment from 'moment'
import {NFTList} from '@/api/NFT'
import dot from '@/components/Dot/Dot'
import storage from 'store'

const columns = [
  {
    title: '上架NFT',
    dataIndex: 'nftArt~name',
    width: 200,
    fixed: 'left',
    scopedSlots: {customRender: 'nftArt~name',}
  },
  {
    title: '商户',
    dataIndex: 'merchant~merchantName',
    width: 200,
    fixed: 'left',
    scopedSlots: {customRender: 'merchant~merchantName',},
    merchant:true
  },
  {
    title: '上架数量',
    dataIndex: 'issueNum',
    width: 200,
  },
  {
    title: '售价',
    dataIndex: 'price',
    width: 200,
    scopedSlots: {customRender: 'price',}
  },
  {
    title: '已售',
    dataIndex: 'soldCount',
    width: 200,
    scopedSlots: {customRender: 'soldCount',}
  },
  {
    title: '销售状态',
    dataIndex: 'saleStatus',
    width: 200,
    scopedSlots: {customRender: 'saleStatus',}
  },
  {
    title: '上架状态',
    dataIndex: 'onsaleStatus',
    width: 200,
    scopedSlots: {customRender: 'onsaleStatus',}
  },
  {
    title: '上架时间',
    dataIndex: 'createdAt',
    width: 200,
  },
  {
    title: '开售时间',
    dataIndex: 'startsAt',
    width: 200,
  },
  {
    title: '计划结束时间',
    dataIndex: 'endsAt',
    width: 200,
    scopedSlots: {customRender: 'endsAt'},
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {customRender: 'action'},
    width: 200,
    fixed: 'right'
  },
]
export default {
  name: 'List',
  data() {
    return {
      showMask: false,
      showModal: false,
      disabledName: false,
      selectValue: [
        {text: '全部', value: ''},
        {text: '未开始', value: 'unsellGoodsMerchantView'},
        // {text: '审批中', value: 'nftGoodsApprovalProcessView'},
        {text: '进行中', value: 'onsaleGoodsMerchantView'},
        {text: '已结束', value: 'endedGoodsMerchantView'},
        // {text: '已驳回', value: 'nftGoodsApprovalRejectedView '}
      ],
      searchValue: {
        select: '', input: ''
      },
      columns,
      form: {
        price: '',
        id: '',
        issueNum: '',
        'nftArt~name': '',
        startsAt: null,
        endsAt: null
      },
      rules: {
        'id': [
          {required: true, message: '请选择一个NFT', trigger: 'change'},
        ],
        price: [
          {required: true, message: '请输入售价', trigger: 'blur'},
        ],
        issueNum: [
          {required: true, message: '请输入售卖份数', trigger: 'blur'},
        ],
        startsAt: [
          {required: true, message: '请输入起售时间', trigger: 'change'},
        ]
      },
      nftList: []
    }
  },
  created() {
    if (this.merId) {
      this.columns = columns.filter(item=>!item.merchant)
      this.form.merchantId = this.merId
    }
    this.getNFTList()
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    async getNFTList() {
      let req = {
        "paging": {
          "pageNumber": 1,
          "pageSize": 30
        },
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      if (this.merId) {
        req.searchItems = [{
          "columnName": "nftArt~luMerchantId",
          "value": this.merId
        }
        ]
      }
      try {
        let res = await NFTList(req, 'UnsellNftArtView')
        this.nftList = this.transformData(res.data.rows)
      } catch (e) {
      }
    },
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      let opt = {
        paging: req,
        searchItems: [
          {
            "columnName": "goods_type",
            "value": '10'
          }
        ],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      if (this.merId) opt.searchItems.push({
        'columnName': 'nftArt~luMerchantId',
        value: this.merId
      })
      if (this.searchValue.input) {
        opt.searchItems.push({
          "columnName": "nftArt~name",
          "value": this.searchValue.input
        })
      }
      return await nftGoodsList(opt, this.searchValue.select)
    },
    editGoodsDetail(item) {
      this.nftList = [{
        ...item,
        name: item['nftArt~name'],
        issueNum: item['nftArt~issueNum'],
        tokenId: item['nftArt~tokenId']
      }]
      this.disabledName = true
      this.showModal = true
      this.form = {...item}
    },
    async changeStatus(item) {
      let req = {
        "status": item.onsaleStatus === '已上架' ? '20' : '10'
      }
      try {
        await onSaleGoods(req, item.id)
        this.$message.success(`${item.onsaleStatus === '已上架' ? '下架成功' : '上架成功'}`)
        this.$refs.table.refresh(true)
      } catch (e) {
      }
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
          if(req.issueNum<1){
            this.$message.error('请输入正确的发行数量')
            this.showMask = false
            return
          }
          if (this.disabledName) {
            try {
              await editGoods(req, this.form.id)
              this.showMask = false
              this.showModal = false
              this.$message.success(`编辑成功${this.merId ? ',等待管理员审核' : ''}`)
              setTimeout(()=>{
                this.$refs.table.refresh(true)
              },300)
            } catch (e) {
              this.showMask = false
            }
          } else {
            await createGoods(req)
            this.showModal = false
            this.showMask = false
            this.$message.success(`上架成功${this.merId ? ',等待管理员审核' : ''}`)
            setTimeout(()=>{
              this.$refs.table.refresh(true)
            },300)
          }
          this.showMask = false
        } else {
        }
      });
    }
  },
  components: {
    sTable, Breadcrumb, dot
  }
}
</script>

<style scoped>
.top-wrapper {
  background: #ffffff;
}

.empty-box {
  display: inline-block;
  width: 20px;
}

.table-box {
  background: #fff;
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
</style>