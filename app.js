import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let model;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

const loader = new GLTFLoader();
loader.load( 'models/scene.gltf', function ( gltf ) {
  model = gltf.scene;
  model.position.set(0, 0, 0);
  scene.add( model );
}, undefined, function ( error ) {
  console.error( error );
} );

camera.position.set(0, 0, 1);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}

animate();
