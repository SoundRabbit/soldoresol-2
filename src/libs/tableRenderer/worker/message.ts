import { RunRenderer } from './runRenderer';
import { SetCanvasSize } from './setCanvasSize';
import { SetTableDataBlockId } from './setTableDataBlockId';
import { StopRenderer } from './stopRenderer';

export { RunRenderer } from './runRenderer';
export { SetCanvasSize } from './setCanvasSize';
export { SetTableDataBlockId } from './setTableDataBlockId';
export { StopRenderer } from './stopRenderer';

export type Message = RunRenderer | SetCanvasSize | SetTableDataBlockId | StopRenderer;
