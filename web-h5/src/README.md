# mini-nft-user-h5

ntf项目仓库


# 目录结构描述
    ├── ReadMe.md               // 帮助文档
    
    ├── mixin                   // 全局混入文件

    ├── components              // 全局通用组件
    
    ├── static                  // 静态资源目录
    
    │   ├── css                 // css通用文件
    
    │   └── img                 // 静态图片

    │   └── common              // 地图文件

    ├── store                   // 仓库目录

    ├── util                    // 工具目录
    
    ├── index.html              // 全局入口文件
    
    └── package.json            // 项目依赖包文件



- 安装依赖
```bash
yarn or yarn install
```

- 运行
```bash
yarn serve
```

- 打包
```bash
yarn build:env
```

- 框架

[uniapp](https://uniapp.dcloud.io/)



- 微信支付

[接入weixin-js-sdk 具体使用参考](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)

- 路由

```bash
this.$Router.push({name,params,query})
this.$Router.replace({name,params,query})

获取参数 this.$Route.query.userId;  this.$Route.params.userId;

具体同vue-router类似
```

