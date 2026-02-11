import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.webgpu.js";
let renderer;
let camera;

// メインスレッドから通達があったとき
onmessage = async (event) => {
  switch (event.data.type) {
    case "init":
      await init(event);
      break;
    case "resize":
      resize(event.data.width, event.data.height, event.data.devicePixelRatio);
      break;
  }
};

async function init(event) {
  // メインスレッドからオフスクリーンキャンバスを受け取る
  const canvas = event.data.canvas;
  // スクリーン情報を受け取る
  const width = event.data.width;
  const height = event.data.height;
  const devicePixelRatio = event.data.devicePixelRatio;
  // Three.jsのライブラリの内部で style.width にアクセスされてしまう
  // 対策しないと、エラーが発生するためダミーの値を指定
  canvas.style = { width: 0, height: 0 };

  // レンダラーを作成
  renderer = new THREE.WebGPURenderer({ canvas });

  renderer.setAnimationLoop(tick);

  // シーンを作成
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, 1000);
  resize(width, height, devicePixelRatio);

  // 球体を作成
  const geometry = new THREE.SphereGeometry(300, 30, 30);
  // マテリアルを作成
  const material = new THREE.MeshBasicMaterial({ wireframe: true });
  // メッシュを作成
  const mesh = new THREE.Mesh(geometry, material);
  // 3D空間にメッシュを追加
  scene.add(mesh);

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    mesh.rotation.y += 0.01;

    // レンダリング
    renderer.render(scene, camera);
  }
}

function resize(width, height, devicePixelRatio) {
  if (!renderer || !camera) return;

  // レンダラーのサイズを調整する
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
