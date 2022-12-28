<template>
  <div>
    <Breadcrumb title="用户管理"></Breadcrumb>
    <div class="mt-2 mx-2">
      <div class="bg-w ta-r py-2 px-3">
        <a-input-search placeholder="输入用户名" style="width: 300px"  @blur="$refs.table.refresh(true)"
                        @search="$refs.table.refresh(true)"
                        v-model="form.conditionSecond"/>
      </div>
      <div class="bg-w ta-r py-2 px-3 mt-1">
        <s-table
          class="mt-2"
          ref="table"
          size="small"
          :columns="columns"
          :rowKey="(record) => record.id"
          :data="getTable"
        >
          <a slot="name" slot-scope="text, record" @click="enterDetail(record)">{{ record.name }}</a>
          <div slot="action" slot-scope="text, record">
            <a @click="enterDetail(record)">查看</a>
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
import {adminList,collectionNumberList} from '@/api/user'

export default {
  name: 'Manage',
  components: {
    Upload, STable, Dot, Breadcrumb
  },
  data() {
    return {
      inpSearch: '',
      tableParams: '',
      searchParams: '',
      form: {
        conditionFirst: '',
        conditionSecond: ''
      },
      columns: [
        {
          title: '用户名称',
          dataIndex: 'nickname~claimValue',
          scopedSlots: {customRender: 'nickname~claimValue'}
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          scopedSlots: {customRender: 'phone'}
        },
        {
          title: '藏品数',
          dataIndex: 'count',
          scopedSlots: {customRender: 'count'}
        },
        {
          title: '账号类型',
          dataIndex: 'accountProfiles',
          scopedSlots: { customRender: 'accountProfiles' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'}
        }
      ]
    }
  },
  created() {
  },
  methods: {
    //js拼接俩个对象数组
    cancatArr(arr1,arr2){
      let arrResult=[];
      arr1.map((item,index)=>{
        let json =  Object.assign( arr2[index],item)
        arrResult.push(json)
      })
      return arrResult
    },
    formatTable(arrs){
      let reqData = arrs.data;
      let arr = []
      reqData.forEach((item,index)=>{
        // console.log(item)
        let outJson={}
        for (const key in item) {
          let json ={}
          json['columnName'] = key;
          json['text'] = item[key];
          json['value'] = item[key];
          outJson[key]=json;
        }
        arr.push(outJson)
      })
      return arr
    },
    //获取列表
    async getTable(param) {
      const { conditionSecond} = this.form;
      const req = {
        pageNumber: param['pageNo'],
        pageSize: param['pageSize'],
      }
      const searchItems = [];
      if (conditionSecond.trim()) {
        searchItems.push({
          "columnName":"phone",
          "value": conditionSecond
        })
      }
      const reqData = {
        paging: req,
        searchItems,
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      const res = await adminList(reqData)
      const resData = this.transformData(res.data.rows)
      let reqData1=[];
      resData.map((item)=>{
        reqData1.push(item['userId'])
      })
      const reqs = reqData1.toString()
      if(reqs){
        const res1 = await collectionNumberList(reqs)
        const datas = this.cancatArr(res.data.rows,this.formatTable(res1))
        res.data.rows = datas;
        const allData = res;
        return allData;
      }else{
        return res;
      }
    },
    search(e) {
      this.inpSearch = e
      this.searchParams = {
        "searchItems": [
          {
            "columnName": "name",
            "value": this.inpSearch
          }
        ]
      }
      this.$refs.table.refresh(true)
    },
    blur(e) {
      this.inpSearch = e.target.value
      this.searchParams = {
        "searchItems": [
          {
            "columnName": "name",
            "value": this.inpSearch
          }
        ]
      }
      this.$refs.table.refresh(true)
    },
    enterDetail(row) {
      this.$router.push({
        path: '/user/userManage/detail?userId='+row['userId']
      })
    }
  }
}
</script>

<style scoped>
.bg-w {
  background: white;
  border-radius: 5px;
}
</style>