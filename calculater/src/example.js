import * as th from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import './style.css'
import { CapsuleGeometry } from 'three'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { FontLoader, Wireframe } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import CANNON from 'cannon'
console.log(CANNON)
/*
envirnment map
*/
// const rgbloader=new RGBELoader()
// rgbloader.load('./t.hdr',(envirnmentMap) => {
//     envirnmentMap.mapping = th.EquirectangularReflectionMapping
//     scene.background =envirnmentMap
//     scene.environment = envirnmentMap
// })
// textures
const TextureLoader= new th.TextureLoader()
const texture= TextureLoader.load('./earth.jpg')

//texture.repeat.x=2
texture.wrapS= th.RepeatWrapping
texture.wrapT = th.RepeatWrapping
texture.offset.x=0
texture.rotation= 0
texture.center.x=0.5
texture.center.y=0.5
// debug
const gui= new GUI()
const debug={
    color : 'red',

}
// canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new th.Scene()

// Geometries

/*const material = new th.MeshLambertMaterial({
   //color : 'red',
   side : th.DoubleSide,
  //  transparent : true,
  //  opacity : 0.5
   map : texture
 })*/
const material= new th.MeshStandardMaterial({
    side : th.DoubleSide,
    // metalness: 1,
    // roughness: 1.0,
    //transparent: true,
    //opacity: 0.4
   //map : texture
})
gui.add(material,"metalness").min(0).max(1).step(0.001)
gui.add(material,"roughness").min(0).max(1).step(0.001)
const Sphere = new th.SphereGeometry(1,60,60)

const Box= new th.BoxGeometry(25,1,15)

const box=new th.Mesh(Box,material)
box.position.set(0,-2,0)
scene.add(box)
const sphere  = new th.Mesh(Sphere,material)

sphere.castShadow = true
box.receiveShadow = true



sphere.position.x=-5
scene.add(sphere)
/*phiscs */ 
const world=new CANNON.World()
world.gravity.set(0,-9.82,0)

/**Lights */
const ambientLight = new th.AmbientLight('white',0.4)
scene.add(ambientLight)

const pointlig= new th.PointLight('white',250)
pointlig.castShadow= true
pointlig.position.set(10,5,1)
pointlig.shadow.mapSize.width=1024 *2
pointlig.shadow.mapSize.height=1024*2
scene.add(pointlig)
// helpers
const axeshelper = new th.AxesHelper(1000)
scene.add(axeshelper)
gui.add(material,'wireframe')

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize',()=>{
    sizes.width  = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect= sizes.width/sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})
window.addEventListener('dblclick', ()=>{
    if(!document.fullscreenElement){
        canvas.requestFullscreen()
    }
    else {
        document.exitFullscreen()
    }
})

// camera 
const camera = new th.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 2)
scene.add(camera)

// renderer
const renderer = new th.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled=true
 renderer.shadowMap.type = th.PCFSoftShadowMap
// controls
const controls = new OrbitControls(camera, canvas)
controls.enabled =true
controls.enableDamping = true 
controls.enableZoom = true 
controls.autoRotate = false 
controls.autoRotateSpeed = 2.0

const clock = new th.Clock()
// 
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y= elapsedTime *0.1
    
    sphere.rotation.x= elapsedTime * -0.15

   
 //  mesh3.rotation.y=elapsedTime * 0.0000727 *10
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
