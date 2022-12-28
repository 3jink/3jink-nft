<template>
  <div class="content">
    <Breadcrumb title="NFT库"></Breadcrumb>
    <a-modal :maskClosable="false"
             :bodyStyle="{'max-height':'70vh','overflow':'auto'}"
             :visible="showModal"
             title="发行NFT"
             @ok="handleOk"
             @cancel="$refs.ruleForm.resetFields();showModal = false;form={}"
             width="70%"
             wrapClassName="full-modal"
    >
      <div class="w-100 modal-wrapper">
        <div v-if="showMask" class="mask flex jc-c ai-c">
          <a-spin size="large"/>
        </div>
        <a-form-model ref="ruleForm" disabled
                      :model="form"
                      :rules="rules"
                      :label-col="{ span: 5 }"
                      :wrapper-col="{ span: 12 }">
          <a-form-model-item :label="`NFT名称`" ref="name" prop="name">
            <a-input placeholder="请输入NFT名称" v-model="form.name" :maxLength="15"
                     @blur="() => { $refs.name.onFieldBlur();}"
            />
          </a-form-model-item>
          <a-form-model-item label="上传主图" ref="mainImg" prop="mainImg">
            <upload v-if="showModal" :file-type="1" @getUrl="uploadMainImg" ref="main"></upload>
          </a-form-model-item>
          <a-form-model-item label="上传详情图" ref="detailImg" prop="detailImg">
            <upload v-if="showModal" :file-type="1" @getUrl="(url)=>form.detailImg = url" ref="detail"
                    :max-num="6"></upload>
          </a-form-model-item>
          <a-form-model-item label="上传NFT文件" ref="nftFile" prop="nftFile">
            <upload v-if="showModal" :file-type="2" @getUrl="(url)=>form.nftFile = url" ref="file"
                    :u-type="false"></upload>
          </a-form-model-item>
          <a-form-model-item label="选择版权方" v-if="!merId" ref="merchantId" prop="merchantId">
            <a-select
              show-search
              @blur="$forceUpdate()"
              v-model="form.merchantId"
              placeholder="选择版权方"
              option-filter-prop="children"
              :filter-option="filterOption"
            >
              <a-select-option v-for="item in merchantList" :key="item.id" :value="item.id">
                {{ item['merchantName'] }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
<!--          <a-form-model-item label="是否是合成材料" prop="isCompundPiece">-->
<!--            <a-checkbox-group v-model="form.isCompundPiece">-->
<!--              <a-checkbox value="1" name="isCompundPiece">-->
<!--                是合成材料-->
<!--              </a-checkbox>-->
<!--            </a-checkbox-group>-->
<!--          </a-form-model-item>-->
        </a-form-model>
      </div>
    </a-modal>
    <div class="top-wrapper p-2 br-5 flex jc-sb ai-c m-2">
      <div>
        <a-button type="primary" @click="showModal = true">发行NFT</a-button>
      </div>
      <a-col class="search-box">
        <a-radio-group class="mr-2" v-model:value="searchValue.select" @change="current=1;getNFTList(1,12)">
          <a-radio-button :value="item.value" :key="item.text" v-for="item in selectValue">{{ item.text }}
          </a-radio-button>
        </a-radio-group>
        <span class="empty-box"></span>
        <div class="mr-1 w-260" v-if="!merchantPermission">
          <a-select style="width: 260px"
                    placeholder="选择商户"
                    v-model="searchValue.merchantId"
                    @change="current=1;getNFTList(1,12)"
          >
            <a-select-option value="">
              全部商户
            </a-select-option>
            <a-select-option v-for="(item,index) in merchantList" :key="index" :value="item['id']">
              {{ item['merchantName'] }}
            </a-select-option>
          </a-select>
        </div>
        <a-input-search v-model:value="searchValue.input" placeholder="搜索NFT" class="w-200"
                        @blur="current=1;getNFTList(1,12)"
                        @search="current=1;getNFTList(1,12)"
        />
      </a-col>
    </div>
    <div class="m-2">
      <a-row v-if="nftList.length>0" class="content-wrapper" :gutter="48">
        <a-col @click="$router.push({path:`/NFT/library/detail?artId=${item.id}`})"
               class="item-box mt-3"
               v-for="item in
        nftList"
               :key="item.id" :xs="24"
               :sm="24"
               :md="12"
               :lg="8"
               :xl="8" :xxl="6">
          <div class="item-box">
            <view-picture :img-str="item['mainImageFile']" class="w-100 img-box" height="200" width="100%">
            </view-picture>
            <div class="desc-box">
              <div class="p-2 title-box fw-b fs-18">{{ item['name'] }}</div>
              <div class="flex jc-sb px-2 ai-c mb-1">
                <div class="mr-3">合约地址</div>
                <div :title="item['contractAddress']" class="flex-1 text-ellipsis-1 ta-r flex ai-c">
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
              <div class="flex jc-sb px-2 mb-1">
                <div>发行时间</div>
                <div>{{ item['createdAt'] }}</div>
              </div>
              <div class="flex px-2 mb-1 jc-fs ai-c">
                <view-picture :img-str="item['merchant~avatar']" :is-circle="true"
                              class="avatar-box"></view-picture>
                <div class="ml-1">{{ item['merchant~merchantName'] }}</div>
              </div>
            </div>

            <div class="tag-box ta-c fs-12" :style="{'background':states[item['approvalJoinView~state']]}">
              {{ statesWord[item['approvalJoinView~state']]==='待审批'?'待审批':statesWord[item['approvalJoinView~state']] }}
            </div>
          </div>
        </a-col>
      </a-row>
      <div v-if="nftList.length>0" class="flex jc-fe p-1">
        <a-pagination size="small" v-model="current" @change="pageChange" :pageSizeOptions="['12','24','36','48']"
                      :total="nftTotalCount"
                      @showSizeChange="changeSize"
                      show-size-changer
                      show-quick-jumper
                      :defaultPageSize="12"/>
      </div>
      <div v-else class="data-empty flex jc-c ai-c w-100">暂无数据</div>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/Upload'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import { createNFT, NFTList } from '@/api/NFT'
import { merchantList } from '@/api/merchant'
import { tableRowFormat } from '@/utils/tableUtils'
import viewPicture from '@/components/ViewPicture/ViewPicture'
import { Copy } from '@/core/icons'
import storage from 'store'

export default {
  name: 'library',
  data() {
    return {
      showMask: false,
      current: 1,
      nftTotalCount: 0,
      selectValue: [
        {text: '全部', value: ''},
        // {text: '审批中', value: 'NftArtApprovalProcessView '},
        {text: '已使用', value: 'UsedNftArtView'},
        {text: '未使用', value: 'UnusedNftArtView'},
        // {text: '已上架', value: 'OnsellNftArtView'},
        // {text: '已下架', value: 'OffsellNftArtView'},
        // {text: '已驳回', value: 'NftArtApprovalRejectedView'}
      ],
      states:{'待审批':'#DEC578','已通过':'#7ACA65','已拒绝':'#F91E40','':'#7ACA65'},
      statesWord:{'待审批':'待审批','已通过':'已通过','已拒绝':'已拒绝','':'已通过'},
      searchValue: {
        input: '',
        select: '',
        merchantId:''
      },
      showModal: false,
      form: {
        name: '',
        mainImg: '',
        merchantId: '',
        nftFile: '',
        isMaterials:[],
      },
      rules: {
        name: [
          {required: true, message: '请输入NFT名称', trigger: 'blur'}
        ],
        mainImg: [
          {required: true, message: '请上传主图', trigger: 'blur'}
        ],
        nftFile: [
          {required: true, message: '请上传NFT文件', trigger: 'blur'}
        ],
        merchantId: [
          {required: true, message: '请选择版权方', trigger: 'blur'}
        ]
      },
      merchantID: '',
      merchantList: [],
      nftList: []
    }
  },
  components: {
    Breadcrumb, Upload, viewPicture, Copy
  },
  created() {
    this.getMerchantList()
    this.getNFTList()
  },
  methods: {
    async getMerchantList() {
      if (this.merId) return
      let req = {
        "paging": {
          "pageNumber": 1,
          "pageSize": 30
        },
        "searchItems": [
          {
            "columnName": "is_enabled",
            "value": '1'
          }
        ]
      }
      try {
        let res = await merchantList(req)
        this.merchantList = tableRowFormat(res).data.list
        if (this.merchantList.length > 0) this.form.merchantId = this.merchantList[0].id
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
    uploadMainImg(url, role) {
      this.form.mainImg = url
      this.$refs.mainImg.onFieldBlur()
    },
    async getNFTList(num = 1, size = 12) {
      let req = {
        "paging": {
          "pageNumber": num,
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
      if (this.searchValue.input) {
        req.searchItems.push({
          "columnName": "name",
          "value": '%' + this.searchValue.input + '%'
        })
      }
      if (this.merId) {
        req.searchItems.push({
          'columnName': 'luMerchantId',
          value: this.merId
        })
      }
      if(this.searchValue.merchantId){
        req.searchItems.push({
          'columnName': 'luMerchantId',
          value: this.searchValue.merchantId
        })
      }
      try {
        let res = await NFTList(req, this.searchValue.select)
        this.nftList = tableRowFormat(res)?.data.list
        this.nftTotalCount = res.data.paging.totalCount
      } catch (e) {
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.showMask = true
          let req = {
            "detailImageFiles": this.form.detailImg,
            "issueNum": '200',
            "mainImageFile": this.form.mainImg,
            "merchantId": this.merId || this.form.merchantId,
            "name": this.form.name,
            "story": '',
            "nftFile": this.form.nftFile,
            "isCompundPiece":'0'
          }
          await Promise.all([this.$refs.main.handleUpload(), this.$refs.file.handleUpload(), this.$refs.detail.handleUpload()]).then(async () => {
            setTimeout(async () => {
              try {
                await createNFT(req)
                this.showModal = false
                //清除等待状态
                this.$message.destroy()
                //设置表单为空
                this.resetForm()
                this.form.mainImg = ''
                this.form.detailImg = ''
                this.$message.success(`创建成功${this.merId ? ',等待管理员审核' : ''}`)
                this.showModal = false
                this.showMask = false
                await this.getNFTList()
              } catch (e) {

                this.showMask = false
              }
            }, 2000)
          })
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.form = {
        name: '',
        mainImg: '',
        merchantId: '',
        num: null,
        nftFile: ''
      }
    },
    pageChange(num, size) {
      this.getNFTList(num, size)
    },
    changeSize(num, size) {
      this.getNFTList(num, size)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  }
}
</script>

<style scoped lang="less">
.top-wrapper {
  background: #ffffff;
}

.search-box {
  display: flex;
}

.content-wrapper {
  min-height: 100px;
}

.empty-box {
  display: inline-block;
  width: 20px;
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
    background: #7ACE4C;
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

.data-empty {
  height: 100px;
  color: #8F9BAF;
  background: #ffffff;
}

.avatar-box {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
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

.copy {
  width: 12px;
  height: 12px;
  margin-left: 2px
}

.copy:hover {
  transform: scale(1.3, 1.3);
}
.w-260{
  width: 260px;
}
</style>