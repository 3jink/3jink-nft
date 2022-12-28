<template>
  <view class="bg" >
    <view class="mask flex jc-c ai-c">
      <slot name="content"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "Modal"
}
</script>

<style scoped lang="scss">
.bg{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  z-index: 2221;
}
.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0,0.5);
  z-index: 2222;
}
</style>
