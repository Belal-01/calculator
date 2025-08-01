// src/LookAt.js
import * as THREE from 'three';

export class LookAt {
  constructor() {
  
    SunGui.add({ lookAtSun: () => this.lookAtSun() }, 'lookAtSun').name('Camera to Sun');
    EarthGui.add({ lookAtEarth: () => this.lookAtEarth() }, 'lookAtEarth').name('Camera to Earth');
    MercuryGui.add({ lookAtMercury: () => this.lookAtMercury() }, 'lookAtMercury').name('Camera to Mercury');
    venusGui.add({ lookAtVenus: () => this.lookAtVenus() }, 'lookAtVenus').name('Camera to Venus');
    marsGui.add({ lookAtMars: () => this.lookAtMars() }, 'lookAtMars').name('Camera to Mars');
    jupiterGui.add({ lookAtJupiter: () => this.lookAtJupiter() }, 'lookAtJupiter').name('Camera to Jupiter');
    saturnGui.add({ lookAtSaturn: () => this.lookAtSaturn() }, 'lookAtSaturn').name('Camera to Saturn');
    uranusGui.add({ lookAtUranus: () => this.lookAtUranus() }, 'lookAtUranus').name('Camera to Uranus');
    neptuneGui.add({ lookAtNeptune: () => this.lookAtNeptune() }, 'lookAtNeptune').name('Camera to Neptune');
    GlobalGui.add({CancelLooking: () => this.CancelLooking() },'CancelLooking' ).name('Cancel Looking');
    this.currentTargetPlanet = null;
    this._followOffset = new THREE.Vector3();
  }

  lookAtSun() {
    //todo
    this.currentTargetPlanet = null;
    //rotatingToSun = false;
    orbit.target.set(0, 0, 0);
    camera.position.set(-200, 160, 140);
    camera.lookAt(orbit.target);

    orbit.update();
  }

  #lookAtPlanet(planet, offsetX = 0, offsetY = 150, offsetZ = 200) {

    this.currentTargetPlanet = planet;
    // store offset for continuous follow
    this._followOffset.set(offsetX, offsetY, offsetZ);

    // immediately jump camera into place too:
    this._applyFollow();
  
  }

  lookAtEarth() {
    this.#lookAtPlanet(earth, 0, 150, 200);
  }


  lookAtMercury() {
    this.#lookAtPlanet(mercury, 0, 100, 140);
  }


  lookAtVenus() {
    this.#lookAtPlanet(venus, 0, 200, 200);
  }


  lookAtMars() {
    this.#lookAtPlanet(mars, 0, 100, 140);
  }

  lookAtJupiter() {
    this.#lookAtPlanet(jupiter, 100, 200, 300);
  }

  lookAtSaturn() {
    this.#lookAtPlanet(saturn, 0, 200, 200);
  }

  lookAtUranus() {
    this.#lookAtPlanet(uranus, 0, 100, 140);
  }

  lookAtNeptune() {
    this.#lookAtPlanet(neptune, 0, 100, 140);
  }
  showLookingPlanetInfo(){
  if (this.currentTargetPlanet !=null) {

    let dx = this.currentTargetPlanet.mesh.position.x;
    let dz = this.currentTargetPlanet.mesh.position.z;
    let distance = Math.sqrt(dx*dx + dz*dz);
    let dayLength = this.currentTargetPlanet.rotationPeriod;

    document.getElementById("hud").innerHTML = `
        Planet: ${this.currentTargetPlanet.name}<br>
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
  _applyFollow() {
    const planet = this.currentTargetPlanet;
    if (!planet) return;

    // get up-to-date world position
    const worldPos = new THREE.Vector3();
    planet.mesh.getWorldPosition(worldPos);

    // set the controls’ target to the planet
    orbit.target.copy(worldPos);

    // position camera at planet + offset
    camera.position.set(
        worldPos.x + this._followOffset.x,
        worldPos.y + this._followOffset.y,
        worldPos.z + this._followOffset.z
    );

    // re-compute the orbit-controls matrices
    orbit.update();
  }

  // call this every frame in your render loop:
  updateFollow() {
    if (this.currentTargetPlanet) {
      this._applyFollow();
    }
    // and always refresh the HUD info:
    this.showLookingPlanetInfo();
  }
  CancelLooking(){
    this.currentTargetPlanet=null;
  }
}
