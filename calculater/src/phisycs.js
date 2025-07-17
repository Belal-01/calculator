import * as THREE from 'three';

export class phiyscs {

// solve kepler function 
 solveKepler(M, e, epsilon = 1e-6) {
    let E = M; 
    let delta = 1;
    while (Math.abs(delta) > epsilon) {
        delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= delta;
    }
    return E;
}
// get the position of planet 
 computePosition(t, a, e, T) {

    let M = (2 * Math.PI / T) * t;

    M = M % (2 * Math.PI);

    let E = this.solveKepler(M, e);

    let sqrt = Math.sqrt((1 + e) / (1 - e));
    let theta = 2 * Math.atan( sqrt * Math.tan(E / 2) );

    if (theta < 0) theta += 2 * Math.PI;

    let r = a * (1 - e * Math.cos(E));

    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);

    return {x, y};
}


}