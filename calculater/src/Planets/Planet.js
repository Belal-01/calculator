import { phiyscs } from '../phisycs.js';
export class Planet {
    static phisycsCalcuator = new phiyscs();
    constructor(name, mesh, obj, ringMesh, Au, e, T, rotationPeriod) {
        this.name = name;
        this.mesh = mesh;
        this.obj = obj;
        this.ringMesh = ringMesh;
        this.Au = Au;
        this.e = e;
        this.T = T;
        this.rotationPeriod = rotationPeriod;
    }
    updateCurrentPosition(deltaDays) {
        let newPlanetPosition = Planet.phisycsCalcuator.computePosition(global.days, this.Au, this.e, this.T);
        this.mesh.position.set(newPlanetPosition.x * 100 * global.distance * global.size, this.mesh.position.y, newPlanetPosition.y * 100 * global.distance * global.size);
        if (this.ringMesh) {
            this.ringMesh.position.set(newPlanetPosition.x * 100 * global.distance * global.size, this.ringMesh.position.y, newPlanetPosition.y * 100 * global.distance * global.size);
        }

        this.mesh.rotation.y += (deltaDays * 2 * Math.PI) / this.rotationPeriod;
    }

}