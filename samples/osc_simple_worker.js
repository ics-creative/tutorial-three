importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js'
);

// メインスレッドから通達があったとき
onmessage = event => {
  // メインスレッドからオフスクリーンキャンバスを受け取る
  const canvas = event.data.canvas;
  // Three.jsのライブラリの内部で style.width にアクセスされてしまう
  // 対策しないと、エラーが発生するためダミーの値を指定
  canvas.style = { width: 0, height: 0 };

  // サイズを指定
  const width = 960;
  const height = 540;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height);
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  scene.add(directionalLight);

  // マテリアルを作成
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

  // たくさん作成
  for (let i = 0; i < 300; i++) {
    const geometry = new THREE.SphereGeometry(20, 20, 20);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    // 適当に配置
    mesh.position.set(
      1000 * (Math.random() - 0.5),
      1000 * (Math.random() - 0.5),
      1000 * (Math.random() - 0.5)
    );
  }

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // カメラの自動移動
    camera.position.set(
      100 * Math.sin(Date.now() / 2000),
      100 * Math.cos(Date.now() / 2000),
      50 * Math.sin(Date.now() / 1000) + 60
    );
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
};
