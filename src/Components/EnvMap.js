import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export const HDRMap = (obj,hdr) => {
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(
    hdr,
    (texture) => {
      const pmremGenerator = new THREE.PMREMGenerator(obj.renderer);
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      obj.scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    }
  );
};
