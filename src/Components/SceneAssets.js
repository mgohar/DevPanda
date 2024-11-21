import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import * as dat from "dat.gui";

let scene, tControl, orbitControls, camera, renderer;
// const gui = new dat.GUI();
// let parameter = { type: "" };
// let transformControls = gui.add(parameter, "type", ["P", "R", "S", ""]).name("T Controls");
let textureLoader = new THREE.TextureLoader;


export const Camera = (x, y, z) => {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );
  camera.position.set(x, y, z);
  return camera;
};

export const Scene = (x, y, z) => {
  scene = new THREE.Scene();
  const texture = textureLoader.load( "img.png" );

  // scene.background = texture;
  return scene;
};

export const OrbitControl = (camera, canvas) => {
  orbitControls = new OrbitControls(camera, canvas);
  orbitControls.enableDamping = true;
  return orbitControls;
};

export const Resize = (camera, renderer) => {
  window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
};

export const PointLight = (helper = false, ...props) => {
  var PointLight = new THREE.PointLight(props);
  if (helper) {
    var PointLightHelper = new THREE.PointLightHelper(PointLight);
    scene.add(PointLight, PointLightHelper);
    return { PointLight, PointLightHelper };
  } else {
    scene.add(PointLight);
    return PointLight;
  }
};

export const DirectionalLight = (helper = false, ...props) => {
  var DirectionalLight = new THREE.DirectionalLight(props);
  if (helper) {
    var DirectionalLightHelper = new THREE.DirectionalLightHelper(
      DirectionalLight
    );
    scene.add(DirectionalLightHelper, DirectionalLight);
    return { DirectionalLight, DirectionalLightHelper };
  } else {
    scene.add(DirectionalLight);
    return DirectionalLight;
  }
};

export const AmbientLight = (...props) => {
  var AmbientLight = new THREE.AmbientLight(props);
  scene.add(AmbientLight);
  return AmbientLight;
};

export const Renderer = (canvas) => {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: "high-performance",
    alpha: false,
    antialias: true,
    stencil: false,
    depth: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
};

export const AxesHelper = (length=1) => {
  const axesHelper = new THREE.AxesHelper(length);
  scene.add(axesHelper);
  return axesHelper;
}

export const GridHelper = (length=1) => {
  const gridHelper = new THREE.GridHelper(length);
  scene.add(gridHelper);
  return gridHelper;
}

export const TControl = (name, type = "P", group = true) => {
  tControl = new TransformControls(camera, renderer.domElement);
  tControl.addEventListener("dragging-changed", (event) => {
    orbitControls.enabled = !event.value;
  });
  tControl.attach(name);
  scene.add(tControl);

  tControl.addEventListener("change", () => {
    // The object's position has changed
    const newPosition = name.position;
    const newRotate = name.rotation;
    const newScale = name.scale;
    type == "R"
      ? (console.log("New Rotation:", {
          x: parseFloat(newRotate.x.toFixed(2)),
          y: parseFloat(newRotate.y.toFixed(2)),
          z: parseFloat(newRotate.z.toFixed(2)),
        }),
        tControl.setMode("rotate"))
      : type == "S"
      ? (console.log("New Scale:", {
          x: parseFloat(newScale.x.toFixed(2)),
          y: parseFloat(newScale.y.toFixed(2)),
          z: parseFloat(newScale.z.toFixed(2)),
        }),
        tControl.setMode("scale"))
      : (console.log("New Position:", {
          x: parseFloat(newPosition.x.toFixed(2)),
          y: parseFloat(newPosition.y.toFixed(2)),
          z: parseFloat(newPosition.z.toFixed(2)),
        }),
        tControl.setMode("translate"));
  });
};

export const useTControl = (model) => {
  transformControls.onChange((e) => {
    if (e != "") {
      TControlRemove();
      TControl(model, e);
    } else {
      TControlRemove();
    }
  });
};

export const TControlRemove = () => {
  if (tControl) {
    scene.remove(tControl);
    tControl.dispose();
  }
};
