# 暂时不能使用
前段时间一直在使用北邮测试的1毛钱的联通网络，期间bilibili前端有一次重大升级
当前脚本必定是有问题的，正在修复......


# bilibili-WS-CDN-switcher
自动使用网宿cdn，北邮校园网可以节省流量

~~ws.acgvideo.com在北邮校园网自动被解析为10.3.200.205，不使用校外流量~~

ws.acgvideo.com再北邮校园网某些情况下会解析到外网地址，将使用校园网流量

将下面内容加入到hosts文件，可解决该问题
```
10.3.200.205    ws.acgvideo.com
```

其他学校请自行测试ws.acgvideo.com能否解析到内网地址，并更具情况修改hosts


# 使用方法
浏览器安装Tampermonkey插件，新建脚本，将bilibili-WS-CDN-switcher.js内容插入即可

将下面内容添加到系统hosts文件，可以增加获取到网宿cdn链接的概率，提高切换成功率（正常访问速度可能会变慢）
```
47.88.107.100    interface.bilibili.com
47.88.107.100    bangumi.bilibili.com
```
