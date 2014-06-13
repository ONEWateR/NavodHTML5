//判断是否播放页，非播放页无<object>的
if (document.getElementsByTagName("object")[0] != undefined) {
    //提取真实地址
    var movieurl = $("object").find("param[name=FlashVars]").val().
                   replace("&play_url=", "").
                   replace("&play_url_hd=", "").
                   replace("&play_url_low=", "").
                   split("&")[0];
    //url编码解码
    movieurl = unescape(movieurl);
    //如果是外网访问，就替换一下路径
    if ((window.location.href).indexOf("172.16") == -1) //最简单的判断
        movieurl = movieurl.replace("172.16.31.102", "navod.scse.com.cn");
    //移除旧播放器
    $('object').remove();
    //插入播放器
    var v = $("<video id='hehevideo' class='video-js vjs-default-skin' controls preload='none' width='960' height='540' data-setup='{}' autoplay='autoplay'></video>");
    $('.live_player').append(v);
    //然后就是插真实地址咯
    var r = ("<source src='" + movieurl + "' type='video/mp4' />");
    $('#hehevideo').append(r);


    //增加音量记忆功能
    if (window.localStorage) {
        if (localStorage.volume) {
            var v = document.getElementsByTagName("video")[0];
            v.volume = localStorage.volume; //设置音量
        }
    }


    //插入一段css，调用字体图标
    var c = document.createElement('style');
    var font_css = "@font-face {font-family: 'VideoJS';";
    font_css += "src: url('" + chrome.runtime.getURL("videojs/font/vjs.eot") + "');";
    font_css += "src: url('" + chrome.runtime.getURL("videojs/font/vjs.eot") + "?#iefix') format('embedded-opentype'), ";
    font_css += "url('" + chrome.runtime.getURL("videojs/font/vjs.woff") + "') format('woff'), ";
    font_css += "url('" + chrome.runtime.getURL("videojs/font/vjs.ttf") + "') format('truetype');";
    font_css += "font-weight: normal;font-style: normal;}";
    c.innerHTML = font_css;
    document.head.appendChild(c);



    //淫荡的插入一段代码，注释中间才是正式代码 [真淫荡 - -b]
    Function.prototype.getMultiLine = function() {
        var lines = new String(this);
        lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
        return lines;
    }
    var inject=function(){
    /*
        //先获取video对象
        var v = document.getElementsByTagName("video")[0];
        //在页面关闭时保存进度
        window.onbeforeunload = dealHistoryDetail;
        function dealHistoryDetail() {
            if (!v.ended && v.currentTime != 0)  // 只记录播放且非结尾的片片记录
            {
                addHistory();
                addPlayHistory(v.currentTime, v.duration);
            }
        }
        // [History] 添加历史记录
        function addPlayHistory(cTime, dur)
        {
            if (window.localStorage) {
                // 尝试读取播放记录
                if (localStorage.NAVideoHistory) {
                    var HistoryInfo = JSON.parse(localStorage.NAVideoHistory);
                    var len = HistoryInfo.length;
                    // 删除历史中存在本片的记录，识别标志为video_id
                    for(var i = len - 1; i >= 0; i--){
                        if (HistoryInfo[i].vid == video_info.video_id){
                            HistoryInfo.splice(i,1);
                        }
                    }
                    // 只记录9条历史数据
                    if (len >= 9) HistoryInfo.splice(0,1);
                }else{
                    var HistoryInfo = new Array();
                }
                // 添加记录
                HistoryInfo.push(
                    {
                        vid: video_info.video_id,  // ID
                        video_index: video_info.video_index,  // 集数
                        currentTime: cTime, // 当前时间
                        duration : dur // 总片长
                    }
                );
                // 保存数据至本地
                localStorage.NAVideoHistory = JSON.stringify(HistoryInfo);
            } // END IF
        } // END Function
        //监听按键，全屏时，左右键控制前进后退，上下键控制音量
        document.onkeyup = keyUp;
        function keyUp(e) {
            if (document.webkitIsFullScreen) {  //只是全屏才生效
                var currKeyNum = e.which;
                if (currKeyNum == 37) { //左键
                    v.currentTime -= 10;
                } else if(currKeyNum == 39) { //右键
                    v.currentTime += 10;
                } else if(currKeyNum == 38) { //上键
                    if(v.volume + 0.2 <= 1) v.volume += 0.2;
                    else v.volume = 1;
                } else if(currKeyNum == 40) { //下键
                    if(v.volume - 0.2 >= 0) v.volume -= 0.2;
                    else v.volume = 0;
                }
            }　
        }
    */}.getMultiLine();

    var x=document.createElement("script");
    x.type="text/javascript";
    var y=document.createTextNode(inject);
    x.appendChild(y);
    document.body.appendChild(x);


    var video_id = window.location.href.match(/&nns_video_id=(.*?)&/)[1]
    var video_index = window.location.href.match(/&nns_video_index=(.*?)&/)
    // [History] 跳转至之前进度
    if (window.localStorage) {
        if (localStorage.NAVideoHistory) {
            var HistoryInfo = JSON.parse(localStorage.NAVideoHistory);
            for(var i = HistoryInfo.length - 1; i >= 0; i--){
                if (HistoryInfo[i].vid == video_id && HistoryInfo[i].video_index == (video_index ? video_index[1] : 0)){
                    var v = document.getElementsByTagName("video")[0];
                    v.play();
                    var first = true;
                    v.addEventListener("canplay", function() {
                        if (first){
                            v.currentTime = HistoryInfo[i].currentTime;
                            first = false
                        }
                    });
                    break;
                }
            }
        }
    }

} //END IF (播放页面判断)


// [History] 修改历史样式
$(".history_date").remove();
$(".video_index").each(function(){
    var url = $(this).children("a").attr("href");
    var m = url.match(/&nns_video_index=(.*?)&/)
    var index = m ? parseInt(m[1]) + 1 : 1
    var vid = url.match(/&nns_video_id=(.*?)&/)[1]
    var rate = 0;

    if (window.localStorage && localStorage.NAVideoHistory){
        var HistoryInfo = JSON.parse(localStorage.NAVideoHistory);
        for(var i = HistoryInfo.length - 1; i >= 0; i--){
            if (HistoryInfo[i].vid == vid){
                rate = Math.round(HistoryInfo[i].currentTime / HistoryInfo[i].duration * 100, 2);
                break;
            }
        }
    }

    $(this).children("a").html($(this).children("a").html() + "" + "(" + rate +"%)")
    url = url + "&nns_video_index=" + index;
    console.log(url)
    $(this).after(
        "<div class='history_date'><a href='"+ url +"' title='下一集'>下一集</a></div>"
    )
})
$(".video_name").css("width","250px")
$(".video_index").css("width","90px")
$(".history_date").css("width","50px")

// END [History]