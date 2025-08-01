import * as THREE from 'three';
import { LilGui } from './Gui.js';
import { Configurations } from './configurations.js';
import { Sun } from './Planets/Sun.js';
import { SolarSystemPlanets } from './Planets/SolarSystemPlanets.js';
import { LookAt } from './LookAt.js'
//configurations
const config = new Configurations();
config.setConfigruations();
// gui configurations
const GUI = new LilGui();
GUI.setGuiConfiguration();
GUI.addGlobalButtons();
// sun
const sunObj = new Sun();
sunObj.CreateSun();
// planets
const solarSyatem = new SolarSystemPlanets();
// look at 
const lookAT = new LookAt();

function animate() {
  // update time 
  const currentTime = performance.now() / 1000;
  const deltaSeconds = currentTime - GUI.lastTime;
  GUI.lastTime = currentTime;
  const deltaDays = deltaSeconds * global.timespeed;
  // show and increase  days on screen 
  document.getElementById("timeDisplay").innerText = `Days: ${global.days.toFixed(2)}`;
  global.days += deltaDays * global.timespeed; // increasing of days per second
  /// palnets and sun movemnet 
  sun.rotateY(0.004 * global.timespeed);
  mercury.updateCurrentPosition(deltaDays);
  venus.updateCurrentPosition(deltaDays);
  earth.updateCurrentPosition(deltaDays);
  mars.updateCurrentPosition(deltaDays);
  jupiter.updateCurrentPosition(deltaDays);
  saturn.updateCurrentPosition(deltaDays);
  uranus.updateCurrentPosition(deltaDays);
  neptune.updateCurrentPosition(deltaDays);
///
  lookAT.updateFollow();
  // move the background 
  config.updateStarFiledMovement();
  // update look at variables 
  lookAT.showLookingPlanetInfo();
  // handle user close to sun 
  sunObj.handleCloseToSun(deltaSeconds);
  // show distance to sun 
  sunObj.updateDistanceToSun();
  // rotate to sun 
  let rot=sunObj.handleRotationToSun();
  if(rot){
    lookAT.currentTargetPlanet=null;
  }
  // shadows
  renderer.shadowMap.enabled = true;
  mercury.mesh.castShadow = true;
  venus.mesh.castShadow = true;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});





