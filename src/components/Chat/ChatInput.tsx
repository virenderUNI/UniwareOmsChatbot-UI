import React, { useState } from 'react';
import { SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t border-gray-200 bg-white p-3 sticky bottom-0 w-full"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bg-customblue focus:border-transparent transition-all duration-200"
        disabled={disabled}
      />
      <button
        type="submit"
        className={`flex items-center justify-center rounded-r-full p-2 px-4 border border-l-0 ${
          disabled || !message.trim()
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-customblue hover:bg-customblue'
        } text-white transition-colors duration-200`}
        disabled={disabled || !message.trim()}
      >
        <SendIcon size={20} />
      </button>
    </form>
  );
};

export default ChatInput;