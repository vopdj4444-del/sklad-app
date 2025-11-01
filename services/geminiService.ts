import { GoogleGenAI, Type } from "@google/genai";
import { Product, Document } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ExtractedProduct {
    name: string;
    quantity: number;
    description?: string;
}

interface ExtractedInvoiceData {
    invoiceNumber: string;
    supplier: string;
    consignee: string;
    products: ExtractedProduct[];
}


const invoiceSchema = {
    type: Type.OBJECT,
    properties: {
        invoiceNumber: {
            type: Type.STRING,
            description: 'Номер документа (накладной)',
        },
        supplier: {
            type: Type.STRING,
            description: 'Наименование поставщика или грузоотправителя',
        },
        consignee: {
            type: Type.STRING,
            description: 'Наименование грузополучателя',
        },
        products: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: 'Полное наименование товара/позиции',
                    },
                    quantity: {
                        type: Type.NUMBER,
                        description: 'Количество товара',
                    },
                    description: {
                        type: Type.STRING,
                        description: 'Краткое описание или характеристики товара, если имеются (артикул, модель и т.д.)',
                    },
                },
                required: ['name', 'quantity'],
            },
            description: 'Список всех товарных позиций в документе. Цены и суммы включать не нужно.',
        },
    },
    required: ['invoiceNumber', 'products', 'supplier', 'consignee'],
};


export async function extractInvoiceDataFromImage(imageDataBase64: string): Promise<ExtractedInvoiceData> {
    const model = 'gemini-2.5-flash';
    
    const prompt = `Проанализируй это изображение документа (товарной накладной). Извлеки из него номер накладной, наименование поставщика (грузоотправителя), и наименование грузополучателя. Также извлеки все товарные позиции. Для каждой позиции найди наименование, количество и, если есть, краткое описание или артикул. Игнорируй цены, суммы, налоги, банковские реквизиты и подписи. Предоставь результат в виде единого JSON-объекта.`;

    const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageDataBase64,
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: invoiceSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Ошибка при вызове Gemini API для анализа изображения:", error);
        throw new Error("Не удалось извлечь данные из изображения.");
    }
}


export async function askAboutInventory(inventory: Product[], documents: Document[], manualRegistryData: string, question: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `Ты — продвинутый ИИ-ассистент для управления складом. Твоя задача — отвечать на вопросы пользователя, основываясь ИСКЛЮЧИТЕЛЬНО на предоставленных данных: 1) список товаров (инвентарь), 2) список документов (накладные), 3) дополнительная информация из реестра. Всегда отвечай на русском языке. Будь кратким и точным. Если ответ нельзя найти в предоставленных данных, сообщи об этом. Не выдумывай информацию. Связывай товары с документами по полю registerId (у товара) и invoiceNumber (у документа).`;

    const inventoryDataString = JSON.stringify(inventory, null, 2);
    const documentsDataString = JSON.stringify(documents.map(d => ({
        invoiceNumber: d.invoiceNumber, 
        imageName: d.imageName,
        supplier: d.supplier,
        consignee: d.consignee,
    })), null, 2); 

    const prompt = `
Вот текущие данные по складу:

Инвентарь:
\`\`\`json
${inventoryDataString}
\`\`\`

Документы:
\`\`\`json
${documentsDataString}
\`\`\`

Дополнительная информация из реестра:
\`\`\`text
${manualRegistryData || 'Нет дополнительной информации.'}
\`\`\`

Вопрос пользователя: "${question}"

Проанализируй все предоставленные данные и ответь на вопрос.
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Ошибка при вызове Gemini API:", error);
        throw new Error("Не удалось получить ответ от Gemini API.");
    }
}