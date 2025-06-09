/**
 * API service for chat functionality
 */

export const initiateChat = async (): Promise<{ sessionId: string }> => {
  try {
    const response = await fetch('http://localhost:8000/chat/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json(); 

    console.log(data);
    return data;
  } catch (error) {
    console.error('Error initiating chat:', error);
    throw error;
  }
};

// Function to send a message and get a response
export const sendMessage = async (
  message: string,
  sessionId?: string
): Promise<{ response: string , type: 'text' | 'pdf' }> => {
  try {
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            parts: [message]  
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};