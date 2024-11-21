import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

let renderScene;
export const BloomEffect = (obj, threshold = 0, strength = 5.5, radius = 0.5) => {
  const bloomComposer = new EffectComposer(obj.renderer);
  bloomComposer.renderToScreen = false;
  renderScene = new RenderPass(obj.scene, obj.camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(obj.WIDTH, obj.HEIGHT),
    100
  );
  
  bloomPass.threshold = threshold;
  bloomPass.strength = strength;
  bloomPass.radius = radius;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);
  return {bloomComposer,bloomPass};
};

export const DefaultBloomEffect = (obj, threshold = 0, strength = 5.5, radius = 0) => {
  const bloomComposer = new EffectComposer(obj.renderer);
  const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
          vec4 baseColor = texture2D(baseTexture, vUv);
          vec4 bloomColor = texture2D(bloomTexture, vUv);
          gl_FragColor = baseColor + bloomColor;
        }
      `,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;
  const finalComposer = new EffectComposer(obj.renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);
  return finalComposer;
};


