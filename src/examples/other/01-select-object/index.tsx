import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

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

const SelectObject = () => {
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

    const cubeGeo = new THREE.BoxGeometry(14, 14, 14);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    cube.position.x = -10;
    cube.name = 'cube';
    scene.add(cube);

    const sphereGeo = new THREE.SphereGeometry(10, 10, 10);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.name = 'sphere';
    sphere.position.x = 10;
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 62;
    camera.position.z = 68;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const light = new THREE.DirectionalLight();
    light.position.set(0, 30, 20);
    light.intensity = 1.2;
    scene.add(light);

    console.log(scene.children);

    container.appendChild(webGLRenderer.domElement);

    function render() {
      stats.update();
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();

    const convertCoordinateToThree = (e: MouseEvent) => {
      e.preventDefault();
      const mouse = { x: 0, y: 0 };
      //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标
      mouse.x = (e.offsetX / container.clientWidth) * 2 - 1;
      mouse.y = -(e.offsetY / container.clientHeight) * 2 + 1;

      return mouse;
    };

    const selectObj = (mouse: { x: number; y: number }) => {
      //新建一个三维单位向量 假设z方向就是0.5
      //根据照相机，把这个向量转换到视点坐标系
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

      //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
      const raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize(),
      );

      //射线和模型求交，选中一系列直线
      const intersects = raycaster.intersectObjects(scene.children);
      console.log('imtersrcts=' + intersects);

      if (intersects.length > 0) {
        //选中第一个射线相交的物体
        const intersected = intersects[0].object;
        console.log(intersected);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const mouse = convertCoordinateToThree(e);
      selectObj(mouse);
    };
    document.addEventListener('mousedown', onMouseDown, false);
  }, []);

  return <Container ref={containerRef} />;
};
export { SelectObject };
