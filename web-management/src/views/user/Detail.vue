<template>
  <div>
    <Breadcrumb title="用户详情"></Breadcrumb>
    <div class="mt-2">
      <div class="bg-w flex py-2">
        <div class="flex-1 pl-3  flex">
          <ViewPicture :width="70" :height="70" is-circle :img-str="topData['avatar~claimValue']||''"/>
          <div class="flex fd-c pl-2 jc-c">
            <span class="fw-b fs-20">{{ topData['nickname~claimValue'] || '暂无昵称' }}</span>
            <span class="py-1">手机号：{{ topData['phone'] }}</span>
            <div class="py-1 account-np">账号类型：{{ topData['accountProfiles'] }}
            <!--
                @confirm="confirm"
                @cancel="cancel"
            -->
              <a-popconfirm
                title="确认设为管理员吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="setAdmin"
              >
                <a v-if="topData['isHaveBtn']">设为管理员</a>
                <a v-if="topData['isHaveBtnFalse']" class="fc-252">取消管理员</a>
              </a-popconfirm>
            </div>
          </div>
        </div>
        <div class="flex-1 flex fd-c jc-c ml-4">
          <span class="pb-1">实名认证：{{state[topData['state']]}}</span>
          <span class="py-1">姓名：{{ topData['realName'] }}</span>
          <span class="py-1"> 身份证号：{{ topData['cardNo'] }}</span>
        </div>
        <div class="flex-1 ta-r pr-2">
          <a-button v-if="topData['isHaveBtnPermission']" class="flex-1" type="primary" @click="editBlackList">
            {{ topData['isLocked']==='正常'?'加入':'移出' }}黑名单
          </a-button>
        </div>
      </div>
      <div class="flex-1">
      </div>
    </div>
    <div class="bg-w py-2">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="详情">
          <div class="fc-e2 p-2">
            <div class="flex bg-w fd-c">
              <div class="flex ai-c jc-sb px-3 py-1 bb-1">
                <span class="fw-b fs-18">藏品</span>
                <span class="fc-89 fs-16">共 <span class="fc-89 fs-26">{{ total }}</span> 款</span>
              </div>
              <div class="px-3 my-1">
                <a-row :gutter="48">
                  <a-col :xl="6" class="mt-2" v-for="(item,index) in collectionList" :key="index">
                    <div class="flex fd-c bd-1"
                         @click="$router.push({path:`/NFT/library/detail?artId=${item['luNftArtId']}`})">
                      <div class="center-img">
                        <ViewPicture :img-str="item['nftArt~mainImageFile']" style="height:200px">
                        </ViewPicture>
                        <div style="position: absolute;bottom: 10px;left: 20px;z-index: 1000">#{{
                            item['tokenId']
                          }}
                        </div>
                      </div>
                      <div class="flex mt-2 fd-c px-2">
                        <span class="mb-1 fw-b">{{ item['nftArt~name'] || '暂无' }}</span>
                        <div class="flex ai-c jc-sb">
                          <span class="fs-12 fc-80">合约地址</span>
                          <div :title="item['contractAddress']" class="fs-12 fc-80 text-ellipsis-1">
                            {{
                              item['contractAddress'] &&
                              item['contractAddress'].length > 12 ? item['contractAddress'].substr(0, 6) + '...' + item['contractAddress'].substr(item['contractAddress'].length - 6) :
                                item['contractAddress'] ||
                                '暂无'
                            }}
                            <Copy class="copy"
                                  @click.stop="copy(item['contractAddress'])"></Copy>
                          </div>
                        </div>
                        <div class="flex ai-c jc-sb mt-1">
                          <span class="fs-12 fc-80">发行时间</span>
                          <span class="fs-12 fc-80">{{ item['createdAt'] || '暂无' }}</span>
                        </div>
                      </div>
                      <div class="flex my-2 px-2 ai-c">
                        <!--                          <ViewPicture :width="30" :height="30" is-circle :img-str="item['merchant~avatar']" />-->
                        <!--                          <span class='fc-80 fs-12 fw-b' style='margin-left: 5px'>{{-->
                        <!--                              item['merchant~merchantName']||'暂无'-->
                        <!--                            }}</span>-->
                      </div>
                    </div>
                  </a-col>
                </a-row>
                <div class="mt-2 ta-r">
                  <a-pagination
                    size="small"
                    :total="total"
                    :current="current"
                    :pageSize="pageSize"
                    @change="pageChange"
                    @showSizeChange="sizeChange"
                    :pageSizeOptions="['12','24','36']"
                    show-size-changer
                    show-quick-jumper/>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="订单记录" force-render>
          <div class="fc-e2 p-2">
            <div class="flex bg-w fd-c">
              <div class="flex ai-c jc-sb px-3 py-1 bb-1">
                <span class="fw-b fs-18">订单记录</span>
                <span class="fc-89 fs-16"> <span class="fc-89 fs-26"></span>&nbsp;</span>
              </div>
              <s-table
                class="bg-w"
                ref="table"
                size="small"
                :columns="columns"
                :rowKey="(record) => record.id"
                :data="getTable"
                :scroll="{ x: 1500}"
              >
                <a slot="nftArt~name" slot-scope="text, record" @click="$router.push({ path:
                  '/NFT/library/detail?artId='+record['nftArt~id'] })">{{ record['nftArt~name'] }}</a>
                <a slot="merchant~merchantName" slot-scope="text, record" @click="$router.push({ path:
                  '/merchant/merchantManage/detail?id='+record['merchant~id'] })">{{ record['merchant~merchantName'] }}</a>
                <span slot="paidType" slot-scope="text, record">{{ record.paidType }}</span>
                <div slot="action" slot-scope="text, record">
                  <a @click="enterDetail(record)">查看</a>
                </div>
              </s-table>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import STable from '@/components/Table'
