import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { getSocket } from '../../hooks/useSocket';
import { Send, Image as ImageIcon, Smile, MessageSquare, Info } from 'lucide-react';

export default function CommunityChat() {
  const { user } = useAuthStore();
  const socket = getSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    socket.on('chat:message', handleMessage);

    return () => {
      socket.off('chat:message', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgData = {
      id: Date.now().toString(),
      text: input,
      userId: user.id,
      userName: `${user.first_name} ${user.last_name}`,
      role: user.role,
      societyId: user.society_id,
      timestamp: new Date().toISOString()
    };

    socket.emit('chat:message', msgData);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight">Community Chat</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
            </div>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm">
          <Info size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <MessageSquare size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No messages yet.</p>
            <p className="text-slate-400 text-sm">Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.userId === user.id;
            return (
              <motion.div key={msg.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-xs font-bold text-slate-500 ml-1 mb-1">{msg.userName} <span className="font-normal text-slate-400">({msg.role})</span></span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${
                  isMe ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-200' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 mx-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ImageIcon size={20} />
          </button>
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Smile size={20} />
          </button>
          <div className="flex-1 relative">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Type a message..." 
              className="w-full bg-slate-100/80 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
