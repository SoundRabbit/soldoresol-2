const tagName = 'setCanvasSize';

export type SetCanvasSize = {
  tag: typeof tagName;
  width: number;
  height: number;
  devicePixelRatio: number;
};

export const SetCanvasSize = {
  is: (value: unknown): value is SetCanvasSize =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create(props: Omit<SetCanvasSize, 'tag'>): SetCanvasSize {
    return {
      tag: tagName,
      ...props,
    };
  },
};
