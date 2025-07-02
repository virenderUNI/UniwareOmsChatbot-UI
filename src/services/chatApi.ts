/**
 * API service for chat functionality
 */

import { ENDPOINTS } from "../api/endpoints"

export const initiateChat = async (tenantCode:string,sessionId:string,userId:string,accessToken:string): Promise<{ message:string ,sessionId: string}> => {
  try {
  const response = await fetch(ENDPOINTS.CHAT_INITIATE, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Tenant-Code': tenantCode || '',
        'X-Chat-Session-Id': sessionId,
        'X-User-Id': userId || '',
        'x-access-token': accessToken || ''
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
  sessionId: string,
  userId:string,
  tenantCode:string,
  accessToken:string
): Promise<{ response: string , type: 'text' | 'pdf' }> => {
  try {
    const response = await fetch(ENDPOINTS.CHAT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Code': tenantCode || '',
        'X-Chat-Session-Id': sessionId,
        'X-User-Id': userId || '',
        'x-access-token': accessToken || ''
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