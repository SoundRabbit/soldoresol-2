import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

export type ModelessTab = {
  renderTab: (
    modelessId: string,
    tabId: string,
    tabIndex: number,
    selectedTabId: string,
    setSelectedTabId: (tabId: string) => void,
  ) => JSX.Element;
  renderMenu: (modelessId: string, tabId: string) => JSX.Element;
  renderContent: (modelessId: string, tabId: string) => JSX.Element;
};
export type Modeless = {
  tabs: string[];
  size: 'normal' | 'minimized' | 'maximized';
};
export type ModelessTabTable = Record<string, ModelessTab | undefined>;
export type ModelessTable = Record<string, Modeless | undefined>;
export type ModelessIndex = string[];

export const useModelessTabTable = () => {
  const swrKey = 'local/modeless/tabs';

  const { data: maybeTabTable, mutate } = useSWR<ModelessTabTable>(swrKey, null);

  const tabTable = useMemo(() => {
    if (maybeTabTable) {
      return maybeTabTable;
    } else {
      return {};
    }
  }, [maybeTabTable]);

  const add = useCallback(
    (tab: ModelessTab) => {
      const tabId = uuidv4();
      mutate({ ...tabTable, [tabId]: tab });
      return tabId;
    },
    [tabTable, mutate],
  );

  const remove = useCallback(
    (tabId: string) => {
      mutate({ ...tabTable, [tabId]: undefined });
    },
    [tabTable, mutate],
  );

  return { tabTable, add, remove };
};

export const useModelessTab = (tabId: string) => {
  const { tabTable } = useModelessTabTable();
  return tabTable[tabId];
};

