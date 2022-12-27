# 数源三街社区版
## Quick Start
1. 启动后端服务 (docker-compose)
```
version: '3'

services:
  nft-server-svc:
    image: 3jink/mini-nft-server:latest
    container_name: nft-server-svc
    restart: unless-stopped
    depends_on:
      - nft-server-prep
      - nft-server-redis
      - nft-server-rabbitmq
      - nft-server-mysql
    environment:
      TZ: "Asia/Shanghai"
      ZFY_APPLICATION_ENV: dev
      APPLICATION_BIND_ADDR: '0.0.0.0:8083'
      DSN_NFT_SERVER: nft-server-mysql
      DSN_NFT_PORT: 3306
      DSN_NFT_USER: root
      DSN_NFT_DB: nft
      DSN_NFT_PWD: /* MYSQL数据库ROOT用户密码 */
      REDIS_NFT_ADDR: nft-server-redis:6379
      REDIS_NFT_PWD: /* Redis密码 */
      REDIS_NFT_DB: /* 单实例模式下，使用的数据库编号，默认为 0 */
      REDIS_NFT_CLUSTER:  /* 是否使用Redis集群模式，默认为false */
      AMQP_URL: amqp://${RabbitMq用户名}:${RabbitMq密码}@nft-server-rabbitmq:5672/
      AMQP_VHOST: /* RabbitMQ虚拟主机，默认为 '/' */
      wallet_account: /* 数字钱包地址 */
      contract_address: /* NFT合约地址 */
    ports:
      - 8083:8083
    volumes:
      - /* 本地存储上传文件的路径 */:/app/uploadfiles

  nft-server-redis:
    image: redis:6.2.5
    container_name: nft-server-redis
    restart: unless-stopped
    depends_on:
      - nft-server-prep
    volumes:
      - ./redis:/data
    command:
      --requirepass "/* Redis密码 */"

  nft-server-rabbitmq:
    image: 3jink/rabbitmq:3.10.2-management-delay
    container_name: nft-server-rabbitmq
    restart: unless-stopped
    depends_on:
      - nft-server-prep
    environment:
      RABBITMQ_DEFAULT_USER: /* RabbitMQ用户名 */
      RABBITMQ_DEFAULT_PASS: /* RabbitMQ密码 */
    volumes:
      - ./rabbitmq:/var/lib/rabbitmq

  nft-server-prep:
    image: 3jink/mini-nft-server:latest
    container_name: nft-server-prep
    restart: 'no'
    command: /app/exec --initdb
    depends_on:
      - nft-server-mysql
    environment:
      ZFY_APPLICATION_ENV: dev
      DSN_NFT_SERVER: nft-server-mysql
      DSN_NFT_PORT: 3306
      DSN_NFT_USER: root
      DSN_NFT_DB: nft
      DSN_NFT_PWD: /* MYSQL数据库ROOT用户密码 */
      SUPER_ADMIN: /* 超管用户登陆所使用的手机号码 */

  nft-server-mysql:
    image: mysql:8.0
    container_name: nft-server-mysql
    restart: unless-stopped
    command: ['mysqld', '--character-set-server=utf8mb4', '--collation-server=utf8mb4_unicode_ci','--default-time-zone=+08:00']
    environment:
      TZ: "Asia/Shanghai"
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: /* MYSQL数据库ROOT用户密码 */
    volumes:
      - ./mysql:/var/lib/mysql
    ports:
      - 3306:3306
```

2. Clone项目源码，构建前端镜像
2.1 开发服务器模式
- 分别进入 web-management 和 web-h5 目录，运行 `docker build ./ -t ${镜像名称}` 构建镜像
- 启动时通过参数 `-e VUE_APP_BASE_URL=${后端服务HOST}` 传入后端服务的访问域名，如: `https://127.0.0.1:8083`
- 参考以下 `docker-compose.yaml`

```
version: '3'

services:
  nft-web-management:
    image: mininft-admin
    container_name: nft-web-management
    restart: unless-stopped
    environment:
      VUE_APP_BASE_URL: http://127.0.0.1:8083
    ports:
      - 8080:8080

  nft-web-h5:
    image: mininft-h5
    container_name: nft-web-h5
    restart: unless-stopped
    environment:
      VUE_APP_BASE_URL: http://127.0.0.1:8083
    ports:
      - 8081:8081
```

2.2 生产模式
- 分别进入 web-management 和 web-h5 目录，修改env.prod文件中的相关参数，然后运行 `yarn build:prod` 编译生成静态文件
- 将 `dist` 目录下的静态文件部署到网页托管服务（如：nginx, oss，cdn等）
