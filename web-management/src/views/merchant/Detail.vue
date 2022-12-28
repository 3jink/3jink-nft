<template>
  <div class="content">
    <Breadcrumb></Breadcrumb>
    <a-modal
      :maskClosable="false"
      :bodyStyle="{'max-height':'70vh','overflow':'auto'}"
      v-model:visible="showModal"
      title="编辑商户信息"
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
          <a-form-model-item label="商户名称" ref="merchantName" prop="merchantName">
            <a-input placeholder="请输入商户名称" v-model="form.merchantName"
                     @blur="() => { $refs.merchantName.onFieldBlur();}"
            />
          </a-form-model-item>
          <a-form-model-item label="上传头像" ref="avatar" prop="avatar">
            <upload ref="avatarImg" :file-type="1" @getUrl="(url)=>form.avatar = url"
                    :img-url="goodsDetail['avatar']"></upload>
          </a-form-model-item>
          <a-form-model-item label="上传主图" ref="mainImageFile" prop="mainImageFile">
            <upload ref="mainImg" :file-type="1" @getUrl="(url)=>form.mainImageFile = url"
                    :img-url="goodsDetail['mainImageFile']"></upload>
          </a-form-model-item>
          <a-form-model-item label="客户简介" ref="intro" prop="intro">
            <a-textarea autoSize v-model="form.intro" @blur="() => { $refs.intro.onFieldBlur();}" :max-length="300"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <a-modal
      :maskClosable="false"
      :bodyStyle="{'max-height':'60vh','overflow':'auto'}"
      v-model:visible="showModalTwo"
      title="编辑商户信息"
      @ok="handleSubmit"
      @cancel="showModalTwo = false"
      width="70%"
      wrapClassName="full-modal"
      :confirm-loading="confirmLoading"
    >
      <div class="flex ai-c">
        <span class="ws-n">添加核销管理员手机号：</span>
        <a-input placeholder="填写手机号" class="w-as" v-model="adminVerfyPhoneInp" :maxLength="11"/>
      </div>
    </a-modal>
    <div class="top-box flex p-2 jc-sb m-2">
      <view-picture class="avatar-box" :img-str="goodsDetail['avatar']" :is-circle="true"></view-picture>
      <div class="flex fd-c flex-1 ml-3">
        <div class="fs-18 fw-b">{{ goodsDetail['merchantName'] }}</div>
        <a-row class="flex mt-2">
          <!--          <a-col class="" :span="12">统一社会信用代码：{{ goodsDetail['socialCode'] }}</a-col>-->
          <a-col class="" :span="12">手机号：{{ goodsDetail['merchantAdminAccount~phone'] }}</a-col>
        </a-row>
      </div>
      <a-button type="primary" @click="form = {...goodsDetail};showModal = true">编辑商户信息</a-button>
    </div>
    <div class="tenant-detail m-2">
      <div class="detail-text p-1 pl-3 fw-b fs-18">
        商户详情
      </div>
      <div class="tenant-content flex p-2">
        <div class="tenant-img mr-2 flex-1">
          <view-picture class="tenant-img" :img-str="goodsDetail['mainImageFile']"></view-picture>
        </div>
        <div class="flex-4">
          <div class="fs-18 ta-c mb-3">简介</div>
          <div class="tenant-desc">{{ goodsDetail['intro'] }}</div>
        </div>
      </div>
    </div>
    <div class="tenant-detail m-2" v-if="!merId">
      <div class="detail-text p-1 pl-3 fw-b fs-18">
        作品集
      </div>
      <a-row v-if="nftList.length>0" class="content-wrapper" :gutter="48">
        <a-col @click="$router.push({path:`/NFT/library/detail?artId=${item.id}`})" class="item-box mt-3" v-for="item in
        nftList"
               :key="item.id" :xs="24"
               :sm="24"
               :md="12"
               :lg="8"
               :xl="8" :xxl="6">
          <div class="item-box">
            <view-picture :img-str="item['mainImageFile']" class="w-100 img-box" height="200" width="100%"/>
            <div class="desc-box">
              <div class="p-2 title-box fw-b fs-18">{{ item['name'] }}</div>
              <div class="flex jc-sb px-2 mb-1">
                <div class="mr-3">合约地址</div>
                <div class="flex-1 text-ellipsis-1 ta-r">{{
                    item['contractAddress'] &&
                    item['contractAddress'].length > 12 ? item['contractAddress'].substr(0, 6) + '...' + item['contractAddress'].substr(item['contractAddress'].length - 6) :
                      item['contractAddress'] ||
                      '暂无'
                  }}
                  <Copy class="copy"
                        @click.stop="copy(item['contractAddress'])"></Copy>
                </div>
              </div>
              <div class="flex jc-sb px-2 mb-1">
                <div>发行时间</div>
                <div>{{ item['createdAt'] }}</div>
              </div>
              <div class="flex px-2 mb-1 jc-fs ai-c">
                <view-picture :img-str="item['merchant~avatar']" :is-circle="true"
                              class="merchant-avatar"></view-picture>
                <div class="ml-1">{{ item['merchant~merchantName'] }}</div>
              </div>
            </div>
            <div class="tag-box ta-c fs-12" :style="{'background':item['nftGoods~onsaleStatus'] === '未上架' &&
            !item['tokenId']?'#9bc4c6':item['nftGoods~onsaleStatus']==='未上架'?'#a6b1c0':item['nftGoods~onsaleStatus']==='已上架'?'#cfb887':'#d59397'}">
              {{item['approvalJoinView~state'] === '待审批' ?'审批中': item['approvalJoinView~state'] === '已拒绝' ?
              '已驳回':item['nftGoods~onsaleStatus']}}
            </div>
