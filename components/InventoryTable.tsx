import React from 'react';
import { Product } from '../types';

interface InventoryTableProps {
  inventory: Product[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory }) => {
  if (inventory.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 text-center flex-grow flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold text-stone-800 mb-2">Инвентарь пуст</h3>
        <p className="text-stone-500">Загрузите документ накладной, чтобы добавить товары.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden flex-grow">
      <div className="p-4 border-b border-stone-200">
         <h3 className="text-xl font-semibold text-stone-800">Реестр Товаров</h3>
      </div>
      <div className="overflow-y-auto h-[calc(100%-65px)]">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-100 sticky top-0">
            <tr>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-stone-600">Реестр</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-stone-600">Наименование</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-stone-600">Кол-во</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-stone-600 hidden md:table-cell">Описание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {inventory.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-amber-600">{product.registerId}</td>
                <td className="py-4 px-4 text-sm text-stone-800 max-w-xs ">{product.name}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-stone-800 text-center font-mono">{product.quantity}</td>
                <td className="py-4 px-4 text-sm text-stone-500 hidden md:table-cell max-w-xs truncate">{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;