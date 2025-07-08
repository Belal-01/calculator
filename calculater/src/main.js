import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import starsTexture from '/img/stars.jpg';
import sunTexture from '/img/sun.jpg';
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
import { distance } from 'three/tsl';
import GUI from 'lil-gui'

/*###################################
########## global variables #######
###################################
*/
const gui= new GUI();
const GlobalGui = gui.addFolder('GlobalVariables');
const EarthGui =gui.addFolder('Earth');
const MercuryGui=gui.addFolder('Mercury');
const venusGui=gui.addFolder('venus');
const marsGui=gui.addFolder('mars');
const jupiterGui=gui.addFolder('jupiter');
const uranusGui=gui.addFolder('uranus');
const saturnGui=gui.addFolder('saturn');
const neptuneGui=gui.addFolder('neptune');

const global = {
    distance: 2,
    size : 1,
    time: 360
};
GlobalGui.add(global,"distance").min(1).max(10).step(0.5).onChange(updatePlanetPositions);
GlobalGui.add(global,"time");
/* ####################################
######### configurations ##############
 ######################################
*/
/// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
/// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,10000);
const orbit = new OrbitControls(camera, renderer.domElement);
/// camera 
camera.position.set(-90, 140, 140);
orbit.update();
// ambient light
const ambientLight = new THREE.AmbientLight(0x333333,2);
scene.add(ambientLight);
/*
#######################################################
############# background and texture loader ###########
#######################################################
*/
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,starsTexture,starsTexture,starsTexture,starsTexture,starsTexture
]);
/*############################################
############## planets and sun ###############
##############################################
*/
// sun 
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);



// todo add gui helper to update the light intensity
const pointLight = new THREE.PointLight(0xffd700, 4000, 300000);
scene.add(pointLight);
GlobalGui.add(pointLight,'intensity').min(0).max(30000);

const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2)
scene.add(pointLightHelper)
// update planet positions
function updatePlanetPositions() {
    [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto].forEach(planet => {
        planet.mesh.position.x = planet.mesh.userData.basePosition * global.distance;
        if (planet.ringMesh) {
            planet.ringMesh.position.x = planet.ringMesh.userData.basePosition * global.distance;        }
    });
}

// create planet function
function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    mesh.userData = {
        basePosition: position  
    };
    obj.add(mesh);

    let ringMesh = null;
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.userData = {
            basePosition: position
        };
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj, ringMesh};
}

// plants
//todo update distances to real values 
const mercury = createPlanete(2.4397 * global.size, mercuryTexture, 28 * global.distance);
const venus = createPlanete(6.0518 * global.size, venusTexture, 44* global.distance);
const earth = createPlanete(6.3710 * global.size, earthTexture, 62 * global.distance);
const mars = createPlanete(3.3895 * global.size, marsTexture, 78 * global.distance);
const jupiter = createPlanete(6.9911 * global.size, jupiterTexture, 100 * global.distance);
const saturn = createPlanete(5.8232 * global.size, saturnTexture, 138 * global.distance, {
    innerRadius: 5.8232 * global.size * 1.2,
    outerRadius: 5.8232 * global.size * 2,
    texture: saturnRingTexture
});
const uranus = createPlanete(2.5362 * global.size, uranusTexture, 176 * global.distance, {
    innerRadius: 2.5362 * global.size *1.2,
    outerRadius: 2.5362 * global.size * 2,
    texture: uranusRingTexture
});
const neptune = createPlanete(2.4622 * global.size, neptuneTexture, 200 * global.distance);
const pluto = createPlanete(2.8, plutoTexture, 216 * global.distance);




/// here your work abd alrazaq
function animate() {
    //Self-rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);
    
    
    //Around-sun-rotation
    mercury.obj.rotateY(0.004);
    venus.obj.rotateY(0.0015);
    earth.obj.rotateY(0.001);
    mars.obj.rotateY(0.0008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.shadowMap.enabled = true;

    // Configure planet materials to receive/cast shadows (add after creating planets)
    mercury.mesh.castShadow = true;
    venus.mesh.castShadow = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});




/// Look at functions 
GlobalGui.add({lookAtSun}, 'lookAtSun').name('Camera to Sun');
function lookAtSun() {
    orbit.target.set(0, 0, 0);
    camera.position.set(-90, 140, 140);
    camera.lookAt(orbit.target);
    orbit.update();
}
///
const tempVec = new THREE.Vector3();

function lookAtEarth() {
  
  earth.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
EarthGui.add({ lookAtEarth }, 'lookAtEarth').name('Camera to Earth');
//
function lookAtMercury() {
  
  mercury.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
MercuryGui.add({ lookAtMercury }, 'lookAtMercury').name('Camera to Mercury');
// VENUS
function lookAtVenus() {
  venus.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
venusGui.add({ lookAtVenus }, 'lookAtVenus').name('Camera to Venus');

// MARS
function lookAtMars() {
  mars.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
marsGui.add({ lookAtMars }, 'lookAtMars').name('Camera to Mars');

// JUPITER
function lookAtJupiter() {
  jupiter.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
jupiterGui.add({ lookAtJupiter }, 'lookAtJupiter').name('Camera to Jupiter');

// SATURN
function lookAtSaturn() {
  saturn.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
saturnGui.add({ lookAtSaturn }, 'lookAtSaturn').name('Camera to Saturn');

// URANUS
function lookAtUranus() {
  uranus.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
uranusGui.add({ lookAtUranus }, 'lookAtUranus').name('Camera to Uranus');

// NEPTUNE
function lookAtNeptune() {
  neptune.mesh.getWorldPosition(tempVec);
  orbit.target.copy(tempVec);
  camera.position.set(
    tempVec.x,
    tempVec.y + 100,
    tempVec.z + 140
  );
  camera.lookAt(tempVec);
  orbit.update();
}
neptuneGui.add({ lookAtNeptune }, 'lookAtNeptune').name('Camera to Neptune');
