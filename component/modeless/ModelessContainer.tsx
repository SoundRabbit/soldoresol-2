'use client';

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Box, BoxProps } from '@chakra-ui/react';

import { NonChildren } from '@/lib/type/utilityTypes';

import { Modeless, ModelessContent, ModelessController } from './Modeless';
import { parseDataTransfer } from './ModelessTab';

export type ModelessContainerController = {
  openModeless: (contentList: ModelessContent[], option?: { defaultPosition?: { x: number; y: number } }) => void;
};

export type ModelessContainerProps = NonChildren<BoxProps> & {};

type ModelessListItem = {
  modelessId: string;
  defaultZIndex: number;
  defaultPosition: { x: number; y: number };
  defaultContentList: ModelessContent[];
};

type ModelessList = (ModelessListItem | null)[];

type ContainerRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const findModeless = (modelessId: string) => (item: ModelessListItem | null) => {
  return item !== null && item.modelessId === modelessId;
};

const getMaxZIndex = (modelessController: ModelessController): number => {
  const maxZIndex = Object.values(modelessController).reduce((max, { getZIndex }) => {
    return Math.max(max, getZIndex());
  }, 0);

  return maxZIndex;
};

export const ModelessContainer = forwardRef<ModelessContainerController, ModelessContainerProps>(
  ({ ...porps }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerRect, setContainerRectImpl] = useState<ContainerRect>({ x: 0, y: 0, width: 0, height: 0 });
    const containerRectRef = useRef<ContainerRect>(containerRect);
    const setContainerRect = useCallback((rect: ContainerRect | ((prev: ContainerRect) => ContainerRect)) => {
      if (typeof rect === 'function') {
        containerRectRef.current = rect(containerRectRef.current);
      } else {
        containerRectRef.current = rect;
      }
      setContainerRectImpl(containerRectRef.current);
    }, []);

    const [modelessList, setModelessList] = useState<ModelessList>([]);

    const modelessControllerRef = useRef<ModelessController>({});

    const handleMoveTab = useCallback(
      (srcModelessId: string, dstModelessId: string, srcTabId: string, dstTabIndex: number) => {
        const srcModelessController = modelessControllerRef.current[srcModelessId];
        const dstModelessController = modelessControllerRef.current[dstModelessId];
        if (srcModelessId === dstModelessId && srcModelessController) {
          srcModelessController.moveTab(srcTabId, dstTabIndex);
        } else if (srcModelessController && dstModelessController) {
          const [srcTab, _srcTabIndex] = srcModelessController.removeTab(srcTabId, true);
          if (!srcTab) return;
          dstModelessController.insertTab(srcTab, dstTabIndex);
        }
      },
      [],
    );

    const handleOpenMoodeless = useCallback(
      (contentList: ModelessContent[], option?: { defaultPosition?: { x: number; y: number } }) => {
        if (contentList.length === 0) return;

        const newModelessId = uuidv4();
        setModelessList((modelessList) => {
          const newModelessList = [...modelessList];
          const newZIndex = getMaxZIndex(modelessControllerRef.current) + 1;
          const position = option?.defaultPosition || { x: 160, y: 160 };
          position.x += (newZIndex % 10) * 20;
          position.y += (newZIndex % 10) * 20;
          newModelessList.push({
            modelessId: newModelessId,
            defaultZIndex: newZIndex,
            defaultPosition: position,
            defaultContentList: contentList,
          });
          return newModelessList;
        });
      },
      [],
    );

    const handleFocusModeless = useCallback((modelessId: string) => {
      const targetModelessController = modelessControllerRef.current[modelessId];
      if (!targetModelessController) return;

      const targetZIndex = targetModelessController.getZIndex();
      const maxZIndex = getMaxZIndex(modelessControllerRef.current);
      if (targetZIndex === maxZIndex) return;

      targetModelessController.setZIndex(maxZIndex + 1);
    }, []);

    const handleCloseModeless = useCallback((modelessId: string) => {
      setModelessList((modelessList) => {
        const modelessListIndex = modelessList.findIndex(findModeless(modelessId));
        if (modelessListIndex === -1) return modelessList;

        const newModelessList = [...modelessList];
        newModelessList[modelessListIndex] = null;
        delete modelessControllerRef.current[modelessId];

        return newModelessList;
      });
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        const srcDataTransfer = parseDataTransfer(e);
        if (srcDataTransfer) {
          e.preventDefault();
          e.stopPropagation();
          let srcTab: ModelessContent | undefined = undefined;
          const srcModelessController = modelessControllerRef.current[srcDataTransfer.modelessId];
          if (srcModelessController) {
            srcTab = srcModelessController.removeTab(srcDataTransfer.contentId, true)[0];
          }
          if (srcTab) {
            const defaultPosition = {
              x: e.clientX - containerRectRef.current.x - 32,
              y: e.clientY - containerRectRef.current.y - 16,
            };
            handleOpenMoodeless([srcTab], { defaultPosition });
          }
        }
      },
      [handleOpenMoodeless],
    );

    const containerRefCallback = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (node) {
          const rect = node.getBoundingClientRect();
          setContainerRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        }
      },
      [setContainerRect],
    );

    const modelessControllerRefCallback = useCallback((controller: ModelessController | null) => {
      if (!controller) return;
      Object.assign(modelessControllerRef.current, controller);
    }, []);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setContainerRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [setContainerRect]);

    useImperativeHandle(ref, () => ({
      openModeless: (tabList, option) => {
        handleOpenMoodeless(tabList, option);
      },
    }));

    return (
      <Box
        ref={containerRefCallback}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        width={'100%'}
        height={'100%'}
        position={'relative'}
        zIndex={0}
        {...porps}
      >
        {modelessList.map((maybeModelessId, index) => {
          if (!maybeModelessId) return <Box key={`empty-${index}`} />;
          const { modelessId, defaultPosition, defaultZIndex, defaultContentList } = maybeModelessId;

          return (
            <Modeless
              ref={modelessControllerRefCallback}
              key={modelessId}
              modelessId={modelessId}
              onMoveTab={handleMoveTab}
              onFocusModeless={handleFocusModeless}
              onCloseModeless={handleCloseModeless}
              containerRect={containerRect}
              containerElement={containerRef.current}
              defaultPosition={defaultPosition}
              defaultZIndex={defaultZIndex}
              defaultContentList={defaultContentList}
            />
          );
        })}
      </Box>
    );
  },
);

ModelessContainer.displayName = 'ModelessContainer';
