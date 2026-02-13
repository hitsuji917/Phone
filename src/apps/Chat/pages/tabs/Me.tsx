import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, MessageSquare, Wallet, Sticker, Camera, User, Palette } from 'lucide-react';
import { useAppStore } from '../../../../store/useAppStore';
import { AvatarSelector } from '../../../../components/AvatarSelector';

export default function Me() {
  const navigate = useNavigate();
  const userProfile = useAppStore((state) => state.userProfile);
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editWechatId, setEditWechatId] = useState(userProfile.wechatId);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editName,
      wechatId: editWechatId
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      {/* Header (UserInfo) */}
      <div className="pt-[env(safe-area-inset-top)] bg-white mb-3 pb-8">
        <div className="flex items-center gap-4 px-6 pt-10">
          {/* Avatar with Selector */}
          <div className="relative">
             <AvatarSelector 
              currentAvatar={userProfile.avatar}
              onSelect={(avatar) => updateUserProfile({ avatar })}
              name={userProfile.name}
            />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xl font-semibold text-gray-900 border-b border-gray-300 outline-none w-full"
                  autoFocus
                />
                <input 
                  type="text" 
                  value={editWechatId}
                  onChange={(e) => setEditWechatId(e.target.value)}
                  className="text-sm text-gray-500 border-b border-gray-300 outline-none w-full"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
                <p className="text-sm text-gray-400 mt-1">微信号: {userProfile.wechatId}</p>
              </>
            )}
          </div>
          
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-[#007aff]"
          >
            {isEditing ? <span className="text-[#007aff] font-medium">保存</span> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white mb-3">
          <div 
            onClick={() => navigate('/chat/wallet')}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer"
          >
            <Wallet className="w-6 h-6 text-[#ff9500]" />
            <span className="text-[16px] text-gray-900 flex-1">服务 (钱包)</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        <div className="bg-white mb-3">
           <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-100">
            <Sticker className="w-6 h-6 text-[#ffcc00]" />
            <span className="text-[16px] text-gray-900 flex-1">表情</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <div 
            onClick={() => navigate('/chat/user-masks')}
            className="flex items-center gap-3 px-4 py-3 active:bg-gray-100 cursor-pointer"
          >
            <User className="w-6 h-6 text-[#5856d6]" />
            <span className="text-[16px] text-gray-900 flex-1">用户面具 (多重人设)</span>
            <div className="flex items-center gap-1">
              {userProfile.activeMaskId && (
                <span className="text-xs text-[#5856d6] bg-indigo-50 px-2 py-0.5 rounded-full">
                  {(userProfile.masks || []).find(m => m.id === userProfile.activeMaskId)?.name}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-white mb-3">
          <div 
            onClick={() => navigate('/chat/styling')}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer"
          >
            <Palette className="w-6 h-6 text-[#ff9500]" />
            <span className="text-[16px] text-gray-900 flex-1">聊天美化</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <div 
            onClick={() => navigate('/chat/settings')}
            className="flex items-center gap-3 px-4 py-3 active:bg-gray-100 cursor-pointer"
          >
            <Settings className="w-6 h-6 text-[#007aff]" />
            <span className="text-[16px] text-gray-900 flex-1">设置 (API 配置)</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </main>
    </div>
  );
}
