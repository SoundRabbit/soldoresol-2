import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  FlexProps,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { RndDragCallback, RndResizeCallback } from 'react-rnd';
import { Rnd } from 'react-rnd';
import { OnMoveTab, parseDataTransfer } from '@/component/atom/ModelessTab';
import { CheckBoxIcon } from '@/component/atom/icon/CheckBoxIcon';
import { MouseLeftButtonIcon } from '@/component/atom/icon/MouseLeftButtonIcon';
import { openColor } from '@/util/openColor';

export type ModelessTabProps = {
  modelessId: string;
  tabId: string;
  tabIndex: number;
  selectedTabId: string;
  setSelectedTabId: (tabId: string) => void;
  onMoveTab: OnMoveTab;
};

export type ModelessMenuProps = {
  modelessId: string;
  tabId: string;
};

export type ModelessContentProps = {
  modelessId: string;
  tabId: string;
};

export type ModelessTab = {
  tabId: string;
  renderTab: (props: ModelessTabProps) => JSX.Element;
  renderMenu: (props: ModelessMenuProps) => JSX.Element;
  renderContent: (props: ModelessContentProps) => JSX.Element;
};

export type ModelessController = {
  [modelessId: string]: {
    removeTab: (tabId: string, closeSelf?: boolean) => [ModelessTab | undefined, number];
    insertTab: (tab: ModelessTab, index?: number) => void;
    moveTab: (srcTabId: string, dstTabIndex: number) => void;
    pushTabList: (tabList: ModelessTab[]) => void;
    getZIndex: () => number;
    setZIndex: (zIndex: number) => void;
  };
};

