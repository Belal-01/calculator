import * as THREE from 'three';
//import Images
import starTexture from "/img/stars.jpg"
import sunTexture from "/img/sun.jpg"
import mercuryTexture from '/img/mercury.jpg';
import venusTexture from '/img/venus.jpg';
import earthTexture from '/img/earth.jpg';
import marsTexture from '/img/mars.jpg';
import jupiterTexture from '/img/jupiter.jpg';
import saturnTexture from '/img/saturn.jpg';
import saturnRingTexture from '/img/saturn ring.png';
import uranusTexture from '/img/uranus.jpg';
import uranusRingTexture from '/img/uranus ring.png';
import neptuneTexture from '/img/neptune.jpg';
import plutoTexture from '/img/pluto.jpg';
import { OrbitControls } from 'three/examples/jsm/Addons.js';



// define the renderer 
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// define the scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera , renderer.domElement)
camera.position.set(-90, 140, 140);
orbit.update();

// add light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// set background to the scene 
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
starTexture,
starTexture,
starTexture,
starTexture,
starTexture,
starTexture,
]);


// define the shape and add it to the scene
const textureLoader = new THREE.TextureLoader()
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});

const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);


const mercuryGeo = new THREE.SphereGeometry(3.2, 30, 30);
const mercuryMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(mercuryTexture)
});

const mercury = new THREE.Mesh(mercuryGeo,mercuryMat);
const mercuryObj = new THREE.Object3D()
mercuryObj.add(mercury)
scene.add(mercuryObj);
mercury.position.x = 28;

const pointLight = new THREE.PointLight(0xFFFFFF,2, 300);
pointLight.position.set( 0, 0, 0 );
scene.add(pointLight);




// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


// camera.position.z = 5;


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// add animation to the shape 
function animate() {
    requestAnimationFrame(animate);
    sun.rotateY(0.004);
    mercury.rotateY(0.004);
    mercuryObj.rotateY(0.04);

    
    // Rotate cube
    // sun.rotation.x += 0.01;
    // sun.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}
animate();
