import type { GetDataBlock, GetDataBlockResponse } from './message/getDataBlock';
import { RemoveDataBlock, RemoveDataBlockResponse } from './message/removeDataBlock';
import type { SetDataBlock, SetDataBlockResponse } from './message/setDataBlock';
import type { SetPort } from './message/setPort';

export { GetDataBlock, GetDataBlockResponse } from './message/getDataBlock';
export { RemoveDataBlock, RemoveDataBlockResponse } from './message/removeDataBlock';
export { SetDataBlock, SetDataBlockResponse } from './message/setDataBlock';
export { SetPort } from './message/setPort';

export type Message =
  | GetDataBlock
  | GetDataBlockResponse
  | RemoveDataBlock
  | RemoveDataBlockResponse
  | SetDataBlock
  | SetDataBlockResponse
  | SetPort;
