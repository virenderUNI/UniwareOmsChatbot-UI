import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message, ChatState } from '../../types/chat';
import { initiateChat, sendMessage } from '../../services/chatApi';
import { Loader } from 'lucide-react';
import logo from '../../assets/uniware.png';

const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  // Initialize chat when component mounts
  useEffect(() => {
    const startChat = async () => {
      try {
        setChatState(prevState => ({ ...prevState, isLoading: true }));
        const { sessionId } = await initiateChat();
        setSessionId(sessionId);
        
        // Add welcome message from bot
        addMessage('Hello! How can I assist you today?', 'bot');
      } catch (error) {
        setChatState(prevState => ({
          ...prevState,
          error: 'Failed to start chat. Please try again.'
        }));
      } finally {
        setChatState(prevState => ({ ...prevState, isLoading: false }));
      }
    };

    startChat();
  }, []);

const addMessage = (
  content: string,
  sender: 'user' | 'bot',
  type: 'text' | 'pdf' = 'text'
) => {
  const newMessage: Message = {
    id: uuidv4(),
    content,
    sender,
    timestamp: new Date(),
    type,
  };

  setChatState(prevState => ({
    ...prevState,
    messages: [...prevState.messages, newMessage],
  }));
};

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message to chat
    addMessage(content, 'user','text');
    
    // Set loading state
    setChatState(prevState => ({ ...prevState, isLoading: true }));

    try {
        const { response, type } = await sendMessage(content, sessionId);
        addMessage(response, 'bot', type);
    } catch (error) {
      setChatState(prevState => ({
        ...prevState,
        error: 'Failed to send message. Please try again.'
      }));
    } finally {
      setChatState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <img
          src={logo}
          alt="Uniware Logo"
          className="h-9 w-15 mr-2 rounded"
          loading="lazy"
        />
        <h2 className="text-lg font-semibold">Uniware OMS Assistant</h2>
      </div>

      {/* Error message */}
      {chatState.error && (
        <div className="bg-red-100 text-red-700 p-3 text-center">
          {chatState.error}
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {chatState.messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Loading indicator */}
        {chatState.isLoading && (
          <div className="flex items-center text-gray-500 animate-pulse">
            <Loader className="animate-spin mr-2" size={16} />
            <span>Thinking...</span>
          </div>
        )}
        
        {/* This div helps us scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={chatState.isLoading} 
      />
    </div>
  );
};

export default ChatContainer;