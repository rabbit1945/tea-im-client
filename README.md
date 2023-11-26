<a name="RlEyN"></a>

## 下载IM项目 创建tea-im目录

:::info
git clone git@gitee.com:gzy1991/tea-im.git
:::
<a name="ELNaK"></a>

## 进入tea-im目录

<a name="y0u2l"></a>

### 下载服务端

:::info
git clone git@gitee.com:gzy1991/tea-im-service.git
:::
<a name="A7wiD"></a>

### 下载前端

:::info
git clone git@gitee.com:gzy1991/tea-im-client.git
:::

<a name="zNQyu"></a>

## docker 安装环境

<a name="gea8Y"></a>

### 进入.teaIm 目录,执行下面指令，构建环境。

```
docker compose up -d
```

<br />
<a name="sMwZw"></a>
### 配置nginx 
```


server {
listen 8078;
index index.php index.html;
server_name api.teaim.cn;
root /home/www/tea-im-service/public;
location / {

            if (!-e $request_filename) {
               rewrite  ^(.*)$  /index.php?s=$1  last; break;
            }
        }

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
            error_log off;
            access_log /dev/null;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
            error_log off;
            access_log /dev/null;
        }
       location ~ [^/]\.php(/|$)
       	{
       		try_files $uri =404;
       		fastcgi_pass  php-fpm:9000;
       		fastcgi_index index.php;
       		fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
            include   fastcgi_params;
            set $real_script_name $fastcgi_script_name;
            if ($fastcgi_script_name ~ "^(.+?\.php)(/.+)$") {
            set $real_script_name $1;
            set $path_info $2;
             }
       	}

}

```

```

# server {

# listen 80;

# index index.php index.html  index.htm;

# server_name teaim.cn;

# rewrite ^(.*) https://$server_name$1 permanent; #此句最关键

#

#

# }

server {
listen 443 ssl;
index index.php index.html index.htm;
server_name teaim.cn;
ssl_certificate /etc/nginx/conf.d/cert/teaim.cn_nginx/teaim.cn_bundle.crt; #替换成您的证书文件的路径。
ssl_certificate_key /etc/nginx/conf.d/cert/teaim.cn_nginx/teaim.cn.key; #替换成您的私钥文件的路径。
ssl_session_cache shared:SSL:1m;
ssl_session_timeout 5m;
ssl_ciphers HIGH:!aNULL:!MD5; #加密套件。
ssl_prefer_server_ciphers on;

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

    root /home/www/tea-im-client/dist;

location /{
try_files $uri $uri/ /index.html;
}

location /api {
include uwsgi_params;
proxy_set_header Host $host;
proxy_set_header x-forwarded-for $remote_addr;
proxy_set_header X-Real-IP $remote_addr;
proxy_pass   http://127.0.0.1:8078;

# rewrite ^/api/(.*)$ /api/$1 break;

}

location ^~/static/ {
proxy_pass   http://127.0.0.1:8078;
}

location ^~/storage/ {

      proxy_pass   http://127.0.0.1:8078;

}

location /socket.io/ {
proxy_pass http://192.168.1.12:9502; # 帮我告诉ta我想ta
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
}

}

```

<a name="ozect"></a>
### 导入sql
:::info
在mysql文件夹下面的sql文件，导入到数据库中。
:::
<a name="icRfU"></a>
### 构建完成，重启docker
```

docker compose restart

```

<a name="bhlpm"></a>
### 构建vue前端,生成dist文件
```

npm run build

```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2981007/1700996631154-b1e096f3-f72d-4d2d-9b20-7f462c2f1d8c.png#averageHue=%23a9ad92&clientId=u1c8a55ad-924b-4&from=paste&height=1115&id=u92b426c7&originHeight=1115&originWidth=1708&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1091854&status=done&style=none&taskId=uacfd2adb-614a-4320-ab72-7e0b3cf0bdc&title=&width=1708)
