import * as t from 'io-ts';

export const maybe = <T extends t.Mixed>(type: T) => t.union([type, t.undefined]);
