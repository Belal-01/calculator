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
import GUI from 'lil-gui'
const warningAudio = new Audio('/sounds/alert.mp3');
warningAudio.loop = true; 

/*############################################################
########## global variables and initilaize Gui folders #######
##############################################################
*/
const gui= new GUI();
const GlobalGui = gui.addFolder('Global');
const SunGui = gui.addFolder('Sun');
const MercuryGui=gui.addFolder('Mercury');
const venusGui=gui.addFolder('venus');
const EarthGui =gui.addFolder('Earth');
const marsGui=gui.addFolder('mars');
const jupiterGui=gui.addFolder('jupiter');
const saturnGui=gui.addFolder('saturn');
const uranusGui=gui.addFolder('uranus');
const neptuneGui=gui.addFolder('neptune');
EarthGui.close();
SunGui.close();
MercuryGui.close();
venusGui.close();
marsGui.close();
jupiterGui.close();
uranusGui.close();
saturnGui.close();
neptuneGui.close();
const global = {
    distance: 2,
    size : 1,
    days: 0,
    timespeed : 1 // days increase per second 
};
GlobalGui.add(global,"distance").min(1).max(10).step(0.5);
GlobalGui.add(global,"days");


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
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,20000);
const orbit = new OrbitControls(camera, renderer.domElement);
/// camera 
camera.position.set(-90, 140, 140);
orbit.update();
// ambient light
const ambientLight = new THREE.AmbientLight(0x333333,3);
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
/*
############################################
################### Sun #####################
##############################################
*/
const sunGeo = new THREE.SphereGeometry(20, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
const pointLight = new THREE.PointLight(0xffd700, 7000, 300000);
scene.add(pointLight);

SunGui.add(pointLight,'intensity').min(0).max(100000);
const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2);
scene.add(pointLightHelper);

/*
############################################
################ Planets ####################
##############################################
*/

function createPlanete(size, texture, position,Au,e,T,rotationPeriod,ring ) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    mesh.userData = {
        basePosition: position   / global.distance
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
    return {mesh, obj, ringMesh,Au,e,T,rotationPeriod};
}

// plants
const mercury = createPlanete(2.4397 * global.size, mercuryTexture, 18.18 * global.distance ,0.3871,0.2056,87.97,58 );
const venus = createPlanete(6.0518 * global.size, venusTexture, 33.96 * global.distance,0.7233,0.0068,224.70,243 );
const earth = createPlanete(6.3710 * global.size, earthTexture, 47 * global.distance,1,0.0167,365.25,1);
const mars = createPlanete(3.3895 * global.size, marsTexture, 71 * global.distance,1.5237,0.0934,686.98,1);
const jupiter = createPlanete(6.9911 * global.size, jupiterTexture, 100.2 * global.distance,5.2028,0.0484,4332.59,0.72);
const saturn = createPlanete(5.8232 * global.size, saturnTexture, 131  * global.distance ,9.5388,0.0541,10759,0.67,{
    innerRadius: 5.8232 * global.size * 1.2,
    outerRadius: 5.8232 * global.size * 2,
    texture: saturnRingTexture
});
const uranus = createPlanete(2.5362 * global.size, uranusTexture, 160 *  global.distance , 19.1914,0.0472,30685.4,0.44,{
    innerRadius: 2.5362 * global.size *1.2,
    outerRadius: 2.5362 * global.size * 2,
    texture: uranusRingTexture
});
const neptune = createPlanete(2.4622 * global.size, neptuneTexture, 200 * global.distance,30.0611,0.0086,60189,0.41);

/* ##########################################
   ############### Phiysc ###################
   ##########################################
*/

