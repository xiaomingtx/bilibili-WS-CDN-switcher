# bilibili-WS-CDN-switcher
自动使用网宿cdn，北邮校园网可以节省流量

ws.acgvideo.com在北邮校园网自动被解析为10.3.200.205，不使用校外流量

其他学校请自行测试ws.acgvideo.com能否解析到内网地址


# 使用方法
浏览器安装Tampermonkey插件，新建脚本，将bilibili-WS-CDN-switcher.js内容插入即可

将下面内容添加到系统hosts文件，可以增加获取到网宿cdn链接的概率，提高切换成功率（正常访问速度可能会变慢）
```
47.88.107.100    interface.bilibili.com
47.88.107.100    bangumi.bilibili.com
```