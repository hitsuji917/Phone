import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Compass, User } from 'lucide-react';

export function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: '/chat/chats', label: '聊天', icon: MessageSquare },
    { id: '/chat/contacts', label: '通讯录', icon: Users },
    { id: '/chat/discover', label: '发现', icon: Compass },
    { id: '/chat/me', label: '我', icon: User },
  ];

  return (
    <div className="flex-none bg-[#f9f9f9]/90 backdrop-blur-lg border-t border-gray-200 pb-[env(safe-area-inset-bottom)] pt-1">
      <div className="flex justify-around items-center h-12">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${
                isActive ? 'text-[#07c160]' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
