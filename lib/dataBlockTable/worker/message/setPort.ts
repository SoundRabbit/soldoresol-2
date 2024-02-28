const tagName = 'setPort';

export type SetPort = {
  tag: typeof tagName;
  port: MessagePort;
};

export const SetPort = {
  is: (value: unknown): value is SetPort => value instanceof Object && (value as SetPort).tag === tagName,

  create: (props: Omit<SetPort, 'tag'>): SetPort => {
    return { ...props, tag: tagName };
  },
};
