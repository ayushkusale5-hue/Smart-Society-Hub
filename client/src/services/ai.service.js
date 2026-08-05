import api from './api';

export const aiService = {
  chatWithAssistant: (message, history = []) => 
    api.post('/ai/chat', { message, history }),
};
