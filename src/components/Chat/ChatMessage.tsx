import React, { useEffect, useState } from 'react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isPdf = message.type === 'pdf' || message.content.startsWith('JVBER');

  useEffect(() => {
    if (isPdf) {
      const byteCharacters = atob(message.content);
      const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [message.content, isPdf]);

  // Parse bold (convert **text** to <strong>text</strong>)
  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  // Render message: detects bullet blocks and plain paragraphs
  const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');

    const blocks: JSX.Element[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push(
          <ul className="list-disc pl-5 mb-2" key={`list-${blocks.length}`}>
            {currentList.map((item, idx) => (
              <li key={idx}>{renderBold(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    for (const line of lines) {
      const isListItem = /^[A-Z0-9_\-\s]{3,}$/.test(line); // detects uppercase list-like items

      if (isListItem) {
        currentList.push(line);
      } else {
        flushList();
        blocks.push(
          <p className="mb-2" key={`p-${blocks.length}`}>
            {renderBold(line)}
          </p>
        );
      }
    }

    flushList();
    return blocks;
  };

  return (
    <div
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${message.id}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm animate-fadeIn ${
          isUser
            ? 'bg-customblue text-white rounded-tr-none ml-auto'
            : 'bg-gray-100 text-darkgray rounded-tl-none mr-auto'
        }`}
      >
        {/* PDF Link or Text Message */}
        {isPdf && pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 underline font-medium"
          >
            📄 {message.filename || 'Invoice_Label_Sample'}
          </a>
        ) : (
          <div className="text-sm md:text-base">{renderFormattedMessage(message.content)}</div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
