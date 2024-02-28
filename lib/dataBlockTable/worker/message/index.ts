import type { GetDataBlock, GetDataBlockResponse } from './getDataBlock';
import { RemoveDataBlock, RemoveDataBlockResponse } from './removeDataBlock';
import type { SetDataBlock, SetDataBlockResponse } from './setDataBlock';
import type { SetPort } from './setPort';

export { GetDataBlock, GetDataBlockResponse } from './getDataBlock';
export { RemoveDataBlock, RemoveDataBlockResponse } from './removeDataBlock';
export { SetDataBlock, SetDataBlockResponse } from './setDataBlock';
export { SetPort } from './setPort';

export type Message =
  | GetDataBlock
  | GetDataBlockResponse
  | RemoveDataBlock
  | RemoveDataBlockResponse
  | SetDataBlock
  | SetDataBlockResponse
  | SetPort;
