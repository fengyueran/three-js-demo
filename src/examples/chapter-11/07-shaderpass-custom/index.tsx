import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

import styled from 'styled-components';

import earthImg from 'src/assets/textures/planets/Earth.png';
import earthSpecImg from 'src/assets/textures/planets/EarthSpec.png';
import earthNormalImg from 'src/assets/textures/planets/EarthNormal.png';


const Container = styled.div`
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

const initStats = (node: HTMLElement) => {
  const stats = Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '285px';
  stats.domElement.style.top = '0px';

  node.appendChild(stats.domElement);

  return stats;
};

const createMesh = (geom: THREE.BufferGeometry) => {
  const planetTexture = new THREE.TextureLoader().load(earthImg);
  const specularTexture = new THREE.TextureLoader().load(earthSpecImg);
  const normalTexture = new THREE.TextureLoader().load(earthNormalImg);

  const planetMaterial = new THREE.MeshPhongMaterial();
  planetMaterial.specularMap = specularTexture;
  planetMaterial.specular = new THREE.Color(0x4444aa);

  planetMaterial.normalMap = normalTexture;
  planetMaterial.map = planetTexture


   // create a multimaterial
   var mesh = SceneUtils.createMultiMaterialObject(geom, [planetMaterial])
  return mesh;
};

const ShaderPassCustom = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stats = initStats(containerRef.current!);
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    const container = containerRef.current!;
    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    // create a render and set the size
    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);
    webGLRenderer.shadowMap.enabled = true;

    const cube1 = createMesh(new THREE.SphereGeometry(10, 40, 40));
    cube1.rotation.y = -0.5;
    cube1.position.x = 12;
    scene.add(cube1);



    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 12;
    camera.position.z = 28;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add spotlight for the shadows
    const ambiLight = new THREE.AmbientLight(0x141414);
    scene.add(ambiLight);

    const light = new THREE.DirectionalLight();
    light.position.set(0, 30, 20);
    light.intensity = 1.2;
    scene.add(light);

    container.appendChild(webGLRenderer.domElement);

    // setup the control gui




    function render() {
      stats.update();
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
export { ShaderPassCustom };
