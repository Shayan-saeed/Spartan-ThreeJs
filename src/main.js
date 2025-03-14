import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

const loadingScreen = document.getElementById('loading-screen');

const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const scene = new THREE.Scene();
let spartan;
let mixer;
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xff0000, 1);
pointLight1.position.set(5, 0, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x0000ff, 1);
pointLight2.position.set(-5, 0, 5);
scene.add(pointLight2);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const particlesPositions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    particlesPositions[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// const audioListener = new THREE.AudioListener();
// camera.add(audioListener);
// const sound = new THREE.Audio(audioListener);
// const audioLoader = new THREE.AudioLoader();

// audioLoader.load('/sound.mp3', function (buffer) {
//     sound.setBuffer(buffer);
//     sound.setLoop(true);
//     sound.setVolume(0.1);
//     sound.play();
// });

let isSmallScreen = window.innerWidth < 1000;

const updateModelForScreenSize = () => {
    if (!spartan) return;
    
    isSmallScreen = window.innerWidth < 1000;
    
    if (isSmallScreen) {
        // Set base position for small screens
        spartan.position.set(0, -2, -10);
        spartan.rotation.set(0, 0, 0);
        camera.position.z = 15;
        // Set container to be behind content
        // document.getElementById('container3D').style.zIndex = '0';
    } else {
        // Reset to original position based on scroll
        modelMove();
        camera.position.z = 20;
        // Reset container z-index
        // document.getElementById('container3D').style.zIndex = '0';
    }
    
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', () => {
    updateModelForScreenSize();
});

loader.load('/spartan.glb',
    function (gltf) {
        spartan = gltf.scene;
        scene.add(spartan);

        mixer = new THREE.AnimationMixer(spartan);
        mixer.clipAction(gltf.animations[0]).play();
        updateModelForScreenSize(); // Initialize position based on screen size
        loadingScreen.style.display = 'none';
    },
    function (xhr) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        gsap.to(document.getElementById('progress-circle'), {
            rotation: -90 + (360 * (percentComplete / 100)),
            duration: 0.1,
            ease: 'linear',
            transformOrigin: "center"
        });
    },
    function (error) {
        console.error('An error happened', error);
    }
);

// let mouseX = 0;
// let mouseY = 0;

// document.addEventListener('mousemove', (event) => {
//     mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//     mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
// });


const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
    pointLight1.position.x = Math.sin(Date.now() * 0.001) * 5;
    pointLight2.position.x = Math.cos(Date.now() * 0.001) * 5;
    particles.rotation.y += 0.005;
    // if (spartan) {
    //     gsap.to(spartan.rotation, {
    //         y: mouseX * 0.5, // Adjust sensitivity
    //         x: mouseY * 0.2, // Adjust sensitivity
    //         duration: 0.5,
    //         ease: 'power2.out',
    //     });
    // }
};
reRender3D();

let arrPositionModel = [
    {
        id: 'banner',
        position: { x: 0, y: -2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        ambientColor: 0xffffff, directionalColor: 0xffffff
    },
    {
        id: 'intro',
        position: { x: 1, y: -2.5, z: 10 },
        rotation: { x: 0.2, y: -0.5, z: 0 },
        ambientColor: 0x8080ff, directionalColor: 0xff8080
    },
    {
        id: 'description',
        position: { x: -1.7, y: -2.3, z: 7 },
        rotation: { x: -0.2, y: -5.5, z: 0 },
        ambientColor: 0xff8080, directionalColor: 0x80ffff
    },
    {
        id: 'contact',
        position: { x: 1, y: -2.6, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        ambientColor: 0x80ff80, directionalColor: 0xffff80
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
            currentSection = section.id;
        }
    });

    let position_active = arrPositionModel.findIndex((val) => val.id === currentSection);

    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        
        if (isSmallScreen) {
            // Apply subtle movements around the base position for small screens
            gsap.to(spartan.position, {
                x: 0 + (new_coordinates.position.x * 0.2), // Reduced movement range
                y: -2 + (new_coordinates.position.y * 0.1), // Very subtle vertical movement
                z: -10, // Keep fixed z position
                duration: 2,
                ease: 'power1.out',
            });
            gsap.to(spartan.rotation, {
                x: new_coordinates.rotation.x * 0.3, // Reduced rotation
                y: new_coordinates.rotation.y * 1,
                z: 0,
                duration: 2,
                ease: 'power1.out',
            });
        } else {
            // Original full movement for larger screens
            gsap.to(spartan.position, {
                x: new_coordinates.position.x,
                y: new_coordinates.position.y,
                z: new_coordinates.position.z,
                duration: 2,
                ease: 'power1.out',
            });
            gsap.to(spartan.rotation, {
                x: new_coordinates.rotation.x,
                y: new_coordinates.rotation.y,
                z: new_coordinates.rotation.z,
                duration: 2,
                ease: 'power1.out',
            });
        }

        // Keep the lighting animations for both screen sizes
        gsap.to(ambientLight.color, {
            r: new THREE.Color(new_coordinates.ambientColor).r,
            g: new THREE.Color(new_coordinates.ambientColor).g,
            b: new THREE.Color(new_coordinates.ambientColor).b,
            duration: 2
        });
        gsap.to(directionalLight.color, {
            r: new THREE.Color(new_coordinates.directionalColor).r,
            g: new THREE.Color(new_coordinates.directionalColor).g,
            b: new THREE.Color(new_coordinates.directionalColor).b,
            duration: 2
        });
    }
};

window.addEventListener('scroll', () => {
    if (spartan) {
        modelMove();
    }
});
