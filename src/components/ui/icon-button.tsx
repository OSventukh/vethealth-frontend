import { forwardRef } from 'react';
import { Button } from './button';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200"
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
