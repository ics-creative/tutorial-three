---
title: Three.jsでオブジェクトとの交差を調べる
author: 池田 泰延
published_date: 2017-11-08
modified_date: 2017-11-08
---

Three.jsで3Dオブジェクトにマウスがホバーしていた時、クリックした時を調べるにはレイキャストという機能を使います。次のサンプルでは、マウスが重なったオブジェクトだけ、赤くなるようにしています。


![](../imgs/raycast.png)

- [サンプルを再生する](https://ics-creative.github.io/tutorial-three/samples/raycast.html)
- [サンプルのソースコードを確認する](../samples/raycast.html)


マウス位置を`mousemove`イベントを使って監視します。マウス位置は`-1.0`から`+1.0`の割合で管理したいため、`canvas`要素の幅・高さやマウス座標から割合を数値計算します。

```js
// canvas 要素の参照を取得する
const canvas = document.querySelector('#myCanvas');
// マウス座標管理用のベクトルを作成
const mouse = new THREE.Vector2();
// マウスイベントを登録
canvas.addEventListener('mousemove', handleMouseMove);

// マウスを動かしたときのイベント
function handleMouseMove(event) {
  const element = event.currentTarget;
  // canvas要素上のXY座標
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  // canvas要素の幅・高さ
  const w = element.offsetWidth;
  const h = element.offsetHeight;

  // -1〜+1の範囲で現在のマウス座標を登録する
  mouse.x = ( x / w ) * 2 - 1;
  mouse.y = -( y / h ) * 2 + 1;
}
```

レイキャストを利用するには`THREE.Raycaster`クラスを利用します。

上記のコードで求めた`mouse`オブジェクトを使って、レイキャストを更新しましょう。`setFromCamera`メソッドを使って、マウス位置からまっすぐに伸びる光線ベクトルに更新します。次に、その光線とぶつかったオブジェクトを得るために`intersectObjects`メソッドを利用します。すると、`intersects`配列に光線とぶつかったオブジェクトが格納されます。

※詳しい使い方は公式ドキュメントの「[Raycaster](https://threejs.org/docs/#api/core/Raycaster)」を参考ください。

```js

// レイキャストを作成
const raycaster = new THREE.Raycaster();

tick();
// 毎フレーム時に実行されるループイベントです
function tick() {

  // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
  raycaster.setFromCamera(mouse, camera);

  // その光線とぶつかったオブジェクトを得る
  const intersects = raycaster.intersectObjects(scene.children);

  if(intersects.length > 0){
    // ぶつかったオブジェクトに対してなんかする
  }

  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
```

公式のexamplesにレイキャストのサンプルが用意されています。使い道を探ってみるといいでしょう。

- [webgl_interactive_cubes](https://threejs.org/examples/#webgl_interactive_cubes)
- [webgl_geometry_terrain_raycast](https://threejs.org/examples/?q=raycast#webgl_geometry_terrain_raycast)
- [webgl_interactive_raycasting_points](https://threejs.org/examples/?q=raycast#webgl_interactive_raycasting_points)
- [webgl_raycast_texture](https://threejs.org/examples/?q=raycast#webgl_raycast_texture)


## まとめ

ちょっと難しいですが、応用の効く機能なのでぜひ覚えてみてください。

