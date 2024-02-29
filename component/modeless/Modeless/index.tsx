'use client';

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, FlexProps, Grid, IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';

import { useRefState } from '@/lib/hook/useRefState';
import { bgColor, txColor } from '@/lib/util/openColor';

import { OnMoveTab, parseDataTransfer } from '../ModelessTab';

import { ModelessMenuItems } from './ModelessMenuItems';
import { ModelessRnd, ModelessRndController, ModelessRndProps, defaultModelessRndController } from './ModelessRnd';

export type ModelessContentTabProps = {
  modelessId: string;
  contentId: string;
  tabIndex: number;
  isSelected: boolean;
  onSelectTab: (contentId: string) => void;
  onMoveTab: OnMoveTab;
};

export type ModelessContentMenuProps = {
  modelessId: string;
  contentId: string;
};

export type ModelessContentPanelProps = {
  modelessId: string;
  contentId: string;
};

export type ModelessContent = {
  contentId: string;
  renderTab: (props: ModelessContentTabProps) => JSX.Element;
  renderMenu: (props: ModelessContentMenuProps) => JSX.Element;
  renderPanel: (props: ModelessContentPanelProps) => JSX.Element;
};

export type ModelessController = {
  [modelessId: string]: {
    removeTab: (contentId: string, closeSelf?: boolean) => [ModelessContent | undefined, number];
    insertTab: (content: ModelessContent, index?: number) => void;
    moveTab: (srcContentId: string, dstTabIndex: number) => void;
    pushTabList: (contentList: ModelessContent[]) => void;
    getZIndex: () => number;
    setZIndex: (zIndex: number) => void;
  };
};

export type ModelessProps = FlexProps & {
  modelessId: string;
  defaultPosition: { x: number; y: number };
  defaultZIndex: number;
  containerRect: ModelessRndProps['containerRect'];
  onMoveTab: OnMoveTab;
  onFocusModeless: (modelessId: string) => void;
  onCloseModeless: (modelessId: string) => void;
};

