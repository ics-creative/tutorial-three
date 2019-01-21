---
title: Three.jsのスプライト
author: 池田 泰延
published_date: 2017-11-11
modified_date: 2019-01-08
---

3Dでスプライトとは常に正面を向く3Dオブジェクトのことを言います。別の言い方でビルボードとも呼びます。今まで紹介した形状の3Dオブジェクトは角度の変化をつけることでさまざまな「向き」が表現されていました。ここで紹介するスプライトはどの視点から見ても常に正面を向いています。

スプライトはポリゴン数を節約するのには効果的です。とくにパーティクル表現では煙などの小さなオブジェクトを大量に生成するため負荷が増大しがちですが、こういう表現にもスプライトは有効です。


![](../imgs/sprite.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/sprite.html)
- [サンプルのソースコードを確認する](../samples/sprite.html)



▲サンプル。どの視点から見ても配置した3Dオブジェクトは常に正面を向いている


Three.jsでは`THREE.Sprite`クラスのインスタンスを作成することで、ビルボードの表現ができます。`THREE.Sprite`は`THREE.Object3D`クラスのサブクラスであり、任意のマテリアルをコンストラクターで設定し、3D空間に`add()`メソッドで追加して画面に表示します。

```js
// マテリアルを作成する
const material = new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load(/*画像パス*/),
});

const sprite = new THREE.Sprite(material);
scene.add(sprite);
```

`THREE.Sprite`クラスは常にカメラに向かって正面を向くため、角度に関するプロパティー（例：`rotation`）を変更したりメソッド（例：`lookAt()`）を実行しても表示に影響はありません。

## 補足：フォグを適用するには

スプライトに対してフォグを有効にするには`THREE.SpriteMaterial`の`fog`プロパティーを有効にします。

```js
// マテリアルを作成する
const material = new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load(/*画像パス*/),
});
// マテリアルでフォグを有効にする
material.fog = true;

const sprite = new THREE.Sprite(material);
scene.add(sprite);
```
