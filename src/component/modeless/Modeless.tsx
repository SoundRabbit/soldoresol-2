import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, FlexProps, Grid, IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';

import { useRefState } from '@/hook/useRefState';
import { bgColor, txColor } from '@/utils/openColor';

import { ModelessMenuItems } from './Modeless/ModelessMenuItems';
import {
  ModelessRnd,
  ModelessRndController,
  ModelessRndProps,
  defaultModelessRndController,
} from './Modeless/ModelessRnd';
import { OnMoveTab, parseDataTransfer } from './ModelessTab';

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

    const [tabList, tabListRef, setTabList] = useRefState<ModelessTab[]>([]);

    const [selectedTabId, setSelectedTabId] = useState<string>('');
    const selectedTab = useMemo(() => tabList.find((tab) => tab.tabId === selectedTabId), [tabList, selectedTabId]);

    const tabListLength = useMemo(() => tabList.length, [tabList]);

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
            return modelessRndControllerRef.current.getZIndex();
          },
          setZIndex: (zIndex: number) => {
            modelessRndControllerRef.current.setZIndex(zIndex);
          },
        },
      }),
      [modelessId, onCloseModeless, setTabList, tabListRef],
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
          <Box flexGrow={1} overflow={'hidden'} backgroundColor={bgColor.gray[0].hex()}>
            {selectedTab?.renderContent({ modelessId, tabId: selectedTabId })}
          </Box>
        </Flex>
      </ModelessRnd>
    );
  },
);
Modeless.displayName = 'Modeless';
