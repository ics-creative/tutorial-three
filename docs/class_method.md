---
title: Three.jsでclass構文を利用する(メソッド編)
author: 池田 泰延
published_date: 2017-12-04
modified_date: 2023-05-26
---

この解説は[Three.jsでES2015のclassを利用する（継承）](class.md)からの続きです。クラスのメソッドを呼び出すベスト・プラクティスな例を学んでいきましょう。


## クラスのメソッドを利用する

時間経過でグループのアニメーションをさせたい場合の方法を紹介します。

![](../imgs/class_update.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/class_update.html)
- [サンプルのソースコードを確認する](../samples/class_update.html)

時間経過は`renderer.setAnimationLoop()`で管理するのが基本です。クラス内部で独自に`requestAnimationFrame()`を回しはじめると、更新順序が分かりづらくなり、レンダリングとの前後関係も不明確になります。ループの起点は1箇所に絞りましょう。

### 悪い例

良くないコード例から見てみます。

```js
/** メッシュを継承した独自グループのクラスです。 */
class MyGroup extends THREE.Object3D {

  /** コンストラクターです。 */
  constructor() {
    super();
    // 任意の処理
    this.update();
  }

  /** 更新命令を定義します。 */
  update() {
    requestAnimationFrame(this.update);
  }
}

// 独自グループを作る
const myGroup = new MyGroup();
scene.add(myGroup);

renderer.setAnimationLoop(tick);

// 毎フレーム時に実行されるループイベントです
function tick() {

  // レンダリング
  renderer.render(scene, camera);
}
```

良くないのは親となるコードは`renderer.setAnimationLoop()`、子クラスは`requestAnimationFrame()`で別々にループを持っているところです。うまく動く場合もありますが、どちらの更新が先に実行されるかを保証できません。結果として、`renderer.render(scene, camera);`の前後で`MyGroup`の更新がずれる可能性があります。

### 改善例

メインとなるコードに一つだけ`renderer.setAnimationLoop()`を用意し、そこからツリー構造で独自メソッドを呼び出すのが安全です。

良い例

```js
/** メッシュを継承した独自グループのクラスです。 */
class MyGroup extends THREE.Object3D {

  /** コンストラクターです。 */
  constructor() {
    super();
    // 任意の処理
  }

  /** 更新命令を定義します。 */
  update() {
  }
}

// 独自グループを作る
const myGroup = new MyGroup();
scene.add(myGroup);

renderer.setAnimationLoop(tick);

// 毎フレーム時に実行されるループイベントです
function tick() {

  // 更新命令を実行します。
  myGroup.update();

  // レンダリング
  renderer.render(scene, camera);
}
```

こうすれば、ループの登録箇所はメインコードの1箇所だけになります。`renderer.render(scene, camera);`の前に`MyGroup`クラスの`update()`メソッドが実行されることを保証できます。
