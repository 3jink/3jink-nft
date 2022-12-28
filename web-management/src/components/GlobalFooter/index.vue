<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a>copyright@成都今赛科技有限公司</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
