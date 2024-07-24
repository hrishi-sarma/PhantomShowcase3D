import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model;
let isMouseDown = false;
let previousMouseX = 0;
let isFrontView = true;
let isStockModel = false;
const models = {
    stock: '3dmodels/rx7stock.glb',
    edit: '3dmodels/rx7fcedit.glb'
};

function init(containerId, modelPath) {
    // Create the scene
    scene = new THREE.Scene();

    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 18);
    camera.lookAt(0, 10, 0);

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(containerId).appendChild(renderer.domElement);

    // Add lighting
    const light = new THREE.RectAreaLight(0xffffff, 10);
    light.position.set(9, 18, 15);
    scene.add(light);

    // Load the initial model
    loadModel(modelPath);

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);

    document.getElementById('toggleView').addEventListener('click', toggleCameraView);
    document.getElementById('toggleModel').addEventListener('click', toggleModel);
}

function loadModel(modelPath) {
    const loader = new GLTFLoader();
    loader.load(modelPath, function (gltf) {
        if (model) {
            scene.remove(model);
        }
        model = gltf.scene;
        model.position.set(0, 10, 0);
        model.rotation.set(0, 0, 0);
        model.scale.set(5, 5, 5);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
    }, undefined, function (error) {
        console.error(error);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01; // Adjust the rotation speed if needed
    }

    renderer.render(scene, camera);
}

// Mouse event handlers
function onMouseDown(event) {
    isMouseDown = true;
    previousMouseX = event.clientX;
}

function onMouseMove(event) {
    if (isMouseDown && model) {
        const deltaX = event.clientX - previousMouseX;
        model.rotation.y += deltaX * 0.005;
        previousMouseX = event.clientX;
    }
}

function onMouseUp() {
    isMouseDown = false;
}

function toggleCameraView() {
    if (isFrontView) {
        camera.position.set(0, 40, 0);
    } else {
        camera.position.set(0, 15, 18);
    }
    camera.lookAt(0, 10, 0);
    isFrontView = !isFrontView;
}

function toggleModel() {
    isStockModel = !isStockModel;
    loadModel(isStockModel ? models.stock : models.edit);
}

init('three-container', models.edit);
animate();
