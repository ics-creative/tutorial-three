---
title: Three.jsでES2015のclassを利用する(メソッド編)
author: 池田 泰延
published_date: 2017-12-04
modified_date: 2017-12-04
---

この解説は[Three.jsでES2015のclassを利用する（継承）](class.md)からの続きです。クラスのメソッドを呼び出すベスト・プラクティスな例を学んでいきましょう。


## クラスのメソッドを利用する

時間経過でグループのアニメーションをさせたい場合の方法を紹介します。

![](../imgs/class_update.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/class_update.html)
- [サンプルのソースコードを確認する](../samples/class_update.html)

時間経過は`requestAnimationFrame()`メソッドを使いたいところですが、いたる所に`requestAnimationFrame()`メソッドを記述するのはベストプラクティスとは言えません。複数の`requestAnimationFrame()`メソッドがあったときに、どれがはじめに実行されるのか、処理の実行順がわかりにくいからです。また、負荷の観点からも複数の`requestAnimationFrame()`メソッドを定義するのは最適とは言えません。

### 悪い例

良くないコード例から見てみます。

```js
// 独自グループを作る
const myGroup = new MyGroup();
scene.add(myGroup);

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {

  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

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
```

良くないのは親となるコードにも、子供のクラスにも`requestAnimationFrame()`が使われているところです。うまく動くと思いますが、どちらの`requestAnimationFrame()`が先に実行されるのか、明示的にわからなくなります。メインコードにレンダリングのための`renderer.render(scene, camera);`処理がありますが、その処理の実行前後で子供の`MyGroup`が実行されるか、保証されません。

### 改善例

メインとなるコードに一つだけ`requestAnimationFrame()`メソッドを用意し、そこからツリー構造で独自メソッドを叩いていくといいでしょう。

良い例

```js
// 独自グループを作る
const myGroup = new MyGroup();
scene.add(myGroup);

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {

  // 更新命令を実行します。
  myGroup.update();

  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

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
```

こうすれば、`requestAnimationFrame()`メソッドが実行されるのはメインコードの一箇所のみになります。メインコードにレンダリングのための`renderer.render(scene, camera);`処理の前に子供の`MyGroup`クラスの`update()`メソッドが実行されることが保証されます。

