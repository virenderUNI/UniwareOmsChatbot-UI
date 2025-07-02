export const API_BASE_URL = "https://r28fisu1gi.execute-api.ap-south-1.amazonaws.com";
export const STAGING_API_BASE_URL = "http://localhost:8000";

export const ENDPOINTS = {
    CHAT_INITIATE: `${API_BASE_URL}/chat/initiate`,
    CHAT: `${API_BASE_URL}/chat`,
    LOGIN: `${API_BASE_URL}/login`,
    SESSION: `${API_BASE_URL}/session/verify`
  };