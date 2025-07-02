export interface Message {
  id: string;
  content: string; // plain text or base64 PDF string
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'pdf'; // Optional field to help you switch render logic
  filename?: string;     // Optional: "invoice.pdf"
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}