import Upload from '@/components/Upload/Upload'
import Dot from '@/components/Dot/Dot'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {Copy} from '@/core/icons'
import {adminList,createAdmin, collectionList, orderList,accountRealNameList,adminSuspend,adminLock,adminUnLock} from
    '@/api/user'
import ViewPicture from '@/components/ViewPicture/ViewPicture'

export default {
  name: 'Detail',
  components: {
    ViewPicture,
    Upload, STable, Dot, Breadcrumb, Copy
  },
  data() {
    return {
      ID: '',
      userId: '',
      total: 0,
      current: 1,
      pageSize: 12,
      topData: {},
      state:{'Unverify':'未认证','Processing':'认证中','Verified':'已认证','Failed':'认证失败'},
      collectionList: [],
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
          fixed: 'left'
        },
        // {
        //   title: '版权方',
        //   dataIndex: 'merchant~merchantName',
        //   scopedSlots: { customRender: 'merchant~merchantName' },
        //   width: 200,
        //   fixed: 'left'
        // },
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
        {
          title: '订单金额',
          dataIndex: 'goodsAmount',
          scopedSlots: {customRender: 'goodsAmount'},
          width: 200
        },
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
  async created() {
    await this.init();
  },
  methods: {
    async init(){
      this.ID = this.$route.query.id
      const reqData = {
        paging: {pageNumber:1,pageSize:999},
        searchItems:[{
          "columnName": "userId",
          "value":this.$route.query['userId']
        }],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      const res = await adminList(reqData)
      //查询这个用户实名认证的姓名
      reqData.searchItems = [{'columnName':'userId','value':this.$route.query['userId']}]
      const res1 = await accountRealNameList(reqData)
      const allData = this.cancatArr(res.data.rows,res1.data.rows)
      this.topData = this.transformData(allData)[0]
      //判断是否有管理员
      const profileArr = this.topData['accountProfiles'].split(',');
      this.topData['isHaveBtn'] = !profileArr.includes('管理员') && this.permission;
      this.topData['isHaveBtnFalse'] = profileArr.includes('管理员') && this.permission;
      //判断是否有加入黑名单功能
      if(this.permission){
        this.topData['isHaveBtnPermission'] = true
      }else this.topData['isHaveBtnPermission'] = !this.permission && !this.merchantPermission && !profileArr.includes('管理员');
      await this.getCollectionList();
    },
    //js拼接俩个对象数组
    cancatArr(arr1,arr2){
      let arrResult=[];
      if(arr2.length===0) return arr1
      arr1.map((item,index)=>{
        let json =  Object.assign( arr2[index],item)
        arrResult.push(json)
      })
      return arrResult
    },
    //获取订单列表
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      const reqData = {
        paging: req,
        "searchItems": [
          {
            "columnName": "userId",
            "value": this.$route.query['userId']
          }
        ],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      return await orderList(reqData)
    },
    //获取用户藏品列表
    async getCollectionList(page = 1, size = 12) {
      //获取用户页面位的藏品列表
      const reqData = {
        'paging': {
          pageNumber: page,
          pageSize: size
        },
        "searchItems": [
          {
            "columnName": "userId",
            "value": this.$route.query['userId'],
          }
        ]
      }
      const res = await collectionList(reqData, false);
      this.total = res.data.paging.totalCount
      this.collectionList = this.transformData(res.data.rows)
    },
    async pageChange(page, size) {
      this.pageSize = size
      this.current = page
      await this.getCollectionList(page, size);
    },
    async sizeChange(page, size) {
      this.pageSize = size
      this.current = page
      await this.getCollectionList(page, size);
    },
    //设置用户成为管理员
    async setAdmin(){
      if(this.topData['isHaveBtn']){
        await createAdmin({
          name: "管理员",
          phone: this.topData['phone'],
          userId: this.$route.query['userId']
        })
        this.$message.success('设置管理员成功')
        await this.init();
      }else{
        await adminSuspend({
          "userId":this.$route.query['userId']
        })
        this.$message.success('取消管理员成功')
        await this.init();
      }
    },
    //加入黑名单
    editBlackList(){
      let that = this;
      this.$confirm({
        title: `确定${this.topData['isLocked']==='正常'?'加入':'移出'}黑名单吗?`,
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          if(that.topData['isLocked']==='正常'){
            await adminLock({userId:that.$route.query['userId']})
            that.$message.success('已加入黑名单')
            await that.init();
          }else{
            await adminUnLock({userId:that.$route.query['userId']})
            that.$message.success('已移出黑名单')
            await that.init();
          }
        },
        onCancel() {
        },
      });
    },
    enterDetail(row) {
      this.$router.push({
        path: '/user/userManage/detail'
      })
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
    }
  }
}
</script>

<style scoped lang="less">
.bg-w {
  background: white;
}

/deep/ .ant-tabs-bar {
  margin: 0;
}

.fc-e2 {
  background: #EDEFF2
}

.center-img {
  height: 200px;
  position: relative
}

.fc-89 {
  color: #8F9BAF
}

.bb-1 {
  border-bottom: 1px solid #E8EAED;
}

.fc-80 {
  color: #808080
}

.bd-1 {
  border: 1px solid #E9E9E9;
}

/deep/ .ant-col {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.copy {
  width: 12px;
  height: 12px;
  margin-left: 2px
}

.copy:hover {
  transform: scale(1.3, 1.3);
}
.fc-252{
  color:rgb(252,78,81);
}
.account-np{
  white-space: nowrap;
}
</style>