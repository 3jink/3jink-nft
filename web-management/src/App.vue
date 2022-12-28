<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import storage from 'store'
import { ID_TOKEN } from '@/store/mutation-types'

export default {
  data() {
    return {
      zh_CN
    }
  },
  mounted() {
    this.isReresh()
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  destroyed() {
    // window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.beforeunloadHandler(e))
  },
  //监听是否选择记住我，false的话直接在关闭网站时删除token
  methods: {
    beforeunloadHandler(e) {
      localStorage.leaT = new Date().getTime()
      // if(!storage.get('remember')) storage.remove(ID_TOKEN);
    },
    isReresh() {
      if (new Date().getTime() - localStorage.leaT > 5000) {
        if (!storage.get('remember')) storage.remove(ID_TOKEN)
      }
    }
  },
  computed: {}
}
</script>