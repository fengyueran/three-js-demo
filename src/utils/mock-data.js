import { LESSONS } from './constants';

const treeData = [
  {
    title: '1、创建第一个三维场景',
    children: [
      {
        title: '02-first-scene',
        value: LESSONS.C1_02,
      },
    ],
  },
  {
    title: '4、使用three js的材质',
    children: [
      {
        title: '08-shader-material',
        value: LESSONS.C4_08,
      },
    ],
  },
  {
    title: '8、创建、加载高级网格和几何体',
    children: [
      {
        title: '09-load-stl',
        value: LESSONS.C8_09,
      },
      {
        title: '13-load-ply',
        value: LESSONS.C8_13,
      },
    ],
  },
  {
    title: '10、加载和使用纹理',
    children: [
      {
        title: '01-basic-texture',
        value: LESSONS.C10_01,
      },
      {
        title: '02-bump-map',
        value: LESSONS.C10_02,
      },
    ],
  },
  {
    title: '11、定制着色器和渲染后期处理',
    children: [
      {
        title: '07-shaderpass-custom',
        value: LESSONS.C11_07,
      },
    ],
  },
  {
    title: '其他',
    children: [
      {
        title: '01-select-object',
        value: LESSONS.other_01,
      },
      {
        title: '02-drag-object',
        value: LESSONS.other_02,
      },
      {
        title: '03-obj-outline',
        value: LESSONS.other_03,
      },
      {
        title: '04-plane-clip',
        value: LESSONS.other_04,
      },
    ],
  },
];
export { treeData };
