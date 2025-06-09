export interface Message {
  id: string;
  content: string; 
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'pdf'; 
  filename?: string;   
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}