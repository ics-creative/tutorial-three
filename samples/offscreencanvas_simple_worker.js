importScripts("https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.min.js");

onmessage = event => {

  // サイズを指定
  const width = 960;
  const height = 540;

  // メインスレッドからオフスクリーンキャンバスを受け取る
  const canvas = event.data.canvas;
  canvas.style = { width: 0, height: 0 };

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);

  // マテリアルを作成する
  const material = new THREE.MeshStandardMaterial({ color: 0xffFF00 });

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  // シーンに追加
  scene.add(directionalLight);

  // ビルボードを作成
  for (let i = 0; i < 300; i++) {
    // 球体を作成
    const geometry = new THREE.SphereGeometry(20, 20, 20);
    // メッシュを作成
    const mesh = new THREE.Mesh(geometry, material);
    // 3D空間にメッシュを追加
    scene.add(mesh);
    mesh.position.set(1000 * (Math.random() - 0.5),
      1000 * (Math.random() - 0.5),
      1000 * (Math.random() - 0.5));
  }

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // カメラの自動移動
    camera.position.x = 100 * Math.sin(Date.now() / 2000);
    camera.position.z = 100 * Math.cos(Date.now() / 2000);
    camera.position.y = 50 * Math.sin(Date.now() / 1000) + 60;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
};
