'use client';

import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/component/atom/Input';
import { KeyValue } from '@/component/atom/KeyValue';
import { ModelessContainer } from '@/component/organism/modelessContainer';
import { ChatModelessContent, ChatModelessMenu, ChatModelessTab } from '@/component/organism/modelessTab/chat';
import { Modeless, useModelessTabTable, useModelessTable } from '@/hook/useTabModeless';
import { openColor } from '@/util/openColor';

export const Page = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { add: createNewTab } = useModelessTabTable();
  const { open: openModeless } = useModelessTable();

  const createNewModeless = useCallback(() => {
    const chatModelessTab = {
      renderTab: (
        modelessId: string,
        tabId: string,
        tabIndex: number,
        selectedTabId: string,
        setSelectedTabId: (tabId: string) => void,
      ) => {
        return (
          <ChatModelessTab
            key={`${modelessId}/${tabId}`}
            modelessId={modelessId}
            tabId={tabId}
            tabIndex={tabIndex}
            selectedTabId={selectedTabId}
            setSelectedTabId={setSelectedTabId}
          />
        );
      },
      renderMenu: (modelessId: string, tabId: string) => {
        return <ChatModelessMenu key={`${modelessId}/${tabId}`} />;
      },
      renderContent: (modelessId: string, tabId: string) => {
        return <ChatModelessContent key={`${modelessId}/${tabId}`} />;
      },
    };
    const tabId = createNewTab(chatModelessTab);
    const modeless: Modeless = {
      tabs: [tabId],
      size: 'normal',
    };
    openModeless(modeless);
  }, [createNewTab, openModeless]);

  return (
    <Flex direction={'column'}>
      <Grid
        onClick={createNewModeless}
        gridTemplateColumns={'1fr 1fr'}
        gridTemplateRows={'max-content max-content'}
        padding={'1ch'}
        rowGap={'1ch'}
        backgroundColor={openColor.gray[8].hex()}
        color={openColor.gray[0].hex()}
      >
        <KeyValue>
          <Text>ルームID</Text>
          <Input isReadOnly={true} value={roomId} />
        </KeyValue>
      </Grid>
      <Box>
        <ModelessContainer />
      </Box>
    </Flex>
  );
};

export default Page;
