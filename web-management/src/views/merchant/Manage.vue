<template>
  <div class="content">
    <Breadcrumb title="商户管理"></Breadcrumb>

    <a-modal
      :maskClosable="false"
      :bodyStyle="{'max-height':'70vh','overflow':'auto'}"
      v-model:visible="showModal"
      title="添加商户"
      @ok="handleOk"
      @cancel="$refs.ruleForm.resetFields();showModal = false;form={}"
      width="80%"
      wrapClassName="full-modal"
      :confirm-loading="disabled"
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
          <!--          <a-form-model-item label="统一社会信用代码" ref="socialCode" prop="socialCode">-->
          <!--            <a-input placeholder="请输入统一社会信用代码" v-model="form.socialCode"-->
          <!--                     @blur="() => { $refs.socialCode.onFieldBlur();}"-->
          <!--            />-->
          <!--          </a-form-model-item>-->
          <a-form-model-item label="登录手机号" ref="phone" prop="phone">
            <a-input placeholder="请输入登录手机号" :maxLength="11" v-model="form.phone"
                     @blur="() => { $refs.phone.onFieldBlur();}"
            />
          </a-form-model-item>
          <a-form-model-item label="上传头像" ref="avatar" prop="avatar">
            <upload v-if="showModal" ref="avatarImg" :file-type="1" @getUrl="(url)=>form.avatar = url"
                    :img-url="form['avatar']"></upload>
          </a-form-model-item>
          <a-form-model-item label="上传主图" ref="mainImageFile" prop="mainImageFile">
            <upload v-if="showModal" ref="mainImg" :file-type="1" @getUrl="(url)=>form.mainImageFile = url"
                    :img-url="form['mainImageFile']"></upload>
          </a-form-model-item>
          <a-form-model-item label="客户简介" ref="intro" prop="intro">
            <a-textarea autoSize v-model="form.intro" @blur="() => { $refs.intro.onFieldBlur();}" :max-length="300"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <div class="top-wrapper p-2 br-5 flex jc-sb ai-c m-2">
      <a-button type="primary" @click="showModal = true;">添加商户</a-button>
      <div></div>
      <div class="search-box ta-r">
        <a-radio-group class="mr-2" v-model:value="searchValue.select" @change="$refs.table.refresh()">
          <a-radio-button :value="item.value" :key="item.text" v-for="item in selectValue">{{
              item.text
            }}
          </a-radio-button>
        </a-radio-group>
        <span class="empty-box"></span>
        <a-input-search v-model:value="searchValue.input" placeholder="搜索商户名称" class="w-200"
                        @blur="$refs.table.refresh()"
                        @search="$refs.table.refresh()"
        />
      </div>
    </div>
    <div class="table-box p-2 mt-2">
      <s-table
        style="margin-top: 20px"
        ref="table"
        size="small"
        :columns="columns"
        :rowKey="(record) => record.id"
        :data="getTable"
      >
        <div slot="merchantName" slot-scope="text,record">
          <a @click="$router.push({ path: `/merchant/merchantManage/detail?id=${record.id}` })">{{ text }}</a>
        </div>
        <div slot="isEnabled" slot-scope="text">
          <dot :type="text"></dot>
        </div>
        <div slot="action" slot-scope="text, record">
          <a-popconfirm
            :title="`确定${record.isEnabled==='1'?'停用':'启用'}吗？`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="changeStatus(record)"
          >
            <a class="pr-3">{{ record.isEnabled === '1' ? '停用' : '启用' }}</a>
          </a-popconfirm>
          <a
            @click="$router.push({ path: `/merchant/merchantManage/detail?id=${record.id}` })">
            查看</a>
          <a-popconfirm v-if="record.isEnabled==='1'"
                        :title="`确定将该商户设为默认商户？`"
                        cancel-text="取消"
                        ok-text="确定"
                        @confirm="setMerchant(record.id)"
          >
            <a :class="record.id === defaultMerchant?'green-color':''" class="pl-3">{{
                record.id === defaultMerchant ? '默认' : '设为默认'
              }}</a>
          </a-popconfirm>
        </div>
      </s-table>
    </div>
  </div>
</template>

