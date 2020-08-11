import * as THREE from 'three';
import SceneSubject from './SceneSubject';
import GeneralLights from './GeneralLights';
const OrbitControls = require('three-orbitcontrols');
import { Interaction } from 'three.interaction';
export default canvas => {
    const clock = new THREE.Clock();
    const origin = new THREE.Vector3(0, 0, 0);
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    const mousePosition = {
        x: 0,
        y: 0
    }
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const controls = buildControls(camera, renderer);
    const sceneSubjects = createSceneSubjects(scene);
    
    const interaction = new Interaction(renderer, scene, camera);
    window.scene = scene;
    window.THREE = THREE;
    window.camera = camera;
    window.controls = controls;
    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xdddddd);
        return scene;
    }
    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 45;
        const nearPlane = 0.1;
        const farPlane = 2000; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = 104.43850464611005;
        camera.position.x = 65.44828302907102;
        camera.position.y = 80.14689327938085;
        return camera;
    }
    function buildControls(camera, renderer){
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI * 0.45;
        controls.minDistance = 40;
        controls.maxDistance = 200;
        controls.autoRotateSpeed = .5;
        controls.target = origin;
        return controls;
    }
    function createSceneSubjects(scene) {
        const sceneSubjects = [
            new GeneralLights(scene, origin),
            new SceneSubject(scene, origin),
        ];
        return sceneSubjects;
    }

    

    function update() {
        const elapsedTime = clock.getElapsedTime();
        for(let i=0; i<sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime);
        controls.update();
        renderer.render(scene, camera);
        camera.lookAt(origin);
    }
    function onWindowResize() {
        const { width, height } = canvas;
        
        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    function onMouseMove(x, y) {
        mousePosition.x = x;
        mousePosition.y = y;
    }
    function search(data){
        sceneSubjects[1].search(data);
    }
    function play(){
        controls.autoRotate = !controls.autoRotate;
    }
    function toggleShadow(){
        renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
        renderer.clearTarget(sceneSubjects[0].light.shadow.map);
    }
    function resetCamera(){
        sceneSubjects[1].resetCamera();
    }
    function toggleSound(){
        sounds.loadSound() ;
    }
    function toggleCompass(){
        sceneSubjects[1].toggleCompass();
    }
    function changePositionOfLight(date){
        sceneSubjects[0].changePositionOfLight(date);
    }
    return {
        update,
        onWindowResize,
        onMouseMove,
        search,
        toggleShadow,
        resetCamera,
        play,
        toggleSound,
        toggleCompass,
        changePositionOfLight
    }
}