<!--            <div class="id-box">{{ '#' + item['tokenId'] }}</div>-->
<!--            <div class="number-box">{{ item['issueNum'] }} 份</div>-->
          </div>
        </a-col>
      </a-row>
      <div v-if="nftList.length>0" class="flex jc-fe p-1">
        <a-pagination size="small" @change="pageChange" :defaultPageSize="12" :pageSizeOptions="['12','24','36','48']"
                      :total="nftTotalCount"
                      @showSizeChange="changeSize"
                      show-size-changer
                      show-quick-jumper/>
      </div>
      <div v-else class="empty-box flex jc-c ai-c">暂无数据</div>
    </div>
  </div>
</template>

<script>
import upload from '@/components/Upload/Upload'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {addVerfy, delVerfy, editMerchant, merchantList} from '@/api/merchant'
import viewPicture from '@/components/ViewPicture/ViewPicture'
import {NFTList} from '@/api/NFT'
import {Copy} from '@/core/icons'
import {adminLists} from '@/api/user'
export default {
  name: 'Detail',
  components: {
    Breadcrumb, upload, viewPicture, Copy
  },
  data() {
    return {
      showMask: false,
      goodsDetail: {},
      showModal: false,
      form: {
        price: ''
      },
      nftTotalCount: 0,
      nftList: [],
      rules: {
        merchantName: {required: true, message: '请输入商户名称', trigger: 'change'},
        avatar: {required: true, message: '请上传头像', trigger: 'blur'},
        mainImageFile: {required: true, message: '请上传主图', trigger: 'blur'},
        socialCode: {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
        intro: {required: true, message: '请输入客户简介', trigger: 'blur'}
      },
      //核销管理员model
      showModalTwo:false,
      adminVerfyPhoneInp:'',
      confirmLoading:false,
      adminVerfyList:[]
    }
  },
  created() {
    this.getMerchantDetail()
    this.getNFTList()
  },
  methods: {
    async getNFTList(num = 1, size = 12) {
      let req = {
        "paging": {
          "pageNumber": num,
          "pageSize": size
        },
        "searchItems": [{
          "columnName": "lu_merchant_id",
          "value": this.$route.query.id
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
        let res = await NFTList(req)
        this.nftList = this.transformData(res.data.rows)
        this.nftTotalCount = res.data.paging.totalCount
      } catch (e) {}
    },
    async getMerchantDetail() {
      try {
        let res = await merchantList({}, this.$route.query.id || this.merId)
        this.goodsDetail = this.transformData(res.data.rows[0])
      } catch (e) {}
      //获取核销人员
      try {
        const reqData={
          paging: {pageNumber:1,pageSize:999},
          searchItems: [
            {
            columnName:'luMerchantId',
            value:this.$route.query.id
            },
            {
              columnName:'accountProfile~profileCode',
              value:'merchant_staff'
            }
          ]
        }
        let res = await adminLists({req: reqData, view: 'account_common_view'})
        this.adminVerfyList=this.transformData(res.data.rows)
      } catch (e) {}
    },
    handleOk() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.showMask = true
          let req =
            {
              "avatar": this.form.avatar,
              "intro": this.form.intro,
              "mainImageFile": this.form.mainImageFile,
              "merchantName": this.form.merchantName,
              "socialCode": this.form.socialCode,
            }
          await this.$refs.avatarImg.handleUpload()
          await this.$refs.mainImg.handleUpload()
          setTimeout(async () => {
            try {
              await editMerchant(req, this.form.id)
              this.$message.success('编辑成功')
              this.showModal = false
              this.showMask = false
              await this.getMerchantDetail()
            } catch (e) {
              this.showMask = false
            }
          }, 2000)
        } else {
          return false;
        }
      })
    },
    pageChange(num, size) {
      this.getNFTList(num, size)
    },
    changeSize(num, size) {
      this.getNFTList(1, size)
    },
    //添加核销管理员账号
    async handleSubmit(){
      if ((/^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(this.adminVerfyPhoneInp))) {
        this.confirmLoading=true
        const reqData={
          phone:this.adminVerfyPhoneInp,
          profile:'merchant_staff',
          merchantId:this.$route.query['id']
        }
        try {
        await addVerfy(reqData)
          this.$message.success('添加成功！')
          this.showModalTwo = false
          this.confirmLoading=false
          await this.getMerchantDetail()
        }catch (e){
          this.confirmLoading=false
          return
        }
      }else {
        this.$message.error('手机号格式错误')
      }
    },
    //删除管理员账号
    async delAdminVerfy(row){
      try {
        const reqData={
          userId:row['userId'],
          merchantId:this.$route.query['id'],
          profile:'merchant_staff'
        }
        await delVerfy(reqData)
        this.$message.success('删除成功！')
        await this.getMerchantDetail()
      }catch (e) {
        return
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

  },
}
</script>

<style scoped lang="less">
.avatar-box {
  width: 80px;
  height: 80px;
}

.merchant-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.top-box {
  background: #fff;
}

.content-wrapper {
  min-height: 100px;
}

.detail-text {
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.tenant-detail {
  background: #fff;
}

.tenant-img {
  height: 300px;
  width: 300px;
}

.item-box {
  height: 380px;
  //border: 1px solid #e9e9e9;
  box-sizing: border-box;

  .desc-box {
    height: 170px;
    background: #ffffff;
    color: #a099a9;
  }

  .title-box {
    color: black;
  }

  .img-box {
    height: 200px;
  }

  .avator-warapper {
    height: 40px;
  }

  .tag-box {
    position: absolute;
    top: 10px;
    left: 0;
    width: 55px;
    height: 25px;
    line-height: 25px;
    color: #ffffff;
    border-radius: 0 20px 20px 0;
    background: #cfb887;
  }
}

.empty-box {
  height: 100px;
  color: #8F9BAF;
}

.item-box {
  //height: 370px;
  box-sizing: border-box;

  .desc-box {
    border: 1px solid #e9e9e9;
    height: 170px;
    background: #ffffff;
    color: #a099a9;
  }

  .title-box {
    height: 70px;
    color: black;
  }

  .img-box {
    height: 200px;
  }

  .avator-warapper {
    height: 40px;
  }

  .tag-box {
    position: absolute;
    top: 10px;
    left: 24px;
    width: 55px;
    height: 25px;
    line-height: 25px;
    color: #ffffff;
    border-radius: 0 20px 20px 0;
    background: #cfb887;
  }

  .id-box {
    position: absolute;
    top: 170px;
    left: 40px;
    line-height: 20px;
    padding: 0 10px;
    border-radius: 10px;
    background: rgba(231, 222, 222, 0.6);
  }

  .number-box {
    position: absolute;
    top: 170px;
    right: 40px;
    line-height: 20px;
    padding: 0 10px;
    border-radius: 10px;
    background: rgba(231, 222, 222, 0.6);
  }
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
.copy{
  width: 12px;
  height: 12px;
  margin-left: 2px
}
.copy:hover{
  transform: scale(1.3,1.3);
}
.mr-10{
  margin-right: 100px;
}
.w-as{
  width: 500px;
}
.tenant-desc{
  word-break: break-word;
}
</style>