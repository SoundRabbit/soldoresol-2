const tagName = 'runRenderer';

export type RunRenderer = {
  tag: typeof tagName;
  roomId: string;
  canvas: OffscreenCanvas;
};

export const RunRenderer = {
  is: (value: unknown): value is RunRenderer =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create(props: Omit<RunRenderer, 'tag'>): RunRenderer {
    return {
      tag: tagName,
      ...props,
    };
  },
};
