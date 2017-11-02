///<reference path="jquery/jquery.d.ts" />
var project;
(function (project) {
    $ = jQuery;
    $(document).ready(function () {
        init();
    });
    // 初期化関数
    function init() {
        $("article a").removeAttr("target");
        $("article a[href^=http]").attr("target", "_blank");
        //$("a[href^=http://]").not($("a[href^=https://ics.media]")).attr("target", "_blank");
        if (location.href.indexOf("index.html") > -1) {
            $("div.link-index").hide();
        }
        // 共有ボタン
        $("a.share-twitter").attr("href", "https://twitter.com/share?text=" + encodeURI($.trim($("h1").text()) + " - ICS MEDIA") + "&lang=ja&url=" + location.href).attr("target", "_blank");
        $("a.share-facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + location.href).attr("target", "_blank");
        // ----------------------------------
        // TypeKit の初期化コード
        // ---------------------------------
        var agent = navigator.userAgent; // ユーザーエージェント
        // Windows のとき
        if (agent.search("Windows") != -1) {
            var os = null;
            if (agent.match(/Win(dows )?NT 6\.2/)) {
                os = "Windows 8"; // Windows 8 の処理
            }
            else if (agent.match(/Win(dows )?NT 6\.1/)) {
                os = "Windows 7"; // Windows 7 の処理
            }
            else if (agent.match(/Win(dows )?NT 6\.0/)) {
                os = "Windows Vista"; // Windows Vista の処理
            }
            else if (agent.match(/Win(dows )?NT 5\.2/)) {
                os = "Windows Server 2003"; // Windows Server 2003 の処理
            }
            else if (agent.match(/Win(dows )?(NT 5\.1|XP)/)) {
                os = "Windows XP"; // Windows XP の処理
            }
            // Windows 8 以下の場合は TypeKit フォントを使う
            if (os != null) {
                (function (d) {
                    var config = {
                        kitId: 'djc6jhl',
                        scriptTimeout: 3000,
                        async: true
                    }, h = d.documentElement, t = setTimeout(function () {
                        h.className = h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
                    }, config.scriptTimeout), tk = d.createElement("script"), f = false, s = d.getElementsByTagName("script")[0], a;
                    h.className += " wf-loading";
                    tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
                    tk.async = true;
                    tk.onload = tk.onreadystatechange = function () {
                        a = this.readyState;
                        if (f || a && a != "complete" && a != "loaded")
                            return;
                        f = true;
                        clearTimeout(t);
                        try {
                            Typekit.load(config);
                        }
                        catch (e) {
                        }
                    };
                    s.parentNode.insertBefore(tk, s);
                })(document);
            }
        }
    }
})(project || (project = {}));
// ----------------------------------
// Google Analytics の初期化コード
// ---------------------------------
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34243464-2']);
_gaq.push(['_trackPageview']);
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
