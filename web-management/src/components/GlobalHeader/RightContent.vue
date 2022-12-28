<template>
  <div :class="wrpCls">
<!--    <a-icon type="search" style="font-size: 20px"/>-->
<!--    <a-badge count="100" :overflowCount="10000">-->
<!--      <a-icon type="bell" style="font-size: 20px" class="ml-2"/>-->
<!--    </a-badge>-->
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls"
                     style="margin-left: 20px;display: flex;" />
<!--    <select-lang :class="prefixCls" />-->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import storage from 'store'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action',
    },
    isMobile: {
      type: Boolean,
      default: () => false,
    },
    topMenu: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMenu: true,
      currentUser: {},
    }
  },
  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
      }
    },
  },
}
</script>
