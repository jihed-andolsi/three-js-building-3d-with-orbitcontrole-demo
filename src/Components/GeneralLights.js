import * as THREE from 'three';
export default (scene, origin) => {
    scene.add( new THREE.AmbientLight( 0xdddddd, .5 ) );
    let light = null;
    initLight();
    setLightPosition(config3D.date, false);
    function update(time) {

    }
    function changePositionOfLight(date = config3D.date){
        setLightPosition(date);
    }

    function setLightPosition(date = config3D.date, showHelper = true){

    }
    function initLight(){
        light = new THREE.DirectionalLight( 0xffffff, .7 );
        //light = new THREE.SpotLight( 0xffffff, .8 );
        light.castShadow = true;
        light.penumbra = 0.3;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        const d = 50;
        light.shadow.camera.left = - d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = - d;
        light.shadow.camera.near = 50;
        light.shadow.camera.far = 500;
        //light.shadow.camera.fov = 130;
        light.shadow.bias = -0.0005;
        scene.add(light);
    }
    return {
        update,
        light,
        changePositionOfLight
    }
}