<script>
import sTable from '@/components/Table'
import upload from '@/components/Upload/Upload'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Dot from '@/components/Dot/Dot'
import {checkPhone, socialCreditCode} from '@/utils/regularCheck'
import {activeMerchant, createMerchant, merchantList, suspendMerchant} from '@/api/merchant'
import {getDefaultMerchant, setDefaultMerchant} from '@/api/setting'

const columns = [
  {
    title: '商户名称',
    dataIndex: 'merchantName',
    scopedSlots: {customRender: 'merchantName'}
  },
  // {
  //   title: '统一社会信用代码',
  //   dataIndex: 'socialCode',
  // },
  {
    title: '发行作品数量',
    dataIndex: 'nftGoodsNum',
  },
  // {
  //   title: '区块链地址',
  //   dataIndex: 'nftAddress',
  // },
  {
    title: '启用状态',
    dataIndex: 'isEnabled',
    scopedSlots: {customRender: 'isEnabled'}
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {customRender: 'action'}
  }
]
export default {
  name: 'Manage',
  data() {
    return {
      defaultMerchant: '',
      disabled: false,
      showMask: false,
      showModal: false,
      selectValue: [
        {text: '全部', value: ''},
        {text: '已停用', value: '0'},
        {text: '已启用', value: '1'}
      ],
      searchValue: {
        select: '', input: ''
      },
      columns,
      form: {
        price: ''
      },
      rules: {
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}, {validator: checkPhone, trigger: 'blur'}],
        merchantName: {required: true, message: '请输入商户名称', trigger: 'change'},
        avatar: {required: true, message: '请上传头像', trigger: 'blur'},
        mainImageFile: {required: true, message: '请上传主图', trigger: 'blur'},
        socialCode: [{required: true, message: '请输入统一社会信用代码', trigger: 'blur'}, {
          validator: socialCreditCode,
          trigger: 'blur'
        }],
        intro: {required: true, message: '请输入客户简介', trigger: 'blur'}
      }
    }
  },
  async created() {
    await this.getMerchant();
  },
  methods: {
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      let opt = {
        paging: req,
        searchItems: [],
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      if (this.searchValue.input) {
        opt.searchItems.push({
          "columnName": "merchant_name",
          "dataType": "",
          "value": this.searchValue.input,
          "visible": true
        })
      }
      if (this.searchValue.select !== '') {
        opt.searchItems.push({
          "columnName": "is_enabled",
          "dataType": "",
          "value": this.searchValue.select,
          "visible": true
        })
      }
      return await merchantList(opt)
    },
    async changeStatus(item) {
      if (item.isEnabled === '1') {
        try {
          await suspendMerchant(item.id)
          this.$message.success('禁用成功')
        } catch (e) {
        }
      } else {
        try {
          await activeMerchant(item.id)
          this.$message.success('启用成功')
        } catch (e) {
        }
      }
      this.$refs.table.refresh()
    },
    handleOk() {
      this.disabled = true
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.showMask = true
          await this.$refs.avatarImg.handleUpload()
          await this.$refs.mainImg.handleUpload()
          let req = {
            "avatar": this.form.avatar,
            "intro": this.form.intro,
            "mainImageFile": this.form.mainImageFile,
            "merchantName": this.form.merchantName,
            // "socialCode": this.form.socialCode,
            phone: this.form.phone
          }
          setTimeout(async () => {
            try {
              await createMerchant(req)
              this.$message.success('新增成功')
              this.disabled = false
              this.$refs.ruleForm.resetFields();
              this.$refs.table.refresh()
              this.showModal = false
              this.showMask = false
            } catch (e) {
              this.disabled = false
              this.showMask = false
            }
          }, 2000)
        } else {
          this.disabled = false
          return false;
        }
      });
    },
    async setMerchant(id) {
      if (id === this.defaultMerchant) return
      try {
        let req = {
          "claims":
            [
              {
                "claimType": "Nft10DefaultMerchantID",
                "claimValue": id
              }
            ]
        }
        let res = await setDefaultMerchant(req)
        await this.getMerchant()
      } catch (e) {
      }
    },
    async getMerchant() {
      let res = await getDefaultMerchant()
      this.defaultMerchant = res.data?.Nft10DefaultMerchantID
    },
  },
  components: {
    sTable, Breadcrumb, upload, Dot
  }
}
</script>

<style scoped lang="less">
.green-color {
  color: #52c41a;
}

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

.w-200 {
  width: 200px;
}
</style>