import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import {
  Renderer,
  Camera,
  Scene,
  OrbitControl,
  Resize,
  PointLight,
  AmbientLight,
  DirectionalLight,
  useTControl,
  AxesHelper,
  GridHelper,
} from "./src/Components/SceneAssets";
gsap.registerPlugin(ScrollTrigger);

//===================================================== SHADERS
// const vertexShader = `
//   varying float vDistance;
//   varying vec2 vUv;

//     void main() {
//       vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//       gl_Position = projectionMatrix * mvPosition;
//       vDistance = -mvPosition.z; // Use negative Z-coordinate as distance from camera
//       vUv = uv;
//     }
// `;
// const fragmentShader = `

//   varying vec2 vUv;
//   uniform sampler2D imageTexture;

//   void main() {

//     vec4 color = texture(imageTexture, vUv);
//     gl_FragColor = color;
//   }
// `;

//===================================================== Variables
let canvas,
  heartGlobal,
  gltfloader = new GLTFLoader(),
  WIDTH = window.innerWidth,
  mainGroup = new THREE.Group(),
  HEIGHT = window.innerHeight,
  leftModel,
  leftPModel,
  RightModel,
  RightPModel,
  HDRMAPURL =
    "https://chatpanda.b-cdn.net/Fluid-anim/assets/rural_asphalt_road_4k.hdr";

canvas = document.querySelector(".canvas");
var markerStatus = canvas.dataset.marker;
markerStatus=JSON.parse(markerStatus)
console.log(markerStatus);
//===================================================== Create a WebGL renderer
var renderer = Renderer(canvas);
//===================================================== Create an empty scene
var scene = Scene();
scene.add(mainGroup);
scene.fog = new THREE.FogExp2(0x000000, 0.04);

// HDRMap({ scene, renderer }, HDRMAPURL);

//===================================================== Perpsective camera
var camera = Camera(0, 0, 1);

//===================================================== Orbit Controls
// const orbitControls = OrbitControl(camera, canvas);

//===================================================== Resize
Resize(camera, renderer);

//===================================================== Import Model
// Create layers
const ENTIRE_SCENE = 0,
  BLOOM_SCENE1 = 1,
  BLOOM_SCENE2 = 2;
const bloomLayer1 = new THREE.Layers();
const bloomLayer2 = new THREE.Layers();
bloomLayer1.set(BLOOM_SCENE1);
bloomLayer2.set(BLOOM_SCENE2);

// Materials
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const materials1 = {};
const materials2 = {};
// Global Variables
let sampler1;
let modelVertices1 = [];
let modelPoints1;
let modelVerticesArray1 = [];
let modelVerticesArrayOrig1 = [];
let modelPositionAttribute1;
const tempPosition1 = new THREE.Vector3();
let modelPointsGeometry1 = new THREE.BufferGeometry();
let sampler2;
let modelVertices2 = [];
let modelPoints2;
let modelVerticesArray2 = [];
let modelVerticesArrayOrig2 = [];
let modelPositionAttribute2;
const tempPosition2 = new THREE.Vector3();
let modelPointsGeometry2 = new THREE.BufferGeometry();
const directions = [];

