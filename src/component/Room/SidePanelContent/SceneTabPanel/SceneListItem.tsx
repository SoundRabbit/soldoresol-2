import React from 'react';

import { Flex, FlexProps } from '@chakra-ui/react';

import { DataBlockId } from '@/dataBlock';
import { SceneDataBlock } from '@/dataBlock/gameObject/sceneDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';
import { NonChildren } from '@/util/utilityTypes';

export type SceneListItemProps = NonChildren<FlexProps> & {
  sceneDataBlockId: DataBlockId;
};

export const SceneListItem: React.FC<SceneListItemProps> = ({ sceneDataBlockId, ...props }) => {
  const { dataBlock: scene } = useDataBlock(sceneDataBlockId, SceneDataBlock.partialIs);

  return <Flex {...props}>{scene?.name}</Flex>;
};
