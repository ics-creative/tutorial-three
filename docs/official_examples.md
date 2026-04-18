---
title: Three.js公式examplesの紹介
author: 池田 泰延
published_date: 2026-04-18
modified_date: 2026-04-18
---

Three.jsの公式examplesをピックアップして紹介します。とくに利用している技術に焦点をあてています。

## 1. webgl_loader_3dtiles

![](../imgs/examples_webgl_loader_3dtiles.avif)

- [Play Demo](https://threejs.org/examples/webgl_loader_3dtiles.html)

3D Tiles形式の地理データを読み込み、Google Photorealistic Tilesと`three-clouds`を組み合わせた作例です。広い範囲の地形や建物を出しながら、地表の上に雲の層も重ねています。見どころは、景観の密度と空の表情が同じ画面に入るところです。画面上部のUIで時刻を切り替えると、地表の明るさと雲の見え方が連動して変わります。

## 2. webgpu_postprocessing_anamorphic

![](../imgs/webgpu_postprocessing_anamorphic.avif)

- [Play Demo](https://threejs.org/examples/webgpu_postprocessing_anamorphic.html)

ポストエフェクトで、横に長く伸びる光条を加える作例です。金属のヘルメットに入った強いハイライトから細い光が左右へ伸び、画面に横方向の緊張感が生まれます。発光体そのものを大きくぼかすのではなく、光の筋を重ねる見せ方なので、形の輪郭と光の存在感がきれいに並びます。

## 3. webgpu_postprocessing_radial_blur

![](../imgs/webgpu_postprocessing_radial_blur.avif)

- [Play Demo](https://threejs.org/examples/webgpu_postprocessing_radial_blur.html)

放射状のぼかしで、光が差し込む筋を描く作例です。光源から外側へ向かって明るさが広がるため、奥行きのある場面で空気の中に光の束が立って見えます。ぼかしの重なり方と減衰のさせ方で印象が変わるので、同じシーンでも光の強さを大きく調整できるタイプの表現です。

## 4. webgpu_upscaling_taau

![](../imgs/webgpu_upscaling_taau.avif)

- [Play Demo](https://threejs.org/examples/webgpu_upscaling_taau.html)

都市の建物が整った箱庭のように並び、街全体がミニチュア模型のように見える作例です。

## 5. webgpu_postprocessing_ssr

![](../imgs/webgpu_postprocessing_ssr.avif)

- [Play Demo](https://threejs.org/examples/webgpu_postprocessing_ssr.html)

画面内反射を描く作例です。金属の表面や磨かれた床に周囲の形が映り込み、素材の硬さと重さが前に出ます。明るい部分が反射面に拾われるたびに、物体の表面が一枚増えたように見え、静止画でも密度の高い画面になります。

## 6. webgpu_postprocessing_dof

![](../imgs/webgpu_postprocessing_dof.avif)

- [Play Demo](https://threejs.org/examples/webgpu_postprocessing_dof.html)

被写界深度の作例です。ピントの合う位置を中心に、手前と奥がやわらかくぼけます。小さな光や細い形が丸くほどけるので、静物写真のようなまとまりが出ます。モデルそのものはそのままでも、視線が集まる位置を画面の中で自然に決められる表現です。

## 7. webgpu_caustics

![](../imgs/webgpu_caustics.avif)

- [Play Demo](https://threejs.org/examples/webgpu_caustics.html)

水やガラスを通った光が床に落とす、ゆらぎ模様の作例です。影の上に明るい模様が重なるので、透明な物体の厚みと光の通り道が目で追えます。細かな揺れが続くため、止まった構図でも画面に動きが残ります。透明素材を主役にしたいときに印象へ直結するタイプの表現です。

## 8. webgpu_lights_projector

![](../imgs/webgpu_lights_projector.avif)

- [Play Demo](https://threejs.org/examples/webgpu_lights_projector.html)

映写機のように、画像や映像を光として投影する作例です。模様が壁や床に貼り付くだけでなく、水面の反射を思わせる揺らぎも加わります。静止した照明よりも情報量が多く、空間全体に意味のある柄や映像を流し込めるので、舞台や展示のような見え方になります。

## 9. webgpu_loader_gltf_transmission

![](../imgs/webgpu_loader_gltf_transmission.avif)

- [Play Demo](https://threejs.org/examples/webgpu_loader_gltf_transmission.html)

glTFの`KHR_materials_transmission`を使った透過材質の作例です。器の向こう側が透けて見え、輪郭の近くでは背景がわずかに曲がって映ります。ガラスや透明樹脂らしい厚みが出やすく、背景と一緒に見たときの材質感がつかみやすい作例です。反射だけの表面とは違う、抜けのある質感がよく出ています。

## 10. webgpu_loader_gltf_iridescence

![](../imgs/webgpu_loader_gltf_iridescence.avif)

- [Play Demo](https://threejs.org/examples/webgpu_loader_gltf_iridescence.html)

glTFの`KHR_materials_iridescence`を使った、玉虫色の薄膜表現の作例です。見る角度に応じて青や紫、緑の色味が移り、単色の金属とは違う複雑な表情が現れます。表面にもう一枚薄い膜が乗ったような見え方なので、アクセサリーや塗装面のような繊細な光り方を見せたい場面に向いた作例です。
