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

    // position and point the camera to the center of the scene
    camera.position.x = 150;
    camera.position.y = 150;
    camera.position.z = 150;
    camera.lookAt(new THREE.Vector3(0, 40, 0));

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(150, 150, 150);
    scene.add(spotLight);

    // model from http://www.thingiverse.com/thing:69709
    const loader = new STLLoader();
    let mesh: THREE.Mesh;
    loader.load(stl, function (geometry) {
      console.log(geometry);
      var mat = new THREE.MeshLambertMaterial({ color: 0x7777ff });
      mesh = new THREE.Mesh(geometry, mat);
      mesh.rotation.x = -0.5 * Math.PI;
      mesh.scale.set(0.6, 0.6, 0.6);
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
