<template>
  <div class='bg-w pt-2 pl-3'>
      <a-breadcrumb>
        <a-breadcrumb-item><a @click='toHome'>首页</a></a-breadcrumb-item>
        <a-breadcrumb-item><a  @click='toPage1'>{{ name1 }}</a></a-breadcrumb-item>
        <a-breadcrumb-item><a v-if='path2'>{{ name2 }}</a></a-breadcrumb-item>
      </a-breadcrumb>
    <div class='py-1 fw-b fs-18 fc-bl'>{{ title }}</div>
  </div>
</template>

<script>

import storage from 'store'
import { constantRouterMap } from '@/config/router.config'
export default {
  name:'Breadcrumb',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      name1:'',
      name2:'',
      path1:'',
      path2:'',
    }
  },
  created() {
    const path = storage.get('current-path')
    const pathArr=path.split('/');
    const routeArr=constantRouterMap.slice(2,100)
    const pathInside=pathArr.join('/')
    routeArr.map((item,index)=>{
      item.children.forEach((iitem,iindex)=>{
        if(iitem['path'] === pathInside&&pathArr.length===3){
          this.name1 = iitem['value'];
          this.path1 = path;
        }
        if(iitem['path'] === pathInside&&pathArr.length===4){
          this.name2 = iitem['value'];
          this.path2 = path;
        }
      })
      for(let i = 0;i<item.children.length;i++){
        if(item.children[i]['path'] === pathInside&&pathArr.length===3){
          this.name1 = item.children[i]['value'];
          this.path1 = path;
        }
        if(item.children[i]['path'] === pathInside&&pathArr.length===4){
          this.name1 = item.children[i-1]['value'];
          this.path1 = item.children[i-1]['path']

          this.name2 = item.children[i]['value'];
          this.path2 = item.children[i]['path'];
        }
      }
    })
  },
  methods: {
    toHome(){
      this.$router.push({
        path:'/NFT/library'
      })
    },
    toPage1(){
      this.$router.push({
        path:this.path1
      })
    },
  }
}
</script>

<style scoped>
.bg-w {
  background: white;
  border-radius: 5px;
}
.fc-bl{
  color: black;
}
</style>