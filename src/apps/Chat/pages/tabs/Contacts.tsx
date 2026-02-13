import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search } from 'lucide-react';
import { useAppStore } from '../../../../store/useAppStore';

export default function Contacts() {
  const navigate = useNavigate();
  const contacts = useAppStore((state) => state.contacts);
  const createSession = useAppStore((state) => state.createSession);

  const handleContactClick = (contactId: string) => {
    // Navigate to profile or directly to chat?
    // WeChat behavior: Profile.
    // User requirement for "Chat" tab + button was "select to chat".
    // For Contacts tab, let's just show profile details or start chat.
    // Let's go to chat for simplicity and "instant gratification".
    // But wait, user requirement says: "Chat tab + button -> select list -> chat".
    // So here in Contacts tab, clicking might just show info.
    // But to be useful, let's make it start chat too.
    const sessionId = useAppStore.getState().getOrCreateSession(contactId);
    navigate(`/chat/chat-detail/${sessionId}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      {/* Header */}
      <header className="flex-none bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <h1 className="text-[17px] font-semibold text-gray-900">通讯录</h1>
        <button 
          onClick={() => navigate('/chat/create-contact')}
          className="bg-[#ededed] p-1.5 rounded-md active:bg-[#d1d1d1] transition-colors"
        >
          <UserPlus className="w-5 h-5 text-gray-900" />
        </button>
      </header>

      {/* Search Bar Placeholder */}
      <div className="px-3 py-2 bg-[#ededed]">
        <div className="bg-white rounded-md h-9 flex items-center justify-center text-gray-400 gap-1.5 text-[15px]">
          <Search className="w-4 h-4" />
          <span>搜索</span>
        </div>
      </div>

      {/* Contact List */}
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white">
          {contacts.map((contact, index) => (
            <div 
              key={contact.id}
              onClick={() => handleContactClick(contact.id)}
              className={`flex items-center gap-3 px-4 py-2.5 active:bg-gray-100 transition-colors ${
                index !== contacts.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* Avatar */}
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
              
              {/* Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-medium text-gray-900 truncate">{contact.nickname || contact.name}</h3>
                {contact.bio && (
                   <p className="text-xs text-gray-400 truncate mt-0.5">{contact.bio}</p>
                )}
              </div>
            </div>
          ))}
          
          <div className="py-3 text-center text-gray-400 text-xs">
            {contacts.length} 位联系人
          </div>
        </div>
      </main>
    </div>
  );
}
