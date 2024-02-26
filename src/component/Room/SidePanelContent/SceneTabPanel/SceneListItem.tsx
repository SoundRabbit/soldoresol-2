import React from 'react';

import { Flex, FlexProps } from '@chakra-ui/react';

import { useDataBlock } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { SceneDataBlock } from '@/libs/dataBlock/gameObject/sceneDataBlock';
import { NonChildren } from '@/utils/utilityTypes';

export type SceneListItemProps = NonChildren<FlexProps> & {
  sceneDataBlockId: DataBlockId;
};

export const SceneListItem: React.FC<SceneListItemProps> = ({ sceneDataBlockId, ...props }) => {
  const { dataBlock: scene } = useDataBlock(sceneDataBlockId, SceneDataBlock.partialIs);

  return <Flex {...props}>{scene?.name}</Flex>;
};
