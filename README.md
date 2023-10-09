lightning-client 1.0
===============

> 运行环境要求 vue2  node 16.19.1 npm 9.19.3 

## vue.config.js配置测试服务
```
const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
configureWebpack:{
	plugins:[
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        // test: /.js$|.html$|.json$|.css/,
        test: /.js$|.json$|.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        // deleteOriginalAssets: true // 删除原文件
      })
    ]
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //配置代理跨
  devServer: {
    proxy: {
     
      "/api": {
        target: "http://127.0.0.1:8078/",  
        pathRewrite: {
          '^/api': '/home'
        }
      },

      "/static": {
        target: "http://127.0.0.1:8078/",
      },

      "/audio": {
        target: "http://127.0.0.1:8078/storage",
      },
      

    },
    
  },
  
})

```
## 配置 socket
```
使用的插件是：socket.io
 地址 http://192.168.1.108:9502

```
```
 //用户登录了
   if(token != null && to.meta.requiresAuth ){
     //已经登录而且还想去登录------不行
        try {
          // 获取房间信息
          await store.dispatch('getRoomInfo');
          let room_id = store.state.user.roomInfo.room_id
          // 注册 socket
          Vue.use(new VueSocketIO({
            debug: true,
            connection: Manager.connect("http://192.168.1.108:9502", {
              connectionStateRecovery: {
                // the backup duration of the sessions and the packets
                maxDisconnectionDuration: 2 * 60 * 1000,
                // whether to skip middlewares upon successful recovery
                skipMiddlewares: true,
              },
                reconnectionDelayMax: 100,
                transports: ["websocket"],//默认使用的请求方式
              
                query: {
                  "token":store.state.user.token,
                  "room": room_id
               },
                autoConnect: false,//是否自动连接 
              })
            
          }));
          
          next();
        } catch (error) {
          
          //token失效从新登录
          await store.dispatch('userLogout');
          next({ name: 'Login' })
        }
```

## 配置 nginx 
```
nginx 用户访问打包之后的代码，代理跳转到service端获取数据。替代node服务器
nginx 客户端服务和服务端公用lightning_nginx容器

```
```

server {
   listen 80;
   index index.php index.html  index.htm;
   server_name www.xiaogongtx.com;
   rewrite ^(.*) https://$server_name$1 permanent; #此句最关键


}

server {
   listen 443 ssl;
   index index.php index.html  index.htm;
   server_name www.xiaogongtx.com;
   ssl_certificate      /etc/nginx/conf.d/cert/scs1695721843916_xiaogongtx.com_server.crt; #替换成您的证书文件的路径。
    ssl_certificate_key  /etc/nginx/conf.d/cert/scs1695721843916_xiaogongtx.com_server.key; #替换成您的私钥文件的路径。
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers  HIGH:!aNULL:!MD5; #加密套件。
    ssl_prefer_server_ciphers  on;
    # 开启gzip
    gzip on;

    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;

    # 设置压缩所需要的缓冲区大小
    gzip_buffers 16 64k;

    # 设置gzip压缩针对的HTTP协议版本
    gzip_http_version 1.1;

    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间
    gzip_comp_level 9;

    gzip_types text/plain application/x-javascript application/javascript text/javascript text/css application/xml application/x-httpd-php image/jpeg image/gif image/png;

    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;

    root /home/www/lightning-client/dist;

   location /{
       try_files $uri $uri/ /index.html;
   }

   location  /api {
           include  uwsgi_params;
           proxy_set_header   Host             $host;
           proxy_set_header   x-forwarded-for  $remote_addr;
           proxy_set_header   X-Real-IP        $remote_addr;
           proxy_pass   http://127.0.0.1:8078;
           rewrite  ^/api/(.*)$ /home/$1 break;
        }

   location  ^~/static/ {
              proxy_pass   http://127.0.0.1:8078;
   }


}

```
## 下载包

```
npm install
```

### 运行服务

```
npm run serve
```

### 打包 生成 dist

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

Customize configuration

 See [Configuration Reference](https://cli.vuejs.org/config/).

# 笔记

* emoji 插件

cnpm i v-emoji-picker

# 问题

```
1、执行npm出现版本冲突

npm run install  --legacy-peer-deps
   

```
