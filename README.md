 <p align="center">
 	<a target="_blank" href="https://travis-ci.org/aoju/mauve">
 		<img src="https://travis-ci.org/aoju/mauve.svg?branch=master">
 	</a>
 	<a target="_blank" href="https://www.nodejs.org">
 		<img src="https://img.shields.io/badge/nodejs-8.0-blue.svg">
 	</a>
 	<a target="_blank" href="https://www.vuejs.org">
 		<img src="https://img.shields.io/badge/vue-2.6.10-yellow.svg">
 	</a>
 	<a target="_blank" href="https://jquery.com">
 		<img src="https://img.shields.io/badge/jquery-3.4.1-blue.svg">
 	</a>
 	<a target="_blank" href="https://www.mit-license.org">
 		<img src="https://img.shields.io/badge/license-MIT-green.svg">
 	</a>
 </p>
 
 <p align="center">
	-- QQ群①：839120 --
 </p>
 
 **Mauve是一个基于 [Diatto](https://github.com/aoju/diatto.git) 使用的协同软件,帮助团队轻松共享和讨论工作中的任务、文件、分享、日程等内容，让团队协作焕发无限可能。所以你随时随地都可以和团队协作**
  
 ## 概述
 - 不支持 IE8 及以下版本，建议使用基于Webkit内核的现代浏览器访问
 - 为前后端分离架构，因此安装分为后端和前端部分，需要分别进行部署
 
 ## 环境要求
 
 - nodejs >= 8.0.0
 - vue >= 2.6.10
 - jquery >= 3.4.1
 - ant-design >= 1.3.15
 - echarts >= 4.2.1

 
 ## 服务配置
 
 ### 基础信息
 1. 修改 ./src/app/feature/config/config.js 修改对应相关信息
 2. 修改 ./vue.config.js  中 devServer 的相关信息,可进行本地运行调试
 
 ### 其他信息
 1. ```npm install  ``` 安装项目依赖
 2. ```npm run start  ``` 可进行本地调试
 3. ```npm run build  ``` 项目编译打包，上传服务器即可

 ### Nginx
 ```
 server {
   listen       80;
   listen       443 ssl;
   server_name  teamee.cn;
 
   ssl on;
   ssl_certificate     /data/000x/cert.d/mauve.pem;
   ssl_certificate_key /data/000x/cert.d/mauve.key;
 
   gzip on;
   error_page 497  https://$host$request_uri;
 
   location / {
     try_files $uri $uri/ /index.html;
     root /data/000x/html.d/xxxx;
     index  index.html;
   }
 
   location ^~ /rest/ {
     client_max_body_size   500m;
     proxy_set_header Host $host;
     proxy_connect_timeout 3600;
     proxy_send_timeout 3600;
     proxy_read_timeout 3600;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_request_buffering off;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_pass http://172.171.0.9:9001/;
   }
 
   location /message {
     client_max_body_size   500m;
     proxy_set_header Host $host;
     proxy_connect_timeout 3600;
     proxy_send_timeout 3600;
     proxy_read_timeout 3600;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_buffering off;
     proxy_request_buffering off;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header upgrade $http_upgrade;
     proxy_set_header connection "upgrade";
     proxy_pass http://172.171.0.9:9002;
   }
 
 }  
 ```