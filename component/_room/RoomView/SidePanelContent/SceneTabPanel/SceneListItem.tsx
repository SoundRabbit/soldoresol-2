'use client';

import React from 'react';

import { Flex, FlexProps } from '@chakra-ui/react';

import { DataBlockId } from '@/lib/dataBlock';
import { SceneDataBlock } from '@/lib/dataBlock/gameObject/sceneDataBlock';
import { useDataBlock } from '@/lib/hook/useDataBlock';
import { NonChildren } from '@/lib/util/utilityTypes';

export type SceneListItemProps = NonChildren<FlexProps> & {
  sceneDataBlockId: DataBlockId;
};

export const SceneListItem: React.FC<SceneListItemProps> = ({ sceneDataBlockId, ...props }) => {
  const { dataBlock: scene } = useDataBlock(sceneDataBlockId, SceneDataBlock.partialIs);

  return <Flex {...props}>{scene?.name}</Flex>;
};
