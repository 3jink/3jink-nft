<template>
  <a-dropdown v-if="currentUser && currentUser.Phone" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <ViewPicture
        style="height: 25px;width: 25px;margin-right: 10px" :img-str='currentUser.Avatar||""' isPreview is-circle/>
      <span>{{currentUser.NickName || currentUser.Phone || '暂无信息' }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!--        <a-menu-item v-if="menu" key="center" @click="handleToCenter">-->
        <!--          <a-icon type="user" />-->
        <!--          个人中心-->
        <!--        </a-menu-item>-->
        <!--        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">-->
        <!--          <a-icon type="setting" />-->
        <!--          个人设置-->
        <!--        </a-menu-item>-->
        <!--        <a-menu-divider v-if="menu" />-->
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout"/>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }"/>
  </span>
</template>

<script>
import {Modal} from 'ant-design-vue'
import ViewPicture from '@/components/ViewPicture/ViewPicture'
import storage from 'store'

export default {
  name: 'AvatarDropdown',
  components: {
    ViewPicture
  },
  props: {
    // currentUser: {
    //   type: Object,
    //   default: () => null
    // },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentUser: storage.get('user-info')
    }
  },
  methods: {
    handleToCenter() {
      this.$router.push({path: '/exception/403'})
    },
    handleToSettings() {
      this.$router.push({path: '/exception/404'})
    },
    handleLogout(e) {
      Modal.confirm({
        title: '信息',
        content: '您确定要退出吗？',
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$message.success('退出成功！');
            this.$router.push({name: 'login'})
          })
        },
        onCancel() {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }

  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
