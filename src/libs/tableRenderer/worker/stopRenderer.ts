const tagName = 'stopRenderer';

export type StopRenderer = {
  tag: typeof tagName;
};

export const StopRenderer = {
  is: (value: unknown): value is StopRenderer =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create(props: Omit<StopRenderer, 'tag'>): StopRenderer {
    return {
      tag: tagName,
      ...props,
    };
  },
};
