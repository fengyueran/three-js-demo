import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import styled from 'styled-components';

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

const ObjOutline = () => {
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

    const geometry = new THREE.SphereGeometry(20, 48, 24);

    for (let i = 0; i < 5; i++) {
      const material = new THREE.MeshLambertMaterial();
      material.color.setHSL(Math.random(), 1.0, 0.3);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 30 - 8;
      mesh.position.y = Math.random() * 30 - 2;
      mesh.position.z = Math.random() * 30 - 2;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
      scene.add(mesh);
    }

    // position and point the camera to the center of the scene
    camera.position.x = -80;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(scene.position);

    const light = new THREE.DirectionalLight();
    light.position.set(0, 30, 20);
    light.intensity = 1.2;
    scene.add(light);

    // postprocessing

    const composer = new EffectComposer(webGLRenderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera,
    );
    outlinePass.visibleEdgeColor.set('#12793E');
    composer.addPass(outlinePass);

    container.appendChild(webGLRenderer.domElement);

    function render() {
      stats.update();
      requestAnimationFrame(render);
      composer.render();
    }
    render();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObjects: Array<THREE.Object3D> = [];

    function addSelectedObject(object: THREE.Object3D) {
      selectedObjects = [];
      selectedObjects.push(object);
    }

    function checkIntersection() {
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      console.log('intersects', intersects);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;
      } else {
        outlinePass.selectedObjects = [];
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.isPrimary === false) return;
      e.preventDefault();

      mouse.x = (e.offsetX / container.clientWidth) * 2 - 1;
      mouse.y = -(e.offsetY / container.clientHeight) * 2 + 1;

      checkIntersection();
    };

    webGLRenderer.domElement.style.touchAction = 'none';
    webGLRenderer.domElement.addEventListener('pointermove', onPointerMove);
  }, []);

  return <Container ref={containerRef} />;
};
export { ObjOutline };
