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
  stats.domElement.style.left = '285px';
  stats.domElement.style.top = '0px';

  node.appendChild(stats.domElement);

  return stats;
};

const createMesh = (geom: THREE.BufferGeometry, imageFile: string, bumpFile?: string) => {
  const texture = new THREE.TextureLoader().load(imageFile);
  const mat = new THREE.MeshPhongMaterial();
  mat.map = texture;
  if (bumpFile) {
    const bump = new THREE.TextureLoader().load(bumpFile);
    mat.bumpMap = bump;
    mat.bumpScale = 0.2;
  }
  const mesh = new THREE.Mesh(geom, mat);
  return mesh;
};

const BumpMap = () => {
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

    const cube1 = createMesh(new THREE.BoxGeometry(15, 15, 2), stone);
    cube1.rotation.y = -0.5;
    cube1.position.x = 12;
    scene.add(cube1);

    const cube2 = createMesh(new THREE.BoxGeometry(15, 15, 2), stone, stoneBump);
    cube2.rotation.y = 0.5;
    cube2.position.x = -12;
    scene.add(cube2);

    const floorTex = new THREE.TextureLoader().load(floorWood);
    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(200, 100, 0.1, 30),
      new THREE.MeshPhongMaterial({
        color: 0x3c3c3c,
        map: floorTex,
      }),
    );

    plane.position.y = -7.5;
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

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
    const controls = (() => {
      const bumpScale = 0.2;
      // const changeTexture = 'weave';
      const rotate = false;

      const changeTexture = function (e: string) {
        const img = e === 'stone' ? stone : weave;
        const texture = new THREE.TextureLoader().load(img);
        (cube2.material as THREE.MeshPhongMaterial).map = texture;
        (cube1.material as THREE.MeshPhongMaterial).map = texture;

        const bumpImg = e === 'stone' ? stoneBump : weaveBump;
        const bump = new THREE.TextureLoader().load(bumpImg);
        (cube2.material as THREE.MeshPhongMaterial).bumpMap = bump;
      };

      const updateBump = function (e: number) {
        (cube2.material as THREE.MeshPhongMaterial).bumpScale = e;
      };
      return { bumpScale, rotate, changeTexture, updateBump };
    })();

    const gui = new dat.GUI();
    gui.add(controls, 'bumpScale', -2, 2).onChange(controls.updateBump);
    gui.add(controls, 'changeTexture', ['stone', 'weave']).onChange(controls.changeTexture);
    gui.add(controls, 'rotate');

    function render() {
      stats.update();
      if (controls.rotate) {
        cube1.rotation.y -= 0.01;
        // cube2.rotation.y += 0.01;
      }
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
export { BumpMap };
