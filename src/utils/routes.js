import * as chapter4 from 'src/examples/chapter-04';
import * as chapter8 from 'src/examples/chapter-08';
import * as chapter10 from 'src/examples/chapter-10';
import * as chapter11 from 'src/examples/chapter-11';
import { LESSONS } from './constants';

export const Routes = [
  { path: LESSONS.C4_08, component: chapter4.ShaderMaterial },
  { path: LESSONS.C8_09, component: chapter8.LoadSTL },
  { path: LESSONS.C10_01, component: chapter10.BasicTexture },
  { path: LESSONS.C10_02, component: chapter10.BumpMap },
  { path: LESSONS.C11_07, component: chapter11.ShaderPassCustom },
];
