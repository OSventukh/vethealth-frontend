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
        className="h-10 w-10 p-2 flex justify-center items-center rounded-full bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
