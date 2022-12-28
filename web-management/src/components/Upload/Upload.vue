<template>
  <div>
    <a-upload
      v-if="UType"
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      list-type="picture-card"
      @preview="handlePreview"
      @change="handleChange"
      :customRequest="customRequest"
    >
      <div v-if="fileList.length < maxNum">
        <a-icon type="plus"/>
        <div class="ant-upload-text">
          {{ '上传图片' }}
        </div>
      </div>
    </a-upload>

    <a-upload
      v-if="!UType"
      :file-list="fileList"
      :beforeUpload="beforeUpload"
      :remove="handleRemove"
      @change="handleChange"
      :customRequest="customRequest"
      :disabled="disable"
    >
      <a-button class="btn-sty" v-if="!Only">
        <a-icon type="upload"/>
        上传文件
      </a-button>
    </a-upload>

    <a-modal :maskClosable="false" :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'
import {accessUpload, accessView} from '@/api/common'
import {v4} from 'uuid'
import OSS from 'ali-oss'

const ossService = axios.create({})

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  props: {
    maxNum: {//最大数量  默认上传单张
      type: Number,
      default: 1
    },
    UType: { //上传类型  默认未图片
      type: Boolean,
      default: true
    },
    imgUrl: {   //传入回填的img url的值
      type: String,
      default: ''
    },
    Only: { //只读   默认为false，表示上传
      type: Boolean,
      default: false
    },
    fileType: {
      type: Number,
      /*
      * 1   表示   bieName = nftArts *
      * 2   表示   bieName = nftFile *
      * 3   表示   bieName = userSpace
      * */
      default: 3
    }
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      signedUrl: '',
      fileList: [],
      file: '',
      disable: false,
      //判断是否修改文件
      moveFile: false,
      client: '',
      objectName: ''
    };
  },
  created() {
    if (this.imgUrl) {
      const baseUrl = process.env.VUE_APP_BASE_URL;
      this.imgUrl.split(',').map(item => {
        let req = baseUrl+'/api/v1/file/'+item
        if (!item.trim()) return
        // accessView(req).then(res => {
          let url = req;
          // let name = res.data.metas.fileName//.findLastIndex(v => v === '/')
          this.fileList.push({
            uid: item,
            name:item,
            status: 'done',
            path: item,
            url: url,
            thumbUrl: url
          // })
        // }).catch(() => {
        //
        })
      })
    }
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    handleChange(file) {
      this.fileList = file.fileList.map(item => {
        return {...item, status: 'done'}
      });
      if (!this.UType) {
        let fileList = [...file.fileList];
        //控制文件的上传为1
        fileList = fileList.slice(-1);

        // 2. read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });

        this.fileList = fileList.map(item => {
          return {...item, status: 'done'}
        });
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.$emit('getUrl', this.fileList.map(item => item.path).toString())
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (!this.UType) {
          resolve()
          return
        }
        let size = file.size ? Math.floor(file.size / 1024) : 0
        let name = file.name
        //判断文件名有多种重复格式
        // let arrr = name.split('.')
        // if(arrr.length>2){
        //   this.$message.error(`该文件格式不正确，请重新上传其他文件`)
        //   return
        // }
        let index = name.lastIndexOf('.')
        let suffix = name.substring(index, name.length) // 后缀名
        let arr = ['.jpg', '.jpeg', '.png']
        if (size && size > 1024 * 5) {
          this.$message.error(`上传失败，单个文件不得超过5M`)
          reject()
          return
        }
        if (this.UType) {
          if (arr.filter(item => item === suffix.toLowerCase()).length === 0) {
            this.$message.error(`上传失败，仅支持PNG、JPG、JPEG格式文件`)
            reject()
            return
          }
        } else {
          if (suffix.toLowerCase() !== '.pdf') {
            this.$message.error(`上传失败，仅支持PDF格式文件`)
            reject()
            return
          }
        }
        resolve()
      })
    },
    async customRequest(file) {
      this.file = file;
      file.onProgress()

      // todo  预计将filelist放在获取权限之后，想里面添加path路径
      const files = URL.createObjectURL(file.file)
      const filess = await fetch(files).then(r => r.blob())
      const that = this;
      try{
        const res = await accessUpload(filess)
        this.fileList[this.fileList.length - 1] =
          {
            ...this.fileList[this.fileList.length - 1], path: res.data.file,
            upload: true, file: that.file.file, objectName: res.data.file
          }
        const files = this.fileList.map(item => item.path).toString()
        this.$emit('getUrl', files)
      }catch (e){
        this.fileList.pop()
        this.$message.success('上传失败，请重新上传')
      }
      // }
      file.onSuccess()
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleUpload() {
      return
    },
    download(file) {
    }
  },

};
</script>
<style scoped lang="less">
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
