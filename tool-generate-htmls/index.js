const fs = require('fs');
const marked = require('marked');
const mkdirp = require('mkdirp');
const highlightJs = require('highlight.js');

let promises = [];
let samplesUrl = 'https://ics-creative.github.io/tutorial-createjs/';
let samplesHtmlUrl = 'https://github.com/ics-creative/tutorial-createjs/blob/gh-pages/';
let templateHtml;

/**
 * テンプレート文字列を展開
 * http://webdesign-dackel.com/2015/07/17/javascript-template-string/
 * @param text:string テンプレート文字列
 * @param values:Object 展開する値
 * @return string
 */
const template = (text, values) => {
  if (!text) {
    console.log('template-error!');
    return '';
  }
  return text.replace(/\$\{(.*?)\}/g, function (all, key) {
    return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : '';
  });
};


const renderer = new marked.Renderer();

renderer.link = (href, title, text) => {
  //console.log("href:" + href);
  let sampledIndex = href.indexOf('samples/');
  let absolutePass = href.indexOf('http') == 0;
  if (!absolutePass && sampledIndex >= 0) {
    href = samplesHtmlUrl + href.slice(sampledIndex);
  }
  else {
    if (!absolutePass && href.indexOf('md')) {
      href = href.replace('md', 'html');
    }
  }
  let htmlHref = (href != null && href != '') ? ` href="${href}"` : '';
  let htmlTitle = (title != null && title != '') ? ` title=${title}` : '';
  return `<a${htmlHref}${htmlTitle}>${text}</a>`;
};
renderer.image = (href, title, text) => {
  //console.log("imgs:" + href);
  let absolutePass = href.indexOf('http') == 0;
  let sampledIndex = href.indexOf('../imgs/');
  if (!absolutePass && sampledIndex >= 0) {
    href = samplesUrl + href.slice(sampledIndex + ('../').length);
  }
  let htmlHref = (href != null && href != '') ? ` src="${href}"` : '';
  let htmlTitle = (title != null && title != '') ? ` title=${title}` : '';
  return `<img${htmlHref}${htmlTitle} />`;
};
renderer.heading = function (text, level) {
  return `<h${level}>${text}</h${level}>`;
};


marked.setOptions({
  highlight: function (code) {
    return highlightJs.highlightAuto(code).value;
  },
  renderer: renderer
});


const generateHTML = (dirName, fileName, resolve) => {
  fs.readFile('../docs/' + dirName + fileName, 'utf8', (error, text) => {
    if (error) {
      return;
    }
    let articleMarkdown = marked(text);
    const fileRawName = fileName.split('.md').join('');
    // --------------------------------
    // h1 要素の選定
    // --------------------------------
    const headerMatch = articleMarkdown.match(/<h1>(.*?)<\/h1>/);
    const articleTitle = headerMatch ? headerMatch[1] : '';
    if (!headerMatch) {
      console.error(`h1 Element is not written. : ${fileName}`);
    }
    else {
      //	最初のH1だけ削除するとき。
      articleMarkdown = articleMarkdown.replace(headerMatch[0], '');
    }
    // --------------------------------
    // メタデータの選定
    // --------------------------------
    const articleAuthorArr = articleMarkdown.match(/<p><article-author>(.*?)<\/article-author><\/p>/);
    const articleAuthorStr = articleAuthorArr ? articleAuthorArr[1] : '';
    if (!articleAuthorArr) {
      console.error(`<article-author> Element is not written. : ${fileName}`);
    }
    else {
      // 要素を削除
      articleMarkdown = articleMarkdown.replace(articleAuthorArr[0], '');
    }
    // --------------------------------
    // メタデータの選定 (公開日)
    // --------------------------------
    const articleUpdatedArr = articleMarkdown.match(/<article-date-published>(.*?)<\/article-date-published>/);
    const articleUpdatedStr = articleUpdatedArr ? articleUpdatedArr[1] : '';
    const articleUpdatedDate = new Date(articleUpdatedStr);
    const articleUpdatedStrLocale = articleUpdatedArr ? toLocaleString(articleUpdatedDate) : '';
    if (!articleUpdatedArr) {
      console.error(`<article-date-modified> Element is not written. : ${fileName}`);
    }
    else {
      // 要素を削除
      articleMarkdown = articleMarkdown.replace(articleUpdatedArr[0], '');
    }
    // --------------------------------
    // メタデータの選定 (更新日)
    // --------------------------------
    const articleModifiedArr = articleMarkdown.match(/<article-date-modified>(.*?)<\/article-date-modified>/);
    const articleModifiedStr = articleModifiedArr ? articleModifiedArr[1] : '';
    const articleModifiedDate = new Date(articleModifiedStr);
    const articleModifiedStrLocale = articleUpdatedArr ? toLocaleString(articleModifiedDate) : '';
    if (!articleModifiedArr) {
      console.error(`<article-date-published> Element is not written. : ${fileName}`);
    }
    else {
      // 要素を削除
      articleMarkdown = articleMarkdown.replace(articleModifiedArr[0], '');
    }
    // --------------------------------
    // テンプレートへの適用
    // --------------------------------
    articleMarkdown = articleMarkdown.replace(/\<code class\=\"lang-/g, '<code class="hljs ');
    const url = `https://ics.media/tutorial-createjs/${fileRawName}.html`;
    const values = {
      'article-title': articleTitle,
      'article-markdown': articleMarkdown,
      'article-author': articleAuthorStr,
      'article-datePublished': articleUpdatedStr,
      'article-dateModified': articleModifiedStr,
      'article-datePublished-locale': articleUpdatedStrLocale,
      'article-dateModified-locale': articleModifiedStrLocale,
      'url': url
    };
    if (!templateHtml) {
      console.log(fileName + ' generate error!');
      return;
    }


    const textValue = template(templateHtml, values);
    fs.writeFile('../html/' + dirName + fileName.replace('md', 'html'), textValue, (error) => {
      //console.log(fileName + "- maked");
      if (error) {
        return;
      }
      resolve();
    });
  });
};


fs.readdir('../docs', (err, files) => {
  promises.push(new Promise((resolve) => {
    mkdirp('../html/', function (err) {
      if (err) {
        console.error('mkdir-error' + err);
      }
      else {
        resolve();
      }
    });
  }));
  promises.push(new Promise((resolve) => {
    fs.readFile('template-html.html', 'utf8', (error, text) => {
      templateHtml = text;
      resolve();
    });
  }));
  for (let i = 0; i < files.length; i++) {
    let filename = files[i];
    let childPromise = new Promise((resolve) => {
      generateHTML('', filename, resolve);
    });
    promises.push(childPromise);
  }
  Promise
    .all(promises)
    .then((results) => {
      console.log('[Success] HTML files are generated.');
    });
});

/**
 * 日付をフォーマットで変換します。
 * @param date Date オブジェクト
 * @returns {string} 「◯年◯月◯日」フォーマットの日付
 */
function toLocaleString(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
