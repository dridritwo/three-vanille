import * as THREE from "https://cdn.skypack.dev/three";
import { OBJLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js";
import { GUI } from "https://cdn.skypack.dev/three/examples/jsm/libs/dat.gui.module.js";

let container;

let camera, scene, renderer;

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let object;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.x = 141;
  camera.position.y = -80; // verticalité
  camera.position.z = -151;
  camera.rotation.x = 0; // verticalité
  camera.rotation.y = -1; // 
  camera.rotation.z = 0; // 

  // scene

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  // manager

  function loadModel() {
    object.traverse(function (child) {
      if (child.isMesh) child.material.map = texture;
    });

    object.position.y = -95;
    scene.add(object);
  }

  const manager = new THREE.LoadingManager(loadModel);

  manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
  };

  // texture

  const textureLoader = new THREE.TextureLoader(manager);
  const texture = textureLoader.load(
    "model/textures/Wood_Lumber_ButtJoined.jpg"
  );

  // model

  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }

  function onError() {}

  const loader = new OBJLoader(manager);
  loader.load(
    "model/source/PASCAL&CO.obj",
    function (obj) {
      object = obj;
    },
    onProgress,
    onError
  );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onDocumentMouseMove);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

//

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // camera.lookAt( scene.position );
  renderer.render(scene, camera);
}

const panel = new GUI({ width: 310 });
const folder1 = panel.addFolder("cam position");
const folder2 = panel.addFolder("cam rotation");
folder1.add(camera.position, "x", -1000, 1000).onChange(updateCamera);
folder1.add(camera.position, "y", -1000, 1000).onChange(updateCamera);
folder1.add(camera.position, "z", -1000, 1000).onChange(updateCamera);
folder2.add(camera.rotation, "x", -3.6, 3.6).onChange(updateCamera);
folder2.add(camera.rotation, "y", -3.6, 3.6).onChange(updateCamera);
folder2.add(camera.rotation, "z", -3.6, 3.6).onChange(updateCamera);


class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min; // this will call the min setter
  }
}

function updateCamera() {
  camera.updateProjectionMatrix();
}

const gui = new GUI();
gui.add(camera, "fov", 1, 180).onChange(updateCamera);


const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
gui
  .add(minMaxGUIHelper, "min", 0.1, 4000, 0.1)
  .name("near")
  .onChange(updateCamera);
gui
  .add(minMaxGUIHelper, "max", 0.1, 4000, 0.1)
  .name("far")
  .onChange(updateCamera);



  function moveCamera(percent) {
    
    //camera.position.z += t ;

    // start
    // camera.position.x = 141;
    // camera.position.y = -80; // verticalité
    // camera.position.z = -151;
    // camera.rotation.x = 0; // verticalité
    // camera.rotation.y = -1; // 
    // camera.rotation.z = 0; // 
    
    // finish
    // camera.position.z = -203;
    // camera.rotation.y = -1.8; // 
    
    
    // camera.position.z = -151;
    // camera.rotation.y = -1; // 

    camera.position.z = -151 - ((203 - 151) * percent /100);
    camera.rotation.y = -1 - ((1.8 - 1) * percent / 100);

  }

  function scrollMovement() {
    const scrollPosition = document.body.getBoundingClientRect().top * -1;
    console.log(scrollPosition)
    let start = 200;
    let finish = 1200;
    if (scrollPosition> start && scrollPosition< finish) {
        let range = finish - start;
        let position = scrollPosition - start;
        let percent = position / range * 100;
        console.log("percent", percent);
        moveCamera(percent);
    }
  }
  
  document.body.onscroll = scrollMovement;

  