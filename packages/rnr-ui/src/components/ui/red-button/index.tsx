import { Button } from '~/components/ui/button';
import React from 'react';

interface RedButtonProps extends React.ComponentProps<typeof Button> {
  label?: string;
}

function RedButton({ label, ...props }: RedButtonProps) {
  return <Button {...props} variant="destructive">{label ?? props.children}</Button>;
}

export { RedButton };