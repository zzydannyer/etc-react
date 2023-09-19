/*
 * @Author: cmf
 * @Date: 2020-09-04 13:48:34
 * @LastEditTime: 2021-07-31 17:47:19
 * @LastEditors: Please set LastEditors
 * @Description: 动画效果
 * @FilePath: \evdata-exam\src\pages\layout\common\animation.ts
 */
import type React from 'react';
import type { UseTransitionProps } from 'react-spring';

const TransformTime = 500;
export const foward: UseTransitionProps<JSX.Element, React.CSSProperties> = {
  from: { opacity: 0 },
  enter: {
    opacity: 1,
  },
  leave: { opacity: 0 },
  config: { duration: TransformTime },
};

export const back: UseTransitionProps<JSX.Element, React.CSSProperties> = {
  from: { opacity: 0 },
  enter: {
    opacity: 1,
  },
  leave: { opacity: 0 },
  config: { duration: TransformTime },
};
export const fowardHasTranslateX: UseTransitionProps<JSX.Element, React.CSSProperties> = {
  from: { opacity: 0, transform: 'translateX(100%)' },
  enter: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  leave: { opacity: 0, transform: 'translateX(-100%)' },
  config: { duration: TransformTime },
};
export const backHasTranslateX: UseTransitionProps<JSX.Element, React.CSSProperties> = {
  from: { opacity: 0, transform: 'translateX(-100%)' },
  enter: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  leave: { opacity: 0, transform: 'translateX(100%)' },
  config: { duration: TransformTime },
};
