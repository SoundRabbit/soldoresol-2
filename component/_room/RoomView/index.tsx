'use client';

import React, { useContext } from 'react';

import { Box, Button, Flex, FlexProps, Grid, Stack, Text, chakra } from '@chakra-ui/react';

import { Input } from '@/component/Input';
import { KeyValue } from '@/component/KeyValue';
import { SidePanel } from '@/component/SidePanel';
import { RoomContext } from '@/component/context/RoomContext';
import { ModelessContainer } from '@/component/modeless/ModelessContainer';

import { DataBlockId } from '@/lib/dataBlock';
import { bgColor, txColor } from '@/lib/util/openColor';

import { BasicUsage } from './BasicUsage';
import { SidePanelContent } from './SidePanelContent';
import { useCanvas } from './useCanvas';
import { useRoom } from './useRoom';

const Canvas = chakra('canvas');

export type RoomViewProps = Omit<FlexProps, 'children'> & {
  gameDataBlockId: DataBlockId;
  chatDataBlockId: DataBlockId;
};

export const RoomView: React.FC<RoomViewProps> = ({ gameDataBlockId, chatDataBlockId, ...props }) => {
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
