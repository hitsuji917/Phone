import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader2, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { chatCompletion, Message } from '../../../api';

export default function ChatDetail() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const sessions = useAppStore((state) => state.sessions);
  const contacts = useAppStore((state) => state.contacts);
  const userProfile = useAppStore((state) => state.userProfile);
  const addMessage = useAppStore((state) => state.addMessage);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Find session and contact
  const session = sessions.find(s => s.id === sessionId);
  const contact = session ? contacts.find(c => c.id === session.contactId) : null;

  // Find active mask
  const activeMask = userProfile.activeMaskId 
    ? (userProfile.masks || []).find(m => m.id === userProfile.activeMaskId)
    : null;

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  // Adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !session || !contact) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    
    // Add user message to store
    addMessage(session.id, userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      // 1. 构建 System Prompt (整合核心人设 + 聊天规则 + 用户面具)
      let fullSystemPrompt = contact.systemPrompt || '';
      
      // Add Chat Rules
      if (contact.chatRules && contact.chatRules.length > 0) {
        fullSystemPrompt += '\n\n【聊天规则】\n请严格遵守以下规则：\n';
        contact.chatRules.forEach((rule, index) => {
          fullSystemPrompt += `${index + 1}. ${rule.content}\n`;
        });
      }

      // Add User Mask (Context)
      if (activeMask) {
        fullSystemPrompt += `\n\n【用户身份信息】\n你正在对话的用户身份是：${activeMask.name}\n用户描述：${activeMask.description}\n请根据用户的这个身份进行针对性的回复。`;
      }

      const systemMessage: Message = { role: 'system', content: fullSystemPrompt };
      
      // 2. 动态截取历史记录 (根据 memoryDepth)
      // 默认记忆深度为 10，如果未设置
      const depth = contact.memoryDepth || 10;
      
      const history = session.messages.slice(-depth); 
      
      const contextMessages = [systemMessage, ...history, userMessage]; 
      
      const replyContent = await chatCompletion(contextMessages);
      
      const assistantMessage: Message = { role: 'assistant', content: replyContent };
      addMessage(session.id, assistantMessage);
    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `(系统消息) 出错了：${error.message || '未知错误'}。` 
      };
      addMessage(session.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!session || !contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>找不到会话</p>
        <button onClick={() => navigate('/chats')} className="text-blue-500 mt-2">返回聊天列表</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7] safe-area-inset-bottom">
      {/* 顶部标题栏 */}
      <header className="flex-none bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-900 flex items-center -ml-2 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[16px]">微信</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-[17px] font-semibold text-gray-900">{contact.nickname || contact.name}</h1>
          {activeMask && (
            <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 rounded-full">
              {activeMask.name}
            </span>
          )}
        </div>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      {/* 聊天内容区域 */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar chat-container">
        {session.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div 
                className="w-9 h-9 rounded-md mr-2 flex items-center justify-center text-white text-sm font-medium shadow-sm shrink-0"
                style={{ 
                  backgroundColor: contact.avatar.startsWith('http') || contact.avatar.startsWith('data:') ? 'transparent' : (contact.avatar.startsWith('#') ? contact.avatar : '#ccc'),
                  backgroundImage: (contact.avatar.startsWith('http') || contact.avatar.startsWith('data:')) ? `url(${contact.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {(!contact.avatar.startsWith('http') && !contact.avatar.startsWith('data:')) && (contact.nickname?.[0] || contact.name[0])}
              </div>
            )}
            
            <div
              className={`max-w-[70%] rounded-md px-3 py-2 text-[16px] leading-relaxed shadow-sm break-words ${
                msg.role === 'user'
                  ? 'bg-[#95ec69] text-black chat-bubble-user' // WeChat Green
                  : 'bg-white text-black chat-bubble-ai'
              }`}
            >
              {msg.content}
            </div>
            
             {msg.role === 'user' && (
              <div 
                className="w-9 h-9 rounded-md ml-2 flex items-center justify-center bg-gray-300 text-white text-sm font-medium shadow-sm shrink-0 text-gray-500 overflow-hidden"
                style={{ 
                  backgroundColor: userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('data:') ? 'transparent' : '#ccc',
                  backgroundImage: (userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('data:')) ? `url(${userProfile.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {(!userProfile.avatar.startsWith('http') && !userProfile.avatar.startsWith('data:')) && "我"}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div 
                className="w-9 h-9 rounded-md mr-2 flex items-center justify-center text-white text-sm font-medium shadow-sm shrink-0"
                style={{ 
                  backgroundColor: contact.avatar.startsWith('http') || contact.avatar.startsWith('data:') ? 'transparent' : (contact.avatar.startsWith('#') ? contact.avatar : '#ccc'),
                  backgroundImage: (contact.avatar.startsWith('http') || contact.avatar.startsWith('data:')) ? `url(${contact.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {(!contact.avatar.startsWith('http') && !contact.avatar.startsWith('data:')) && (contact.nickname?.[0] || contact.name[0])}
              </div>
            <div className="bg-white rounded-md px-4 py-3 shadow-sm chat-bubble-ai">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* 底部输入框区域 - 吸附键盘优化 */}
      <footer className="flex-none bg-[#f7f7f7] border-t border-gray-200 p-2 pb-[max(8px,env(safe-area-inset-bottom))] sticky bottom-0 z-20">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-white rounded-md min-h-[40px] px-3 py-2 chat-input">
             <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              rows={1}
              className="w-full bg-transparent border-none outline-none resize-none text-[16px] py-0 max-h-[120px]"
              style={{ minHeight: '24px' }}
            />
          </div>
         
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`h-10 px-3 rounded-md flex items-center justify-center transition-all ${
              inputValue.trim() 
                ? 'bg-[#07c160] text-white shadow-sm' 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
