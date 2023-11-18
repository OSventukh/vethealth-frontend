import React from 'react';
import Navigation from '../Navigation';

type Props = {
  className?: string;
};

export default function Sidebar({ className }: Props) {
  return (
    <div className={className}>
      <Navigation />
    </div>
  );
}
