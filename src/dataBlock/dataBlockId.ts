import * as t from 'io-ts';

const $DataBlockId = t.string;

export type DataBlockId = t.TypeOf<typeof $DataBlockId>;

export const DataBlockId = Object.assign(t.string, {
  none: '' as DataBlockId,
});
