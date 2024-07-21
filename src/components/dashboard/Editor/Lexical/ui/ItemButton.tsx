import React from 'react';

type Props = {
  onClick?: React.MouseEventHandler;
  icon?: React.ReactElement;
  children: React.ReactNode;
};
export default function ItemButton({ onClick, icon, children }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex w-full gap-2 rounded-sm p-2 hover:bg-blue-100"
    >
      {icon && icon}
      {children}
    </button>
  );
}
