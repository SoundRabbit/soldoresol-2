const tagName = 'setDataBlockTablePort';

export type SetDataBlockTablePort = {
  tag: typeof tagName;
  port: MessagePort;
};

export const SetDataBlockTablePort = {
  is: (value: unknown): value is SetDataBlockTablePort =>
    value instanceof Object && (value as SetDataBlockTablePort).tag === tagName,

  create: (props: Omit<SetDataBlockTablePort, 'tag'>): SetDataBlockTablePort => {
    return { ...props, tag: tagName };
  },
};
