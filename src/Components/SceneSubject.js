import * as THREE from 'three';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';
var TWEEN = require('@tweenjs/tween.js');
import { isMobile } from 'mobile-device-detect';

export default (scene, origin) => {
    let object = null;
    let objects = [];
    let objectsBoxes = [];
    const group = new THREE.Group();
    const loader = new OBJLoader();
    const loaderMtl = new MTLLoader();
    let compass = {};
    const texturesObj = {};
    let selectedProperty = null;
    const groups = {};
    const textures = config3D.textures;
    const cameraPostion = Object.assign({}, origin);
    initTextures();
    initObj();
    function initTextures(){
        Object.keys(textures).map((key) => {
            const value = textures[key];
            const texture = new THREE.TextureLoader().load( value );
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texturesObj[`${key}`] = texture;
        });
    }
    function initObj(){
        loaderMtl.setPath( config3D.objectDir3D ).load( config3D.objectMtl3D, ( materials )=>{
            materials.preload();
            loader.setMaterials( materials )
                .setPath( config3D.objectDir3D )
                .load( config3D.object3D, ( obj ) => {
                    if(isMobile){
                        obj.scale.set(.4,.4,.4);
                    }
                    obj.position.y = 0;
                    obj.position.x =  0;
                    obj.position.z =  0;
                    obj.castShadow = true;
                    group.add( obj );
                    obj.traverse( function ( child ) {
                        updateChilds(child);
                    });
                    obj.rotation.y = 1.3;
                    object = obj;
                    config3D.loaded();
                }, function ( xhr ) {
                    const loading = parseInt(( xhr.loaded / xhr.total * 100 ));
                    config3D.loaderShow(loading);
                },
                function ( error ) {
                    console.log( 'An error happened' );
                });
        });
        scene.add(group);
    }

    
    function update(time) {
        TWEEN.update();
    }
    function updateChilds(child){
        if (child instanceof THREE.Mesh) {
            updateChild(child);
        }
    }
    function updateChild(child){
        
        if (child instanceof THREE.Mesh) {
            
            let name = child.name.trim();
            let [nameItem, etageTag, etage, texture, textureId] = name.split('_');
            if(nameItem == 'box' && etageTag == "etage"){
                child.castShadow = false;
                child.receiveShadow = false;
                child.renderOrder = 10;
                const property = null;
                const propertyTag = null;
                const reference = null;
                child.userData.property = property;
                child.userData.info = [nameItem, etageTag, etage, propertyTag, reference];
                child.userData.search = false;
                setDefaulTextureWhite(child);
            } else if(nameItem == "item" || nameItem == "s9af"){
                child.castShadow = true;
                child.receiveShadow = true;
                child.userData.info = [nameItem, etageTag, etage, texture, textureId];
                setDefaulTexture(child);
                child.renderOrder = 1;
                objects.push(child);
            } else if(nameItem == "boussol"){
                child.castShadow = true;
                child.receiveShadow = true;
                child.visible = false;
                compass = child;
                setDefaulTexture(child);
            } else if(nameItem != "box") {
                child.castShadow = true;
                child.receiveShadow = true;
                setDefaulTexture(child);
            } else {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        }
    }
    function setDefaulTextureWhite(child){
        if (child instanceof THREE.Mesh) {
            const textureBoxShow = texturesObj.texture_12;
            const opacity = 0;
            const transparent = true;
            child.material = new THREE.MeshPhysicalMaterial({map: textureBoxShow, color: 0x0080C2, opacity: opacity, transparent: transparent, side: THREE.DoubleSide});
        }
    }
    function setDefaulTexture(child){
        if (child instanceof THREE.Mesh) {
            const name = child.name.trim();
            let textureBoxShow = null;
            let opacity = 1;
            let transparent = false;
            let doubleSide = false;
            Object.keys(texturesObj).map(txt => {
                var regex = new RegExp(txt, 'i');
                if(regex.test(name)){
                    if(txt == 'texture_7' || txt == "texture_3"){
                        opacity = .5;
                        transparent = true;
                    } else if(txt == "texture_8" || txt == "texture_5"){
                         doubleSide = true;
                     } else if(txt == "texture_20"){
                        opacity = .2;
                        transparent = true;
                     }
                    textureBoxShow = texturesObj[txt];

                }
            })
            if(textureBoxShow){
                if(doubleSide){
                    child.material = new THREE.MeshLambertMaterial({map: textureBoxShow, color: 0xffffff, opacity: opacity, transparent: transparent, side: THREE.DoubleSide});
                } else {
                    child.material = new THREE.MeshLambertMaterial({map: textureBoxShow, color: 0xffffff, opacity: opacity, transparent: transparent});
                }
                    
                
            }
        }
    }
    function setNotHoveredTexture(child){
        const prps = child.userData.property;
        if (child instanceof THREE.Mesh) {
            if(((JSON.stringify(prps) != JSON.stringify(selectedProperty) && selectedProperty) || !selectedProperty && !child.userData.search) ){
                child.material.color.setHex(0xffffff);
                child.material.opacity = 0;
                child.material.needsUpdate = true;
            }
        }
    }
    function setNotHoveredTextureToAll(){
        objectsBoxes.forEach(item => {
            setNotHoveredTexture(item);
        });
    }
    function resetCamera(callback){
        setNotHoveredTextureToAll();
        objects.map(function(childObj){
            childObj.visible = true;
        });
    }
    
    function search(data){

    }
    function toggleCompass(){
        compass.visible = !compass.visible;
    }
    return {
        update,
        search,
        resetCamera,
        toggleCompass
    }
}