import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import styled from 'styled-components';
import { OrbitControls } from './OrbitControls';

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

const PlaneClip = () => {
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

    const cubeGeo = new THREE.BoxGeometry(100, 100, 100);

    // 开启模型对象的局部剪裁平面功能
    // 如果不设置为true，设置剪裁平面的模型不会被剪裁
    // webGLRenderer.localClippingEnabled = true;

    // Plane作为元素创建数组，Plane的方向法向量、位置根据需要随意定义
    var PlaneArr = [
      //创建一个垂直x轴的平面，方向沿着x轴正方向，沿着x轴负方向平移50,
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 50),
      //创建一个垂直x轴的平面，方向沿着x轴负方向，沿着x轴正方向平移50,
      // new THREE.Plane(new THREE.Vector3(-1, 0, 0), 50),

      // 垂直y轴的平面
      // new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      // 垂直z轴的平面
      // new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
    ];
    // 通过PlaneHelper辅助可视化显示剪裁平面Plane
    var helper1 = new THREE.PlaneHelper(PlaneArr[0], 300, 0xffffff);
    scene.add(helper1);
    // var helpe2 = new THREE.PlaneHelper(PlaneArr[1], 300, 0xffffff);
    // scene.add(helpe2);

    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000, // 设置材质的剪裁平面的属性
      side: THREE.DoubleSide,
      clippingPlanes: PlaneArr,
      // clipIntersection: true,
    });
    const cube = new THREE.Mesh(cubeGeo, material);

    //全局裁剪
    // webGLRenderer.clippingPlanes = PlaneArr;

    // position the cube
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

    scene.add(cube);

    // position and point the camera to the center of the scene
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 250;
    camera.lookAt(scene.position);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(180, 520, 120);
    scene.add(spotLight);

    // add spotlight for the shadows
    const ambiLight = new THREE.AmbientLight(0x141414);
    scene.add(ambiLight);

    container.appendChild(webGLRenderer.domElement);
    (window as any).plane1 = PlaneArr[0];
    // (window as any).plane2 = PlaneArr[1];
    (window as any).webGLRenderer = webGLRenderer;
    function render() {
      stats.update();
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
    const controls = new OrbitControls(camera);
    (controls as any).addEventListener('change', render);
  }, []);

  return <Container ref={containerRef} />;
};
export { PlaneClip };
