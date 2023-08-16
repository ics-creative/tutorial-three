---
title: Three.jsでモデルデータを読み込む
author: 池田 泰延
published_date: 2017-11-03
modified_date: 2023-08-16
---

**3Dモデリングソフトで制作したモデルデータの読み込み方**を説明します。3Dのモデルデータにはさまざまな形式が存在しますが、Three.jsは多くの種類の形式に対応しています。

Three.jsでは外部ソフトを利用して作成した3Dモデリングデータを読み込むことができます。Three.jsではファイルを読み込むときにローダー（ファイルを解析する機能）を使ってモデルデータを読み込みます。 

### Three.jsが対応するモデルデータの形式

Three.jsでは次の形式の読み込みに対応しています。


| 形式名      | 説明                                                                                   | 拡張子  |
| ----------- | -------------------------------------------------------------------------------------- | ------- |
| glTF形式    | インターネット向けの3Dファイル形式。2017年に仕様として定められた新しい形式。           | `.gltf`, `.glb` |
| OBJ形式     | Wavefront社のAdvanced Visualizerというソフト用のファイルフォーマット。テキストデータ。 | `.obj`  |
| Collada形式 | 汎用的なデータファイル。XMLで構成されている。                                          | `.dae`  |
| 3DMax形式   | Autodesk 3ds Maxの出力フォーマットとして使われるデータ形式。                           | `.3ds`  |


### Three.jsでの読み込み方

Three.jsでモデルデータを読み込むには、JavaScriptでThree.jsの初期化を済ませたあとで、ローダーを使ってファイルを読み込み、3D空間に追加するという手順をとります。

データ形式ごとにローダークラスが用意されています。ただ、ローダークラスは、Three.jsライブラリの本体に含まれていないので注意が必要です。ローダークラスは`script`タグ等で取り込む必要があります。




### GLTFファイルの場合


GLTF（ジーエルティーエフ）はインターネット向けの3Dファイル形式です。クロノスグループによって2017年に仕様として定められました。GLTFの中身はJSONファイルを中心として、そこから参照される画像やメッシュデータ等の関連ファイルで構成されています。


GLTFファイルのサンプルは[クロノスグループのGitHub](https://github.com/KhronosGroup/glTF-Sample-Models)から取得できます。

今回は以下のファイルを利用します。ライセンスがPublic domain (CC0) のファイルです。

https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/ToyCar


`gltf`ファイルの場合を読み込むには`GLTFLoader.js`ファイルが必要となります。

以下の`importmap`を記載して、`three/addons/`というエイリアスを貼ります。


```html
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.152.2/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.152.2/examples/jsm/"
    }
  }
</script>
```

処理のほうでは`import`文で読み込みます。

```html
<script type="module">
  import * as THREE from "three";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

  // …
</script>
```


読み込む処理は次のように記載します。`GLTFLoader`クラスのインスタンスから、`loadAsync()`メソッドを利用します。
引数にはファイルパスを指定します。読み込み完了後に3D空間への追加処理をするのがポイントです。GLTFファイルにはシーンの情報の他に、カメラやライトなどさまざまな情報が含まれます。そのため、シーンの情報だけ抜き出すようにしましょう。

トップレベルで実行する場合

```js
// GLTF形式のモデルデータを読み込む
const loader = new GLTFLoader();
// GLTFファイルのパスを指定
const gltf = await loader.loadAsync('./models/gltf/glTF/ToyCar.gltf');
// 読み込み後に3D空間に追加
const model = gltf.scene;
scene.add(model);
```

関数宣言をして実行する場合

```js
// 非同期処理で待機するのでasync function宣言とする
async function init() {
  // ･･･省略

  // GLTF形式のモデルデータを読み込む
  const loader = new GLTFLoader();
  // GLTFファイルのパスを指定
  const gltf = await loader.loadAsync('./models/gltf/glTF/ToyCar.gltf');
  // 読み込み後に3D空間に追加
  const model = gltf.scene;
  scene.add(model);
  
  // ･･･省略
}
```

このコードの実行結果は次のとなります。

![](../imgs/loader_glb.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/loader_gltf.html)
- [サンプルのソースコードを確認する](../samples/loader_gltf.html)


GLTFには、バイナリ形式のGLBがあります。GLTFはテキストデータや関連ファイルがばらけているのに対して、GLBはGLTFを1ファイルにまとめた形式となっています。GLBファイルを読み込む場合も`GLTFLoader`クラスを利用します。コードは先ほど紹介したものとほとんど同じです。

```js
// 非同期処理で待機するのでasync function宣言とする
async function init() {
  // ･･･省略

  // GLTF形式のモデルデータを読み込む
  const loader = new GLTFLoader();
  // GLTFファイルのパスを指定
  const objects = await loader.loadAsync('./models/gltf/binary/ToyCar.glb');
  // 読み込み後に3D空間に追加
  const model = objects.scene;
  scene.add(model);
  
  // ･･･省略
}
```


- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/loader_glb.html)
- [サンプルのソースコードを確認する](../samples/loader_glb.html)