export type ModelessProps = FlexProps & {
  modelessId: string;
  defaultPosition: { x: number; y: number };
  defaultZIndex: number;
  containerRect: { x: number; y: number; width: number; height: number };
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
    const onCloseMenuRef = useRef<() => void>(() => {});

    const [zIndex, setZIndexImpl] = useState(defaultZIndex);
    const zIndexRef = useRef(zIndex);
    const setZIndex = useCallback((zIndex: number | ((prev: number) => number)) => {
      if (typeof zIndex === 'function') {
        zIndexRef.current = zIndex(zIndexRef.current);
      } else {
        zIndexRef.current = zIndex;
      }
      setZIndexImpl(zIndexRef.current);
    }, []);

    const [isSnapToGrid, setIsSnapToGrid] = useState(false);
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

    const [tabList, setTabListImpl] = useState<ModelessTab[]>([]);
    const tabListRef = useRef<ModelessTab[]>(tabList);
    const setTabList = useCallback((tabList: ModelessTab[] | ((prev: ModelessTab[]) => ModelessTab[])) => {
      if (typeof tabList === 'function') {
        tabListRef.current = tabList(tabListRef.current);
      } else {
        tabListRef.current = tabList;
      }
      setTabListImpl(tabListRef.current);
    }, []);

    const [selectedTabId, setSelectedTabId] = useState<string>('');
    const selectedTab = useMemo(() => tabList.find((tab) => tab.tabId === selectedTabId), [tabList, selectedTabId]);

    const handleMoveModeless = useCallback<RndDragCallback>((_e, position) => {
      setModelessPosition(position);
    }, []);

    const handleResizeModeless = useCallback<RndResizeCallback>((_e, _direction, ref, _delta, position) => {
      setModelessSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      setModelessPosition(position);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }, []);

    const tabListLength = useMemo(() => tabList.length, [tabList]);
    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        const srcDataTransfer = parseDataTransfer(e);
        if (srcDataTransfer) {
          e.preventDefault();
          e.stopPropagation();
          onMoveTab(srcDataTransfer.modelessId, modelessId, srcDataTransfer.tabId, tabListLength);
        }
      },
      [modelessId, onMoveTab, tabListLength],
    );

    const handleCloseTab = useCallback(
      (tabId: string) => {
        setTabList((tabList) => {
          const removeTabIndex = tabList.findIndex((tab) => tab.tabId === tabId);
          if (removeTabIndex !== -1) {
            const newTabList = tabList.filter((tab) => tab.tabId !== tabId);
            if (newTabList.length === 0) {
              onCloseModeless(modelessId);
            } else {
              setSelectedTabId((selectedTabId) => {
                if (selectedTabId === tabId) {
                  return newTabList.at(removeTabIndex)?.tabId || newTabList[removeTabIndex - 1].tabId;
                } else {
                  return selectedTabId;
                }
              });
            }
            return newTabList;
          } else {
            return tabList;
          }
        });
      },
      [modelessId, onCloseModeless, setTabList],
    );

    const handleCloseSelectedTab = useCallback(() => {
      handleCloseTab(selectedTabId);
    }, [handleCloseTab, selectedTabId]);

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

    const handleToggleSnapToGrid = useCallback(() => {
      setIsSnapToGrid((isSnapToGrid) => !isSnapToGrid);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        [modelessId]: {
          removeTab: (tabId: string) => {
            const removeTabIndex = tabListRef.current.findIndex((tab) => tab.tabId === tabId);
            if (removeTabIndex === -1) return [undefined, -1];
            const removedTab = tabListRef.current[removeTabIndex];
            const newTabList = tabListRef.current.filter((tab) => tab.tabId !== tabId);
            if (newTabList.length === 0) {
              onCloseModeless(modelessId);
            } else {
              setSelectedTabId((selectedTabId) => {
                if (selectedTabId === tabId) {
                  return newTabList.at(removeTabIndex)?.tabId || newTabList[removeTabIndex - 1].tabId;
                } else {
                  return selectedTabId;
                }
              });
            }
            setTabList(newTabList);
            return [removedTab, removeTabIndex];
          },
          insertTab: (tab: ModelessTab, index?: number) => {
            setTabList((tabList) => {
              const newTabList = [...tabList];
              index = index === undefined ? newTabList.length : index;
              newTabList.splice(index, 0, tab);
              if (newTabList.length === 1) {
                setSelectedTabId(tab.tabId);
              }
              return newTabList;
            });
          },
          moveTab: (srcTabId: string, dstTabIndex: number) => {
            setTabList((tabList) => {
              const srcTabIndex = tabList.findIndex((tab) => tab.tabId === srcTabId);
              if (srcTabIndex === -1) return tabList;

              const srcTab = tabList[srcTabIndex];
              const newTabList = tabList.filter((tab) => tab.tabId !== srcTabId);
              console.log(srcTabIndex, dstTabIndex);
              if (dstTabIndex === srcTabIndex) {
                newTabList.splice(dstTabIndex - 1, 0, srcTab);
              } else {
                newTabList.splice(dstTabIndex, 0, srcTab);
              }
              return newTabList;
            });
          },
          pushTabList: (pushTabList: ModelessTab[]) => {
            if (pushTabList.length === 0) return;
            if (tabListRef.current.length === 0) {
              setSelectedTabId(pushTabList[0].tabId);
            }
            setTabList((prevTabList) => {
              const newTabList = [...prevTabList, ...pushTabList];
              return newTabList;
            });
          },
          getZIndex: () => {
            return zIndexRef.current;
          },
          setZIndex: (zIndex: number) => {
            setZIndex(zIndex);
          },
        },
      }),
      [modelessId, onCloseModeless, setZIndex, setTabList],
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
        onMouseDownCapture={handleFocusSelf}
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
        resizeHandleComponent={{}}
        dragGrid={snapGrid}
        resizeGrid={snapGrid}
        style={{ zIndex: zIndex }}
      >
        <Flex
          flexDirection={'column'}
          width={'100%'}
          height={'100%'}
          border={`1px solid ${openColor.gray[9].hex()}`}
          {...props}
        >
          <Flex
            className={'rnd-drag-handle'}
            paddingLeft={'0.5ch'}
            backgroundColor={openColor.gray[9].hex()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
              {tabList.map((tab, tabIndex) =>
                tab.renderTab({
                  modelessId,
                  tabId: tab.tabId,
                  tabIndex,
                  selectedTabId,
                  setSelectedTabId,
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
                      icon={<HamburgerIcon color={openColor.gray[0].hex()} />}
                      height={'2.5rem'}
                      data-element-type={'menu-button'}
                    />
                    <MenuList position={'absolute'} right={'-2.5rem'} fontSize={'0.8rem'} paddingY={'0.5em'}>
                      <MenuGroup title={'ウィンドウ / タブ'} marginTop={'0.5em'} marginBottom={'0'}>
                        <Flex
                          as={MenuItem}
                          closeOnSelect={false}
                          onClick={handleToggleSnapToGrid}
                          paddingY={'0.5em'}
                          justifyContent={'space-between'}
                        >
                          <Text>グリッドにスナップ</Text>
                          {isSnapToGrid && (
                            <CheckBoxIcon color={openColor.gray[0].hex()} backgroundColor={openColor.blue[9].hex()} />
                          )}
                        </Flex>
                        <MenuItem onClick={handleCloseSelectedTab} paddingY={'0.5em'}>
                          タブを閉じる
                        </MenuItem>
                        <Flex
                          as={MenuItem}
                          closeOnSelect={false}
                          onClick={handleCloseSelfByMenu}
                          paddingY={'0.5em'}
                          justifyContent={'space-between'}
                        >
                          <Text>ウィンドウを閉じる </Text>
                          <Flex alignItems={'center'}>
                            <Text>Shift+</Text>
                            <MouseLeftButtonIcon />
                          </Flex>
                        </Flex>
                      </MenuGroup>
                      {selectedTab?.renderMenu({
                        modelessId,
                        tabId: selectedTabId,
                      })}
                    </MenuList>
                  </>
                );
              }}
            </Menu>
          </Flex>
          <Box flexGrow={1} overflow={'hidden'} backgroundColor={openColor.gray[0].hex()}>
            {selectedTab?.renderContent({ modelessId, tabId: selectedTabId })}
          </Box>
        </Flex>
      </Rnd>
    );
  },
);
Modeless.displayName = 'Modeless';
