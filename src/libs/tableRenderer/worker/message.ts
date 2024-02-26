import { RunRenderer } from './message/runRenderer';
import { SetCanvasSize } from './message/setCanvasSize';
import { SetDataBlockTablePort } from './message/setDataBlockTablePort';
import { SetTableDataBlockId } from './message/setTableDataBlockId';
import { StopRenderer } from './message/stopRenderer';

export { RunRenderer } from './message/runRenderer';
export { SetCanvasSize } from './message/setCanvasSize';
export { SetDataBlockTablePort } from './message/setDataBlockTablePort';
export { SetTableDataBlockId } from './message/setTableDataBlockId';
export { StopRenderer } from './message/stopRenderer';

export type Message = RunRenderer | SetCanvasSize | SetDataBlockTablePort | SetTableDataBlockId | StopRenderer;
