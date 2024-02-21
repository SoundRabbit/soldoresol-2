import * as t from 'io-ts';

const $DataBlockType = t.string;

export type DataBlockType = t.TypeOf<typeof $DataBlockType>;

export const DataBlockType = Object.assign($DataBlockType, {});