gltfloader.load("https://chatpanda.b-cdn.net/DevPanda/logo.gltf", (gltf) => {
  const model = gltf.scene;
  model.name = "left_logo";
  model.position.set(-0.49, 0.17, 0);
  model.rotation.set(-0.12, -0.01, 0.71);
  model.scale.set(2.68, 2.1, 1.7);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({color:0x77bbff})
      child.layers.enable(ENTIRE_SCENE);
      child.layers.enable(BLOOM_SCENE2);
      sampler1 = new MeshSurfaceSampler(child).build();
    }
  });
  RightModel = model;
  scene.add(model);

  // scene.add(gltf.scene);
  for (let i = 0; i < 5000; i++) {
    // Sample a random position in the model
    sampler1.sample(tempPosition1);
    // Push the coordinates of the sampled coordinates into the array
    modelVertices1.push(tempPosition1.x, tempPosition1.y, tempPosition1.z);
    const direction = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    directions.push(direction);
  }

  modelVerticesArray1 = new Float32Array(modelVertices1);
  modelVerticesArrayOrig1 = new Float32Array(modelVertices1);

  modelPositionAttribute1 = new THREE.BufferAttribute(modelVerticesArray1, 3);
  // Define all points positions from the previously created array
  modelPointsGeometry1.setAttribute("position", modelPositionAttribute1);

  // Define the matrial of the points
  const modelPointsMaterial1 = new THREE.PointsMaterial({
    color: 0x77bbff,
    size: 0.01,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    sizeAttenuation: true,
    alphaMap: new THREE.TextureLoader().load("https://chatpanda.b-cdn.net/DevPanda/particle-texture.jpg"),
  });
  modelPoints1 = new THREE.Points(modelPointsGeometry1, modelPointsMaterial1);
  scene.add(modelPoints1);
  modelPoints1.position.set(-0.58, 0.17, 0);
  modelPoints1.rotation.set(-0.12, -0.01, 0.71);
  modelPoints1.scale.set(2.68, 2.1, 1.7);
  modelPoints1.visible = false;
  RightPModel = modelPoints1;
console.log(modelVerticesArray1);
  // for (let i = 0; i < modelVerticesArray1.length; i += 3) {
  //   modelVerticesArray1[i + 1] += Math.random() * 2 - 1;
  //   modelVerticesArray1[i + 2] += Math.random() * 2 - 1;
  // }
  // modelPositionAttribute1.needsUpdate = true;

  



  
});

gltfloader.load("https://chatpanda.b-cdn.net/DevPanda/logo.gltf", (gltf) => {
  const model = gltf.scene;
  model.name = "right_logo";
  model.position.set(0.4, -0.21, 0);
  model.rotation.set(2.7, 0.06, -2.25);
  model.scale.set(2.29, 2.46, 2.35);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({color:0x77bbff})
      child.layers.enable(ENTIRE_SCENE);
      child.layers.enable(BLOOM_SCENE2); // Enable bloom for this model
      sampler2 = new MeshSurfaceSampler(child).build();
    }
  });
  leftModel = model;
  scene.add(model);

  // scene.add(gltf.scene);
  for (let i = 0; i < 5000; i++) {
    // Sample a random position in the model
    sampler2.sample(tempPosition2);
    // Push the coordinates of the sampled coordinates into the array
    modelVertices2.push(tempPosition2.x, tempPosition2.y, tempPosition2.z);
  }

  modelVerticesArray2 = new Float32Array(modelVertices2);
  modelVerticesArrayOrig2 = new Float32Array(modelVertices2);

  modelPositionAttribute2 = new THREE.BufferAttribute(modelVerticesArray2, 3);
  // Define all points positions from the previously created array
  modelPointsGeometry2.setAttribute("position", modelPositionAttribute2);

  // Define the matrial of the points
  const modelPointsMaterial2 = new THREE.PointsMaterial({
    color: 0x77bbff,
    size: 0.01,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    sizeAttenuation: true,
    alphaMap: new THREE.TextureLoader().load("https://chatpanda.b-cdn.net/DevPanda/particle-texture.jpg"),
  });
  modelPoints2 = new THREE.Points(modelPointsGeometry2, modelPointsMaterial2);
  scene.add(modelPoints2);

  modelPoints2.position.set(0.5, -0.21, 0);
  modelPoints2.rotation.set(2.7, 0.06, -2.25);
  modelPoints2.scale.set(2.29, 2.46, 2.35)
  modelPoints2.visible = false;
  leftPModel = modelPoints2;
  setTimeout(() => {
    customAnimation();
  }, 3000);
});

//===================================================== Background Scene

function getRandomSpherePoint({ radius = 10 }) {
  const minRadius = radius * 0.25;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}

const geo = new THREE.BoxGeometry(0.02, 0.02, 0.02);
// const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const mat = new THREE.MeshBasicMaterial({
  // color: 0xb591ff,
  color: 0xffffff,
  wireframe: true,
});
// const edges = new THREE.EdgesGeometry(geo);

