'use client';

import React, { useCallback, useState } from 'react';

import { Flex, FlexProps, Text, TextProps } from '@chakra-ui/react';

import { Button } from '@/component/Button';
import { KeyValue } from '@/component/KeyValue';
import { MouseLeftButtonIcon } from '@/component/icon/MouseLeftButtonIcon';
import { MouseRightButtonIcon } from '@/component/icon/MouseRightButtonIcon';

import { bgColor, txColor } from '@/lib/util/openColor';
import { NonChildren } from '@/lib/util/utilityTypes';

export type BasicUsageProps = NonChildren<FlexProps>;

const Key: React.FC<FlexProps> = (props) => {
  return <Flex justifySelf={'right'} alignItems={'center'} paddingLeft={'1ch'} {...props} />;
};

const Value: React.FC<TextProps> = (props) => {
  return <Text paddingRight={'1ch'} {...props} />;
};

export const BasicUsage: React.FC<BasicUsageProps> = (props) => {
  const [isOpened, setIsOpened] = useState(true);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);
  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <Flex direction={'column'} alignItems={'flex-end'} backgroundColor={bgColor.gray[0].hex()} {...props}>
      {isOpened && (
        <KeyValue
          border={`1px solid ${bgColor.blue[4].hex()}`}
          marginBottom={'0.5em'}
          pointerEvents={'none'}
          userSelect={'none'}
        >
          <Text
            gridColumn={'span 2'}
            textAlign={'center'}
            backgroundColor={bgColor.blue[4].hex()}
            color={txColor.gray[0].hex()}
          >
            Udonariumと同じ操作
          </Text>
          <>
            <Key>
              <MouseLeftButtonIcon />
              <Text fontSize={'0.5em'}>ドラッグ</Text>
            </Key>
            <Value>選択オブジェクトを移動</Value>
          </>
          <>
            <Key>
              <MouseRightButtonIcon />
              <Text fontSize={'0.5em'}>ドラッグ</Text>
            </Key>
            <Value>テーブルを回転</Value>
          </>
          <Value
            gridColumn={'span 2'}
            textAlign={'center'}
            backgroundColor={bgColor.blue[4].hex()}
            color={txColor.gray[0].hex()}
          >
            視界の操作
          </Value>
          <>
            <Key>
              <Text>Shift +</Text>
              <MouseLeftButtonIcon />
              <Text fontSize={'0.5em'}>ドラッグ</Text>
            </Key>
            <Value>視界を移動</Value>
          </>
          <>
            <Key>
              <Text>Ctrl +</Text>
              <MouseLeftButtonIcon />
              <Text fontSize={'0.5em'}>ドラッグ</Text>
            </Key>
            <Value>視界を回転</Value>
          </>
        </KeyValue>
      )}
      <Button
        colorVariant={'blue'}
        styleVariant={'outline'}
        onClick={isOpened ? handleClose : handleOpen}
        fontSize={'0.8em'}
      >
        {isOpened ? '閉じる' : '操作説明'}
      </Button>
    </Flex>
  );
};
