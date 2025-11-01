import React from 'react';
import { BoxIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/70 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center gap-3">
        <BoxIcon className="w-8 h-8 text-amber-600" />
        <h1 className="text-2xl font-bold text-stone-800">
          Система Управления Складом
        </h1>
      </div>
    </header>
  );
};

export default Header;