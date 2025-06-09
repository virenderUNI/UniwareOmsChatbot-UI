import React from 'react';
import ChatContainer from './components/Chat/ChatContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[600px] rounded-lg overflow-hidden shadow-xl">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;