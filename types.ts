export interface Product {
  id: string;
  registerId: string; // This will be the invoice number
  name: string;
  quantity: number;
  location: string;
  description?: string;
}

export interface ChatMessage {
  id:string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Document {
  id: string;
  invoiceNumber: string;
  imageName: string;
  imageDataUrl: string;
  supplier?: string;
  consignee?: string;
}