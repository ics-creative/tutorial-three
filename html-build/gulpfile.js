"use strict";

// glup・使用する各プラグインを最初に読み込む
const gulp = require("gulp");
const concat = require("gulp-concat");
const compass = require("gulp-compass");
const rename = require("gulp-rename");

gulp.task("css.concat", () => {
  return gulp.src(["css/bootstrap/bootstrap.min.css",
        "css/highlight.js/vs.min.css",
        "css/font-awesome/css/font-awesome.min.css",
        "css/style.css"
      ])
      .pipe(concat("style.css"))
      .pipe(gulp.dest("../html/styles/css/"));
});

gulp.task("compass", () => {
  gulp.src("styles/*.scss")
      .pipe(compass({
        config_file: "config.rb",
        css: "css",
        sass: "sass"
      }))
      .pipe(gulp.dest("style.css"));
});

gulp.task("js.concat", () => {
  return gulp.src(["js/jquery-2.1.4.min.js", "typescript/main.js"])
      .pipe(concat("main.js"))
      .pipe(gulp.dest("../html/js/"));
});

// ファイルを監視して実行させる
gulp.task("default", () => {
  gulp.watch(["sass/*.scss"], ["compass", "css.concat"]);
  gulp.watch(["typescript/*.js"], ["js.concat"]);
});
