import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import * as dat from 'lil-gui'
import { Raycaster } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
let raycaster = new Raycaster();
const textureLoader = new THREE.TextureLoader()
const matcap1 = textureLoader.load('/textures/matcaps/1.png')
const matcap2 = textureLoader.load('/textures/matcaps/2.png')
const matcap3 = textureLoader.load('/textures/matcaps/3.png')
const matcap4 = textureLoader.load('/textures/matcaps/4.png')
const matcap5 = textureLoader.load('/textures/matcaps/5.png')
const matcap6 = textureLoader.load('/textures/matcaps/6.png')
const matcap8 = textureLoader.load('/textures/matcaps/8.png')
const textmatcap = textureLoader.load('/textures/matcaps/7.png')

let matcaps = [matcap1, matcap2, matcap3, matcap4, matcap5, matcap6, matcap8]
// Font Loader


const textLoader = new FontLoader();

let spheres = [];
let textMesh;

const sphereGeometry = new THREE.SphereGeometry(0.2);


const font = textLoader.load("/fonts/helvetiker_regular.typeface.json",
    // onLoad callback
    function onLoad(font) {
        let textGeometry = new TextGeometry("Mohit Kumar Toshniwal", {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelEnabled: true,
            bevelSegments: 4
        });
        let textMaterial = new THREE.MeshMatcapMaterial({
            matcap: textmatcap
            // color: 0xff0000
            // wireframe: true
        });
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     -(textGeometry.boundingBox.max.x - 0.02) / 2,
        //     -(textGeometry.boundingBox.max.y - 0.02) / 2,
        //     -(textGeometry.boundingBox.max.z - 0.03) / 2,


        // );
        textGeometry.center()
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 0, 0);
        scene.add(textMesh);

        // let sphereMaterial = new THREE.MeshMatcapMaterial({
        //     // matcap
        //     color: 0xff0000
        //     // wireframe: true
        // });
        for (let i = 0; i < 500; i++) {
            let sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshMatcapMaterial({
                matcap: matcaps[Math.floor(Math.random() * 7)],
                // color: 0xff0000
            }));
            let x = (Math.random() - 0.5) * 20
            let y = (Math.random() - 0.5) * 20
            let z = (Math.random() - 0.5) * 20
            sphere.position.set(x, y, z)


            let scale = Math.random();
            sphere.scale.set(scale, scale, scale)

            spheres.push(sphere)
            scene.add(sphere)
        }
    },
    // onProgress callback
    function onProgress() {
        // do something
    },
    // onError callback
    function onError(err) {
        console.log('An error happened');
    }
);



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 2;
controls.maxDistance = 8;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null;
let coloredIntersectedObjects = []


const mouse = new THREE.Vector2()
window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -((event.clientY / sizes.height) * 2 - 1)

});

window.addEventListener("click", () => {
    if (currentIntersect) {
        console.log("clicked")
        camera.position.copy(currentIntersect.object.position)
    }
})

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(spheres)
    // console.log((intersects));

    if (coloredIntersectedObjects.length > 0) {
        coloredIntersectedObjects.forEach(coloredInteresectedObject => {
            coloredInteresectedObject.material.color.set("#fff")
        });
        coloredIntersectedObjects = []
    }

    for (let intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
        coloredIntersectedObjects.push(intersect.object);

    }

    if (intersects.length) {
        if (currentIntersect === null) {
            console.log("mouse enter");
            document.body.style.cursor = "all-scroll"
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            console.log("mouse leave")
            document.body.style.cursor = "default"


        }
        currentIntersect = null

    }
    camera.rotation.y = Math.sin(elapsedTime);


    // Update controls
    controls.update();
    controls.autoRotate = true
    controls.autoRotateSpeed = 4

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()