function getBox() {
  const box = new THREE.Mesh(geo, mat);
  return box;
}
const boxGroup = new THREE.Group();
boxGroup.userData.update = (timeStamp) => {
  boxGroup.rotation.x = timeStamp * 0.01;
  boxGroup.rotation.y = timeStamp * 0.01;
};

scene.add(boxGroup);

const numBoxes = 2000;
const radius = 45;
for (let i = 0; i < numBoxes; i++) {
  const box = getBox();
  box.layers.enable(ENTIRE_SCENE);
  box.layers.enable(BLOOM_SCENE1);
  const { x, y, z } = getRandomSpherePoint({ radius });
  box.position.set(x, y, z);
  box.rotation.set(x, y, z);
  boxGroup.add(box);
}

const blueLightGeo = new THREE.BoxGeometry(0.001, 0.001, 0.001);
const blueLightMat = new THREE.MeshBasicMaterial({
  color: 0xadd8e6,
  // color: 0xffffff,
});

//===================================================== Create a point light in our scene

var light = PointLight(false, "white", 0.01);
light.position.set(-0.35, -0.08, 0.54);
var light1 = PointLight(false, "white", 0.01);
light1.position.set(0.38, -0.17, 0.67);
// useTControl(light1.PointLight);
// DirectionalLight(false, "white", 10);
// AmbientLight("white", 5);

//===================================================== GSAP Animation

//===================================================== Post processing
// const OBJ = { THREE, renderer, scene, camera, HEIGHT, WIDTH };
// const { bloomComposer, bloomPass } = BloomEffect(OBJ, 0, 5, 0);
// const finalComposer = DefaultBloomEffect(OBJ);
// Bloom Scene 1
const renderScene = new RenderPass(scene, camera);
const bloomPass1 = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight)
);
bloomPass1.threshold = 0;
bloomPass1.strength = 1;
bloomPass1.radius = 0;
const bloomComposer1 = new EffectComposer(renderer);
bloomComposer1.renderToScreen = false;
bloomComposer1.addPass(renderScene);
bloomComposer1.addPass(bloomPass1);
// Bloom Scene 2
const bloomPass2 = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight)
);
bloomPass2.threshold = 0;
bloomPass2.strength = 0;
bloomPass2.radius = 0;
const bloomComposer2 = new EffectComposer(renderer);
bloomComposer2.renderToScreen = false;
bloomComposer2.addPass(renderScene);
bloomComposer2.addPass(bloomPass2);

const finalPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture1: { value: bloomComposer1.renderTarget2.texture },
      bloomTexture2: { value: bloomComposer2.renderTarget2.texture },
    },
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
    defines: {},
  }),
  "baseTexture"
);
finalPass.needsSwap = true;
const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);

