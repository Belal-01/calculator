import * as THREE from 'three';
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
import { Planet } from './Planet';

export class SolarSystemPlanets {


    constructor() {
        this.mercury = this.#createPlanete('mercury', 2.4397 * global.size, mercuryTexture, 18.18 * global.distance, 0.3871, 0.2056, 87.97, 58);
        this.venus = this.#createPlanete('venus', 6.0518 * global.size, venusTexture, 33.96 * global.distance, 0.7233, 0.0068, 224.70, 243);
        this.earth = this.#createPlanete('earth', 6.3710 * global.size, earthTexture, 47 * global.distance, 1, 0.0167, 365.25, 1);
        this.mars = this.#createPlanete('mars', 3.3895 * global.size, marsTexture, 71 * global.distance, 1.5237, 0.0934, 686.98, 1);
        this.jupiter = this.#createPlanete('jupiter', 6.9911 * global.size, jupiterTexture, 100.2 * global.distance, 5.2028, 0.0484, 4332.59, 0.72);
        
        this.saturn = this.#createPlanete("saturn", 5.8232 * global.size, saturnTexture, 131 * global.distance, 9.5388, 0.0541, 10759, 0.67, {
            innerRadius: 5.8232 * global.size * 1.2,
            outerRadius: 5.8232 * global.size * 2,
            texture: saturnRingTexture
        });
        
        this.uranus = this.#createPlanete("uranus", 2.5362 * global.size, uranusTexture, 160 * global.distance, 19.1914, 0.0472, 30685.4, 0.44, {
            innerRadius: 2.5362 * global.size * 1.2,
            outerRadius: 2.5362 * global.size * 2,
            texture: uranusRingTexture
        });

        this.neptune = this.#createPlanete('neptune', 2.4622 * global.size, neptuneTexture, 200 * global.distance, 30.0611, 0.0086, 60189, 0.41);
        /// add to global variables 
        window.mercury = this.mercury;
        window.venus = this.venus;
        window.earth = this.earth;
        window.mars = this.mars;
        window.jupiter = this.jupiter;
        window.saturn = this.saturn;
        window.uranus = this.uranus;
        window.neptune = this.neptune;
        // add gui variables to each planet 
        this.#addPalnetPhiysicsVariable(EarthGui, earth);
        this.#addPalnetPhiysicsVariable(MercuryGui, mercury);
        this.#addPalnetPhiysicsVariable(venusGui, venus);
        this.#addPalnetPhiysicsVariable(marsGui, mars);
        this.#addPalnetPhiysicsVariable(jupiterGui, jupiter);
        this.#addPalnetPhiysicsVariable(uranusGui, uranus);
        this.#addPalnetPhiysicsVariable(saturnGui, saturn);
        this.#addPalnetPhiysicsVariable(neptuneGui, neptune);
        }

    #createPlanete(name, size, texture, position, Au, e, T, rotationPeriod, ring) {

        const geo = new THREE.SphereGeometry(size * global.size, 35, 35);
        const mat = new THREE.MeshStandardMaterial({map: textureLoader.load(texture)});
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const obj = new THREE.Object3D();
        mesh.userData = {
            basePosition: position / global.distance
        };

        obj.add(mesh);

        let ringMesh = null;
        if (ring) {
            const ringGeo = new THREE.RingGeometry(
                ring.innerRadius * global.size,
                ring.outerRadius * global.size,
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

        return new Planet(name, mesh, obj, ringMesh, Au, e, T, rotationPeriod);


    }
    #addPalnetPhiysicsVariable(PlanetGui, planet) {
        if(mode=="mass"){
   PlanetGui.add(planet, "T").name("Period (days)").listen();
PlanetGui.add(planet, "Au").name("a (AU)").listen();
        }
     else{
        PlanetGui.add(planet, "Au").name('a(Au)').min(0).max(20).step(0.0001);
         PlanetGui.add(planet, "T").min(1).max(5000).step(1);
     }

        PlanetGui.add(planet, "e").min(0).max(1).step(0.001);
    }


}