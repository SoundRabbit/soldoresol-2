import { MenuDivider, MenuGroup, MenuItem } from '@chakra-ui/react';
import React from 'react';

export type MenuProps = {};

export const Menu: React.FC<MenuProps> = ({}) => {
  return (
    <>
      <MenuDivider marginY={'0.5em'} />
      <MenuGroup title={'チャット'} marginTop={'0.5em'} marginBottom={'0'}>
        <MenuItem paddingY={'0.5em'}>チャットタブを編集</MenuItem>
        <MenuItem paddingY={'0.5em'}>発言者を切り替え</MenuItem>
      </MenuGroup>
    </>
  );
};
