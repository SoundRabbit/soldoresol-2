import type { GetDataBlock, GetDataBlockResponse } from './message/getDataBlock';
import { RemoveDataBlock, RemoveDataBlockResponse } from './message/removeDataBlock';
import type { SetDataBlock, SetDataBlockResponse } from './message/setDataBlock';

export { GetDataBlock, GetDataBlockResponse } from './message/getDataBlock';
export { SetDataBlock, SetDataBlockResponse } from './message/setDataBlock';
export { RemoveDataBlock, RemoveDataBlockResponse } from './message/removeDataBlock';

export type Message =
  | GetDataBlock
  | GetDataBlockResponse
  | SetDataBlock
  | SetDataBlockResponse
  | RemoveDataBlock
  | RemoveDataBlockResponse;
