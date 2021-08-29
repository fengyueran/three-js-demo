import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { loadModelFiles, loadTexture } from './util';
import { createMesh } from './mesh';

const Container = styled.div`
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

const getGeoCenter = (mesh: THREE.Mesh) => {
  const box = new THREE.Box3().setFromObject(mesh);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return center;
};

const LoadPly = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initScene = async () => {
      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new THREE.Scene();

      const container = containerRef.current!;
      // 近平面和远平面主要用于确定要渲染的顶点范围
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

      // const ambientLight = new THREE.AmbientLight(0xffffff);
      // scene.add(ambientLight);

      const { cldata, geometry } = await loadModelFiles();
      const texture = await loadTexture();
      const mesh = createMesh(cldata, geometry, texture);
      camera.position.set(-50, 350, -70);
      camera.lookAt(scene.position);
      const center = getGeoCenter(mesh);
      // camera.lookAt(center);
      scene.add(mesh);
      container.appendChild(webGLRenderer.domElement);
      function render() {
        if (mesh) {
          // mesh.rotation.z += 0.006;
          // mesh.rotation.x += 0.001;
        }
        // render using requestAnimationFrame
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }
      render();
    };
    initScene();
  }, []);

  return <Container ref={containerRef} />;
};
export { LoadPly };
