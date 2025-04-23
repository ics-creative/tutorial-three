---
title: TSL（Three.js Shading Language）
author: 池田 泰延
published_date: 2025-04-23
modified_date: 2025-04-23
---

# TSL（Three.js Shading Language）の使い方

## TSLとは

**TSL（Three.js Shading Language）** は、Three.js のマテリアルやシェーダーをノードベースで構築・カスタマイズできる高級言語です。  

GLSL を直接記述しなくても、JavaScript でノードを接続していくだけで複雑なシェーダー エフェクトを実装できます。特に WebGPU 環境では、ノードベースのマテリアル（`NodeMaterial`／`MeshStandardNodeMaterial` など）と TSL の組み合わせが強力です。

### WebGPU と WebGL の互換性

TSL は主に WebGPURenderer 向けに設計されていますが、WebGPU をサポートしないブラウザーでは自動的に **WebGL 2** へフォールバックできます。最新ハードウェアでは高性能な WebGPU の恩恵を得つつ、より多くのデバイスで動作する互換性も確保できます。

従来の WebGL では GLSL や **GLSL 3.0** を直接記述する必要があり、低レベルな知識とデバッグの手間が求められました。TSL は JavaScript 構文を用いて抽象化を提供し、シェーダー開発の複雑さを大幅に軽減します。

### TSLの主な特徴

1. **JavaScript／TypeScript での記述**  
   型定義が提供されているため、TypeScript を使うとコード補完や型チェックの恩恵を受けられます。

2. **ノードベースのアプローチ**  
   関数やオブジェクトをノードとして組み合わせ、計算グラフを構築します。ロジックを視覚的に把握しやすく、再利用性も高まります。

3. **ツリーシェイキング対応**  
   必要な機能だけをバンドルに含められるため、最終的な JavaScript バンドルサイズを最小化できます。

4. **自動生成**  
   ターゲットプラットフォーム（WebGPU または WebGL）に合わせてシェーダーコードを生成します。


## NodeMaterial と TSL

Three.js には、従来のマテリアル（`MeshBasicMaterial`／`MeshStandardMaterial` など）とは別に、ノードで計算グラフを構築できる **`NodeMaterial`** と、その拡張版である **`MeshStandardNodeMaterial`** などが用意されています。  
TSL はこれらのプロパティ（`positionNode`／`colorNode`／`normalNode` など）に計算ノードを接続することで、柔軟なカスタマイズを実現します。

- **`positionNode`** — 頂点シェーダーの最終出力位置を制御（頂点変位などに利用）  
- **`colorNode`** — フラグメントシェーダーの最終出力色を制御  
- **`normalNode`** — ライティング計算用の法線ベクトルを制御  

## セットアップ手順

1. **インポート**  
   - `three/webgpu` から `MeshStandardNodeMaterial`をインポート
   - `three/tsl` から各種 TSL ノードをインポート
2. **マテリアル作成**  
   ```js
   const material = new MeshStandardNodeMaterial();
   ```  
3. **TSL ノード構築**  
   `float()`, `vec3()`, `add()`, `mul()`, `sin()`, `time`, `uv()` など多彩なノードを組み合わせて計算グラフを構築。
4. **ノード接続**  
   作成したノードを `material.positionNode` や `material.normalNode` などへ代入します。

## サンプルコード

以下のコードは、`MeshStandardNodeMaterial` の PBR ライティングを保持しつつ、TSL で頂点変位と法線計算をカスタマイズする例です。

![](../imgs/webgpu_tsl.png)

```html
<html>
  <head>
    <meta charset="utf-8" />
    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.webgpu.js",
          "three/webgpu": "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.webgpu.js",
          "three/tsl": "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.tsl.js"
        }
      }
    </script>
    <script type="module">
      import * as THREE from "three";
      import { MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";
      import {
        positionLocal,
        normalLocal,
        time,
        uv,
        sin,
        cos,
        float,
        positionWorld,
        dFdx,
        dFdy,
        cross,
        normalize,
      } from "three/tsl";

      // サイズを指定
      const width = 960;
      const height = 540;

      // レンダラーを作成
      const renderer = new WebGPURenderer({
        canvas: document.querySelector("#myCanvas"),
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000); // 背景色を指定
      await renderer.init(); // 初期化

      // シーンを作成
      const scene = new THREE.Scene();

      // --- ライト設定の調整 ---
      // 平行光源 (角度と強度を再調整)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
      directionalLight.position.set(1, 0.2, 1.5);
      scene.add(directionalLight);

      // カメラを作成
      const camera = new THREE.PerspectiveCamera(45, width / height);
      camera.position.set(0, 0, 1200); // 少しカメラを引く

      // 平面を作成 (サイズ: 800x800, 分割数: 100x100)
      const geometry = new THREE.PlaneGeometry(800, 800, 100, 100);
      const material = new MeshStandardNodeMaterial({
        roughness: 0.0,
        metalness: 0.3,
      });

      // --- 複合波によるディスプレイスメント ---
      const freqX = float(3.0); // 波の周波数X (細かさ)
      const freqY = float(1.0); // 波の周波数Y (細かさ)
      const speed = float(3.0); // 波の速度
      const displacementScale = float(300.0); // 変形の大きさ
      const timeNode = time.mul(speed);

      // X方向とY方向で異なる波を生成
      const waveX = sin(uv().x.mul(freqX).add(timeNode));
      const waveY = cos(uv().y.mul(freqY).add(timeNode)); // Y方向は cos を使用
      // 2つの波を合成 (振幅を平均化)
      const totalWave = waveX.add(waveY).mul(0.5); // -1.0 ~ 1.0 の範囲を想定

      // 変形後の頂点位置を計算し、positionNode に設定
      const deformedPosition = positionLocal.add(normalLocal.mul(totalWave).mul(displacementScale));
      material.positionNode = deformedPosition;

      // --- 変形後の法線を TSL で計算 ---
      // スクリーン空間での偏微分を計算
      const ddx = dFdx(positionWorld);
      const ddy = dFdy(positionWorld);
      // 外積から法線を計算し、正規化
      const calculatedNormal = normalize(cross(ddx, ddy));
      // 計算した法線を normalNode に設定
      material.normalNode = calculatedNormal;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      tick();

      function tick() {
        renderer.render(scene, camera); // レンダリング

        requestAnimationFrame(tick);
      }
    </script>
  </head>
  <body>
    <canvas id="myCanvas"></canvas>
  </body>
</html>
```

### ポイント解説

- **`MeshStandardNodeMaterial`**  
  `three/webgpu` からインポートし、標準の PBR（Physically Based Rendering）ライティング機能を活用しています。
- **複雑な波形の生成**  
  `time`, `uv`, `sin`, `cos` などを組み合わせ、時間経過で変化する波 (`totalWave`) を作成しています。
- **`positionNode` による頂点変位**  
  `positionLocal` を `normalLocal` 方向に押し出し、波打つ形状を生成しています。
- **`normalNode` での法線再計算**  
  `dFdx`／`dFdy` で求めた偏微分ベクトルから外積を取り、変形後に適した法線を算出しています。これによりライティングが正確になります。



TSL と Node Material を組み合わせることで、Three.js の標準マテリアルを拡張しながら、独自のシェーダー エフェクトを手軽に実装できます。ぜひ試してみてください。

