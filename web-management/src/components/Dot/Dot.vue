<template>
  <a-badge :status="statusFilter" :text="statusTypeFilter"/>
</template>
<script>
const statusMap = {
  '0': {
    status: 'error',
    text: '已停用'
  },
  '1': {
    status: 'success',
    text: '已启用'
  },
  '2': {
    status: 'success',
    text: '已上线'
  },
  '3': {
    status: 'error',
    text: '异常'
  },
  '已支付':{
    status:'processing',
    text:'已支付'
  },
  '进行中':{
    status:'processing',
    text:'进行中'
  },
  '未开始':{
    status:'default',
    text:'未开始'
  },
  '已结束':{
    status:'default',
    text:'已结束'
  },
  '已上架':{
    status:'success',
    text:'已上架'
  },
  '已下架':{
    status:'error',
    text:'已下架'
  },
  '已核销':{
    status:'success',
    text:'已核销'
  },
  '直播中':{
    status:'success',
    text:'直播中'
  },
  '试播中':{
    status:'warning',
    text:'试播中'
  },
  '待直播':{
    status:'processing',
    text:'待直播'
  },
  '直播结束':{
    status:'default',
    text:'直播结束'
  },
}
export default {
  name: 'Dot',
  props: {
    type: {
      type: String,
      default: '0'
    },
  },
  //返回的值没有改变不触发该函数
  computed:{
    statusFilter(){
      return statusMap[this.type]?.status
    },
    statusTypeFilter(){
      return statusMap[this.type]?.text
    }
  }
}
</script>
<style scoped lang="less">
//.br {
//  border-radius: 50%;
//  width: 10px;
//  height: 10px;
//  margin-right: 4px;
//}
</style>

