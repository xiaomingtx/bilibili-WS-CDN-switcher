// ==UserScript==
// @name         bilibili强制使用网宿CDN
// @namespace    https://github.com/xiaomingtx/bilibili-WS-CDN-switcher
// @version      0.1
// @description  bilibili强制使用网宿CDN，北邮校园网可节省流量
// @author       xiaomingtx
// @include      https://*.bilibili.com*
// @include      http://*.bilibili.com*
// @require      https://unpkg.com/xhook@1.4.7/dist/xhook.min.js
// @require      https://static.hdslb.com/js/jquery.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

var timeOutInfo;
var wscndError = false;

//修改提示框信息
function changeInfo(info){
    var wscdnswitch_info_p = $("#wscdnswitch_info_p");
    wscdnswitch_info_p.text(info);
    return wscdnswitch_info_p.length>0;
}

//hook函数，用于修改和监控ajax请求和响应
xhook.after(function(request, response) {
    if(request.url.match(/interface\.bilibili\.com\/v2\/playurl/) ||
       request.url.match(/bangumi\.bilibili\.com\/player\/web_api\/v2\/playurl/) ||
       request.url.match(/bangumi\.bilibili\.com\/player\/web_api\/playurl/)){
        //将响应中的url和backurl替换，使网宿CDN成为默认url
        var data = JSON.parse(response.text);
        for(var i=0; i<data.durl.length; i++){
            if(!data.durl[i].url.match("ws.acgvideo.com")){
                for(var j=0; j<data.durl[i].backup_url.length; j++){
                    if(data.durl[i].backup_url[j].match("ws.acgvideo.com")){
                        console.log("replace" + data.durl[i].url + " and " + data.durl[i].backup_url[j]);
                        var temp = data.durl[i].url;
                        data.durl[i].url = data.durl[i].backup_url[j];
                        data.durl[i].backup_url[j] = temp;
                        break;
                    }
                }
            }
        }
        response.text = JSON.stringify(data);
    }
    else if(request.url.match(/\/\/[^\/]+\.acgvideo\.com\//) && (request.url.match(/\/\/ws.acgvideo\.com\//)==null)){
        //若检测到其他CDN连接，进行提示
        if(timeOutInfo){
            //若有timeout，清除
            clearTimeout(timeOutInfo);
        }
        changeInfo("网宿CDN切换失败，请注意流量使用情况！");
        wscndError = true;
    }
});

//初始化提示框
function setupInfo(count=0){
    if($("#wscdnswitch_info").length>0){
        return ;
    }
    var player = $("video");
    //找到video标签
    if(player.length>0){
        //在video标签前面加入提示框
        player.before("<div id='wscdnswitch_info' style='position:absolute; border:0px ;background-color:#00A1D6; border-radius:5px; left:10px; top:10px;'><p id='wscdnswitch_info_p' style='color:white; font-size:15px; margin:10px 10px;'>网宿CDN切换已开启</p></div>");
        if(wscndError){
            changeInfo("网宿CDN切换失败，请注意流量使用情况！");
        }
        else{
            //3秒后缩小提示框，以免遮挡视线
            timeOutInfo = setTimeout(function(){changeInfo("WS");}, 3000);
        }
    }
    else if(count>0){
        //若失败，且count>0重新尝试
        setTimeout(function(){setupInfo(count-1);}, 100);
    }
    else{
        //若提示框添加失败，且cdn出现错误，alert提醒。
        if(wscndError){
            alert("网宿CDN切换失败，请注意流量使用情况！");
        }
    }
}

//尝试300次初始化提示框，两次间隔100毫秒
$(document).ready(function(){
    setTimeout(function(){setupInfo(300);}, 100);
});


