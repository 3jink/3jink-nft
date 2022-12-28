<template>
  <div>
    <Breadcrumb title="广告"></Breadcrumb>
    <!--    详情弹窗-->
    <a-modal
      :title="row['merchant~merchantName']"
      :visible="visible"
      :width="700"
      okText="编辑"
      @cancel="cancel"
      @ok="editDetail(row,'detail')"
    >
      <div class="ml-4 mt-2">
        <view-picture v-if="row['imageFile']" :img-str="row['imageFile']" class="img-detail"></view-picture>
        <view-picture v-else img-str="" class="img-detail"></view-picture>
        <div class="flex ai-c mt-4">
          <div>广告名称：</div>
          <div>{{ row['name'] }}</div>
        </div>
        <div class="flex ai-c mt-1">
          <div>商户名称：</div>
          <a @click="$router.push('/merchant/merchantManage/detail?id='+row['luMerchantId'])">{{
              row['merchant~merchantName']
            }}</a>
        </div>
        <div class="flex ai-c mt-1">
          <div>广告链接：</div>
          <a @click.stop="copy(row['reidrectUrl'])">{{ row['reidrectUrl'] }}</a>
        </div>
        <div class="flex ai-c mt-1">
          <div>广告排序：</div>
          <div>{{ row['sortIndex'] }}</div>
        </div>
        <div class="flex ai-c mt-1">
          <div>展示位置：</div>
          <div>{{ row['areaTypeFlag'] ? formatLocation(row['areaTypeFlag']) : '' }}</div>
        </div>
        <div class="flex ai-c mt-1">
          <div>状态：</div>
          <div>{{ row['state'] }}</div>
        </div>
        <div class="flex ai-c mt-1">
          <div>开启时间：</div>
          <div>{{ row['createdAt'] }}</div>
        </div>
      </div>
    </a-modal>
    <!--    编辑弹窗-->
    <a-modal
      :title="titleEdit"
      :visible="visibleEdit"
      :width="1200"
      :confirm-loading="disabled"
      @cancel="cancelEdit"
      @ok="submit"
    >
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="广告名称" prop="name">
          <a-input autocomplete="off" placeholder="请输入广告名称" :maxLength="15" v-model="ruleForm.name"/>
        </a-form-model-item>
        <a-form-model-item has-feedback label="上传广告图" prop="photoFile">
          <div class="flex">
            <upload v-if="temp" :file-type="1" @getUrl="(url)=>{ruleForm.photoFile = url;$refs.ruleForm.validate(()=>{return})}"
                    ref="upload" :img-url="ruleForm.photoFile"
            ></upload>
            <div class="ml-2 fc-bf">请上传900*296尺寸图片</div>
          </div>
        </a-form-model-item>
        <a-form-model-item has-feedback label="选择商户" prop="merchantId">
          <a-select
            show-search
            @blur="$forceUpdate()"
            placeholder="选择商户"
            option-filter-prop="children"
            v-model="ruleForm.merchantId"
          >
            <a-select-option :value="item['id']" v-for="(item,index) in merchantList" :key="index">
              {{ item['merchantName'] }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="广告链接" prop="url">
          <a-input autocomplete="off" placeholder="请输入广告链接" :maxLength="300" v-model="ruleForm.url" allowClear/>
        </a-form-model-item>
        <a-form-model-item has-feedback label="广告排序" prop="sort">
          <a-input autocomplete="off" placeholder="请输入广告在第几位展示" :maxLength="20" v-model="ruleForm.sort"
                   allowClear/>
        </a-form-model-item>
        <a-form-model-item label="展示位置" prop="locations">
          <a-checkbox-group v-model="ruleForm.locations">
            <a-checkbox value="home" name="locations">
              首页
            </a-checkbox>
            <a-checkbox value="detail" name="locations">
              藏品详情页
            </a-checkbox>
            <a-checkbox value="discover" name="locations">
              发现页
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>


    <div class="mt-2 mx-2">
      <div class="bg-w py-2 px-3 flex jc-sb">
        <a-button type="primary" v-show="this.permission"
                  @click="addAdvertisement">发布广告
        </a-button>
        <div class="flex ai-c">
          <!--          <div class="mr-2">-->
          <!--            <a-radio-group button-style='solid' @change="$refs.table.refresh()" v-model="form.stateSearch">-->
          <!--              <a-radio-button :value='-1'>-->
          <!--                全部-->
          <!--              </a-radio-button>-->
          <!--              <a-radio-button :value='0'>-->
          <!--                未开始-->
          <!--              </a-radio-button>-->
          <!--              <a-radio-button :value='1'>-->
          <!--                进行中-->
          <!--              </a-radio-button>-->
          <!--              <a-radio-button :value='2'>-->
          <!--                已结束-->
          <!--              </a-radio-button>-->
          <!--            </a-radio-group>-->
          <!--          </div>-->
          <a-input-search placeholder="搜索广告" style="width: 300px" @blur="$refs.table.refresh(true)"
                          @search="$refs.table.refresh(true)"
                          v-model="form.inpSearch"/>
        </div>
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
          <div slot="imageFile" slot-scope="text,record">
            <view-picture :img-str="text" class="pic-img"></view-picture>
          </div>
          <div slot="reidrectUrl" slot-scope="text,record" class="flex ai-c fc-blue">
            <a class="w-150"  @click.stop="copy(text)">{{ text }}</a>
<!--            <Copy class="copy"-->
<!--                  @click.stop="copy(text)"></Copy>-->
          </div>
          <a slot="name" slot-scope="text, record" @click="watchDetail(record)">{{ record['name'] }}</a>
          <a slot="merchant~merchantName" slot-scope="text,record"
             @click="$router.push('/merchant/merchantManage/detail?id='+record['luMerchantId'])">{{
              text
            }}</a>
          <div slot="areaTypeFlag" slot-scope="text,record">{{ formatLocation(text) }}</div>
          <div slot="state" slot-scope="text,record">
            <Dot :type="text==='上架'?'已上架':'已下架'"></Dot>
          </div>
          <div slot="action" slot-scope="text, record">
            <a-popconfirm
              :title="`确定${record['state']==='上架'?'下架':'上架'}吗？`"
              ok-text="确定"
              cancel-text="取消"
              @confirm="changeState(record)"
            >
              <a>{{ record['state']==='上架'?'下架':'上架' }}</a>
            </a-popconfirm>
            <a @click="editDetail(record)" class="ml-2">编辑</a>
            <a @click="watchDetail(record)" class="ml-2">查看</a>
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
import viewPicture from '@/components/ViewPicture/ViewPicture'
import {Copy} from '@/core/icons'
import {isNumber} from '@/utils/regularCheck'
import {merchantList} from '@/api/merchant'
import {create, bannerList, bannerEdit, bannerDisable, bannerEnable} from '@/api/advertisement'

export default {
  name: 'Manage',
  components: {
    Upload, STable, Dot, Breadcrumb, viewPicture, Copy
  },
  data() {
    return {
      disabled:false,
      temp: true,
      merchantList: [],
      form: {
        inpSearch: '',
        stateSearch: -1,
      },
      columns: [
        {
          title: '广告名称',
          dataIndex: 'name',
          scopedSlots: {customRender: 'name'},
        },
        {
          title: '广告图',
          dataIndex: 'imageFile',
          scopedSlots: {customRender: 'imageFile'},
        },
        {
          title: '广告链接',
          dataIndex: 'reidrectUrl',
          scopedSlots: {customRender: 'reidrectUrl'},
          width: 200
        },
        {
          title: '商户名称',
          dataIndex: 'merchant~merchantName',
          scopedSlots: {customRender: 'merchant~merchantName'},
        },
        {
          title: '广告排序',
          dataIndex: 'sortIndex',
          scopedSlots: {customRender: 'sortIndex'},
          width: 100,
        },
        {
          title: '展示位置',
          dataIndex: 'areaTypeFlag',
          scopedSlots: {customRender: 'areaTypeFlag'},
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: {customRender: 'state'},
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          fixed: 'right'
        }
      ],
      visible: false,
      row: {},
      ruleForm: {
        name: '',
        photoFile: '',
        merchantId: '',
        url: '',
        sort: '',
        locations: []
      },
      rules: {
        name: [{required: true, message: '请输入广告名称', trigger: 'change'}],
        photoFile: [{required: true, message: '请上传广告图', trigger: 'change'}],
        merchantId: [{required: true, message: '请选择商户', trigger: 'change'}],
        url: [{required: true, message: '请输入广告链接', trigger: 'change'}],
        sort: [{required: true, message: '请输入排序位置', trigger: 'change'}, {
          validator: isNumber,
          trigger:
            'change'
        }],
      },
      layout: {
        labelCol: {span: 3},
        wrapperCol: {span: 16}
      },
      titleEdit: '添加广告',
      visibleEdit: false,
    }
  },
  async created() {
    //获取所有商户列表
    try {
      const res = await merchantList({}, '')
      this.merchantList = this.transformData(res.data.rows)
    } catch (e) {
      return
    }
  },
  methods: {
    formatLocation(text) {
      let resultArr = []
      const arr = text.split(',')
      if (arr.includes('home')) {
        resultArr.push('首页')
      }
      if (arr.includes('detail')) {
        resultArr.push('藏品详情页')
      }
      if (arr.includes('discover')) {
        resultArr.push('发现页')
      }
      return resultArr.join(' | ')
    },
    //获取列表
    async getTable(param) {
      const req = Object.assign({}, param)
      req.pageNumber = req.pageNo
      delete req.pageNo
      const searchParams = [];
      let sorting=null;
      if (this.form.inpSearch) {
        searchParams.push({
          columnName: 'name',
          value: this.form.inpSearch
        })
      }
      sorting={
        columnNames: ['createdAt'],
        direction: 'desc'
      }
      const reqData = {
        paging: req,
        searchItems: searchParams,
        sorting
      }
      return await bannerList(reqData)
    },
    //点击查看详情
    watchDetail(item) {
      this.visible = true
      this.row = item
    },
    enterDetail(row) {
      this.$router.push({
        path: '/user/userManage/detail?id=' + row['userId']
      })
    },
    cancel() {
      this.visible = false
    },
    //新增
    addAdvertisement() {
      this.temp = true
      this.ruleForm = {
        name: '',
        photoFile: '',
        merchantId: '',
        url: '',
        sort: '',
        locations: []
      },
        this.visibleEdit = true
      this.titleEdit = '新增广告';
      this.$refs?.ruleForm?.resetFields();
    },
    //编辑操作
    editDetail(item, temp) {
      this.temp = true
      if (temp = 'detail') this.visible = false
      this.titleEdit = '编辑广告'
      this.row = item
      this.ruleForm = {
        name: item['name'],
        photoFile: item['imageFile'],
        merchantId: item['luMerchantId'],
        url: item['reidrectUrl'],
        sort: item['sortIndex'],
        locations: item['areaTypeFlag'].split(',')
      }
      this.visibleEdit = true
    },
    cancelEdit() {
      this.temp = false
      this.visibleEdit = false
      this.$refs.ruleForm.resetFields();
    },
    //提交编辑表单
    submit() {
      this.disabled=true;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          await this.$refs.upload.handleUpload()
          const {
            name,
            photoFile,
            merchantId,
            url,
            sort,
            locations
          } = this.ruleForm
          const reqData = {
            name,
            imageFile: photoFile,
            merchantId: merchantId,
            areaType: locations.toString(),
            sortIndex: sort,
            redirectUrl: url
          }
          try {
            if (this.titleEdit === '新增广告') {
              await create(reqData)
              this.$message.success('新增广告成功')
              this.disabled=false;
            } else {
              await bannerEdit(reqData, this.row['id'])
              this.$message.success('编辑广告成功')
              this.disabled=false;
            }
            this.$refs.table.refresh(true)
            this.visibleEdit = false
          } catch (e) {
            this.disabled=false;
            return
          }
          this.temp = false
        } else {
          this.disabled=false;
          this.$message.error('请检查表单必填项')
        }
      })
    },
    //上下架处理
    async changeState(row) {
      if (row['state'] === '上架') {
        try {
          await bannerDisable({id: row['id']})
          this.$message.success('下架成功')
          this.$refs.table.refresh(true)
        } catch (e) {
          return
        }
      } else {
        try {
          await bannerEnable({id: row['id']})
          this.$message.success('下架成功')
          this.$refs.table.refresh(true)
        } catch (e) {
          return
        }
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
  }
}
</script>

<style scoped>
.bg-w {
  background: white;
  border-radius: 5px;
}

.pic-img {
  width: 200px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
}

.img-detail {
  width: 350px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
}

.fc-bf {
  color: #BFBFBF;
}

.copy {
  width: 12px;
  height: 12px;
  margin-left: 6px
}

.copy:hover {
  transform: scale(1.3, 1.3);
}
.fc-blue{
  color: #2EA0F6;
}
.w-150{
  width: 150px;
}
</style>