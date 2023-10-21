import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let model;
let mixer;
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

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const controls = new OrbitControls( camera, renderer.domElement );

const loader = new GLTFLoader();
loader.load( 'models/cheesecake/scene.gltf', function ( gltf ) {
  model = gltf.scene;
  model.position.set(0, -0.5, 0);
  model.scale.set(0.0001, 0.0001, 0.0001);
  scene.add( model );

  mixer = new THREE.AnimationMixer( model );
  const clips = gltf.animations;
  clips.forEach(clip => {
    const action = mixer.clipAction( clip );
    action.play();
  });
}, undefined, function ( error ) {
  console.error( error );
} );

camera.position.set(0, 0, 1);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (mixer) {
    mixer.update(0.01);
  }

  renderer.render(scene, camera);
}

animate();
