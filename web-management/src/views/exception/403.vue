<template>
  <a-result status="403" title="403" sub-title="对不起，您没有权限！">
    <template #extra>
      <a-button type="primary" @click="toHome">
        回到首页
      </a-button>
      <a-button type="primary" @click="toHome2">
        click
      </a-button>
      <a-button type="success" @click="toHome3">
        click
      </a-button>
      <a-button type="success" @click="toHome4">
        click
      </a-button>
      <a-button type="warning" @click="toHome5">
        click
      </a-button>
    </template>
  </a-result>
</template>


<script>
import { userInfo } from '@/api/login'

export default {
  name: 'Exception403',
  methods: {
    async toHome() {
      let req = {
        client_id: 'f7b292feb696eb5b8c8dde8a10578844',
        grant_type: 'password',
        password: '123456',
        user: 'admin421321',
        username: 'admin421321'
      }
      if (!this.$storage.get('qingtao')) {
        this.$storage.set('qingtao', 1000, 2000)
      }

      let res = await userInfo(req)
      // this.$router.push({ path: '/' })
    },
    toHome2() {
      this.$message.success('This is a normal message')
    },
    toHome3() {
      this.$message.error('This is a normal message')
    },
    toHome4() {
      this.$message.info('This is a normal message')
    },
    toHome5() {
      this.$message.warning('This is a normal message')
    }
  }
}
</script>
