import * as THREE from 'three';
import sunTexture from '/img/sun.jpg';
export class Sun {
    constructor() {
        this.warningTime = 10;
        this.warningTimerActive = false;
        this.warningAudio = new Audio('/sounds/alert.mp3');
        this.warningAudio.loop = true;
        this.rotatingToSun = false;

        GlobalGui.add( this , 'stareAtSun').name('Look to Sun');
    }
    stareAtSun() {
        this.rotatingToSun = true;
    }
    handleRotationToSun() {
        if (this.rotatingToSun) {
            const target = new THREE.Vector3(0, 0, 0);
            const currentPos = camera.position.clone();
            const direction = target.clone().sub(currentPos).normalize();

            const currentLookAt = orbit.target.clone();

            if (!(currentLookAt.x >= -10 * global.size && currentLookAt.x <= 10 * global.size && currentLookAt.y >= -10 * global.size && currentLookAt.y <= 10 * global.size && currentLookAt.z >= -10 * global.size && currentLookAt.z <= 10 * global.size)) {
                const newLookAt = currentLookAt.lerp(currentPos.clone().add(direction), 0.05);
                orbit.target.copy(newLookAt);
                orbit.update();
                if (newLookAt.distanceTo(currentPos.clone().add(direction)) < 0.1) {
                    this.rotatingToSun = false;
                    orbit.target.set(0, 0, 0);
                    orbit.update();
                }
            }
            else {
                this.rotatingToSun = false;
            }
        return true;
        }
        else return  false;
    }
    CreateSun() {
        const sunGeo = new THREE.SphereGeometry(20 * global.size, 35, 35);
        const sunMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(sunTexture)
        });
        this.sun = new THREE.Mesh(sunGeo, sunMat);
        this.sun.castShadow = false;
        this.sun.receiveShadow = false;
        this.sun.mass=1;
        scene.add(this.sun);
        const pointLight = new THREE.PointLight(0xffd700, 1000000, 3000000);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width  = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.shadow.camera.near    = 0.5;
        pointLight.shadow.camera.far     = 3000;
        scene.add(pointLight);

        SunGui.add(pointLight, 'intensity').min(0).max(9000000);
        SunGui.add(this.sun, "mass")
            .min(0)
            .max(500)
            .step(0.1)
            .name("Sun Mass");
            
        window.sun = this.sun;
        return this.sun;

    }
    handleCloseToSun(deltaSeconds) {
        const cameraDistanceFromSun = camera.position.length();

        if (cameraDistanceFromSun < 80 * global.size) {
            if (!this.warningTimerActive) {
                this.warningTimerActive = true;
                this.warningAudio.play();
            } else {
                if (cameraDistanceFromSun < 50 * global.size)
                    this.warningTime -= 10 * deltaSeconds;
                else
                    this.warningTime -= deltaSeconds;
                document.getElementById("warning").style.display = "block";
                document.getElementById("warning").innerText =
                    `⚠️ Warning: Too close to the Sun! Move away in ${this.warningTime.toFixed(1)} s`;
            }

            if (this.warningTime <= 0) {
                alert("🔥 You stayed too close to the Sun for too long. you died");
                window.close();
                this.warningAudio.pause();
            }
        } else {
            this.warningTime = 10;
            this.warningTimerActive = false;
            this.warningAudio.pause();
            document.getElementById("warning").style.display = "none";
        }

    }

    updateDistanceToSun() {
        const distanceToSun = camera.position.distanceTo(sun.position);
        document.getElementById("sundist").innerHTML = `
       Current distnce from sun  : ${distanceToSun}
    `;

    }

}