// Mask function
function darkenNonBloomed1(obj) {
  if (obj.isMesh && !bloomLayer1.test(obj.layers)) {
    materials1[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function darkenNonBloomed2(obj) {
  if (obj.isMesh && !bloomLayer2.test(obj.layers)) {
    materials2[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial1(obj) {
  if (materials1[obj.uuid]) {
    obj.material = materials1[obj.uuid];
    delete materials1[obj.uuid];
  }
}

function restoreMaterial2(obj) {
  if (materials2[obj.uuid]) {
    obj.material = materials2[obj.uuid];
    delete materials2[obj.uuid];
  }
}
function customAnimation() {
  let duration = 8;
  let radius = 1;
  let tl = gsap.timeline({ paused: true });
  // ========================================== RIGHT MODEL
  tl.to(RightModel.scale, { x: 2.48, y: 2.46, z: 2.33, duration: 1.5 });
  tl.to(RightPModel.scale, { x: 2.48, y: 2.46, z: 2.33, duration: 1.5 },"-=1.5");
  tl.to(RightModel.position,{ x: -0.04, y: -0.09, z: 0, duration: 1.5 },"-=1.5");
  tl.to( RightPModel.position,{ x: -0.11, y: -0.01, z: 0, duration: 1.5 },"-=1.5");
  tl.to(leftModel.position,{ x: 0.04, y: -0.09, z: 0, duration: 1.5 },"-=1.5");
  tl.to(leftPModel.position,{ x: 0.1, y: -0.01, z: 0, duration: 1.5 },"-=1.5");
  tl.to(RightModel.rotation,{ x: 0, y: -0.02, z: 0.01, duration: 1.5 },"-=1.5");
  tl.to(RightPModel.rotation,{ x: 0, y: -0.02, z: 0.01, duration: 1.5 },"-=1.5");
  tl.to(leftModel.rotation,{ x: 3.13, y: -0.01, z: -3.14, duration: 1.5 },"-=1.5");
  tl.to(leftPModel.rotation,{ x: 3.13, y: -0.01, z: -3.14, duration: 1.5 },"-=1.5");
  tl.to(RightPModel, { visible: true });
  tl.to(leftPModel, { visible: true },"-=0.5");
  tl.to(bloomPass2, { strength: 1.3, duration: 1.5, ease: "power1.in" }, "-=1.8");
  tl.to(bloomPass2, {strength: 0,ease: "power2.out",duration: 0.9,delay: 0.1,});
  tl.to(RightModel, { visible: false }, "-=1.4");
  tl.to(leftModel, { visible: false }, "-=1.4");



  for (let i = 0; i < modelVerticesArray1.length; i += 3) {
    const targetPosition = {
      x: modelVerticesArray1[i] + directions[i / 3].x * radius, // Adjust multiplier to control blast distance
      y: modelVerticesArray1[i + 1] + directions[i / 3].y * radius,
      z: modelVerticesArray1[i + 2] + directions[i / 3].z * radius
    };
  
    // Use GSAP to animate the positions
    tl.to(modelVerticesArray1, {
      [i]: targetPosition.x,
      [i + 1]: targetPosition.y,
      [i + 2]: targetPosition.z,
      duration: duration,
      delay:2,
      ease: "power3.out",
      onUpdate: function() {
        // Update the position attribute on each frame
        modelPositionAttribute1.needsUpdate = true;
      }
    },0);
  }
  for (let i = 0; i < modelVerticesArray2.length; i += 3) {
    const targetPosition = {
      x: modelVerticesArray2[i] + directions[i / 3].x * radius, // Adjust multiplier to control blast distance
      y: modelVerticesArray2[i + 1] + directions[i / 3].y * radius,
      z: modelVerticesArray2[i + 2] + directions[i / 3].z * radius
    };
  
    // Use GSAP to animate the positions
    tl.to(modelVerticesArray2, {
      [i]: targetPosition.x,
      [i + 1]: targetPosition.y,
      [i + 2]: targetPosition.z,
      duration: duration,
      delay:2,
      ease: "power3.out",
      onUpdate: function() {
        // Update the position attribute on each frame
        modelPositionAttribute2.needsUpdate = true;
      }
    },0);
  }
  


  // ========================================== ANIMATION ON SCROLL

  ScrollTrigger.create({
    trigger: ".animation-height",
    start: "top 0%",
    end: "bottom bottom",
    markers: markerStatus,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      console.log("progress:", progress);
      tl.progress(progress*0.5);
     
    },
  });
}

//===================================================== Animate
const clock = new THREE.Clock();
let x = 0,
  y = true;
function Animation() {
  const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(Animation);

  scene.traverse(darkenNonBloomed1);
  bloomComposer1.render();
  scene.traverse(restoreMaterial1);

  scene.traverse(darkenNonBloomed2);
  bloomComposer2.render();
  scene.traverse(restoreMaterial2);

  // Render the entire scene normally
  finalComposer.render();
  // orbitControls.update();
  boxGroup.userData.update(elapsedTime);

  // if (y) {
  //   x += 0.01;
  //   bloomPass2.strength = x;
  //   if(x>2){
  //     y = false;
  //   }
  // } else {
  //   x -= 0.01;
  //   bloomPass2.strength = x;
  //   if(x<-0.5){
  //     y = true;
  //   }
  // }
}

Animation();
// AxesHelper(5);
