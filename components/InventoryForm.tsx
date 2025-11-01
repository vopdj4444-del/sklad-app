import React, { useState } from 'react';
import { Product } from '../types';
import { PlusCircleIcon } from './icons';

interface InventoryFormProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onAddProduct }) => {
  const [registerId, setRegisterId] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerId || !name || !quantity || !location) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    onAddProduct({
      registerId,
      name,
      quantity: parseInt(quantity, 10),
      location,
      description,
    });
    // Reset form
    setRegisterId('');
    setName('');
    setQuantity('');
    setLocation('');
    setDescription('');
  };

  const inputClass = "w-full bg-stone-100 border border-stone-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <h2 className="text-xl font-semibold mb-4 text-stone-800">Добавить новый товар</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Реестр*</label>
          <input type="text" value={registerId} onChange={e => setRegisterId(e.target.value)} className={inputClass} placeholder="Р-004" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Наименование*</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Мышь Logitech G Pro" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Количество*</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className={inputClass} placeholder="100" min="0" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Местоположение*</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} placeholder="Секция В, Полка 2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-600 mb-1">Описание</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} placeholder="Беспроводная, игровая" rows={2}></textarea>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-amber-500">
            <PlusCircleIcon className="w-5 h-5" />
            Добавить товар
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;