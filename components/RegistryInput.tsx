import React, { useState } from 'react';
import { PlusCircleIcon } from './icons';

interface RegistryInputProps {
  onAdd: (text: string) => void;
}

const RegistryInput: React.FC<RegistryInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <div className="bg-stone-50 p-4 rounded-lg shadow-sm border border-stone-200">
      <h3 className="text-xl font-semibold mb-3 text-stone-800">Добавить заметку из реестра</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="registry-text" className="sr-only">Текст из реестра</label>
          <textarea
            id="registry-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Введите информацию, правила или контекст..."
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-50 focus:ring-amber-500 disabled:bg-stone-400 disabled:cursor-not-allowed"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Добавить в Базу Знаний
        </button>
      </form>
    </div>
  );
};

export default RegistryInput;