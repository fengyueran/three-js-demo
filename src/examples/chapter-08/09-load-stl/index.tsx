import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import styled from 'styled-components';

import stl from 'src/assets/models/SolidHead_2_lowPoly_42k.stl';

const Container = styled.div`
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

const LoadSTL = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const cubeGeo = new THREE.BoxGeometry(20, 20, 20);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    cube.position.set(-50, 0, 0);
    scene.add(cube);

    // 相机左移物体右移
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 300;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(150, 150, 150);
    scene.add(spotLight);

    // // model from http://www.thingiverse.com/thing:69709
    const loader = new STLLoader();
    let mesh: THREE.Mesh;
    loader.load(stl, function (geometry) {
      var mat = new THREE.MeshLambertMaterial({ color: 0x7777ff });
      mesh = new THREE.Mesh(geometry, mat);

      //模型没有居中，可能是模型局部坐标的原点不是在模型中心，像在左下角
      const box = new THREE.Box3().setFromObject(mesh);
      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center); // center the model

      scene.add(mesh);
    });

    container.appendChild(webGLRenderer.domElement);
    function render() {
      if (mesh) {
        mesh.rotation.z += 0.006;
        mesh.rotation.x += 0.006;
      }

      // render using requestAnimationFrame
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
export { LoadSTL };
