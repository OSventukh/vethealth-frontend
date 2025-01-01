'use client';
import { useEffect, useState } from 'react';

const useTooltipSide = () => {
  const [side, setSide] = useState<'top' | 'right' | 'bottom' | 'left'>(
    'right'
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSide('top');
      } else {
        setSide('right');
      }
    };

    handleResize(); // Встановлюємо початкове значення

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return side;
};

export default useTooltipSide;
