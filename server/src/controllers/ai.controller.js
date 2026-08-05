import { chatWithAssistantAI } from '../utils/ai.utils.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

export async function handleAssistantChat(req, res, next) {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return errorResponse(res, 'Message is required', 400);
    }

    const reply = await chatWithAssistantAI(message, history);
    
    return successResponse(res, { reply }, 'AI response generated successfully');
  } catch (err) {
    next(err);
  }
}
