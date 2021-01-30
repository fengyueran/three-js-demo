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

const vert1 = `
uniform float time;
varying vec2 vUv;


void main()
{
vec3 posChanged = position;
posChanged.x = posChanged.x*(abs(sin(time*1.0)));
posChanged.y = posChanged.y*(abs(cos(time*1.0)));
posChanged.z = posChanged.z*(abs(sin(time*1.0)));
//gl_Position = projectionMatrix * modelViewMatrix * vec4(position*(abs(sin(time)/2.0)+0.5),1.0);
gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged,1.0);
}

`;

const frag1 = `
precision highp float;
uniform float time;
uniform float alpha;
uniform vec2 resolution;
varying vec2 vUv;

void main2(void)
{
vec2 position = vUv;
float red = 1.0;
float green = 0.25 + sin(time) * 0.25;
float blue = 0.0;
vec3 rgb = vec3(red, green, blue);
vec4 color = vec4(rgb, alpha);
gl_FragColor = color;
}

#define PI 3.14159
#define TWO_PI (PI*2.0)
#define N 68.5

void main(void)
{
vec2 center = (gl_FragCoord.xy);
center.x=-10.12*sin(time/200.0);
center.y=-10.12*cos(time/200.0);

vec2 v = (gl_FragCoord.xy - resolution/20.0) / min(resolution.y,resolution.x) * 15.0;
v.x=v.x-10.0;
v.y=v.y-200.0;
float col = 0.0;

for(float i = 0.0; i < N; i++)
{
float a = i * (TWO_PI/N) * 61.95;
col += cos(TWO_PI*(v.y * cos(a) + v.x * sin(a) + sin(time*0.004)*100.0 ));
}

col /= 5.0;

gl_FragColor = vec4(col*1.0, -col*1.0,-col*4.0, 1.0);
}
`;

const createMaterial = () => {
  const vertShader = vert1;
  const fragShader = frag1;

  const uniforms = {
    time: { type: 'f', value: 0.2 },
    scale: { type: 'f', value: 0.2 },
    alpha: { type: 'f', value: 0.6 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
  };

  uniforms.resolution.value.x = 300;
  uniforms.resolution.value.y = 400;

  const meshMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true,
  });

  return meshMaterial;
};

const ShaderMaterial = () => {
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

    const cubeGeo = new THREE.BoxGeometry(20, 50, 50);

    const meshMaterial1 = createMaterial();
    meshMaterial1.wireframe = true;
    const materials = [meshMaterial1];
    // const meshMaterial2 = createMaterial("vertex-shader", "fragment-shader-2");
    // const meshMaterial3 = createMaterial("vertex-shader", "fragment-shader-3");
    // const meshMaterial4 = createMaterial("vertex-shader", "fragment-shader-4");
    // const meshMaterial5 = createMaterial("vertex-shader", "fragment-shader-5");
    // const meshMaterial6 = createMaterial("vertex-shader", "fragment-shader-6");

    const cube = new THREE.Mesh(cubeGeo, materials);
    scene.add(cube);

    // position and point the camera to the center of the scene
    camera.position.x = 30;
    camera.position.y = 30;
    camera.position.z = 30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add spotlight for the shadows
    const ambiLight = new THREE.AmbientLight(0x141414);
    scene.add(ambiLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    container.appendChild(webGLRenderer.domElement);

    const controls = {
      rotationSpeed: 0.02,
      bouncingSpeed: 0.03,

      opacity: meshMaterial1.opacity,
      transparent: meshMaterial1.transparent,

      visible: meshMaterial1.visible,
      side: 'front',

      wireframe: meshMaterial1.wireframe,
      wireframeLinewidth: meshMaterial1.wireframeLinewidth,

      selectedMesh: 'cube',

      shadow: 'flat',
    };

    let step = 0;
    function render() {
      stats.update();

      // cube.rotation.y = step += 0.01;
      // cube.rotation.x = step;
      // cube.rotation.z = step;

      materials.forEach(function (e) {
        e.uniforms.time.value += 0.01;
      });

      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
export { ShaderMaterial };
