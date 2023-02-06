---
title: Three.jsのOrbitControlsで手軽にカメラを制御する
author: 池田 泰延
published_date: 2017-11-03
modified_date: 2023-02-06
---

Three.jsには**カメラの動きを自動的に制御する `THREE.OrbitControls` クラスが存在**します。

次の用途で役立つ機能です。

- 周回軌道を描くように、カメラを配置する
- ポインター操作でカメラの配置やアングルを変更する


## 導入方法

`OrbitControls.js`は、Three.jsライブラリの本体に含まれていないので注意が必要です。CDNで利用するときは、以下の`script`要素で読み込みます。


```html
<script src="https://unpkg.com/three@0.147.0/examples/js/controls/OrbitControls.js"></script>
```

※公式GitHubの`examples/js/controls`フォルダーにJavaScriptファイルにはいっています。該当ファイルは[こちら](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js)で確認できます。

※Three.js r148（2022年12月リリース）より`examples/js`フォルダーでの提供はなくなりました。今後はES Modulesでの利用を推奨されますので、本記事もゆくゆく更新します。


## 使い方

`THREE.OrbitControls`は次の書式で利用します。`THREE.OrbitControls`クラスのコンストラクターへ、カメラのインスタンスとDOM要素を引数として指定します。これだけで、自動的にマウスと連動してインタラクションが効くようになります。

`THREE.OrbitControls`クラスの第2引数は、ポインターの操作を受け付ける対象のDOM要素を指定します。多くの利用用途では`document.body`か`canvas`要素が妥当でしょう。以下の例では`document.body`として指定しています（画面内のどこでもポインター操作を受け付けるようになります）。

```js
// カメラを作成
const camera = new THREE.PerspectiveCamera(/*省略*/);
// カメラの初期座標を設定
camera.position.set(0, 0, 1000);

// カメラコントローラーを作成
const controls = new THREE.OrbitControls(camera, document.body);
```

マウス操作で次のようにカメラを制御できます。

- オービット（周回軌道）: 左ボタンでドラッグ
- ズーム: マウスホイール
- パン: 右ボタンでドラッグ


実行可能な最小のサンプルコードはこちらです。次の例では、`THREE.OrbitControls`クラスの第2引数に`canvas`要素を指定しており、ポインター操作の対象をCanvasだけに絞っています。

```js
// サイズを指定
const width = 960;
const height = 540;

// レンダラーを作成
const canvasElement = document.querySelector('#myCanvas')
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement,
});
renderer.setSize(width, height);

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
camera.position.set(0, 0, 1000);

// カメラコントローラーを作成
const controls = new THREE.OrbitControls(camera, canvasElement);

// 形状とマテリアルからメッシュを作成します
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(300, 300, 300),
  new THREE.MeshNormalMaterial());
scene.add(mesh);

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {
  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
```


![](../imgs/camera_orbitcontrols_basic.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/camera_orbitcontrols_basic.html)
- [サンプルのソースコードを確認する](../samples/camera_orbitcontrols_basic.html)




### 滑らかにコントロールする

`THREE.OrbitControls`インスタンスの`enableDamping`や`dampingFactor`プロパティーを設定すると、ドラッグ時にカメラが滑らかに動くようになります。デフォルトだと機械的な動きになってしまいますが、これらのプロパティーを設定するだけで心地良い操作感になります。

`enableDamping`や`dampingFactor`プロパティーを使う場合は、`requestAnimationFrame`内で`THREE.OrbitControls`インスンタンスの`update`メソッドを呼び出す必要があります。

```js
// カメラを作成
const camera = new THREE.PerspectiveCamera(/*省略*/);
// カメラの初期座標を設定
camera.position.set(0, 0, 1000);

// カメラコントローラーを作成
const controls = new THREE.OrbitControls(camera, canvasElement);

// 滑らかにカメラコントローラーを制御する
controls.enableDamping = true;
controls.dampingFactor = 0.2;

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {
  // カメラコントローラーを更新
  controls.update();

  // レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}
```


![](../imgs/camera_orbitcontrols.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/camera_orbitcontrols.html)
- [サンプルのソースコードを確認する](../samples/camera_orbitcontrols.html)



## まとめ

カメラを手軽に制御できるので、小さな作例では`THREE.OrbitControls`を使われることが多いです。ただし、手軽である分、カスタマイズの自由度の制限があるので、細かいカメラワークを作ろうとしたら`THREE.OrbitControls`では物足りません。カメラの制御はいろんなコードを書いて自作して覚えていくといいでしょう。


次回の記事では、モデリングデータの読み込み方法を説明します。

[次の記事へ](model_basic.md)

### 関連

Node.js関連のバンドルツールで`OrbitControls`を利用する場合は、以下の解説を参照ください。

- [Node.jsを使ったフロントエンド開発](nodejs.md)