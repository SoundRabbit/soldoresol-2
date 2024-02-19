import { Flex, MenuGroup, MenuGroupProps, MenuItem, Text } from '@chakra-ui/react';
import React from 'react';
import { CheckBoxIcon } from '@/component/common/icon/CheckBoxIcon';
import { MouseLeftButtonIcon } from '@/component/common/icon/MouseLeftButtonIcon';
import { bgColor, txColor } from '@/util/openColor';

export type ModelessMenuItemsProps = MenuGroupProps & {
  onCloseTab: () => void;
  onCloseModeless: (e: React.MouseEvent) => void;
  onToggleSnapToGrid: () => void;
  isSnapToGrid: boolean;
};

export const ModelessMenuItems: React.FC<ModelessMenuItemsProps> = ({
  onCloseTab,
  onCloseModeless,
  onToggleSnapToGrid,
  isSnapToGrid,
  ...props
}) => {
  return (
    <MenuGroup title={'ウィンドウ / タブ'} {...props}>
      <Flex
        as={MenuItem}
        closeOnSelect={false}
        onClick={onToggleSnapToGrid}
        paddingY={'0.5em'}
        justifyContent={'space-between'}
      >
        <Text>グリッドにスナップ</Text>
        {isSnapToGrid && <CheckBoxIcon color={txColor.gray[0].hex()} backgroundColor={bgColor.blue[4].hex()} />}
      </Flex>
      <MenuItem onClick={onCloseTab} paddingY={'0.5em'}>
        タブを閉じる
      </MenuItem>
      <Flex
        as={MenuItem}
        closeOnSelect={false}
        onClick={onCloseModeless}
        paddingY={'0.5em'}
        justifyContent={'space-between'}
      >
        <Text>ウィンドウを閉じる </Text>
        <Flex alignItems={'center'}>
          <Text>Shift+</Text>
          <MouseLeftButtonIcon />
        </Flex>
      </Flex>
    </MenuGroup>
  );
};
