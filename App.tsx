import React, { useState, useEffect } from 'react';
import { Product, ChatMessage, Document } from './types';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import KnowledgeBase from './components/KnowledgeBase';
import { askAboutInventory, extractInvoiceDataFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [manualRegistryData, setManualRegistryData] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    setChatMessages([
      { id: 'initial', sender: 'ai', text: 'Здравствуйте! Я ваш складской ИИ-ассистент. Загрузите документ, чтобы начать, или задайте мне вопрос.' }
    ]);
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file || isAiLoading) {
        const errorMessage: ChatMessage = {
            id: `${new Date().toISOString()}-error`,
            sender: 'ai',
            text: 'Пожалуйста, выберите файл для анализа.'
        };
        setChatMessages(prev => [...prev, errorMessage]);
        return;
    }

    const userMessage: ChatMessage = {
      id: new Date().toISOString(),
      sender: 'user',
      text: `Анализ документа: ${file.name}`
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            try {
                const base64data = (reader.result as string).split(',')[1];
                
                const extractedData = await extractInvoiceDataFromImage(base64data);

                if (!extractedData || !extractedData.products || extractedData.products.length === 0 || !extractedData.invoiceNumber) {
                    throw new Error("Не удалось извлечь товары или номер накладной из изображения.");
                }
                
                const { invoiceNumber, supplier, consignee, products } = extractedData;

                const newProducts: Product[] = products.map((p, index) => ({
                    id: `${invoiceNumber}-${index}-${Date.now()}`,
                    registerId: invoiceNumber,
                    name: p.name,
                    quantity: p.quantity,
                    description: p.description || '',
                    location: 'Не указано',
                }));

                setInventory(prev => [...prev, ...newProducts]);
                
                const newDocument: Document = {
                    id: `doc-${Date.now()}`,
                    invoiceNumber: invoiceNumber,
                    imageName: file.name,
                    imageDataUrl: reader.result as string,
                    supplier: supplier,
                    consignee: consignee,
                };
                setDocuments(prev => [...prev, newDocument]);

                const aiMessage: ChatMessage = {
                    id: `${new Date().toISOString()}-ai`,
                    sender: 'ai',
                    text: `Успешно обработана накладная №${invoiceNumber}. Добавлено ${newProducts.length} позиций в реестр.`
                };
                setChatMessages(prev => [...prev, aiMessage]);

            } catch (error) {
                 console.error('Ошибка при обработке изображения:', error);
                 const errorMessage: ChatMessage = {
                    id: `${new Date().toISOString()}-error-processing`,
                    sender: 'ai',
                    text: `Не удалось обработать документ. Убедитесь, что на изображении четко виден список товаров и номер документа, и попробуйте снова.`
                 };
                 setChatMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsAiLoading(false);
            }
        };
        reader.onerror = () => {
             throw new Error("Не удалось прочитать файл.");
        }
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      const errorMessage: ChatMessage = {
        id: `${new Date().toISOString()}-error-upload`,
        sender: 'ai',
        text: 'Произошла ошибка при загрузке файла. Пожалуйста, попробуйте снова.'
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsAiLoading(false);
    }
  };

  const handleAddRegistryInfo = (text: string) => {
    setManualRegistryData(prev => prev ? `${prev}\n\n${text}` : text);
     const aiMessage: ChatMessage = {
        id: `${new Date().toISOString()}-info`,
        sender: 'ai',
        text: `Информация из реестра добавлена в базу знаний.`
    };
    setChatMessages(prev => [...prev, aiMessage]);
  };


  const handleAskAi = async (question: string) => {
    if (!question.trim() || isAiLoading) return;

    const userMessage: ChatMessage = {
      id: new Date().toISOString(),
      sender: 'user',
      text: question
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      const aiResponseText = await askAboutInventory(inventory, documents, manualRegistryData, question);
      const aiMessage: ChatMessage = {
        id: `${new Date().toISOString()}-ai`,
        sender: 'ai',
        text: aiResponseText
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка ответа Gemini:', error);
      const errorMessage: ChatMessage = {
        id: `${new Date().toISOString()}-error`,
        sender: 'ai',
        text: 'Извините, ИИ-ассистент временно недоступен. Пожалуйста, попробуйте снова через несколько минут.'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden h-full">
        <KnowledgeBase
          inventory={inventory}
          onUpload={handleImageUpload}
          onAddRegistryInfo={handleAddRegistryInfo}
          isProcessing={isAiLoading}
        />
        <div className="flex-grow flex flex-col min-h-0">
          <ChatInterface 
            messages={chatMessages} 
            onSendMessage={handleAskAi} 
            isLoading={isAiLoading} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;