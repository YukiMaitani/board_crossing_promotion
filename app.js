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
  model.position.set(0, -1.5, 8);
  model.scale.set(0.0006, 0.0006, 0.0006);
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


const shape = new THREE.Shape();
const angleStep = Math.PI * 0.5;
const radius = 1;
const length = 5;
shape.absarc(length, length, radius, angleStep * 0, angleStep * 1);
shape.absarc(-length, length, radius, angleStep * 1, angleStep * 2);
shape.absarc(-length, -length, radius, angleStep * 2, angleStep * 3);
shape.absarc(length, -length, radius, angleStep * 3, angleStep * 4);
const geometry = new THREE.ExtrudeGeometry(shape, {
	depth: length,
});

geometry.center();

const material = new THREE.ShaderMaterial({
  vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      void main() {
        gl_FragColor = vec4(vUv, 0.5, 1.0);
      }
    `,
});

const piece = new THREE.Mesh(geometry, material);
scene.add(piece);

camera.position.set(0, 0, 20);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (mixer) {
    mixer.update(0.01);
  }

  renderer.render(scene, camera);
}

animate();