昔のThree.jsに`loadAsync()`メソッドは存在せず、`load()`メソッドのみ提供されていました。ネット上の記事では、`load()`メソッドで説明されているものが多いですが、`Promise`による非同期処理が苦手でなければ`await`・`async`を使って制御するといいでしょう。


### 3dsファイルの場合

3dsファイルの場合を読み込むには`TDSLoader.js`ファイルが必要となります。CDNで読み込む場合は以下の`script`タグをHTMLに記述します。



```html
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.152.2/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.152.2/examples/jsm/"
    }
  }
</script>
```

処理のほうでは`import`文で読み込みます。

```html
<script type="module">
  import * as THREE from "three";
  import { TDSLoader } from "three/addons/loaders/TDSLoader.js";

  // …
</script>
```

読み込む処理は次のように記載します。`TDSLoader`クラスのインスタンスから、`loadAsync()`メソッドを利用します。戻り値として`Promise`オブジェクトを返すので`await`・`async`で待機します。
引数にはファイルパスを指定します。

なお、3dsファイルのテクスチャーのパスがずれないように、`setResourcePath`メソッドを使って、明示的にテクスチャーが含まれるフォルダーのパスを指定します。

```js
// 非同期処理で待機するのでasync function宣言とする
async function init() {
  // ･･･省略

  // 3DS形式のモデルデータを読み込む
  const loader = new TDSLoader();
  // テクスチャーのパスを指定
  loader.setResourcePath('models/3ds/portalgun/textures/');
  // 3dsファイルのパスを指定
  const object = await loader.loadAsync('models/3ds/portalgun/portalgun.3ds');
  // 読み込み後に3D空間に追加
  scene.add(object);

  // ･･･省略
}
```

このコードの実行結果は次のとなります。

![](../imgs/loader_3ds.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/loader_3ds.html)
- [サンプルのソースコードを確認する](../samples/loader_3ds.html)




### Colladaファイルの場合

Colladaファイル（拡張子は`.dae`）の場合を読み込むには`ColladaLoader.js`ファイルが必要となります。



```html
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.152.2/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.152.2/examples/jsm/"
    }
  }
</script>
```

処理のほうでは`import`文で読み込みます。

```html
<script type="module">
  import * as THREE from "three";
  import { ColladaLoader } from "three/addons/loaders/ColladaLoader.js";

  // …
</script>
```
※Three.js r148（2022年12月リリース）より`examples/js`フォルダーでの提供はなくなりました。今後はES Modulesでの利用を推奨されますので、本記事もゆくゆく更新します。

読み込む処理は次のように記載します。`ColladaLoader`クラスのインスタンスから、`loadAsync()`メソッドを利用します。
引数にはファイルパスを指定します。読み込み完了後に3D空間への配置処理をするのがポイントです。Colladaファイルにはシーンの情報の他に、カメラやライトなどさまざまな情報が含まれます。そのため、シーンの情報だけ抜き出すようにしましょう。

```js
// 非同期処理で待機するのでasync function宣言とする
async function init() {
  // ･･･省略

  // Collada形式のモデルデータを読み込む
  const loader = new ColladaLoader();
  // Colladaファイルのパスを指定
  const collada = await loader.loadAsync('./models/collada/elf/elf.dae');
  // 読み込み後に3D空間に追加
  const model = collada.scene;
  scene.add(model);
  // ･･･省略
}
```

このコードの実行結果は次のとなります。

![](../imgs/loader_dae.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/loader_dae.html)
- [サンプルのソースコードを確認する](../samples/loader_dae.html)


### まとめ

今回はモデルデータの読み込み方について説明しました。JavaScriptだけのコードだとどうしても表現がプログラミングアートよりになってしまうため、モデルデータを使った方が表現のバリエーションを増やせます。とくにキャラクターや建築物、物体の表示にはモデルデータの読み込みがかかせません。

### 関連

Node.js関連のバンドルツールで各種ローダーを利用する場合は、以下の解説を参照ください。

- [Node.jsを使ったフロントエンド開発](nodejs.md)