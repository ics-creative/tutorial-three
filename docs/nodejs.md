---
title: Node.jsを使ったフロントエンド開発
author: 池田 泰延
published_date: 2019-01-17
modified_date: 2024-04-27
---

効率のよい開発ができるよう、最新の開発環境の構築もしましょう。開発環境を整えれば最新のJavaScript言語仕様を利用でき、開発効率向上に役立つはずです。また、型定義のあるTypeScriptを使ってコード補完をフルに効かせて開発するのもオススメです。

- [webpack + Babelの環境構築 \(Three\.jsのサンプル付き\)](https://ics.media/entry/16028/)
- [webpack + TypeScriptの環境構築 \(Three\.jsのサンプル付き\)](https://ics.media/entry/16329/)

### import文の課題

とくに注意したいのは、Three.jsの本体に含まれていないライブラリです。本入門サイトで扱った`OrbitControls`や`mergeGeometries`、`GLTFLoader`などが該当します。

これらの機能はThree.js本体に含まれていないので、入門サイトでは別途JavaScriptファイルを`importmap`を使って読み込むことで利用しました。バンドルツール（webpackやVite等）を使った開発では、`importmap`での利用する方法とは異なる方式で解決しなければなりません。以下に対策方法を示します。



### バンドルツールで使う方法

Node.jsのバンドルツールで取り込む場合は、`THREE`名前空間上に該当機能が存在しないので、`import`文の書き方を調整する必要があります。

`three/examples/jsm/`以下の階層に該当機能が存在するので、ここにパスを通します。


### OrbitControls の使い方

`import`文で、`three/examples/jsm/controls/OrbitControls`から該当機能を読み込みます。`import`文により`OrbitControls`オブジェクトで該当機能を得ているので、これを使って利用します。`THREE.OrbitControls`ではなく`OrbitControls`で参照していることがポイントです。


```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ･･･省略

// カメラを作成
const camera = new THREE.PerspectiveCamera(/* 省略 */);

// カメラコントローラーを作成
const controls = new OrbitControls(camera, renderer.domElement);
```

サンプルを用意しているので、以下の構成を参考ください。

- [TypeScript + webpack](https://github.com/ics-creative/170330_webpack/tree/master/tutorial-typescript-three)
- [Babel + webpack](https://github.com/ics-creative/170330_webpack/tree/master/tutorial-babel-three)



### mergeGeometries の使い方


`import`文で、`three/examples/jsm/utils/BufferGeometryUtils`から該当機能を読み込みます。`import`文により`mergeGeometries`が該当機能を得ているので、これを使って利用します。`THREE.BufferGeometryUtils.mergeGeometries`ではなく`mergeGeometries`で参照していることがポイントです。


```js
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

// ･･･省略

// ジオメトリを生成
const geometry = mergeGeometries(boxes);
```

もしくは、以下のように`* as BufferGeometryUtils`として`import`文を記載しても問題ありません。

```js
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

// ･･･省略

// ジオメトリを生成
const geometry = BufferGeometryUtils.mergeGeometries(boxes);
```


### GLTFLoader の使い方

`import`文で、`three/examples/jsm/loaders/GLTFLoader`から該当機能を読み込みます。`import`文により`GLTFLoader`オブジェクトが該当機能を得ているので、これを使って利用します。`THREE.GLTFLoader`ではなく`GLTFLoader`で参照していることがポイントです。


```js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ･･･省略

// GLTF形式のモデルデータを読み込む
const loader = new GLTFLoader();
```
