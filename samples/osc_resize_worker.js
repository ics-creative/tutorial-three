importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js'
);
let renderer;
let camera;

// メインスレッドから通達があったとき
onmessage = event => {
  switch (event.data.type) {
    case 'init':
      init(event);
      break;
    case 'resize':
      resize(event.data.width, event.data.height, event.data.devicePixelRatio);
      break;
  }
};

function init(event) {
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
  renderer = new THREE.WebGLRenderer({ canvas });

  // シーンを作成
  const scene = new THREE.Scene();
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

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    mesh.rotation.y += 0.01;

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}

function resize(width, height, devicePixelRatio) {
  // レンダラーのサイズを調整する
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
