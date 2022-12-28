<template>
  <a-result status="500" title="500" sub-title="对不起，产生了不符合预期的错误！">
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception500',
  methods: {
    toHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
