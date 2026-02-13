import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, X, Layout } from 'lucide-react';
import { useAppStore } from '../../../../store/useAppStore';

export default function Chats() {
  const navigate = useNavigate();
  const sessions = useAppStore((state) => state.sessions);
  const contacts = useAppStore((state) => state.contacts);
  const getOrCreateSession = useAppStore((state) => state.getOrCreateSession);

  const [showContactSelector, setShowContactSelector] = useState(false);

  // Helper to get contact details for a session
  const getSessionContact = (contactId: string) => {
    return contacts.find(c => c.id === contactId);
  };

  const handleStartChat = (contactId: string) => {
    const sessionId = getOrCreateSession(contactId);
    setShowContactSelector(false);
    navigate(`/chat/chat-detail/${sessionId}`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      {/* Header */}
      <header className="flex-none bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-gray-900 active:opacity-60 transition-opacity"
        >
          <Layout className="w-5 h-5" />
          <span className="text-[17px] font-semibold">微信</span>
        </button>
        <button 
          onClick={() => setShowContactSelector(true)}
          className="bg-[#ededed] p-1.5 rounded-md active:bg-[#d1d1d1] transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-900" />
        </button>
      </header>

      {/* Chat List */}
      <main className="flex-1 overflow-y-auto bg-white">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
            <MessageSquare className="w-12 h-12 opacity-20" />
            <p className="text-sm">暂无聊天，点击右上角 + 发起对话</p>
          </div>
        ) : (
          sessions.map((session, index) => {
            const contact = getSessionContact(session.contactId);
            if (!contact) return null; // Should not happen

            return (
              <div 
                key={session.id}
                onClick={() => navigate(`/chat/chat-detail/${session.id}`)}
                className={`flex items-center gap-3 px-4 py-3 active:bg-gray-100 transition-colors ${
                  index !== sessions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-md flex items-center justify-center text-white text-xl font-medium shadow-sm shrink-0 relative"
                  style={{ 
                    backgroundColor: contact.avatar.startsWith('#') ? contact.avatar : '#ccc',
                    backgroundImage: contact.avatar.startsWith('http') ? `url(${contact.avatar})` : 'none',
                    backgroundSize: 'cover'
                  }}
                >
                  {!contact.avatar.startsWith('http') && (contact.nickname?.[0] || contact.name[0])}
                  {session.unreadCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-[#ff3b30] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center border border-white">
                      {session.unreadCount}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-[16px] font-medium text-gray-900 truncate">{contact.nickname || contact.name}</h3>
                    <span className="text-[11px] text-gray-400 font-normal">{formatTime(session.lastTimestamp)}</span>
                  </div>
                  <p className="text-[14px] text-gray-400 truncate">
                    {session.lastMessage || contact.systemPrompt}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Contact Selector Modal */}
      {showContactSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#ededed] w-full sm:w-[90%] sm:max-w-sm sm:rounded-xl rounded-t-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom duration-200 h-[80%] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-[#f9f9f9] border-b border-gray-200">
              <h2 className="text-[17px] font-semibold text-gray-900">选择联系人</h2>
              <button 
                onClick={() => setShowContactSelector(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white p-2">
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleStartChat(contact.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                     <div 
                      className="w-10 h-10 rounded-md flex items-center justify-center text-white text-lg font-medium shadow-sm shrink-0"
                      style={{ 
                        backgroundColor: contact.avatar.startsWith('#') ? contact.avatar : '#ccc',
                        backgroundImage: contact.avatar.startsWith('http') ? `url(${contact.avatar})` : 'none',
                        backgroundSize: 'cover'
                      }}
                    >
                      {!contact.avatar.startsWith('http') && (contact.nickname?.[0] || contact.name[0])}
                    </div>
                    <span className="text-[16px] font-medium text-gray-900">{contact.nickname || contact.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
