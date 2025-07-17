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
    this.currentTargetPlanet = null;

  }

  lookAtSun() {
    //todo
    //rotatingToSun = false;
    orbit.target.set(0, 0, 0);
    camera.position.set(-200, 160, 140);
    camera.lookAt(orbit.target);
    this.currentTargetPlanet = null;
    orbit.update();
  }

  lookAtPlanet(planet, offsetX = 0, offsetY = 150, offsetZ = 200) {
   //  todo
   //  rotatingToSun= false;
      this.tempVec=new THREE.Vector3();
     planet.mesh.getWorldPosition(this.tempVec);
    orbit.target.copy(this.tempVec);
     camera.position.set(
      this.tempVec.x + offsetX,
      this.tempVec.y + offsetY,
      this.tempVec.z + offsetZ
    );
    camera.lookAt(this.tempVec);
    orbit.update();
    this.currentTargetPlanet = planet;
  
  }

  lookAtEarth() {
    this.lookAtPlanet(earth, 0, 150, 200);
  }


  lookAtMercury() {
    this.lookAtPlanet(mercury, 0, 100, 140);
  }


  lookAtVenus() {
    this.lookAtPlanet(venus, 0, 200, 200);
  }


  lookAtMars() {
    this.lookAtPlanet(mars, 0, 100, 140);
  }

  lookAtJupiter() {
    this.lookAtPlanet(jupiter, 100, 200, 300);
  }

  lookAtSaturn() {
    this.lookAtPlanet(saturn, 0, 200, 200);
  }

  lookAtUranus() {
    this.lookAtPlanet(uranus, 0, 100, 140);
  }

  lookAtNeptune() {
    this.lookAtPlanet(neptune, 0, 100, 140);
  }
  showLookingPlanetInfo(){
  if (this.currentTargetPlanet ) {

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
}
