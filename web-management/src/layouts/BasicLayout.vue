<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :collapsedButtonRender="false"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    v-bind="settings"
    :siderWidth="220"
  >
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template v-slot:menuHeaderRender>
      <div class="flex ai-c">
        <!-- <logo-svg /> -->
        <img v-if="!merId"
          src="../assets/icons/logo.png"
          style="width: 50px; height: auto"
        />
        <viewPicture v-else :img-str="detail['avatar']" :is-circle="true" style="width: 50px;
        height: auto;border-radius:
        50%" />

         <div v-if="!merId">
           <h1>NFT</h1>
           <span style="color: white;margin-left: 10px;">管理端</span>
         </div>
        <div class="text-ellipsis-1" style="color: #fff;width: 130px" v-else>
          {{detail['merchantName']}}
        </div>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template v-slot:headerContentRender>
      <div>
          <a-tooltip title="返回上一级" @click="$router.back()" v-if="$route.path.includes('/detail')">
          <a-icon
            type="left"
            style="font-size: 18px; cursor: pointer;margin-left: 15px"
            @click="reload"
          />
        </a-tooltip>
        <a-tooltip title="刷新页面">
          <a-icon
            type="reload"
            style="font-size: 18px; cursor: pointer;margin-left: 15px;display: inline-block"
            @click="reload"
          />
        </a-tooltip>
      </div>
    </template>

    <setting-drawer
      v-if="isDev"
      :settings="settings"
      @change="handleSettingChange"
    >
      <div style="margin: 12px 0">This is SettingDrawer custom footer content.</div>
    </setting-drawer>
    <template v-slot:rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme"
      />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import viewPicture from '@/components/ViewPicture/ViewPicture'
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { mapState } from 'vuex'
import storage from 'store'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import {merchantList} from '@/api/merchant'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    viewPicture
  },
  data() {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end
      isDev: false,

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: process.env.NODE_ENV==='development' ? '#f5222d' : '#11A0F8',
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,
      //本地存储端口
      port: '',
      detail:{}
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters
    })
  },
  created() {

    const routes = this.mainMenu.find((item) => item.path === '/')
    this.menus = (routes && routes.children) || []
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
    //取出本地存储中的端口
    this.port = storage.get('port')
    this.getMerDetail()
  },
  mounted() {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
    // console.log('moubnted',process.env.NODE_ENV !== 'production',process.env.VUE_APP_PREVIEW === 'true',this.settings.primaryColor)
    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
      // console.log('设置成功',this.settings.primaryColor)
      updateTheme(this.settings.primaryColor)
    }
  },
  methods: {
    async getMerDetail() {

      let opt = {
        paging: {pageSize: 10, pageNumber: 1},
        sorting: {
          "columnNames": [
            "createdAt"
          ],
          "direction": "desc"
        }
      }
      let res =  await merchantList(opt,this.merId)
      this.detail = this.transformData(res.data.rows)[0]
    },
    handleMediaQuery(val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse(val) {
      this.collapsed = val
    },
    handleSettingChange({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    reload() {
      window.location.reload()
    }
  }
}
</script>

<style lang="less">
@import './BasicLayout.less';
</style>