// solve kepler function 
function solveKepler(M, e, epsilon = 1e-6) {
    let E = M; 
    let delta = 1;
    while (Math.abs(delta) > epsilon) {
        delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= delta;
    }
    return E;
}
// get the position of planet 
function computePosition(t, a, e, T) {

    let M = (2 * Math.PI / T) * t;

    M = M % (2 * Math.PI);

    let E = solveKepler(M, e);

    let sqrt = Math.sqrt((1 + e) / (1 - e));
    let theta = 2 * Math.atan( sqrt * Math.tan(E / 2) );

    if (theta < 0) theta += 2 * Math.PI;

    let r = a * (1 - e * Math.cos(E));

    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);

    return {x, y};
}
// update planets position
function updateCurrentPosition(planet,deltaDays){
  let newPlanetPosition=computePosition(global.days,planet.Au,planet.e,planet.T);
    planet.mesh.position.set(newPlanetPosition.x*100* global.distance,planet.mesh.position.y,newPlanetPosition.y*100* global.distance);
    if (planet.ringMesh) {
        planet.ringMesh.position.set(newPlanetPosition.x*100* global.distance, planet.ringMesh.position.y, newPlanetPosition.y*100* global.distance);
    }
   
    planet.mesh.rotation.y += (deltaDays * 2 * Math.PI) / planet.rotationPeriod;
}



let lastTime = performance.now() / 1000; 


GlobalGui.add(global,"timespeed").name("days speed per second").min(0).max(10).step(0.001);
let currentTargetPlanet = null;
function showLookingPlanetInfo(){
  if (currentTargetPlanet) {

    let dx = currentTargetPlanet.mesh.position.x;
    let dz = currentTargetPlanet.mesh.position.z;
    let distance = Math.sqrt(dx*dx + dz*dz);
    let dayLength = currentTargetPlanet.rotationPeriod;

    document.getElementById("hud").innerHTML = `
        Planet: ${getPlanetName(currentTargetPlanet)}<br>
        Distance from Sun: ${distance.toFixed(2)}<br>
        Day Length: ${dayLength} days
    `;
} else {
    document.getElementById("hud").innerHTML = `
        Planet: None<br>
        Distance from Sun: -<br>
        Day Length: -
    `;
}

}


const earthOrbitCurve = new THREE.EllipseCurve(
    0, 0, 
    100, 100, 
    0, 2 * Math.PI,
    false, 0
);
let warningTime = 10; 
let warningTimerActive = false;

