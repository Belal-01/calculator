
import GUI from 'lil-gui'
export class LilGui {
    #gui;
    constructor() {
        this.pretimespeed = 1;
       
        this.playstatus = true;
        this.lastTime = performance.now() / 1000;
        this.#gui = new GUI();
        this.GlobalGui = this.#gui.addFolder('Global');
        this.SunGui = this.#gui.addFolder('Sun');
        this.MercuryGui = this.#gui.addFolder('Mercury');
        this.venusGui = this.#gui.addFolder('venus');
        this.EarthGui = this.#gui.addFolder('Earth');
        this.marsGui = this.#gui.addFolder('mars');
        this.jupiterGui = this.#gui.addFolder('jupiter');
        this.saturnGui = this.#gui.addFolder('saturn');
        this.uranusGui = this.#gui.addFolder('uranus');
        this.neptuneGui = this.#gui.addFolder('neptune');

        this.EarthGui.close();
        this.SunGui.close();
        this.MercuryGui.close();
        this.venusGui.close();
        this.marsGui.close();
        this.jupiterGui.close();
        this.uranusGui.close();
        this.saturnGui.close();
        this.neptuneGui.close();
    }
    setGuiConfiguration() {


        this.global = {
            distance: 4,
            size: 2.5,
            days: 0,
            timespeed: 1,
        
        };

        this.GlobalGui.add(this.global, "distance").min(1).max(10).step(0.5);
        this.GlobalGui.add(this.global, "days");
        this.GlobalGui.add(this.global, "timespeed").name("days speed per second").min(0).max(10).step(0.001);


        window.GlobalGui = this.GlobalGui;
        window.SunGui = this.SunGui;
        window.MercuryGui = this.MercuryGui;
        window.venusGui = this.venusGui;
        window.EarthGui = this.EarthGui;
        window.marsGui = this.marsGui;
        window.jupiterGui = this.jupiterGui;
        window.saturnGui = this.saturnGui;
        window.uranusGui = this.uranusGui;
        window.neptuneGui = this.neptuneGui;
        window.global = this.global;

    }
    addGlobalButtons() {


        GlobalGui.add({
            pause: () => {
                if (this.playstatus) {
                    this.pretimespeed = global.timespeed;
                    global.timespeed = 0;
                    this.playstatus = false;
                }
            }
        }, "pause");
        GlobalGui.add({
            play: () => {
                if (!this.playstatus) {
                    global.timespeed = this.pretimespeed
                    this.playstatus = true;
                }


            }
        }, "play");

        GlobalGui.add({
            reset: () => {
                global.days = 0;
                this.lastTime = performance.now() / 1000;
                [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(planet => {
                    planet.mesh.rotation.y = 0;
                });
            }
        }, "reset");




    }


}