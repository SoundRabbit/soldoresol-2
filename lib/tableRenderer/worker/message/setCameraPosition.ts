import { EulerOrder } from 'three';

const tagName = 'setCameraPosition';

export type SetCameraPosition = {
  tag: typeof tagName;
  position?: [number, number, number];
  rotation?: {
    euler: [number, number, number];
    order: EulerOrder;
  };
};

export const SetCameraPosition = {
  is: (value: unknown): value is SetCameraPosition =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create: (props: Omit<SetCameraPosition, 'tag'>): SetCameraPosition => {
    return {
      tag: tagName,
      ...props,
    };
  },
};
