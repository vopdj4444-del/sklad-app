import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, BotIcon, CopyIcon, CheckIcon, PdfIcon } from './icons';
import { registerRobotoFont } from './fonts';

// Объявляем, что jspdf будет доступен в глобальном объекте window
declare global {
  interface Window {
    jspdf: any;
  }
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const handleDownloadPdf = (text: string) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Регистрируем и устанавливаем шрифт с поддержкой кириллицы
    registerRobotoFont(doc);
    doc.setFont('Roboto-Regular', 'normal');
    
    const pageMargin = 15;
    const pageWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
    const lines = doc.splitTextToSize(text, pageWidth);
    
    doc.text(lines, pageMargin, pageMargin);
    doc.save('ai-response.pdf');
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 flex flex-col h-full">
      <div className="p-4 border-b border-stone-200 flex items-center gap-3">
        <BotIcon className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-stone-800">ИИ-Ассистент</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative group rounded-lg px-4 py-2 max-w-sm md:max-w-md ${
                msg.sender === 'user' 
                  ? 'bg-amber-600 text-white rounded-br-none' 
                  : 'bg-stone-200 text-stone-800 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                 {msg.sender === 'ai' && (
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => handleDownloadPdf(msg.text)}
                        className="p-1 rounded-md bg-stone-300/50 text-stone-500 hover:text-stone-800"
                        aria-label="Скачать как PDF"
                    >
                        <PdfIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 rounded-md bg-stone-300/50 text-stone-500 hover:text-stone-800"
                      aria-label="Скопировать сообщение"
                    >
                      {copiedMessageId === msg.id ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-stone-200 text-stone-800 rounded-lg px-4 py-2 rounded-bl-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-stone-200">
        <div className="flex items-center bg-stone-100 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спросите что-нибудь о складе..."
            className="w-full bg-transparent p-3 focus:outline-none text-stone-800 placeholder-stone-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 text-amber-600 hover:text-amber-500 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;