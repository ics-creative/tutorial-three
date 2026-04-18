---
title: Three.js公式examplesの紹介
author: 池田 泰延
published_date: 2026-04-18
modified_date: 2026-04-18
---

Three.jsの[公式examples](https://threejs.org/examples/)には、2026年4月18日時点で578点の作例が掲載されています。本ページでは、その中から特に注目したい作例をピックアップして紹介します。とくに利用している技術に焦点をあてています。

## 1. webgl_loader_3dtiles

![](../imgs/examples_webgl_loader_3dtiles.avif)

- [Play demo](https://threejs.org/examples/webgl_loader_3dtiles.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_3dtiles.html)

[3D Tiles](https://www.ogc.org/standards/3dtiles/)形式の地理データを読み込み、[Google Photorealistic Tiles](https://developers.google.com/maps/documentation/tile/3d-tiles)と[`three-clouds`](https://www.npmjs.com/package/@takram/three-clouds)を組み合わせた作例です。広い範囲の地形や建物を出しながら、地表の上に雲の層も重ねています。地形や建物と雲の表現によって、リアルに空撮しているような印象があります。画面上部のUIで時刻を切り替えると、地表の明るさと雲の見え方が連動して変わります。

## 2. webgpu_postprocessing_anamorphic

![](../imgs/webgpu_postprocessing_anamorphic.avif)

- [Play demo](https://threejs.org/examples/webgpu_postprocessing_anamorphic.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_anamorphic.html)

ポストエフェクトで、横に長く伸びる光条を加える作例です。金属のヘルメットに入った強いハイライトから細い光が左右へ伸びます。発光体そのものを大きくぼかすのではなく、光の筋を重ねる見せ方です。

## 3. webgpu_postprocessing_radial_blur

![](../imgs/webgpu_postprocessing_radial_blur.avif)

- [Play demo](https://threejs.org/examples/webgpu_postprocessing_radial_blur.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_radial_blur.html)

放射状のぼかしによって、ライトバーストと呼ばれる表現ができる作例です。光源から外側へ向かって明るさが広がる見え方になります。

## 4. webgpu_upscaling_taau

![](../imgs/webgpu_upscaling_taau.avif)

- [Play demo](https://threejs.org/examples/webgpu_upscaling_taau.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_upscaling_taau.html)

都市の建物が整った箱庭のように並び、街全体がミニチュア模型のように見える作例です。

## 5. webgpu_postprocessing_ssr

![](../imgs/webgpu_postprocessing_ssr.avif)

- [Play demo](https://threejs.org/examples/webgpu_postprocessing_ssr.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_ssr.html)

画面内反射を描く作例です。金属の表面や磨かれた台座に周囲の形やハイライトが映り込み、鏡面らしい材質感がよく分かります。

## 6. webgpu_postprocessing_dof

![](../imgs/webgpu_postprocessing_dof.avif)

- [Play demo](https://threejs.org/examples/webgpu_postprocessing_dof.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_dof.html)

被写界深度の作例です。中央付近の球体にピントが合い、手前と奥の球体は大きくぼけて見えます。

## 7. webgpu_caustics

![](../imgs/webgpu_caustics.avif)

- [Play demo](https://threejs.org/examples/webgpu_caustics.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_caustics.html)

透過材質のダックやガラスを通った光が、床の影の中に模様として落ちる作例です。透明な物体を通った光が床にどう現れるかを見比べられます。

## 8. webgpu_lights_projector

![](../imgs/webgpu_lights_projector.avif)

- [Play demo](https://threejs.org/examples/webgpu_lights_projector.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_lights_projector.html)

映写機のように、画像や映像を光として投影する作例です。床には水面の反射を思わせる模様が映り、像のまわりには細い光の筋も見えます。

## 9. webgpu_loader_gltf_transmission

![](../imgs/webgpu_loader_gltf_transmission.avif)

- [Play demo](https://threejs.org/examples/webgpu_loader_gltf_transmission.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_loader_gltf_transmission.html)

[glTF](https://www.khronos.org/gltf/)で透過材質を扱うための拡張仕様[KHR_materials_transmission](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_transmission)を使った作例です。器の向こう側が透けて見え、輪郭の近くでは背景がわずかに曲がって映ります。ガラスや透明樹脂らしい厚みが出やすく、背景と一緒に見たときの材質感がつかみやすい作例です。反射だけの表面とは違う、抜けのある質感がよく出ています。

## 10. webgpu_loader_gltf_iridescence

![](../imgs/webgpu_loader_gltf_iridescence.avif)

- [Play demo](https://threejs.org/examples/webgpu_loader_gltf_iridescence.html)
- [Source Code](https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_loader_gltf_iridescence.html)

[glTF](https://www.khronos.org/gltf/)で玉虫色の薄膜表現を扱うための拡張仕様[KHR_materials_iridescence](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_iridescence)を使った作例です。見る角度に応じて青や紫、緑の色味が移り、単色の金属とは違う複雑な表情が現れます。表面にもう一枚薄い膜が乗ったような見え方なので、アクセサリーや塗装面のような繊細な光り方を見せたい場面に向いた作例です。
