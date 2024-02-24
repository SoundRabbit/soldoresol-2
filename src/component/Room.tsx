import { Box, Button, Flex, FlexProps, Grid, Stack, Text } from '@chakra-ui/react';

import { Input } from '@/component/common/Input';
import { KeyValue } from '@/component/common/KeyValue';
import { SidePanel } from '@/component/common/SidePanel';
import { ModelessContainer } from '@/component/modeless/ModelessContainer';
import { DataBlockId } from '@/dataBlock';
import { bgColor, txColor } from '@/util/openColor';

import { SidePanelContent } from './Room/SidePanelContent';
import { useRoom } from './Room/useRoom';

export type RoomProps = Omit<FlexProps, 'children'> & {
  roomId: string;
  gameDataBlockId: DataBlockId;
  chatDataBlockId: DataBlockId;
};

export const Room: React.FC<RoomProps> = ({ roomId, gameDataBlockId, chatDataBlockId, ...props }) => {
  const { openChatModeless, modelessContainerControllerRef } = useRoom(gameDataBlockId, chatDataBlockId);
  return (
    <Flex direction={'column'} width={'100%'} height={'100%'} {...props}>
      <Grid
        gridTemplateColumns={'1fr 1fr'}
        gridTemplateRows={'max-content max-content'}
        padding={'1ch'}
        rowGap={'1ch'}
        backgroundColor={bgColor.gray[4].hex()}
        color={txColor.gray[0].hex()}
      >
        <KeyValue>
          <Text>ルームID</Text>
          <Input isReadOnly={true} value={roomId} />
        </KeyValue>
        <Box />
        <Stack direction='row'>
          <Button onClick={openChatModeless}>チャット</Button>
        </Stack>
      </Grid>
      <Box position={'relative'} flexGrow={1}>
        <ModelessContainer ref={modelessContainerControllerRef} />
        <SidePanel position={'absolute'} top={0} right={0} bottom={0} panelPposition={'right'}>
          <SidePanelContent gameDataBlockId={gameDataBlockId} />
        </SidePanel>
      </Box>
    </Flex>
  );
};
