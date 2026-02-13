import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Check, User, X } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { nanoid } from 'nanoid';

export default function UserMasks() {
  const navigate = useNavigate();
  const userProfile = useAppStore((state) => state.userProfile);
  const addUserMask = useAppStore((state) => state.addUserMask);
  const deleteUserMask = useAppStore((state) => state.deleteUserMask);
  const setActiveMask = useAppStore((state) => state.setActiveMask);

  const [isCreating, setIsCreating] = useState(false);
  const [newMaskName, setNewMaskName] = useState('');
  const [newMaskDesc, setNewMaskDesc] = useState('');

  const handleAdd = () => {
    if (!newMaskName.trim() || !newMaskDesc.trim()) return;
    
    addUserMask({
      name: newMaskName.trim(),
      description: newMaskDesc.trim()
    });
    
    setNewMaskName('');
    setNewMaskDesc('');
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      {/* Header */}
      <header className="flex-none bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-900 flex items-center -ml-2 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[16px]">返回</span>
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">用户面具</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="text-gray-900"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-gray-500 mb-2 ml-2">
          选择一个面具，AI 将会根据这个身份与你对话。
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
          {/* Default Mask (None) */}
          <div 
            onClick={() => setActiveMask(null)}
            className="flex items-center gap-4 px-4 py-3 active:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-gray-900">本色出演 (默认)</h3>
              <p className="text-xs text-gray-400">不佩戴任何面具</p>
            </div>
            {userProfile.activeMaskId === null && (
              <Check className="w-5 h-5 text-[#07c160]" />
            )}
          </div>

          {/* User Masks */}
          {(userProfile.masks || []).map((mask) => (
            <div 
              key={mask.id}
              onClick={() => setActiveMask(mask.id)}
              className="flex items-center gap-4 px-4 py-3 active:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#007aff]">
                <span className="text-lg font-bold">{mask.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-medium text-gray-900 truncate">{mask.name}</h3>
                <p className="text-xs text-gray-400 truncate">{mask.description}</p>
              </div>
              
              {userProfile.activeMaskId === mask.id ? (
                 <Check className="w-5 h-5 text-[#07c160]" />
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUserMask(mask.id);
                  }}
                  className="p-2 text-gray-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Create Mask Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[17px] font-semibold text-gray-900">创建新面具</h3>
              <button onClick={() => setIsCreating(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">面具名称</label>
                <input 
                  type="text" 
                  value={newMaskName}
                  onChange={(e) => setNewMaskName(e.target.value)}
                  placeholder="例如：职场新人"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#007aff]"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">人设描述</label>
                <textarea 
                  value={newMaskDesc}
                  onChange={(e) => setNewMaskDesc(e.target.value)}
                  placeholder="描述在这个面具下你是谁。例如：我是一个刚毕业的大学生，对职场规则不太懂，性格比较内向..."
                  className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#007aff] resize-none"
                />
              </div>
              <button 
                onClick={handleAdd}
                disabled={!newMaskName.trim() || !newMaskDesc.trim()}
                className={`w-full py-2.5 rounded-lg text-white font-medium transition-all ${
                  !newMaskName.trim() || !newMaskDesc.trim() 
                    ? 'bg-[#007aff]/50' 
                    : 'bg-[#007aff] active:bg-[#0066d6]'
                }`}
              >
                创建并佩戴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
