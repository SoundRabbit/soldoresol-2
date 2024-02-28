'use client';

import React, { useContext } from 'react';

import { Box, Button, Flex, FlexProps, Grid, Stack, Text, chakra } from '@chakra-ui/react';

import { Input } from '@/component/common/Input';
import { KeyValue } from '@/component/common/KeyValue';
import { SidePanel } from '@/component/common/SidePanel';
import { ModelessContainer } from '@/component/modeless/ModelessContainer';
import { RoomContext } from '@/context/RoomContext';
import { DataBlockId } from '@/libs/dataBlock';
import { bgColor, txColor } from '@/utils/openColor';

import { BasicUsage } from './Room/BasicUsage';
import { SidePanelContent } from './Room/SidePanelContent';
import { useCanvas } from './Room/useCanvas';
import { useRoom } from './Room/useRoom';

const Canvas = chakra('canvas');

export type RoomProps = Omit<FlexProps, 'children'> & {
  gameDataBlockId: DataBlockId;
  chatDataBlockId: DataBlockId;
};

export const Room: React.FC<RoomProps> = ({ gameDataBlockId, chatDataBlockId, ...props }) => {
  const { openChatModeless, modelessContainerControllerRef } = useRoom(gameDataBlockId, chatDataBlockId);
  const roomContext = useContext(RoomContext);
  const { handleCanvasRef, handleMouseEvent } = useCanvas();

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
          <Input isReadOnly={true} value={roomContext?.roomId ?? ''} />
        </KeyValue>
        <Box />
        <Stack direction='row'>
          <Button onClick={openChatModeless}>チャット</Button>
        </Stack>
      </Grid>
      <Box position={'relative'} flexGrow={1}>
        <Canvas ref={handleCanvasRef} position={'absolute'} width={'100%'} height={'100%'} />
        <ModelessContainer
          ref={modelessContainerControllerRef}
          onMouseMove={handleMouseEvent}
          onMouseUp={handleMouseEvent}
          onMouseDown={handleMouseEvent}
          position={'absolute'}
          width={'100%'}
          height={'100%'}
        />
        <SidePanel position={'absolute'} top={0} right={0} bottom={0} panelPposition={'right'}>
          {(isOpened) => {
            return (
              <>
                {isOpened && (
                  <SidePanelContent gameDataBlockId={gameDataBlockId} backgroundColor={bgColor.gray[0].hex()} />
                )}
                <BasicUsage position={'absolute'} bottom={'1em'} right={'calc(100% + 1em)'} width={'max-content'} />
              </>
            );
          }}
        </SidePanel>
      </Box>
    </Flex>
  );
};

export default Room;