export const Modeless = forwardRef<ModelessController, ModelessProps>(
  (
    {
      modelessId,
      defaultPosition,
      defaultZIndex,
      containerRect,
      onMoveTab,
      onFocusModeless,
      onCloseModeless,
      ...props
    },
    ref,
  ) => {
    const modelessRndControllerRef = useRef<ModelessRndController>(defaultModelessRndController);
    const onCloseMenuRef = useRef<() => void>(() => {});

    const [isSnapToGrid, setIsSnapToGrid] = useState<boolean>(false);

    const [contentList, contentListRef, setContentList] = useRefState<ModelessContent[]>([]);

    const [selectedContentId, selectedContentIdRef, setSelectedContentId] = useRefState<string>('');
    const selectedContent = useMemo(
      () => contentList.find((content) => content.contentId === selectedContentId),
      [contentList, selectedContentId],
    );

    const tabListLength = useMemo(() => contentList.length, [contentList]);

    const handleToggleSnapToGrid = useCallback(() => {
      setIsSnapToGrid((prev) => {
        return !prev;
      });
    }, []);
    useEffect(() => {
      modelessRndControllerRef.current.setIsSnapToGrid(isSnapToGrid);
    }, [isSnapToGrid]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        const srcDataTransfer = parseDataTransfer(e);
        if (srcDataTransfer) {
          e.preventDefault();
          e.stopPropagation();
          onMoveTab(srcDataTransfer.modelessId, modelessId, srcDataTransfer.contentId, tabListLength);
        }
      },
      [onMoveTab, tabListLength, modelessId],
    );

    const handleCloseTab = useCallback(
      (tabId: string) => {
        const removingTabIndex = contentListRef.current.findIndex((content) => content.contentId === tabId);
        if (removingTabIndex === -1) return;

        const newContentList = contentListRef.current.filter((content) => content.contentId !== tabId);
        if (newContentList.length === 0) {
          onCloseModeless(modelessId);
        } else {
          setSelectedContentId((selectedContentId) => {
            if (selectedContentId === tabId) {
              return newContentList.at(removingTabIndex)?.contentId || newContentList[removingTabIndex - 1].contentId;
            } else {
              return selectedContentId;
            }
          });
        }

        setContentList(newContentList);
      },
      [onCloseModeless, setContentList, setSelectedContentId, contentListRef, modelessId],
    );

    const handleCloseSelectedTab = useCallback(() => {
      handleCloseTab(selectedContentIdRef.current);
    }, [handleCloseTab, selectedContentIdRef]);

    const handleFocusSelf = useCallback(() => {
      onFocusModeless(modelessId);
    }, [onFocusModeless, modelessId]);

    const handleCloseSelfByMenu = useCallback(
      (e: React.MouseEvent) => {
        if (e.shiftKey) {
          onCloseMenuRef.current();
          onCloseModeless(modelessId);
        }
      },
      [onCloseModeless, modelessId],
    );

    useImperativeHandle(
      ref,
      () => ({
        [modelessId]: {
          removeTab: (contentId: string) => {
            const removingTabIndex = contentListRef.current.findIndex((content) => content.contentId === contentId);
            if (removingTabIndex === -1) return [undefined, -1];
            const removingContent = contentListRef.current[removingTabIndex];
            const newContentList = contentListRef.current.filter((content) => content.contentId !== contentId);
            if (newContentList.length === 0) {
              onCloseModeless(modelessId);
            } else {
              setSelectedContentId((selectedContentId) => {
                if (selectedContentId === contentId) {
                  return (
                    newContentList.at(removingTabIndex)?.contentId || newContentList[removingTabIndex - 1].contentId
                  );
                } else {
                  return selectedContentId;
                }
              });
            }
            setContentList(newContentList);
            return [removingContent, removingTabIndex];
          },
          insertTab: (content: ModelessContent, index?: number) => {
            setContentList((contentList) => {
              const newContentList = [...contentList];
              index = index === undefined ? newContentList.length : index;
              newContentList.splice(index, 0, content);
              if (newContentList.length === 1) {
                setSelectedContentId(content.contentId);
              }
              return newContentList;
            });
          },
          moveTab: (srcContentId: string, dstTabIndex: number) => {
            setContentList((contentList) => {
              const srcTabIndex = contentList.findIndex((content) => content.contentId === srcContentId);
              if (srcTabIndex === -1) return contentList;

              const srcContent = contentList[srcTabIndex];
              const newContentList = contentList.filter((content) => content.contentId !== srcContentId);
              if (dstTabIndex === srcTabIndex) {
                newContentList.splice(dstTabIndex - 1, 0, srcContent);
              } else {
                newContentList.splice(dstTabIndex, 0, srcContent);
              }
              return newContentList;
            });
          },
          pushTabList: (pushingContentList: ModelessContent[]) => {
            setContentList((prevContentList) => {
              if (pushingContentList.length === 0) {
                return prevContentList;
              } else if (prevContentList.length === 0) {
                setSelectedContentId(pushingContentList[0].contentId);
                return [...pushingContentList];
              } else {
                const newTabList = [...prevContentList, ...pushingContentList];
                return newTabList;
              }
            });
          },
          getZIndex: () => {
            return modelessRndControllerRef.current.getZIndex();
          },
          setZIndex: (zIndex: number) => {
            modelessRndControllerRef.current.setZIndex(zIndex);
          },
        },
      }),
      [onCloseModeless, modelessId, setContentList, setSelectedContentId, contentListRef, modelessRndControllerRef],
    );

    return (
      <ModelessRnd
        ref={modelessRndControllerRef}
        defaultZIndex={defaultZIndex}
        defaultPosition={defaultPosition}
        containerRect={containerRect}
      >
        <Flex
          onMouseDownCapture={handleFocusSelf}
          flexDirection={'column'}
          width={'100%'}
          height={'100%'}
          border={`1px solid ${bgColor.gray[4].hex()}`}
          {...props}
        >
          <Flex
            className={'rnd-drag-handle'}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            overflow={'visible'}
            paddingLeft={'0.5ch'}
            backgroundColor={bgColor.gray[4].hex()}
          >
            <Grid
              paddingRight={'4ch'}
              fontSize={'0.8rem'}
              flexGrow={1}
              gridTemplateColumns={'repeat(auto-fill, minmax(20ch, 1fr))'}
              gridAutoRows={'2.5rem'}
              gridAutoFlow={'row'}
              alignItems={'end'}
            >
              {contentList.map((content, tabIndex) =>
                content.renderTab({
                  modelessId,
                  contentId: content.contentId,
                  tabIndex,
                  isSelected: content.contentId === selectedContentId,
                  onSelectTab: setSelectedContentId,
                  onMoveTab,
                }),
              )}
            </Grid>
            <Menu>
              {({ onClose }) => {
                onCloseMenuRef.current = onClose;
                return (
                  <>
                    <MenuButton
                      as={IconButton}
                      variant='unstyled'
                      icon={<HamburgerIcon color={txColor.gray[0].hex()} />}
                      height={'2.5rem'}
                      data-element-type={'menu-button'}
                    />
                    <MenuList position={'absolute'} right={'-2.5rem'} fontSize={'0.8rem'} paddingY={'0.5em'}>
                      <ModelessMenuItems
                        isSnapToGrid={isSnapToGrid}
                        onCloseTab={handleCloseSelectedTab}
                        onCloseModeless={handleCloseSelfByMenu}
                        onToggleSnapToGrid={handleToggleSnapToGrid}
                        marginTop={'0.5em'}
                        marginBottom={'0'}
                      />
                      {selectedContent?.renderMenu({
                        modelessId,
                        contentId: selectedContentId,
                      })}
                    </MenuList>
                  </>
                );
              }}
            </Menu>
          </Flex>
          <Box flexGrow={1} overflow={'hidden'} backgroundColor={bgColor.gray[0].hex()}>
            {selectedContent?.renderPanel({ modelessId, contentId: selectedContentId })}
          </Box>
        </Flex>
      </ModelessRnd>
    );
  },
);
Modeless.displayName = 'Modeless';
