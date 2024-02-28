'use client';

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import type { RndDragCallback, RndResizeCallback } from 'react-rnd';
import { Rnd } from 'react-rnd';

import { useRefState } from '@/lib/hook/useRefState';

export type ModelessRndController = {
  getZIndex: () => number;
  setZIndex: (zIndex: number) => void;
  getIsSnapToGrid: () => boolean;
  setIsSnapToGrid: (isSnapToGrid: boolean) => void;
};

export const defaultModelessRndController: ModelessRndController = {
  getZIndex: () => 0,
  setZIndex: () => {},
  getIsSnapToGrid: () => false,
  setIsSnapToGrid: () => {},
};

export type ModelessRndProps = React.ComponentProps<typeof Rnd> & {
  defaultZIndex: number;
  defaultPosition: { x: number; y: number };
  containerRect: { x: number; y: number; width: number; height: number };
};

export const ModelessRnd = forwardRef<ModelessRndController, ModelessRndProps>(
  ({ defaultZIndex, defaultPosition, containerRect, children, ...props }, ref) => {
    const [zIndex, zIndexRef, setZIndex] = useRefState(defaultZIndex);

    const [isSnapToGrid, isSnapToGridRef, setIsSnapToGrid] = useRefState(false);
    const snapGridSize = useMemo<[number, number]>(
      () => [containerRect.width / 100, containerRect.height / 100],
      [containerRect],
    );
    const snapGrid = useMemo<[number, number]>(
      () => (isSnapToGrid ? snapGridSize : [1, 1]),
      [isSnapToGrid, snapGridSize],
    );

    const [curentModelessPosition, setModelessPosition] = useState(defaultPosition);
    const [curentModelessSize, setModelessSize] = useState({ width: 640, height: 480 });
    const [modelessPosition, modelessSize] = useMemo(() => {
      const modelessPosition = curentModelessPosition;
      const modelessSize = curentModelessSize;
      if (modelessSize.width > containerRect.width) {
        modelessSize.width = containerRect.width;
      }
      if (modelessSize.height > containerRect.height) {
        modelessSize.height = containerRect.height;
      }
      if (modelessPosition.x + modelessSize.width > containerRect.x + containerRect.width) {
        modelessPosition.x = containerRect.x + containerRect.width - modelessSize.width;
      }
      if (modelessPosition.y + modelessSize.height > containerRect.y + containerRect.height) {
        modelessPosition.y = containerRect.y + containerRect.height - modelessSize.height;
      }
      return [modelessPosition, modelessSize];
    }, [curentModelessPosition, curentModelessSize, containerRect]);

    const handleMoveModeless = useCallback<RndDragCallback>((_e, position) => {
      setModelessPosition(position);
    }, []);

    const handleResizeModeless = useCallback<RndResizeCallback>((_e, _direction, ref, _delta, position) => {
      setModelessSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      setModelessPosition(position);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        getZIndex: () => zIndexRef.current,
        setZIndex,
        getIsSnapToGrid: () => isSnapToGridRef.current,
        setIsSnapToGrid,
      }),
      [zIndexRef, isSnapToGridRef, setZIndex, setIsSnapToGrid],
    );

    useEffect(() => {
      if (isSnapToGrid) {
        setModelessPosition((position) => {
          return {
            x: Math.round(position.x / snapGridSize[0]) * snapGridSize[0],
            y: Math.round(position.y / snapGridSize[1]) * snapGridSize[1],
          };
        });
        setModelessSize((size) => {
          return {
            width: Math.round(size.width / snapGridSize[0]) * snapGridSize[0],
            height: Math.round(size.height / snapGridSize[1]) * snapGridSize[1],
          };
        });
      }
    }, [isSnapToGrid, snapGridSize]);

    return (
      <Rnd
        onDragStop={handleMoveModeless}
        onResize={handleResizeModeless}
        position={modelessPosition}
        size={modelessSize}
        minWidth={240}
        minHeight={320}
        bounds={'parent'}
        dragHandleClassName={'rnd-drag-handle'}
        resizeHandleStyles={{
          bottom: { cursor: 'ns-resize' },
          bottomLeft: { cursor: 'nesw-resize' },
          bottomRight: { cursor: 'nwse-resize' },
          left: { cursor: 'ew-resize' },
          right: { cursor: 'ew-resize' },
          top: { cursor: 'ns-resize' },
          topLeft: { cursor: 'nwse-resize' },
          topRight: { cursor: 'nesw-resize' },
        }}
        dragGrid={snapGrid}
        resizeGrid={snapGrid}
        style={{ zIndex: zIndex }}
        {...props}
      >
        {children}
      </Rnd>
    );
  },
);

ModelessRnd.displayName = 'ModelessRnd';
