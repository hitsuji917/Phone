import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Plus, Trash2, Sliders } from 'lucide-react';
import { useAppStore, ChatRule } from '../../../store/useAppStore';
import { nanoid } from 'nanoid';
import { AvatarSelector } from '../../../components/AvatarSelector';

const AVATAR_COLORS = [
  '#007aff', '#ff3b30', '#4cd964', '#ffcc00', '#5856d6', '#ff9500', '#8e8e93', '#ff2d55'
];

export default function CreateContact() {
  const navigate = useNavigate();
  const addContact = useAppStore((state) => state.addContact);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [customAvatar, setCustomAvatar] = useState('');
  const [memoryDepth, setMemoryDepth] = useState(10);
  const [chatRules, setChatRules] = useState<ChatRule[]>([]);

  const handleAddRule = () => {
    setChatRules([...chatRules, { id: nanoid(), content: '' }]);
  };

  const handleUpdateRule = (id: string, content: string) => {
    setChatRules(chatRules.map(rule => 
      rule.id === id ? { ...rule, content } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setChatRules(chatRules.filter(rule => rule.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    // Filter out empty rules
    const validRules = chatRules.filter(rule => rule.content.trim() !== '');

    addContact({
      name: name.trim(),
      nickname: nickname.trim() || name.trim(),
      bio: bio.trim(),
      systemPrompt: systemPrompt.trim() || '你是一个智能助手。',
      avatar: customAvatar || selectedColor,
      memoryDepth,
      chatRules: validRules
    });
    
    navigate('/chat/contacts');
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7] safe-area-inset-bottom">
      {/* Header */}
      <header className="flex-none bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-900 flex items-center -ml-2 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[16px]">取消</span>
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">创建角色</h1>
        <button 
          onClick={handleSave}
          disabled={!name.trim()}
          className={`bg-[#07c160] text-white px-3 py-1 rounded-md text-sm font-medium transition-opacity ${
            !name.trim() ? 'opacity-50' : 'active:opacity-80'
          }`}
        >
          完成
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Avatar Selection */}
        <AvatarSelector 
          currentAvatar={customAvatar || selectedColor}
          onSelect={setCustomAvatar}
          selectedColor={selectedColor}
          onColorSelect={(color) => {
            setSelectedColor(color);
            setCustomAvatar(''); // Clear custom avatar if color picked
          }}
          name={name}
        />

        {/* Basic Info */}
        <div className="space-y-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-24 text-[16px] text-gray-900">角色名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：苏格拉底"
                className="flex-1 text-[16px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-24 text-[16px] text-gray-900">备注名</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="聊天时显示的名称"
                className="flex-1 text-[16px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center px-4 py-3">
              <label className="w-24 text-[16px] text-gray-900">简介</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="简短的描述 (选填)"
                className="flex-1 text-[16px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-gray-500 uppercase ml-3">核心人设 (System Prompt)</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="例如：你是一个古希腊哲学家，喜欢用反问法引导思考..."
              className="w-full h-32 text-[16px] text-gray-900 placeholder-gray-400 outline-none bg-transparent resize-none"
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-gray-500 uppercase ml-3">高级设置</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            
            {/* Memory Depth */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gray-500" />
                  <label className="text-[16px] text-gray-900">记忆深度</label>
                </div>
                <span className="text-sm text-gray-500">{memoryDepth} 条</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                step="1"
                value={memoryDepth} 
                onChange={(e) => setMemoryDepth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007aff]"
              />
              <p className="text-xs text-gray-400 mt-2">
                每次对话携带的历史消息数量。数值越大记忆越好，但消耗 Token 更多。
              </p>
            </div>

            {/* Chat Rules */}
            <div className="px-4 py-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[16px] text-gray-900">聊天规则</label>
                <button 
                  onClick={handleAddRule}
                  className="flex items-center gap-1 text-[#007aff] text-sm font-medium active:opacity-60"
                >
                  <Plus className="w-4 h-4" />
                  添加规则
                </button>
              </div>
              
              <div className="space-y-3">
                {chatRules.map((rule, index) => (
                  <div key={rule.id} className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={rule.content}
                      onChange={(e) => handleUpdateRule(rule.id, e.target.value)}
                      placeholder="例如：禁止使用表情符号"
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-[15px] outline-none focus:bg-white focus:ring-1 focus:ring-[#007aff] transition-all"
                    />
                    <button 
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {chatRules.length === 0 && (
                  <div className="text-center py-2 text-gray-400 text-sm">
                    暂无规则，点击上方添加
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
