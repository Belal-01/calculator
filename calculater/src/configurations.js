// src/Configurations.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import starsTexture from '/img/stars.jpg';

export class Configurations {
  setConfigruations() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled    = true;
    this.renderer.shadowMap.type       = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
    // Scene
    this.scene = new THREE.Scene();
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      20000
    );
    this.camera.position.set(-90, 140, 340);
    // Orbit Controls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333, 4);
    this.scene.add(ambientLight);
    // texture loader 
    window.textureLoader = new THREE.TextureLoader();
    // background (starField)
    const starsTex = textureLoader.load(starsTexture);
    starsTex.wrapS = THREE.RepeatWrapping; starsTex.wrapT = THREE.RepeatWrapping; starsTex.repeat.set(4, 4);
    const starsGeo = new THREE.SphereGeometry(10000, 64, 64);
    const starsMat = new THREE.MeshBasicMaterial({
      map: starsTex,
      side: THREE.BackSide
    });
    this.starField = new THREE.Mesh(starsGeo, starsMat);
    this.scene.add(this.starField);
    //add to global variables
    window.renderer = this.renderer;
    window.scene = this.scene;
    window.camera = this.camera;
    window.orbit = this.orbit;

  }
  updateStarFiledMovement() {
    this.starField.rotation.y += 0.00004;
    this.starField.rotation.x += 0.00004;
  }
}
