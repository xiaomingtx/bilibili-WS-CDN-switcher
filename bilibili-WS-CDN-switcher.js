// ==UserScript==
// @name         bilibili强制使用网宿CDN
// @version      0.1
// @description  bilibili强制使用网宿CDN，北邮校园网可节省流量
// @author       xiaomingtx
// @include      *://*bilibili.com*
// @exlucde      *://live.bilibili.com*
// @require      https://unpkg.com/xhook@1.4.7/dist/xhook.min.js
// @require      http://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

var timeOutInfo;
var timerSetupInfo;
var wscndError = false;

//修改提示框信息
function changeInfo(info){
    var wscdnswitch_info_p = $("#wscdnswitch_info_p");
    wscdnswitch_info_p.text(info);
    return wscdnswitch_info_p.length>0;
}

//初始化提示框
function setupInfo(){
    clearInterval(timerSetupInfo);
    if($("#wscdnswitch_info").length>0){
        return ;
    }
    timerSetupInfo = setInterval(function(){
        if($("#wscdnswitch_info").length>0){
            return;
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
            clearInterval(timerSetupInfo);
        }
    }, 100);
}


//hook，用于修改和监控ajax请求和响应
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
        setupInfo();
        wscndError = false;
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