function animate() {
     const currentTime = performance.now() / 1000; 
    const deltaSeconds = currentTime - lastTime;
    lastTime = currentTime;

    const deltaDays = deltaSeconds * global.timespeed;
     
  document.getElementById("timeDisplay").innerText = `Days: ${global.days.toFixed(2)}`;

   
    global.days+=deltaDays * global.timespeed; // increasing of days per second 
    sun.rotateY(0.004 * global.timespeed);
   
  updateCurrentPosition(mercury,deltaDays);
    updateCurrentPosition(venus,deltaDays);
   updateCurrentPosition(earth,deltaDays);
    updateCurrentPosition(mars,deltaDays);
   updateCurrentPosition(jupiter,deltaDays);
   updateCurrentPosition(saturn,deltaDays);
   updateCurrentPosition(uranus,deltaDays);
   updateCurrentPosition(neptune,deltaDays);

  
  
starField.rotation.y += 0.00004; 
starField.rotation.x += 0.00004;
showLookingPlanetInfo();

const cameraDistanceFromSun = camera.position.length(); 

if (cameraDistanceFromSun < 100) {
    if (!warningTimerActive) {
        warningTimerActive = true;
        warningAudio.play();
    } else {
        warningTime -= deltaSeconds;
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").innerText = 
          `⚠️ Warning: Too close to the Sun! Move away in ${warningTime.toFixed(1)} s`;
    }

    if (warningTime <= 0) {
        alert("🔥 You stayed too close to the Sun for too long. you died");
window.close(); 
        warningAudio.pause();
    }
} else {
    warningTime = 10;
    warningTimerActive = false;
            warningAudio.pause();
    document.getElementById("warning").style.display = "none";
}

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


/* ############################################
 * ############## planets phiyscs #############
 * ############################################
 */
// earth
EarthGui.add(earth,"Au").name('a(Au)').min(0).max(40).step(0.01);
EarthGui.add(earth,"T").min(1).max(5000).step(1);
EarthGui.add(earth,"e").min(0).max(1).step(0.001);
//mercury
MercuryGui.add(mercury,"Au").name('a(Au)').min(0).max(40).step(0.01);
MercuryGui.add(mercury,"T").min(1).max(5000).step(1);
MercuryGui.add(mercury,"e").min(0).max(1).step(0.001);
//venus
venusGui.add(venus,"Au").name('a(Au)').min(0).max(40).step(0.01);
venusGui.add(venus,"T").min(1).max(5000).step(1);
venusGui.add(venus,"e").min(0).max(1).step(0.001);
//mars
marsGui.add(mars,"Au").name('a(Au)').min(0).max(40).step(0.01);
marsGui.add(mars,"T").min(1).max(5000).step(1);
marsGui.add(mars,"e").min(0).max(1).step(0.001);
//jupiter
jupiterGui.add(jupiter,"Au").name('a(Au)').min(0).max(40).step(0.01);
jupiterGui.add(jupiter,"T").min(1).max(5000).step(1);
jupiterGui.add(jupiter,"e").min(0).max(1).step(0.001);
//uranus
uranusGui.add(uranus,"Au").name('a(Au)').min(0).max(40).step(0.01);
uranusGui.add(uranus,"T").min(1).max(5000).step(1);
uranusGui.add(uranus,"e").min(0).max(1).step(0.001);
//saturn
saturnGui.add(saturn,"Au").name('a(Au)').min(0).max(40).step(0.01);
saturnGui.add(saturn,"T").min(1).max(5000).step(1);
saturnGui.add(saturn,"e").min(0).max(1).step(0.001);
//saturn
neptuneGui.add(neptune,"Au").name('a(Au)').min(0).max(40).step(0.01);
neptuneGui.add(neptune,"T").min(1).max(5000).step(1);
neptuneGui.add(neptune,"e").min(0).max(1).step(0.001);


/**############################################
 * ############## Look at functions ###########
 * ############################################
 */

SunGui.add({lookAtSun}, 'lookAtSun').name('Camera to Sun');
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
   currentTargetPlanet = earth;
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
     currentTargetPlanet = mercury;

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
     currentTargetPlanet = venus;

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
     currentTargetPlanet = mars;

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
     currentTargetPlanet = jupiter;

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
     currentTargetPlanet = saturn;

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
     currentTargetPlanet = uranus;

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
     currentTargetPlanet = neptune;

}
neptuneGui.add({ lookAtNeptune }, 'lookAtNeptune').name('Camera to Neptune');
/*###################################
  ############ Additions ############
  ###################################
  */
let pretimespeed = 1;
let playstatus = true;
GlobalGui.add({ pause: ()=> 
  {
    if(playstatus){
      pretimespeed=global.timespeed; global.timespeed = 0 ;
      playstatus= false;
    }
    }
 }, "pause");
GlobalGui.add({ play: ()=> {
  if(!playstatus){
global.timespeed = pretimespeed
playstatus=true;
  }
  

} }, "play");
///
GlobalGui.add({ 
  reset: () => {
    global.days = 0;
    lastTime = performance.now() / 1000;
    [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(planet => {
      planet.mesh.rotation.y = 0;
    });
  }
}, "reset");
///
const starsTex = textureLoader.load(starsTexture);
starsTex.wrapS = THREE.RepeatWrapping;
starsTex.wrapT = THREE.RepeatWrapping;
starsTex.repeat.set(5, 5); 

const starsGeo = new THREE.SphereGeometry(10000, 64, 64);
const starsMat = new THREE.MeshBasicMaterial({
    map: starsTex,
    side: THREE.BackSide
});
const starField = new THREE.Mesh(starsGeo, starsMat);
scene.add(starField);

function getPlanetName(planet) {
    if (planet === mercury) return "Mercury";
    if (planet === venus) return "Venus";
    if (planet === earth) return "Earth";
    if (planet === mars) return "Mars";
    if (planet === jupiter) return "Jupiter";
    if (planet === saturn) return "Saturn";
    if (planet === uranus) return "Uranus";
    if (planet === neptune) return "Neptune";
    return "Unknown";
}