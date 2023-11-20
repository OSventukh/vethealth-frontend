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
      className="flex gap-2 w-full p-2 hover:bg-blue-100 rounded-sm"
    >
      {icon && icon}
      {children}
    </button>
  );
}