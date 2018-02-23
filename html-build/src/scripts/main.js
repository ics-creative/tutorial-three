import * as $ from "jquery";
import platform from "platform";

let isChangeTheme = false;

// DOMContentLoadedに処理可能であれば処理してしまう
if (document.body) {
  const currentTheme = localStorage.getItem("theme");
  changeTheme(currentTheme);
  isChangeTheme = true;
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// 初期化関数
function init() {
  $("article a").removeAttr("target");
  $("article a[href^=http]")
    .attr("target", "_blank")
    .attr("rel", "noopener");
  //$("a[href^=http://]").not($("a[href^=https://ics.media]")).attr("target", "_blank");

  if (location.href.indexOf("index.html") > -1) {
    $("div.link-index").hide();
  }

  if (isChangeTheme === false) {
    const currentTheme = localStorage.getItem("theme");
    changeTheme(currentTheme);
    isChangeTheme = true;
  }

  setTimeout(() => {
    switch (platform.name) {
      case "Safari":
      case "Chrome":
      case "Firefox":
        $("body").css("transition", "all 0.3s");
        break;
    }
  }, 100);

  $("#btn-theme-light").click(() => {
    changeTheme("theme-light");
    localStorage.setItem("theme", "theme-light");
  });
  $("#btn-theme-dark").click(() => {
    changeTheme("theme-dark");

    localStorage.setItem("theme", "theme-dark");
  });

  // 共有ボタン
  $("a.share-twitter")
    .attr(
      "href",
      `https://twitter.com/share?text=${encodeURI(
        $.trim($("h1").text()) + " - ICS MEDIA"
      )}&lang=ja&url=${location.href}`
    )
    .attr("target", "_blank");
  $("a.share-facebook")
    .attr(
      "href",
      `https://www.facebook.com/sharer/sharer.php?u=${location.href}`
    )
    .attr("target", "_blank");
}

// ----------------------------------
// Google Analytics の初期化コード
// ---------------------------------

var _gaq = window._gaq || [];
_gaq.push(["_setAccount", "UA-34243464-2"]);
_gaq.push(["_trackPageview"]);
window._gaq = _gaq; // Windowに保存しないと動作しなくなる
(function() {
  var ga = document.createElement("script");
  ga.type = "text/javascript";
  ga.async = true;
  ga.src =
    ("https:" == document.location.protocol ? "https://ssl" : "http://www") +
    ".google-analytics.com/ga.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(ga, s);
})();

function changeTheme(theme) {
  switch (theme) {
    case "theme-dark":
      $("body")
        .removeClass("theme-light")
        .addClass("theme-dark");

      $("#btn-theme-dark").attr("aria-checked", true);
      $("#btn-theme-light").attr("aria-checked", false);
      break;
    case "theme-light":
    default:
      $("body")
        .removeClass("theme-dark")
        .addClass("theme-light");
      $("#btn-theme-dark").attr("aria-checked", false);
      $("#btn-theme-light").attr("aria-checked", true);
      break;
  }
}
