import { Button, ButtonProps } from '@chakra-ui/react';
import React, { useMemo } from 'react';

export type ToggleButtonProps = ButtonProps & {
  isActive?: boolean;
  onToggle?: (toggle: boolean) => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onToggle, ...props }) => {
  const [isActiveInternal, setIsActiveInternal] = React.useState(isActive ?? false);
  const isToggleActive = useMemo(() => isActive ?? isActiveInternal, [isActive, isActiveInternal]);

  const handleToggle = React.useCallback(() => {
    setIsActiveInternal(!isToggleActive);
    onToggle && onToggle(!isToggleActive);
  }, [onToggle, isToggleActive]);

  return (
    <Button
      onClick={handleToggle}
      variant={'unstyled'}
      fontSize={'0.8rem'}
      fontWeight={'normal'}
      paddingX={'2ch'}
      paddingY={'0.25em'}
      height={'unset'}
      data-is-selected={isToggleActive}
      {...props}
    />
  );
};
