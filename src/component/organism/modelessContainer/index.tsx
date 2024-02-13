import React from 'react';
import { Modeless } from '@/component/molecule/Modeless';
import { useModelessTable } from '@/hook/useTabModeless';

export type ModelessContainerProps = {};

export const ModelessContainer: React.FC<ModelessContainerProps> = ({}) => {
  const { modelessTable, modelessIndex } = useModelessTable();

  return (
    <>
      {modelessIndex.map((modelessId) => {
        const modeless = modelessTable[modelessId];
        if (!modeless) return null;

        return <Modeless key={modelessId} modelessId={modelessId} payload={modeless} data-modeless-id={modelessId} />;
      })}
    </>
  );
};
