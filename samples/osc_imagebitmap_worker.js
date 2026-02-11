import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.webgpu.js";

// メインスレッドから通達があったとき
onmessage = async (event) => {
  // メインスレッドからオフスクリーンキャンバスを受け取る
  const canvas = event.data.canvas;
  // Three.jsのライブラリの内部で style.width にアクセスされてしまう
  // 対策しないと、エラーが発生するためダミーの値を指定
  canvas.style = { width: 0, height: 0 };

  // サイズを指定
  const width = 960;
  const height = 540;

  // レンダラーを作成
  const renderer = new THREE.WebGPURenderer({ canvas });
  renderer.setSize(width, height);
  let mesh;

  renderer.setAnimationLoop(tick);

  // シーンを作成
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);

  // テクスチャーを読み込み
  const texture = await new Promise((resolve) => {
    new THREE.ImageBitmapLoader().load("imgs/earthmap1k.jpg", (imageBitmap) => {
      const texture = new THREE.CanvasTexture(imageBitmap);
      texture.colorSpace = THREE.SRGBColorSpace; // カラースペースを指定
      resolve(texture);
    });
  });
  // マテリアルを作成
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const geometry = new THREE.SphereGeometry(300, 50, 50);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  // 毎フレーム時に実行されるループイベントです
  function tick() {
    if (!mesh) {
      renderer.render(scene, camera);
      return;
    }

    mesh.rotation.y += 0.01;

    // レンダリング
    renderer.render(scene, camera);
  }
};
