---
title: オフスクリーンキャンバス
author: 池田 泰延
published_date: 2019-02-12
modified_date: 2019-02-12
---

オフスクリーンキャンバスはWeb Workers（ウェブワーカーズ）を使用してWorkerスレッドで描画処理を行える機能です。負荷の高い描画処理をWorkerスレッドに移動することで、メインスレッドの負担が軽くなり、余裕ができます。これによりメインスレッドでスムーズなユーザー操作を実現できるようになり、ユーザー体験の向上が期待できます。

Three.jsでもオフスクリーンキャンバスを利用できます。複雑なことをしなければ難しくなく、通常のThree.jsのコードに少しの実装を追加するだけで実現できます。

オフスクリーンキャンバスの機能については記事「[オフスクリーンキャンバスを使ったJSのマルチスレッド描画 – スムーズなユーザー操作実現の切り札 \- ICS MEDIA](https://ics.media/entry/19043)」で詳しく解説しています。Three.jsで利用する前に一読をオススメします。


## 使い方

ワーカーを利用するにあたって、メインスレッド側とワーカー側と処理を分離する必要があります。これはファイル単位で分けなければなりません。まずはメインスレッド側のコードを紹介します。HTMLに`canvas`要素を配置し、JavaScriptではワーカー側に`canvas`要素のオフスクリーン用オブジェクトを転送します。

```html
<canvas id="myCanvas"></canvas>
```

```js
// 普通のキャンバスを取得
const canvasElement = document.querySelector('#myCanvas');
// オフスクリーンキャンバスを取得
const offscreenCanvas = canvasElement.transferControlToOffscreen();
// ワーカーを起動
const worker = new Worker('osc_simple_worker.js');
// ワーカー側にオフスクリーンキャンバスを転送
worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);
```

続いて、ワーカー側の処理を解説します。ワーカー側では、Three.jsを`importScripts()`メソッドを使って読み込みます。`importScripts()`メソッドはワーカーでのみ利用できる機能です。

```js
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.min.js'
);
```

メインスレッド側からの起動コールを受信するために、`onmessage`イベントを監視します。ここに初期化処理を記述します。引数の`event.data`オブジェクトで、メインスレッド側からのデータを受け取れます。

```js
// メインスレッドから通達があったとき
onmessage = event => {
  // メインスレッドからオフスクリーンキャンバスを受け取る
  const canvas = event.data.canvas;
  // ・・・いろいろ処理
```

バッドノウハウですが、ひとつだけ工夫しなければ、Three.jsをワーカー側で利用できません。Three.jsは内部でCanvas要素のstyleにアクセスします。しかし、OffscreenCanvasはDOM要素ではないため、`style`属性を持ちません。Three.jsで使用する場合はランタイムエラーを避けるため、OffscreenCanvasオブジェクトに明示的に`style`プロパティを付加します。

```js
  // Three.jsのライブラリの内部で style.width にアクセスされてしまう
  // 対策しないと、エラーが発生するためダミーの値を指定
  canvas.style = { width: 0, height: 0 };
```

あとは普通にコードをかけばThree.jsが動きます。コードを全部みて呆気なさを感じてください。


## 画像の使い方

オフスクリーンキャンバスで画像を使うには`ImageBitmap`を利用します。通常の`THREE.ImageLoader()`だとDOM APIの`Image`オブジェクト、つまり`img`タグが使われます。ワーカー側ではDOM APIが利用できないため、`img`タグで画像を読み込むことはできないのです。オフスクリーンキャンバスと同時期に用意された、`ImageBitmap`オブジェクトを使います。Three.jsでは`THREE.ImageBitmapLoader()`でファイルを読み込み、`ImageBitmap`インスタンスを`THREE.CanvasTexture`でテクスチャーへと変換します。あとは、適当なマテリアルにテクスチャーとして設定するだけです。

```js
// テクスチャーを読み込み
const texture = await new Promise(resolve => {
  new THREE.ImageBitmapLoader().load('imgs/earthmap1k.jpg', imageBitmap => {
    const texture = new THREE.CanvasTexture(imageBitmap);
    resolve(texture);
  });
});
// マテリアルを作成
const material = new THREE.MeshStandardMaterial({ map: texture });
```

## リサイズの方法

通常のThree.jsのりサイズ処理は、記事「[リサイズ処理](renderer_resize.md)」を先に読んで学習しておいてください。その上で解説します。

オフスクリーンキャンバスからだと、メインスレッド側のりサイズを検知できません。メインスレッド側のりサイズは、メインスレッド側で検知しなけばなりません。たとえば、次のようなコードで、ワーカー側にリサイズイベントを通知します。ワーカー側では`worker.postMessage()`メソッドにより通達を受けますが、初期化なのかリサイズイベントなのか判断する手がかりが必要なため、任意の`type`プロパティーを付与しています。

```js
// 普通のキャンバスを取得
const canvasElement = document.querySelector('#myCanvas');
// オフスクリーンキャンバスを取得
const offscreenCanvas = canvasElement.transferControlToOffscreen();
const worker = new Worker('osc_resize_worker.js');
worker.postMessage(
  {
    type: 'init',
    canvas: offscreenCanvas,
    width: innerWidth,
    height: innerHeight,
    devicePixelRatio: devicePixelRatio
  },
  [offscreenCanvas]
);

window.addEventListener('resize', event => {
  worker.postMessage({
    type: 'resize',
    width: innerWidth,
    height: innerHeight,
    devicePixelRatio: devicePixelRatio
  });
});
```

ワーカー側の処理では、任意の`type`プロパティーの値をみて、条件文で処理を分離しています。

```js
let renderer;
let camera;

// メインスレッドから通達があったとき
onmessage = event => {
  switch (event.data.type) {
    case 'init':
      init(event);
      break;
    case 'resize':
      resize(event.data.width, event.data.height, event.data.devicePixelRatio);
      break;
  }
};
function init(event) {
  // ・・・初期化処理（省略）
}

function resize(width, height, devicePixelRatio) {
  // レンダラーのサイズを調整する
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
```