export const useModelessTable = () => {
  const modelessSwrKey = 'local/modeless';
  const modelessIndexSwrKey = 'local/modeless/index';

  const { data: maybeModelessTable, mutate } = useSWR<ModelessTable>(modelessSwrKey, null);
  const { data: maybeModelessIndex, mutate: mutateIndex } = useSWR<ModelessIndex>(modelessIndexSwrKey, null);

  const modelessTable = useMemo(() => {
    if (maybeModelessTable) {
      return maybeModelessTable;
    } else {
      return {};
    }
  }, [maybeModelessTable]);

  const modelessIndex = useMemo(() => {
    if (maybeModelessIndex) {
      return maybeModelessIndex;
    } else {
      return [];
    }
  }, [maybeModelessIndex]);

  const open = useCallback(
    (modeless: Modeless) => {
      const modelessId = uuidv4();
      mutate({ ...modelessTable, [modelessId]: modeless });

      if (modeless.size !== 'minimized') {
        modelessIndex.push(modelessId);
        mutateIndex(modelessIndex.concat());
      }
      return modelessId;
    },
    [modelessTable, modelessIndex, mutate, mutateIndex],
  );

  const close = useCallback(
    (modelessId: string) => {
      mutate({ ...modelessTable, [modelessId]: undefined });

      if (modelessIndex.indexOf(modelessId) !== -1) {
        modelessIndex.splice(modelessIndex.indexOf(modelessId), 1);
        mutateIndex(modelessIndex.concat());
      }
    },
    [modelessTable, modelessIndex, mutate, mutateIndex],
  );

  const focus = useCallback(
    (modelessId: string) => {
      if (modelessIndex.indexOf(modelessId) !== -1) {
        modelessIndex.splice(modelessIndex.indexOf(modelessId), 1);
        modelessIndex.push(modelessId);
        mutateIndex(modelessIndex.concat());
      }
    },
    [modelessIndex, mutateIndex],
  );

  const resize = useCallback(
    (modelessId: string, size: Modeless['size']) => {
      const modeless = modelessTable[modelessId];
      if (!modeless) return;

      modeless.size = size;
      mutate({ ...modelessTable, [modelessId]: modeless });

      if (size === 'minimized' && modelessIndex.indexOf(modelessId) !== -1) {
        modelessIndex.splice(modelessIndex.indexOf(modelessId), 1);
        mutateIndex(modelessIndex.concat());
      } else if (size !== 'minimized' && modelessIndex.indexOf(modelessId) === -1) {
        modelessIndex.push(modelessId);
        mutateIndex(modelessIndex.concat());
      }
    },
    [modelessTable, modelessIndex, mutate, mutateIndex],
  );

  const addTab = useCallback(
    (modelessId: string, tabId: string) => {
      const modeless = modelessTable[modelessId];
      if (!modeless) return;

      modeless.tabs.push(tabId);
      modeless.tabs = modeless.tabs.concat();
      mutate({ ...modelessTable, [modelessId]: modeless });
    },
    [modelessTable, mutate],
  );

  const removeTab = useCallback(
    (modelessId: string, tabId: string) => {
      const modeless = modelessTable[modelessId];
      if (!modeless) return;

      if (modeless.tabs.indexOf(tabId) !== -1) {
        modeless.tabs.splice(modeless.tabs.indexOf(tabId), 1);
        modeless.tabs = modeless.tabs.concat();
        mutate({ ...modelessTable, [modelessId]: modeless });
      }
    },
    [modelessTable, mutate],
  );

  const moveTab = useCallback(
    (sourceModelessId: string, targetModelessId: string, tabId: string, tabIndex: number) => {
      if (sourceModelessId === targetModelessId) {
        const modeless = modelessTable[sourceModelessId];
        if (!modeless) return;
        if (modeless.tabs.indexOf(tabId) !== -1) {
          modeless.tabs.splice(modeless.tabs.indexOf(tabId), 1);
          modeless.tabs.splice(tabIndex, 0, tabId);
          modeless.tabs = modeless.tabs.concat();
          mutate({ ...modelessTable, [sourceModelessId]: { ...modeless } });
        }
      } else {
        const sourceModeless = modelessTable[sourceModelessId];
        const targetModeless = modelessTable[targetModelessId];
        if (!sourceModeless || !targetModeless) return;

        if (sourceModeless.tabs.indexOf(tabId) !== -1) {
          sourceModeless.tabs.splice(sourceModeless.tabs.indexOf(tabId), 1);
          targetModeless.tabs.splice(tabIndex, 0, tabId);
          sourceModeless.tabs = sourceModeless.tabs.concat();
          targetModeless.tabs = targetModeless.tabs.concat();
          mutate({
            ...modelessTable,
            [sourceModelessId]: { ...sourceModeless },
            [targetModelessId]: { ...targetModeless },
          });
        }

        if (sourceModeless.tabs.length === 0) {
          close(sourceModelessId);
        }
      }
    },
    [modelessTable, mutate, close],
  );

  return { modelessTable, modelessIndex, open, close, focus, resize, addTab, removeTab, moveTab };
};

export const useModeless = (modelessId: string) => {
  const { modelessTable, close, focus, resize, addTab, removeTab, moveTab } = useModelessTable();

  const modeless = modelessTable[modelessId];

  const closeSelf = useCallback(() => {
    close(modelessId);
  }, [close, modelessId]);

  const focusSelf = useCallback(() => {
    focus(modelessId);
  }, [focus, modelessId]);

  const resizeSelf = useCallback(
    (size: Modeless['size']) => {
      resize(modelessId, size);
    },
    [resize, modelessId],
  );

  const addTabSelf = useCallback(
    (tabId: string) => {
      addTab(modelessId, tabId);
    },
    [addTab, modelessId],
  );

  const removeTabSelf = useCallback(
    (tabId: string) => {
      removeTab(modelessId, tabId);
    },
    [removeTab, modelessId],
  );

  return {
    modeless,
    close: closeSelf,
    focus: focusSelf,
    resize: resizeSelf,
    addTab: addTabSelf,
    removeTab: removeTabSelf,
    moveTab,
  };
};
