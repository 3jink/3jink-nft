<template>
  <div>
    <Breadcrumb title="订单记录"></Breadcrumb>
    <div class="mt-2 mx-2">
      <div class="bg-w ta-r py-2 px-3">
        <a-radio-group :default-value="-1" button-style="solid" @change="$refs.table.refresh()"
                       v-model="form.stateSearch">
          <a-radio-button :value="-1">
            全部
          </a-radio-button>
          <a-radio-button :value="0">
            待支付
          </a-radio-button>
          <a-radio-button :value="2">
            已完成
          </a-radio-button>
          <a-radio-button :value="1">
            已取消
          </a-radio-button>
          <a-radio-button :value="3">
            支付失败
          </a-radio-button>
        </a-radio-group>
        <a-input-search placeholder="搜索订单号" class="w-300 ml-1-impro"
                        @blur="$refs.table.refresh()"
                        @search="$refs.table.refresh()"
                        v-model="form.inpSearch"/>
      </div>
      <div class="bg-w ta-r py-2 px-3 mt-1">
        <s-table
          class="mt-2"
          ref="table"
          size="small"
          :columns="columns"
          :scroll="{ x: 1500}"
          :rowKey="(record) => record.id"
          :data="getTable"
        >
          <!--          -->
          <div slot="nftArt~name" slot-scope="text, record" >{{ record['nftArt~name'] }}</div>
          <div   slot="accountClaim~claimValue" slot-scope="text, record" >
            <a v-if="!merId" @click="$router.push({ path:'/user/userManage/detail?userId='+record.userId })">{{
                record['accountClaim~claimValue'] }}</a>
            <span v-else>{{ record['accountClaim~claimValue'] }}</span>
          </div>
        </s-table>
      </div>
    </div>
  </div>
</template>

<script>
import STable from '@/components/Table'
import Upload from '@/components/Upload/Upload'
import Dot from '@/components/Dot/Dot'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {orderList} from '@/api/order'

export default {
  name: 'Record',
  components: {
    Upload, STable, Dot, Breadcrumb
  },
  data() {
    return {
      form: {
        inpSearch: '',
        stateSearch: -1
      },
      searchParams: [],
      current: 1,
      pageSize: 10,
      columns: [
        {
          title: '订单号',
          dataIndex: 'tradeNo',
          scopedSlots: {customRender: 'tradeNo'},
          width: 200,
          fixed: 'left'
        },
        {
          title: '作品名称',
          dataIndex: 'nftArt~name',
          scopedSlots: {customRender: 'nftArt~name'},
          width: 200,
          // fixed: 'left'
        },
        {
          title: '订单类型',
          dataIndex: 'nftGoods~goodsType',
          width: 200,
        },
        // {
        //   title: '版权方',
        //   dataIndex: 'merchant~merchantName',
        //   scopedSlots: { customRender: 'merchant~merchantName' },
        //   width: 200,
        //   fixed: 'left'
        // },
        {
          title: '下单用户',
          dataIndex: 'accountClaim~claimValue',
          scopedSlots: {customRender: 'accountClaim~claimValue'},
          width: 200,
        },
        {
          title: '订单状态',
          dataIndex: 'state',
          scopedSlots: {customRender: 'state'},
          width: 200
        },
        {
          title: '下单时间',
          dataIndex: 'createdAt',
          scopedSlots: {customRender: 'createdAt'},
          width: 200
        },
        // {
        //   title: '售价',
        //   dataIndex: 'goodsUnitAmount',
        //   scopedSlots: { customRender: 'goodsUnitAmount' },
        //   width: 200
        // },
        // {
        //   title: '购买数量',
        //   dataIndex: 'goodsNum',
        //   scopedSlots: { customRender: 'goodsNum' },
        //   width: 200
        // },
        {
          title: '订单金额',
          dataIndex: 'goodsAmount',
          scopedSlots: {customRender: 'goodsAmount'},
          width: 200
        },
        // {
        //   title: '实付金额',
        //   dataIndex: 'amount',
        //   scopedSlots: { customRender: 'amount' },
        //   width: 200
        // },
        {
          title: '付款时间',
          dataIndex: 'paidAt',
          scopedSlots: {customRender: 'paidAt'},
          width: 200
        },
        {
          title: '付款方式',
          dataIndex: 'paidType',
          scopedSlots: {customRender: 'paidType'},
          width: 200
        }
      ]
    }
  },
  methods: {
    //获取订单列表
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      const searchParams = [];
      if (this.form.inpSearch) {
        searchParams.push({
          "columnName": "tradeNo",
          "value": this.form.inpSearch
        })
      }
      if (this.form.stateSearch !== -1) {
        searchParams.push({
          "columnName": "state",
          "value": this.form.stateSearch.toString()
        })
      }
      const reqData = {
        paging: req,
        searchItems: searchParams
      }
      return await orderList(reqData)
    }
  }
}
</script>

<style scoped>

.bg-w {
  background: white;
  border-radius: 5px;
}

.w-300 {
  width: 300px;
}

.ml-1-impro {
  margin-left: 10px !important;
}
</style>