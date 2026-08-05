import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { aiService } from '../../services/ai.service';
import { useAuthStore } from '../../store/authStore';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am the Smart Society AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (messageText) => {
      // Pass the previous history (excluding system prompt to save tokens, though backend can handle it)
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      return aiService.chatWithAssistant(messageText, history);
    },
    onSuccess: (res) => {
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    },
    onError: () => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    sendMessage(userMessage);
  };

  // Only render for residents and committee
  if (!user || (user.role !== 'resident' && user.role !== 'committee')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[90vw] sm:w-[400px] md:w-[450px] bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '600px', maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Society AI Assistant</h3>
                  <p className="text-xs text-indigo-100 opacity-90">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                  </div>
                  <div 
                    className={`max-w-[80%] p-4 px-5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isPending && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 px-5 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center h-[52px]">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                disabled={isPending}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isPending}
                className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-200"
              >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-slate-800 text-white rotate-90 scale-90' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-105'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
