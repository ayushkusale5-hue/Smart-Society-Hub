/**
 * Helper to call OpenRouter API
 */
async function callOpenRouter(messages, temperature = 0.7, max_tokens = 800) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in the environment.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'Smart Society Hub',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter API Error:', errorText);
    throw new Error('Failed to communicate with AI provider');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Categorize a complaint based on title and description
 */
export async function categorizeComplaintAI(title, description) {
  const prompt = `
You are an intelligent assistant for a residential society. 
Please categorize the following complaint into one of these exact categories: Plumbing, Electrical, Civil, Security, Housekeeping, Carpentry, Cleaning, or Other.
Also, assign a priority: Low, Medium, or High.

Complaint Title: ${title}
Complaint Description: ${description}

Respond strictly in valid JSON format with no additional text or markdown formatting.
Example: {"category": "Plumbing", "priority": "High"}
`;

  try {
    const response = await callOpenRouter([
      { role: 'system', content: 'You are a helpful assistant that outputs only raw JSON without any markdown tags.' },
      { role: 'user', content: prompt }
    ], 0.1);

    // Clean up potential markdown if the model ignores the instruction
    const cleanJsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonString);
  } catch (error) {
    console.error('AI Categorization Error:', error);
    return null; // Return null if it fails so the system can fall back to defaults
  }
}

/**
 * Generate a professional notice from a short prompt
 */
export async function generateNoticeAI(prompt) {
  const systemPrompt = `
You are the official secretary of a premium residential society called Smart Society Hub.
Your job is to write professional, polite, and clear notices for the residents based on short instructions.
The output should be the notice content only (no subject lines, no introductory conversation, just the main body of the notice).
Keep it concise but formal. Use appropriate formatting if necessary.
`;

  try {
    const response = await callOpenRouter([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please write a notice for this: ${prompt}` }
    ], 0.7);

    return response.trim();
  } catch (error) {
    console.error('AI Notice Generation Error:', error);
    throw new Error('Failed to generate notice');
  }
}

import { Event } from '../models/mongo/Event.js';
import { Notice } from '../models/mongo/Notice.js';

/**
 * Handle AI Assistant chat queries
 */
export async function chatWithAssistantAI(userMessage, conversationHistory = []) {
  let dynamicContext = '';
  
  try {
    // Fetch upcoming events
    const recentEvents = await Event.find().sort({ date: 1 }).limit(3);
    const eventText = recentEvents.length > 0 
      ? recentEvents.map(e => `- ${e.title} on ${new Date(e.date).toLocaleDateString()} at ${e.time} (${e.location})`).join('\n')
      : 'No upcoming events.';

    // Fetch recent notices
    const recentNotices = await Notice.find({ status: 'active' }).sort({ createdAt: -1 }).limit(3);
    const noticeText = recentNotices.length > 0
      ? recentNotices.map(n => `- ${n.title}: ${n.content}`).join('\n')
      : 'No recent notices.';

    dynamicContext = `
Current Active Notices:
${noticeText}

Upcoming Society Events:
${eventText}
`;
  } catch (err) {
    console.error('Error fetching context for AI:', err);
  }

  const systemPrompt = `
You are a helpful, polite, and knowledgeable AI assistant for Smart Society Hub residents.
You have real-time access to the society's active notices and upcoming events provided below.
If a user asks about events or notices, use the information provided in the "Current Active Notices" and "Upcoming Society Events" sections to answer them.
If you don't know specific details (like a specific user's bill amount), politely inform them that they can check their dashboard for exact figures.
Keep answers concise, friendly, and easy to read.

Common Knowledge:
- Maintenance bills are due by the 5th of every month.
- The Club House is open from 6:00 AM to 10:00 PM.
- Swimming pool timings are 7:00 AM to 9:00 PM.
- Visitors must be pre-approved via the app or approved at the gate.
- Complaints are typically resolved within 24-48 hours depending on priority.

${dynamicContext}
`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await callOpenRouter(messages, 0.7);
    return response.trim();
  } catch (error) {
    console.error('AI Chat Assistant Error:', error);
    throw new Error('Failed to chat with AI assistant');
  }
}
