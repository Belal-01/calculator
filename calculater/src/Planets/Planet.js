import { phiyscs } from '../phisycs.js';
export class Planet {
    static phisycsCalcuator = new phiyscs();
    constructor(name, mesh, obj, ringMesh, Au, e, T, rotationPeriod,mass) {
        this.name = name;
        this.mesh = mesh;
        this.obj = obj;
        this.ringMesh = ringMesh;
        this.Au = Au;
        this.e = e;
        this.T = T;
        this.mass = mass;
        this.rotationPeriod = rotationPeriod;
        this.T = Planet.phisycsCalcuator.computeOrbitalPeriod(this.Au, this.mass);
    }
   
    updateCurrentPosition(deltaDays) {
        //console.log(this.name + " "+this.T);
        this.T = Planet.phisycsCalcuator.computeOrbitalPeriod(this.Au, this.mass);

        let newPlanetPosition = Planet.phisycsCalcuator.computePosition(global.days, this.Au, this.e, this.T);
        
        this.mesh.position.set(newPlanetPosition.x * 100 * global.distance * global.size, this.mesh.position.y, newPlanetPosition.y * 100 * global.distance * global.size);
        if (this.ringMesh) {
            this.ringMesh.position.set(newPlanetPosition.x * 100 * global.distance * global.size, this.ringMesh.position.y, newPlanetPosition.y * 100 * global.distance * global.size);
        }

        this.mesh.rotation.y += (deltaDays * 2 * Math.PI) / this.rotationPeriod;
    }

}