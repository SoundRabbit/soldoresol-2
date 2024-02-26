'use client';

import React, { useCallback, useContext, useEffect, useRef } from 'react';

import { Box, Button, Flex, FlexProps, Grid, Stack, Text, chakra } from '@chakra-ui/react';

import { Input } from '@/component/common/Input';
import { KeyValue } from '@/component/common/KeyValue';
import { SidePanel } from '@/component/common/SidePanel';
import { ModelessContainer } from '@/component/modeless/ModelessContainer';
import { RoomContext } from '@/context/RoomContext';
import { DataBlockId } from '@/libs/dataBlock';
import { TableRendererChannel } from '@/libs/tableRenderer';
import { bgColor, txColor } from '@/utils/openColor';

import { SidePanelContent } from './Room/SidePanelContent';
import { useRoom } from './Room/useRoom';

const Canvas = chakra('canvas');

export type RoomProps = Omit<FlexProps, 'children'> & {
  gameDataBlockId: DataBlockId;
  chatDataBlockId: DataBlockId;
};

export const Room: React.FC<RoomProps> = ({ gameDataBlockId, chatDataBlockId, ...props }) => {
  const { openChatModeless, modelessContainerControllerRef } = useRoom(gameDataBlockId, chatDataBlockId);
  const { roomId, renderer } = useContext(RoomContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvasRef.current && canvas && renderer && roomId !== '') {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const offscreen = canvas.transferControlToOffscreen();
        TableRendererChannel.run(renderer, roomId, offscreen);
      }
      canvasRef.current = canvas;
    },
    [roomId, renderer],
  );

  const handleChangeCanvasSize = useCallback(() => {
    if (canvasRef.current && renderer) {
      TableRendererChannel.setCanvasSize(renderer, [canvasRef.current.clientWidth, canvasRef.current.clientHeight]);
    }
  }, [renderer]);

  useEffect(() => {
    window.addEventListener('resize', handleChangeCanvasSize);
    return () => {
      window.removeEventListener('resize', handleChangeCanvasSize);
    };
  }, [handleChangeCanvasSize]);

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
        <Canvas ref={handleCanvasRef} position={'absolute'} width={'100%'} height={'100%'} />
        <ModelessContainer ref={modelessContainerControllerRef} position={'absolute'} width={'100%'} height={'100%'} />
        <SidePanel position={'absolute'} top={0} right={0} bottom={0} panelPposition={'right'}>
          <SidePanelContent gameDataBlockId={gameDataBlockId} backgroundColor={bgColor.gray[0].hex()} />
        </SidePanel>
      </Box>
    </Flex>
  );
};
