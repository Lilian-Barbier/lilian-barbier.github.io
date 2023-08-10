import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

if (WebGL.isWebGLAvailable()) {

  // Initialize Three.js components
  const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);

  // Set up camera position
  camera.position.z = 20;
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a material for the line
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  // Create a list to store lines
  const lines = [];
  let currentMouse = new THREE.Vector2();

  // Event listener to track mouse movement
  document.addEventListener('mousemove', (event) => {
    currentMouse = new THREE.Vector2();
    currentMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    currentMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Create a timer to draw lines every x seconds
  setInterval(() => {

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      const lastPositions = lastLine.geometry.attributes.position.array;

      // Obtenez la matrice de transformation mondiale de la ligne
      const matrix = lastLine.matrixWorld;

      // Obtenez les coordonnées du deuxième point de la ligne dans le système local de la ligne
      const secondPointLocal = new THREE.Vector3(lastPositions[3], lastPositions[4], lastPositions[5]);  // Remplacez les valeurs par les coordonnées réelles du deuxième point
      // Par exemple, si le deuxième point est à (x, y, z), vous feriez :
      // const secondPointLocal = new THREE.Vector3(x, y, z);

      // Appliquez la matrice de transformation mondiale pour obtenir les coordonnées mondiales
      const secondPointWorld = secondPointLocal.applyMatrix4(matrix);

      lastPositions[3] = secondPointWorld.x;
      lastPositions[4] = secondPointWorld.y;
      lastPositions[5] = secondPointWorld.z;

      lastLine.geometry.attributes.position.needsUpdate = true;
    }

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6);
    linePositions[0] = currentMouse.x;
    linePositions[1] = currentMouse.y;
    linePositions[2] = 0;
    linePositions[3] = currentMouse.x;
    linePositions[4] = currentMouse.y;
    linePositions[5] = 0;
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    lines.push(line);

    if (lines.length > 10000) {
      const firstLine = lines.shift();
      scene.remove(firstLine);
    }

  }, 10);

  // Render loop
  const animate = () => {
    requestAnimationFrame(animate);

    lines.forEach((line) => {
      line.rotation.y += 0.007;
    });

    renderer.render(scene, camera);
  };
  animate();

  function onResize() {
    // camera.aspect = contenedor.clientWidth / contenedor.clientHeight;
    // camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);

} else {

  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);

}
