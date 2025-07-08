import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message, ChatState } from '../../types/chat';
import { initiateChat, sendMessage } from '../../services/chatApi';
import { Loader } from 'lucide-react';
import logo from '../../assets/unicommerce.svg';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId, tenantCode, sessionId, isAuthenticated } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  useEffect(() => {
    if (isAuthenticated && userId && tenantCode && sessionId) {
      const startChat = async () => {
        try {
          setChatState((prev) => ({ ...prev, isLoading: true }));
          const { message, sessionId: newSessionId } = await initiateChat(
            tenantCode,
            sessionId,
            userId
          );

          if (newSessionId) {
            localStorage.setItem('chatSessionId', newSessionId);
          }

          addMessage(message, 'bot');
        } catch (error) {
          console.error('Initiate Chat Error:', error);
          toast.error('Failed to start chat. Please try again.');
        } finally {
          setChatState((prev) => ({ ...prev, isLoading: false }));
        }
      };

      startChat();
    }
  }, [isAuthenticated, userId, tenantCode, sessionId]);

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

    setChatState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, newMessage],
    }));
  };

  const handleSendMessage = async (content: string) => {
    if (
      !content.trim() ||
      !isAuthenticated ||
      !sessionId ||
      !userId ||
      !tenantCode
    ) {
      toast.error('Please log in to send messages.');
      return;
    }

    addMessage(content, 'user', 'text');
    setChatState((prevState) => ({ ...prevState, isLoading: true }));

    try {
      const { response, type } = await sendMessage(
        content,
        sessionId,
        userId,
        tenantCode,
      );
      addMessage(response, 'bot', type);
    } catch (error) {
      console.error('Send Message Error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setChatState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="text-bg-customblue pl-4 pr-4 flex items-center"   style={{ background: 'linear-gradient(to right, #e3f3f9, #1f87c2)' }}>
        <img
          src={logo}
          alt="Uniware Logo"
          className="h-20 w-20 mr-2 rounded"
          loading="lazy"
        />
        <h2 className="text-lg font-semibold">Uniware OMS Assistant</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {chatState.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {chatState.isLoading && (
          <div className="flex items-center text-gray-500 animate-pulse">
            <Loader className="animate-spin mr-2" size={16} />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={chatState.isLoading || !isAuthenticated}
      />
    </div>
  );
};

export default ChatContainer;
