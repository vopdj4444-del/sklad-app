import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import InventoryTable from './InventoryTable';
import DocumentationUploader from './DocumentationUploader';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import RegistryInput from './RegistryInput';

interface KnowledgeBaseProps {
  inventory: Product[];
  onUpload: (file: File) => void;
  onAddRegistryInfo: (text: string) => void;
  isProcessing: boolean;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ inventory, onUpload, onAddRegistryInfo, isProcessing }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Сворачивать панель по умолчанию на мобильных устройствах
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    setIsOpen(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsOpen(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);


  if (!isOpen) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center lg:h-full">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-200 rounded-full transition-colors"
          aria-label="Открыть базу знаний"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-2/5 flex flex-col gap-6 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-stone-200 shadow-sm transition-all duration-300 min-w-[320px] lg:max-w-3xl lg:h-full">
      <div className="flex justify-between items-center border-b border-stone-200 pb-2">
        <h2 className="text-xl font-bold text-stone-800">База Знаний</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-full transition-colors"
          aria-label="Свернуть базу знаний"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex flex-col gap-6 overflow-y-auto flex-grow min-h-0">
        <DocumentationUploader onUpload={onUpload} isProcessing={isProcessing} />
        <RegistryInput onAdd={onAddRegistryInfo} />
        <InventoryTable inventory={inventory} />
      </div>

    </div>
  );
};

export default KnowledgeBase;