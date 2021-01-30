import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import styled from 'styled-components';

import stone from 'src/assets/textures/general/stone.jpg';
import stoneBump from 'src/assets/textures/general/stone-bump.jpg';
import weave from 'src/assets/textures/general/weave.jpg';
import weaveBump from 'src/assets/textures/general/weave-bump.jpg';
import floorWood from 'src/assets/textures/general/floor-wood.jpg';

const Container = styled.div`
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

const initStats = (node: HTMLElement) => {
  const stats = Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '301px';
  stats.domElement.style.top = '0px';

  node.appendChild(stats.domElement);

  return stats;
};

const FirstScene = () => {
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

    const axes = new THREE.AxesHelper(200);
    scene.add(axes);

    const cubeGeo = new THREE.BoxGeometry(14, 14, 14);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeo, material);

    // position the cube
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

    scene.add(cube);

    // position and point the camera to the center of the scene
    camera.position.x = -80;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(scene.position);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    scene.add(spotLight);

    container.appendChild(webGLRenderer.domElement);

    function render() {
      stats.update();
      // cube.position.x += 1;
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
export { FirstScene };
